import { getContextBot } from './context'
import { Block, BlockFactory, BlockClasses, BlockClassesTypes } from './data'
import { asVec3 } from './data/vector'

import { VectorLike } from '../immutable3d/vector'
import { uniqWith, isEqual } from 'lodash/fp'

export type Matcher<T> = number | number[] | ((block: T) => boolean)

export interface WithMatcher<T> { match: Matcher<T> }
export interface SingleBlockQueryOptions<T> {
  position: VectorLike
  maxDistance: number
}
export interface MultipleBlocksQueryOptions<T> extends SingleBlockQueryOptions<T> {
  count?: number
}

export class Find {
  private constructor() {
    const b = Find.blocksOfType('plant', { maxDistance: 34, position: null })
  }

  static blocksOfType<T extends keyof BlockClassesTypes>(
    type: T,
    query: MultipleBlocksQueryOptions<BlockClassesTypes[T]> & Partial<WithMatcher<BlockClassesTypes[T]>>)
    : Promise<BlockClassesTypes[T][]> {
    const match = Find.convertToBlockPredicate(query.match)
    return Find.blocks({
      ...query,
      match: block =>
        block instanceof BlockClasses[type]
        && match(block)
    })
  }

  static async someBlockOfType<T extends keyof BlockClassesTypes>(
    type: T,
    query: SingleBlockQueryOptions<BlockClassesTypes[T]>): Promise<BlockClassesTypes[T]> {
    const result = await Find.blocksOfType(type, { ...query, count: 1 })
    return result[0]
  }

  static blocks(query: MultipleBlocksQueryOptions<Block> & WithMatcher<Block>): Promise<Block[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const rawBlocks: any[] = getContextBot().rawBot.findBlockSync(Find.mapQuery(query))
        resolve(uniqWith(isEqual, rawBlocks.map(_ => BlockFactory.of(_))))
      }, 100)
    })
  }

  static async someBlock(query: SingleBlockQueryOptions<Block> & WithMatcher<Block>): Promise<Block> {
    const blocks = await Find.blocks({ ...query, count: 1 })

    if (blocks.length === 0)
      throw new Error('Unable to find some matching block.')

    return blocks[0]
  }

  private static mapQuery<T extends Block>(query: MultipleBlocksQueryOptions<T> & WithMatcher<Block>): any {
    return {
      count: query.count || Number.MAX_SAFE_INTEGER,
      maxDistance: query.maxDistance,
      point: asVec3(query.position),
      matching: (block: any) => Find.convertToBlockPredicate(query.match)(BlockFactory.of(block))
    }
  }

  private static convertToBlockPredicate<T extends Block>(match?: Matcher<T>): (block: Block) => boolean {
    if(match) {
      if (typeof match === 'number') {
        return (b: Block) => b.type === match
      } else if(typeof match === 'object') {
        return (b: Block) => match.indexOf(b.type) !== -1
      } else {
        return match
      }
    } else {
      return () => true
    }
  }
}
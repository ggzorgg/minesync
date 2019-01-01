import { getContextBot } from '../context'
import { ItemFactory, Item } from './item'
import { Plants, PlantType } from './plants'
import { asVec3 } from './vector'

import { add, VectorLike } from '../../immutable3d/vector'

export class Block {
  constructor(readonly rawBlock: any) {
    this.hardness = rawBlock.hardness
    this.position = rawBlock.position
    this.type = rawBlock.type
  }

  readonly type: number
  readonly hardness: number
  readonly position: VectorLike

  above() { return this.atOffset([0, 1, 0]) }
  below() { return this.atOffset([0, -1, 0]) }

  atOffset(offset: VectorLike) {
    return Block.at(add(this.position)(offset))
  }

  static at(position: VectorLike): Block {
    return BlockFactory.of(
      getContextBot().rawBot.blockAt(asVec3(position))
    )
  }
}

export class PlantBlock extends Block {
  readonly plantType: PlantType

  constructor(rawBlock: any) {
    super(rawBlock)
    this.plantType = Plants.all.find(p => p.plantType === rawBlock.type)
  }

  isReadyToFarm(): boolean {
    return this.plantType.readyToFarm === this.rawBlock.metadata
  }
}


export class ChestSession {
  constructor(readonly rawChestSession: any) { }

  count(type: number): number {
    return this.rawChestSession.count(type)
  }

  items(): Item[] {
    return this.rawChestSession.items().map((_: any) => ItemFactory.of(_))
  }

  take(type: number, count: number, metadata: number | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rawChestSession.withdraw(type, metadata, count, (err: any) => err ? reject(err) : resolve())
    })
  }

  put(type: number, count: number, metadata: number | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rawChestSession.deposit(type, metadata, count, (err: any) => err ? reject(err) : resolve())
    })
  }

  finish(): void {
    this.rawChestSession.close()
  }
}

export class ChestBlock extends Block {
  async transaction<R = void>(actions: (session: ChestSession) => Promise<R>): Promise<R> {
    const session = await new Promise<ChestSession>(resolve => {
      const chest = getContextBot().rawBot.openChest(this.rawBlock)
      chest.on('open', (_: any) => resolve(new ChestSession(chest)))
    })

    const result = await actions(session)
    session.finish()
    return result
  }
}

export class BlockFactory {
  static of(rawBlock: any): Block {
    switch (true) {
      case Plants.allTypes.contains(rawBlock.type):
        return new PlantBlock(rawBlock)
      case rawBlock.type === 54:
        return new ChestBlock(rawBlock)
      default:
        return new Block(rawBlock)
    }
  }
}

export const BlockClasses = {
  any: Block,
  chest: ChestBlock,
  plant: PlantBlock
}
export type BlockClassesTypes = {
  any: Block,
  chest: ChestBlock,
  plant: PlantBlock
}

export type BlockType = keyof BlockClassesTypes
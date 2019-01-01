import { Navigation } from './configuration'
import { getContextBot } from './context'
import { Find } from './find';

import { VectorLike } from '../immutable3d/vector'

export class Navigate {
  private constructor() {}

  static async to(position: VectorLike, allowPartialPaths: boolean = false): Promise<void> {
    const platform = await Find.someBlock({
      position,
      maxDistance: 4,
      match: block => 
        block.hardness === 0 
          && block.below().hardness > 0
          && block.above().hardness === 0
    })

    const bot = getContextBot().rawBot

    await new Promise((res, rej) => {
      bot.navigate.stop()
      bot.navigate.removeAllListeners()
    
      Navigation.blocksNotToAvoid.forEach(t => 
        bot.navigate.blocksToAvoid[t] = false
      )
    
      bot.navigate.on('arrived', res)

      bot.navigate.on('cannotFind', (closestPath: any) => {
        if(allowPartialPaths)
          bot.navigate.walk(closestPath, (err: any) => err && err !== 'arrived' ? rej(err) : res())
        else
          rej(new Error('Unable to find a full path to that position.'))
      })

      bot.navigate.on('interrupted', rej)
    
      bot.navigate.to(platform.position)
    })
  }
}
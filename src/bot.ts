import { setContextBot, getContextBot } from './context'
import { getBot } from './creation'
import { VectorLike } from '../immutable3d/vector'
import { Block } from './data'

export interface BotCreationOptions {
  name: string
}

export class Inventory {
  constructor(readonly rawInventory: any) { }

  count(type: number): number {
    return this.rawInventory.count(type)
  }
}

export class BotInstance {
  constructor(readonly rawBot: any) {
    setContextBot(this)
  }

  position(): VectorLike {
    return this.rawBot.entity.position
  }

  inventory(): Inventory {
    return new Inventory(this.rawBot.inventory)
  }

  dig(block: Block): Promise<void> {
    return new Promise((resolve, reject) => 
      this.rawBot.dig(block.rawBlock, (err: any) => err ? reject(err) : resolve())
    )
  }

  equip(type: number): Promise<void> {
    return new Promise((resolve, reject) => 
      this.rawBot.equip(
        this.rawBot.inventory.items().filter((i: any) => i.type === type)[0], 
        'hand', 
        (err: any) => err ? reject(err) : resolve()
      )
    )
  }

  unequip(): Promise<void> {
    return new Promise(resolve => 
      this.rawBot.unequip('hand', resolve)
    )
  }

  useHand(object: void | Block): Promise<void> {
    return new Promise((resolve, reject) => {
      if(object instanceof Block) {
        this.rawBot.activateBlock(object.rawBlock, (err: any) => err ? reject(err) : resolve())
      } else {
        this.rawBot.activateItem()
        resolve()
      }
    })
  }
}

export class Bot {
  static create(options: BotCreationOptions): Promise<BotInstance> { 
    return new Promise(resolve => {
      const bot = getBot(Bot.mapOptions(options))
      bot.on('spawn', (_: any) => resolve(new BotInstance(bot)))
    })
  }

  static quit(): void {
    getContextBot().rawBot.quit()
  }

  private static mapOptions(options: BotCreationOptions) {
    return {
      username: options.name
    }
  }

  static position(): VectorLike {
    return getContextBot().position()
  }

  static inventory(): Inventory {
    return getContextBot().inventory()
  }

  static dig(block: Block): Promise<void> {
    return getContextBot().dig(block)
  }

  static equip(type: number): Promise<void> {
    return getContextBot().equip(type)
  }

  static unequip(): Promise<void> {
    return getContextBot().unequip()
  }

  static useHand(object: void | Block): Promise<void> {
    return getContextBot().useHand(object)
  }
}
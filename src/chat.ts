import { getContextBot } from './context'

export class Chat {
  static broadcast(message: string): void {
    getContextBot().rawBot.chat(message)
  }
}
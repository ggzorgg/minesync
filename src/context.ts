import { BotInstance } from './bot'

let bot: BotInstance = null

export function setContextBot(botInstance: BotInstance) {
  if(bot !== null)
    throw new Error('Attempting to set context bot twice.')

  bot = botInstance  
}

export function getContextBot(): BotInstance {
  return bot
}
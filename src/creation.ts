import mineflayer = require('mineflayer')

import blockfinder = require('mineflayer-blockfinder')
import navigate = require('mineflayer-navigate')

export function getBot(options) {
  const bot = mineflayer.createBot(options)

  bot.loadPlugin(blockfinder(mineflayer))
  navigate(mineflayer)(bot)

  return bot
}
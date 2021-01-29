import "reflect-metadata";

import Discord from 'discord.js';
import dotenv from 'dotenv';
import { exit } from 'process';
import { BotMessageController } from './core/controller';
import { BotLogger } from "./core/logger";

import { container } from "tsyringe";
import { Commands } from "./command/commands";


dotenv.config();
const logger = container.resolve(BotLogger);

const channelId = process.env.DISCORD_CHANNEL_ID ?? null;
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.DISCORD_PREFIX ?? '/';

if (!token) {
  logger.error('DISCORD_TOKEN is needed in .env');
  exit(1);
}

container.register('channelId', { useValue: channelId });
container.register('prefix', { useValue: prefix });

const bot = new Discord.Client();

container.register('bot', { useValue: bot });
container.resolve(Commands);

logger.info('Finished initializing, logging in');
const messageController = container.resolve<BotMessageController>(BotMessageController);

bot.on('ready', () => messageController.onReady());
bot.on('message', (msg) => messageController.onMessage(msg));
bot.login(token);


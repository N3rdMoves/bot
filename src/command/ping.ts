import { Client, Message, MessageEmbed } from 'discord.js';
import minimist from 'minimist';
import { injectable, singleton } from 'tsyringe';
import { Command } from '../core/command';
import { BotLogger } from '../core/logger';

@singleton()
@injectable()
export class Ping implements Command {
    constructor(private logger: BotLogger, private bot: Client) {
        logger.info('Ping initialized')
    }
    async handle(cmd: minimist.ParsedArgs, msg: Message): Promise<void> {
        const embed = new MessageEmbed({});
        embed
            .setColor(0x00ff00)
            .setTitle('Pong')
        msg.reply(embed);
    }
}
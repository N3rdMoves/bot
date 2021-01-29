import { Client, Message } from 'discord.js';
import { container, injectable } from 'tsyringe';
import { Command } from './command';
import { BotLogger } from './logger';
import { BotConfig } from './model/config';
import { Parser } from './parse';

@injectable()
export class BotMessageController {
    constructor(private config: BotConfig, private bot: Client, private commandParser: Parser, private logger: BotLogger) { }

    public onReady() {
        if (this.bot.user)
            return this.logger.info(`Logged in as ${this.bot.user.tag}!`);
    }

    public onMessage(msg: Message) {
        try {
            if (this.ignores(msg)) return;

            const [name, args] = this.commandParser.parseCommand(msg.content);

            const command = container.resolve<Command>(name);

            if (command) {
                command.handle(args, msg);
            }
            else {
                // friendly error message that the command do not exist
            }
        } catch (error) {
            this.logger.error('got error', error);
        }

    }

    private ignores(msg: Message) {
        const content = msg.content;

        // keep each 'filter' separated, we want to explicitly see each cases
        if (!content.startsWith(this.config.prefix)) return true;

        if (this.config.channelId && this.config.channelId !== msg.channel.id) return true;

        return false;
    }
}
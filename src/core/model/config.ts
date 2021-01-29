import { inject, injectable } from "tsyringe";

@injectable()
export class BotConfig {
    readonly channelId?: string;
    readonly prefix: string;

    constructor(@inject('channelId') channelId?: string, @inject('prefix') prefix?: string) {
        this.channelId = channelId;
        this.prefix = prefix ?? '/';
    }
}
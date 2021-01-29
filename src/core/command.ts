import { Client, Message } from "discord.js";
import minimist from "minimist";

export interface Command {
    handle(cmd: minimist.ParsedArgs, msg: Message): Promise<void>;
}
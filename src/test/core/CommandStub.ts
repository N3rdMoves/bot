import { Message } from 'discord.js';
import minimist from 'minimist';
import { Command } from '../../core/command';

export class CommandStub implements Command { 
    private message?: Message;
    private args?: minimist.ParsedArgs;
    async handle(args: minimist.ParsedArgs, msg: Message): Promise<void>{
        this.message = msg;
        this.args = args;
    }
    
    public get msg() : Message|undefined {
        return this.message;
    }
    public get arguments() : minimist.ParsedArgs|undefined {
        return this.args;
    }
    
}

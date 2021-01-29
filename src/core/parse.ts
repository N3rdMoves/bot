import minimist from 'minimist';
import { singleton } from 'tsyringe';

@singleton()
export class Parser {
    parseCommand(command: string): [string, minimist.ParsedArgs] {
        const args = this.splitargs(command.slice(1));

        return [args[0], minimist(args.slice(1))];
    }

    private splitargs(words: string) {
        return (words.match(/[^\s"]+|"([^"]*)"/gi) || [])
        .map((word) => word.replace(/^"(.+(?="$))"$/, '$1'));
    }
}


import { singleton } from "tsyringe";
import winston, { Logger } from "winston";

@singleton()
export class BotLogger {
    private readonly logger: Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'nerd-move' },
            transports: [
                //
                // - Write all logs with level `error` and below to `error.log`
                // - Write all logs with level `info` and below to `combined.log`
                //
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' }),
            ],
        });

        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        };
    }

    info(msg: string) {
        this.logger.info(msg);
    }

    error(msg: string, ...error: any) {
        this.logger.error(msg, ...error);
    }
}
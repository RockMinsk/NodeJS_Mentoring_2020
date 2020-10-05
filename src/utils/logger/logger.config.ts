import 'dotenv/config';

import * as winston from 'winston';
import * as fs from 'fs';

const logDir: string = 'logs';
const saveLogsInFile: boolean = false;
const loggerLevel = process.env.LOGGER_LEVEL || 'debug';

const logLevels = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'cyan'
}

const transports = [
    new (winston.transports.Console)({
        level: loggerLevel,
        format: winston.format.combine(
            winston.format.label(),
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss'
            }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    }),
    // TODO: improve to exclude custom colorization from saved log files
    new (winston.transports.File)({
        level: 'error',
        filename: `logs/error.log`
    }),
    new (winston.transports.File)({
        level: 'debug',
        filename: `logs/debug.log`
    })
];

winston.addColors(logLevels);

const logger = winston.createLogger({ transports });

if(saveLogsInFile) {
    if(!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    };
} else {
    logger.remove(winston.transports.File)
}

logger.info(`Setting logs level to ${loggerLevel}`)

export { logger };

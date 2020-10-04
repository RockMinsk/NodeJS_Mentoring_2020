import { NextFunction, Request, Response } from "express";
import { setTextColor, COLORS } from "../helpers/colorize-text";
import { logger } from "../logger.config";

const timeExecutionMs = (diff: number[]): number => {
    const [seconds, nanoseconds] = diff;
    return (seconds * 1e9 + nanoseconds) / 1e6;
}

export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
    let expectedColor: string;
    const start = process.hrtime();

    res.on('finish', async() => {
        const diff: number[] = process.hrtime(start);
        const time: number = timeExecutionMs(diff);
        switch (true) {
            case time < 10:
                expectedColor = COLORS.FgGreen;
                break;
            case time >= 10 && time < 50:
                expectedColor = COLORS.FgYellow;
                break;
            case time >= 50:
                expectedColor = COLORS.FgRed;
                break;
        }
        logger.info(`Request ${setTextColor(req.method, COLORS.FgYellow)} ${setTextColor(req.originalUrl, COLORS.FgCyan)} finished in ${setTextColor(`${time}`, expectedColor)} ms`);
    })
    next();
}

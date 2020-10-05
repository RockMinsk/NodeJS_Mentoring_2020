import { NextFunction, Request, Response } from "express";
import { logger } from "../logger.config";
import { sencitiveDataHandler } from "../helpers/sensitive-data-handler";
import { setTextColor, COLORS } from "../helpers/colorize-text";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const params: string = JSON.stringify(sencitiveDataHandler(req.body));
    logger.info(`Request ${setTextColor(req.method, COLORS.FgYellow)} ${setTextColor(req.originalUrl, COLORS.FgCyan)} with params ${params} started`);
    next();
}
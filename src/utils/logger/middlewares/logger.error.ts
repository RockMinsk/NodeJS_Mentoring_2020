import { NextFunction, Request, Response } from "express";
import { setTextColor, COLORS } from "../helpers/colorize-text";
import { logger } from "../logger.config";

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error on ${setTextColor(req.method, COLORS.FgYellow)} ${setTextColor(req.originalUrl, COLORS.FgCyan)} with params ${req.body}. Error: ${err}`);
    next(err);
}

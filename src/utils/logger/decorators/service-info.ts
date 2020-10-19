import { logger } from "../logger.config";
import { sencitiveDataHandler } from "../helpers/sensitive-data-handler";

export const serviceInfo = (service: any, method: any, parameters: any): any => {
    const value = parameters.value;
    parameters.value = function() {
        let params: string;
        const args: any = [...arguments][0];
        typeof args === 'object' ? params = JSON.stringify(sencitiveDataHandler(args)) : params = args;
        try {
            logger.debug(`${service.constructor.name}.${method}(${params}) method is used`);
            return value.apply(this, arguments);
        } catch (err) {
            logger.error(`Error occurred during execution of ${service.constructor.name}.${method}(${params}) method. Error: ${err}`);
            throw new Error(err);
        }
    }
    return parameters;
}

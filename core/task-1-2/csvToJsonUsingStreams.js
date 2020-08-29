import * as fs from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';
import { transformJson } from './utils';
import { FULL_PATH_INPUT, FULL_PATH_OUTPUT } from './constant';

pipeline(
    fs.createReadStream(`${FULL_PATH_INPUT}`),
    csv({ checkType: true, downstreamFormat: 'line' }).subscribe(jsonObj => transformJson(jsonObj)),
    fs.createWriteStream(`${FULL_PATH_OUTPUT}`),
    error => {
        if (error) {
            console.error(`File "${FULL_PATH_INPUT}" wasn't converted to "${FULL_PATH_OUTPUT}".\n${error}`);
        } else {
            console.log(`File "${FULL_PATH_INPUT}" was converted to "${FULL_PATH_OUTPUT}".`);
        }
    }
);

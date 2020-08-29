import * as fs from 'fs';
import csv from 'csvtojson';
import { promisify } from 'util';
import { transformJson } from './utils';
import { FULL_PATH_INPUT, FULL_PATH_OUTPUT } from './constant';

const writeFileAsync = promisify(fs.writeFile);

async function convertCsvFileToJsonUsingBuffer(csvFilePath, jsonFilePath) {
    try {
        const jsonArray = await csv().fromFile(csvFilePath).subscribe(jsonObj => transformJson(jsonObj));
        await writeFileAsync(jsonFilePath, JSON.stringify(jsonArray).slice(1, -1).replace(/},{/g, '}\n{').concat('\n'));
        console.log(`File "${FULL_PATH_INPUT}" was converted to "${FULL_PATH_OUTPUT}".`);
    } catch (error) {
        console.error(`File "${FULL_PATH_INPUT}" wasn't converted to "${FULL_PATH_OUTPUT}".`);
        throw error;
    }
}

convertCsvFileToJsonUsingBuffer(`${FULL_PATH_INPUT}`, `${FULL_PATH_OUTPUT}`);

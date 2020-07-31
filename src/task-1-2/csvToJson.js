import * as fs from 'fs';
import * as path from 'path';
import csv from 'csvtojson';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const pathToFolderInput = path.resolve('./src/task-1-2/csv');
const pathToFolderOutput = path.resolve('./src/task-1-2/txt');
// NOTE. Files can be overwritten by user in command line as first and second parameters. Existing pathes used by default.
const fileInput = process.argv[2] ?? 'example.csv';
const fileOutput = process.argv[3] ?? 'convertedFile.txt';

async function convertCsvFileToJson(csvFilePath, jsonFilePath) {
    try {
        const jsonArray = await csv().fromFile(csvFilePath);
        await writeFileAsync(jsonFilePath, JSON.stringify(jsonArray).slice(1,-1).replace(/},{/g, '}\n{').concat('\n'));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

convertCsvFileToJson(`${pathToFolderInput}/${fileInput}`,`${pathToFolderOutput}/${fileOutput}`)
    .then(
        () => console.log(`File "${fileInput}" was converted to "${fileOutput}".`),
        () => console.error(`File "${fileInput}" wasn't converted to "${fileOutput}".`)
    );

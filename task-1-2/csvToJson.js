import * as fs from 'fs';
import * as path from 'path';
import csv from "csvtojson";
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile);
const pathToFolder = path.resolve('./task-1-2/csv');

async function convertCsvFileToJson(csvFilePath, jsonFilePath) {
    try {
        const jsonArray = await csv().fromFile(csvFilePath);
        await writeFileAsync(jsonFilePath, JSON.stringify(jsonArray).slice(1,-1).replace(/},{/g, `}\n{`));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// NOTE: Files can be overwritten by user in command line as first and second parameters. Existing pathes used by default.
convertCsvFileToJson(process.argv[2] ? `${pathToFolder}/${process.argv[2]}` : `${pathToFolder}/nodejs-hw1-ex1.csv`,
                     process.argv[3] ? `${pathToFolder}/${process.argv[3]}` : `${pathToFolder}/convertedFileUsingPipes.txt`)
    .then(
        () => console.log(`File was converted from CSV to TXT.`),
        () => console.error(`File wasn't converted from CSV to TXT.`)
    );
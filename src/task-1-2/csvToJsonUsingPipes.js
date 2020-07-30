import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import csv from "csvtojson";

const pathToFolderInput = path.resolve('./src/task-1-2/csv');
const pathToFolderOutput = path.resolve('./src/task-1-2/txt');
// NOTE. Files can be overwritten by user in command line as first and second parameters. Existing pathes used by default.
const fileInput = process.argv[2] ?? 'example.csv';
const fileOutput = process.argv[3] ?? 'convertedFileUsingPipes.txt';

pipeline(
    fs.createReadStream(`${pathToFolderInput}/${fileInput}`),
    csv({ checkType: true, downstreamFormat: 'line' }),
    fs.createWriteStream(`${pathToFolderOutput}/${fileOutput}`),
    error => {
        if (error) {
            console.error(`The following error occurred during convertion file from CSV to TXT format: ${error}`);
        } else {
            console.log(`File was converted from CSV to TXT.`);
        }
    }
)

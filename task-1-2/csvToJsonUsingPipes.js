import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import csv from "csvtojson";

const pathToFolder = path.resolve('./task-1-2/csv');

pipeline(
    fs.createReadStream(process.argv[2] ? `${pathToFolder}/${process.argv[2]}` : `${pathToFolder}/nodejs-hw1-ex1.csv`),
    csv({ checkType: true, downstreamFormat: 'line' }),
    fs.createWriteStream(process.argv[3] ? `${pathToFolder}/${process.argv[3]}` : `${pathToFolder}/convertedFileUsingPipes.txt`),
    error => {
        if (error) {
            console.error(`The following error occurred during convertion file from CSV to TXT format: ${error}`);
        } else {
            console.log(`File was converted from CSV to TXT.`);
        }
    }
)

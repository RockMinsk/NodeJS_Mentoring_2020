import path from 'path';

const PATH_TO_FOLDER_INPUT = path.resolve(__dirname, './csv');
const PATH_TO_FOLDER_OUTPUT = path.resolve(__dirname, './txt');
// NOTE. Files can be overwritten by user in command line as first and second parameters. Existing pathes used by default.
const FILE_NAME = 'example';
const FILE_INPUT = process.argv[2] ?? `${FILE_NAME}.csv`;
const FILE_OUTPUT = process.argv[3] ?? `${FILE_NAME}.txt`;

export const FULL_PATH_INPUT = path.join(`${PATH_TO_FOLDER_INPUT}`, `${FILE_INPUT}`);
export const FULL_PATH_OUTPUT = path.join(`${PATH_TO_FOLDER_OUTPUT}`, `${FILE_OUTPUT}`);

export const EXPECTED_CSV_FILE_COLUMNS = [
    'Book',
    'Author',
    'Price'
];

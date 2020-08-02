import { EXPECTED_CSV_FILE_COLUMNS } from './constant';

export function transformJson(jsonObj) {
    for (let key in jsonObj) {
        if (EXPECTED_CSV_FILE_COLUMNS.includes(key)) {
            if (jsonObj[key] && !isNaN(jsonObj[key])) { jsonObj[key] = +jsonObj[key]; }
            if (key !== key.toLowerCase()) {
                Object.defineProperty(jsonObj, key.toLowerCase(), Object.getOwnPropertyDescriptor(jsonObj, key));
                delete jsonObj[key];
            }
        } else {
            delete jsonObj[key];
        }
    }
    return jsonObj;
}

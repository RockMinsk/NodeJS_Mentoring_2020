import { SENSITIVE_DATA } from '../../../constants/constants'

export const sencitiveDataHandler = (jsonObj: any[]) => {
    const correctedObj: any[] = { ...jsonObj };
    for (const key in correctedObj) {
        if (SENSITIVE_DATA.includes(key)) {
            correctedObj[key] = `******`;
        }
    }
    return correctedObj;
}
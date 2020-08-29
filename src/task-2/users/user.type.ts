export type UserInterface = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
    [index: string]: boolean | number | string;
};

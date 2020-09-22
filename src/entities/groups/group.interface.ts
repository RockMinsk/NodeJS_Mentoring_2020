export type Permissions = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface GroupInterface {
    id: string;
    name: string;
    permissions: Array<Permissions>;
};

export interface UserGroupInterface {
    user_id: string;
    group_id: string;
};

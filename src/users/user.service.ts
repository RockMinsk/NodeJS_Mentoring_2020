import { User, operatorsAliases } from './user.model';
import { UserInterface } from './user.interface';

export const getUsersFromDb = async (loginSubstring?: string, limit?: number | undefined): Promise<Array<UserInterface>> => {
    try {
        let users: Array<any> = [];
        const dbUsers: User[] = await User.findAll({
            limit: limit ? limit : undefined,
            where: loginSubstring !== 'undefined' ? {
                login: { [operatorsAliases.$like]: '%' + loginSubstring + '%' },
                is_deleted: false
            } : {
                is_deleted: false
            },
            order: [
                ["login","ASC"]
            ],
        });
        dbUsers.map(user => users.push(user.toJSON()));
        return users;
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.message;
    }
};

export const getUserByIdFromDb = async (id: string): Promise<UserInterface> => {
    try {
        const dbUser: User | null = await User.findOne({
            where: { 
                id: id,
                is_deleted: false 
            }
        });
        return dbUser ? dbUser.get({ plain: true }) : null;
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.message;
    }
}

export const getUserByLoginFromDb = async (login: string): Promise<UserInterface> => {
    try {
        const dbUser: User | null = await User.findOne({
            where: {
                login: login,
                is_deleted: false
            }
        });
        return dbUser ? dbUser.get({ plain: true }) : null;
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.message;
    }
}

export const addNewUserInDb = async(obj: UserInterface): Promise<UserInterface> => {
    try {
        const dbUser: User = await User.create(obj);
        return dbUser.get({ plain: true });
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.errors[0].message;
    }
}

export const updateUserInDb = async(id: string, obj: any): Promise<UserInterface> => {
    try {
        const dbUser: User | null = await User.findByPk(id);
        const isUserDeleted: User = dbUser?.get({ plain: true }).is_deleted;
        if (!isUserDeleted) {
            dbUser?.update({ 
                login: obj.login,
                password: obj.password,
                age: obj.age
            })
        }
        return dbUser && !isUserDeleted ? dbUser.get({ plain: true }) : null;
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.message;
    }
}

export const softDeleteFromDb = async (id: string) => {
    try {
        const dbUser: User | null = await User.findByPk(id);
        return dbUser ? dbUser.update({ is_deleted: true }) : null;
    } catch (err) {
        console.error(`The following error occurred: ${err}`);
        return err.message;
    }
}

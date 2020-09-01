import { User } from './user.model';
import { UserInterface } from './user.type';

export const getUsersFromDb = async (): Promise<Array<UserInterface>> => {
    try {
        let users: Array<any> = [];
        const dbUsers: User[] = await User.findAll();
        dbUsers.map(user => users.push(user.toJSON()));
        const activeUsers = users.filter(user => !user.is_deleted);
        return activeUsers;
    } catch (err) {
        throw new Error(`The following error occurred: ${err}`);
    }
};

export const getUserByIdFromDb = async (id: string): Promise<UserInterface> => {
    try {
        const dbUser: User | null = await User.findByPk(id)
        const isUserDeleted: User = dbUser?.get({ plain: true }).is_deleted;
        return dbUser && !isUserDeleted ? dbUser.get({ plain: true }) : null;
    } catch (err) {
        throw new Error(`The following error occurred: ${err}`);
    }
}

export const getUserByLoginFromDb = async (login: string): Promise<UserInterface> => {
    try {
        const dbUser: User | null = await User.findOne({ where: { login: login }})
        const isUserDeleted: User = dbUser?.get({ plain: true }).is_deleted;
        return dbUser && !isUserDeleted ? dbUser.get({ plain: true }) : null;
    } catch (err) {
        throw new Error(`The following error occurred: ${err}`);
    }
}

export const addNewUserInDb = async(obj: UserInterface): Promise<UserInterface> => {
    try {
        const dbUser: User = await User.create(obj);
        return dbUser.get({ plain: true });
    } catch (err) {
        throw new Error(`The following error occurred: ${err}`);
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
        throw new Error(`The following error occurred: ${err}`);
    }
}

export const softDeleteFromDb = async (id: string) => {
    try {
        const dbUser: User | null = await User.findByPk(id);
        return dbUser ? dbUser.update({ is_deleted: true }) : null;
    } catch (err) {
        throw new Error(`The following error occurred: ${err}`);
    }
}

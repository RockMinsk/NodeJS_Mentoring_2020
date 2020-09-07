import { User, operatorsAliases } from './user.model';
import { UserInterface } from './user.interface';

export class UserService {

    getUsersFromDb = async (loginSubstring?: string, limit?: number | undefined): Promise<Array<UserInterface>> => {
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
    };

    getUserByIdFromDb = async (id: string): Promise<UserInterface|null> => {
        const dbUser: User | null = await User.findOne({
            where: { 
                id: id,
                is_deleted: false 
            }
        });
        return dbUser ? dbUser.get({ plain: true }) : null;
    }

    getActiveUserByLoginFromDb = async (login: string): Promise<UserInterface|null> => {
        const dbUser: User | null = await User.findOne({
            where: {
                login: login,
                is_deleted: false
            }
        });
        return dbUser ? dbUser.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking login uniqueness
    getAnyUserByLoginFromDb = async (login: string): Promise<UserInterface|null> => {
        const dbUser: User | null = await User.findOne({
            where: { login: login }
        });
        return dbUser ? dbUser.get({ plain: true }) : null;
    }

    addNewUserInDb = async(obj: UserInterface): Promise<UserInterface|null> => {
        const dbUser: User = await User.create(obj);
        return dbUser.get({ plain: true });
    }

    updateUserInDb = async(id: string, obj: any): Promise<UserInterface|null> => {
        const dbUser: User | null = await User.findByPk(id);
        const isUserDeleted: boolean = dbUser?.get({ plain: true }).is_deleted;
        if (!isUserDeleted) {
            dbUser?.update({ 
                login: obj.login,
                password: obj.password,
                age: obj.age
            })
        }
        return dbUser && !isUserDeleted ? dbUser.get({ plain: true }) : null;
    }

    softDeleteFromDb = async (id: string): Promise<User|null> => {
        const dbUser: User | null = await User.findByPk(id);
        return dbUser ? dbUser.update({ is_deleted: true }) : null;
    }
}

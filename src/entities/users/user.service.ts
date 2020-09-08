import { User, operatorsAliases } from './user.model';
import { UserInterface } from './user.interface';

export class UserService {

    getAll = async (loginSubstring?: string, limit?: number | undefined): Promise<Array<UserInterface>> => {
        let correctedItems: Array<any> = [];
        const items: User[] = await User.findAll({
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
        items.map(item => correctedItems.push(item.toJSON()));
        return correctedItems;
    };

    getById = async (id: string): Promise<UserInterface|null> => {
        const item: User | null = await User.findOne({
            where: { 
                id: id,
                is_deleted: false 
            }
        });
        return item ? item.get({ plain: true }) : null;
    }

    getActiveByLogin = async (login: string): Promise<UserInterface|null> => {
        const item: User | null = await User.findOne({
            where: {
                login: login,
                is_deleted: false
            }
        });
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking login uniqueness
    getAnyByLogin = async (login: string): Promise<UserInterface|null> => {
        const item: User | null = await User.findOne({
            where: { login: login }
        });
        return item ? item.get({ plain: true }) : null;
    }

    add = async(obj: UserInterface): Promise<UserInterface|null> => {
        const item: User = await User.create(obj);
        return item.get({ plain: true });
    }

    update = async(id: string, obj: any): Promise<UserInterface|null> => {
        const item: User | null = await User.findByPk(id);
        const isItemDeleted: boolean = item?.get({ plain: true }).is_deleted;
        if (!isItemDeleted) {
            item?.update({ 
                login: obj.login,
                password: obj.password,
                age: obj.age
            })
        }
        return item && !isItemDeleted ? item.get({ plain: true }) : null;
    }

    softDelete = async (id: string): Promise<User|null> => {
        const item: User | null = await User.findByPk(id);
        return item ? item.update({ is_deleted: true }) : null;
    }
}

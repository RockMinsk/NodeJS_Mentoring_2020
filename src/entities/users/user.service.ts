import { User, operatorsAliases } from './user.model';
import { UserInterface } from './user.interface';
import { serviceInfo } from '../../utils/logger/decorators/service-info';

class UserService {

    @serviceInfo
    async getAll(loginSubstring?: string, limit?: number | undefined): Promise<Array<UserInterface>> {
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

    @serviceInfo
    async getById(id: string): Promise<UserInterface|null> {
        const item: User | null = await User.findOne({
            where: { 
                id: id,
                is_deleted: false 
            }
        });
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for additional check during adding users to group
    @serviceInfo
    async getAllActiveUserIds(ids: string[]): Promise<string[]> {
        let correctedItems: string[] = [];
        for (let id of ids) {
            const item: UserInterface | null = await this.getById(id);
            if (item) {
                correctedItems.push(id)
            }
        }
        return correctedItems;
    }

    @serviceInfo
    async getActiveByLogin(login: string): Promise<UserInterface|null> {
        const item: User | null = await User.findOne({
            where: {
                login: login,
                is_deleted: false
            }
        });
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking login uniqueness
    @serviceInfo
    async getAnyByLogin(login: string): Promise<UserInterface|null> {
        const item: User | null = await User.findOne({ where: { login: login }});
        return item ? item.get({ plain: true }) : null;
    }

    @serviceInfo
    async add(obj: UserInterface): Promise<UserInterface|null> {
        const item: User = await User.create(obj);
        return item.get({ plain: true });
    }

    @serviceInfo
    async update (id: string, obj: any): Promise<UserInterface|null> {
        let item: User | null = await User.findByPk(id);
        const isItemDeleted: boolean | undefined = item?.get({ plain: true }).is_deleted;
        if (!isItemDeleted) {
            await item?.update({ 
                login: obj.login,
                password: obj.password,
                age: obj.age
            })
        }
        item = await User.findByPk(id);
        return item && !isItemDeleted ? item.get({ plain: true }) : null;
    }

    @serviceInfo
    async softDelete (id: string): Promise<UserInterface|null> {
        const item: User | null = await User.findByPk(id);
        return item ? item.update({ is_deleted: true }) : null;
    }
}

export const userService = new UserService();

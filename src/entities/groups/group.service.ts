import { GroupInterface } from './group.interface';
import { Group } from './group.model';
import { sequelize } from '../../db/dbConnection';
import { UserService } from '../users/user.service'
import { serviceInfo } from '../../utils/logger/decorators/service-info';

export class GroupService {

    @serviceInfo
    async getAll(): Promise<Array<GroupInterface>> {
        let correctedItems: Array<any> = [];
        const items: Group[] = await Group.findAll({
            order: [
                ["name","ASC"]
            ],
        });
        items.map(item => correctedItems.push(item.toJSON()));
        return correctedItems;
    };

    @serviceInfo
    async getById(id: string): Promise<GroupInterface|null> {
        const item: Group | null = await Group.findOne({ where: { id: id }});
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking name uniqueness
    @serviceInfo
    async getByName(name: string): Promise<GroupInterface|null> {
        const item: Group | null = await Group.findOne({ where: { name: name }});
        return item ? item.get({ plain: true }) : null;
    }

    @serviceInfo
    async add (obj: GroupInterface): Promise<GroupInterface|null> {
        const item: Group = await Group.create(obj);
        return item.get({ plain: true });
    }

    @serviceInfo
    async addUsers (id: string, userIds: string[]): Promise<GroupInterface|null> {
        const userService = new UserService;
        const group: any | null = await Group.findOne({ where: { id: id }});
        const existingUserIds: string[] = await userService.getAllActiveUserIds(userIds);
        // TODO: clarify how to move transaction to Model layer to avoid using sequelize inside Service layer
        if (group && existingUserIds.length > 0) {
            await sequelize.transaction(async(transaction) => await group.addUsers(existingUserIds, { transaction }));
            return group;
        } else {
            return null
        }
    }

    @serviceInfo
    async update(id: string, obj: any): Promise<GroupInterface|null> {
        const item: Group | null = await Group.findByPk(id);
        item?.update({ 
            name: obj.name,
            permissions: obj.permissions,
        })
        return item ? item.get({ plain: true }) : null;
    }

    @serviceInfo
    async delete (id: string): Promise<number|null> {
        const item: number | null = await Group.destroy({ where: { id: id }});
        return item;
    }
}

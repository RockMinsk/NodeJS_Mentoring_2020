import { GroupInterface } from './group.interface';
import { Group } from './group.model';
import { sequelize } from '../../db/dbConnection';

export class GroupService {

    getAll = async (): Promise<Array<GroupInterface>> => {
        let correctedItems: Array<any> = [];
        const items: Group[] = await Group.findAll({
            order: [
                ["name","ASC"]
            ],
        });
        items.map(item => correctedItems.push(item.toJSON()));
        return correctedItems;
    };

    getById = async (id: string): Promise<GroupInterface|null> => {
        const item: Group | null = await Group.findOne({ where: { id: id }});
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking name uniqueness
    getByName = async (name: string): Promise<GroupInterface|null> => {
        const item: Group | null = await Group.findOne({ where: { name: name }});
        return item ? item.get({ plain: true }) : null;
    }

    add = async(obj: GroupInterface): Promise<GroupInterface|null> => {
        const item: Group = await Group.create(obj);
        return item.get({ plain: true });
    }

    addUsers = async (id: string, userIds: string[]): Promise<GroupInterface|null> => {
        const item: any | null = await Group.findOne({ where: { id: id }});
        // TODO: clarify how to move transaction to Model layer to avoid using sequelize inside Service layer
        if (item) {
            await sequelize.transaction(async(transaction) => await item.addUsers(userIds, { transaction }));
            return item;
        } else {
            return null
        }
    }

    update = async(id: string, obj: any): Promise<GroupInterface|null> => {
        const item: Group | null = await Group.findByPk(id);
        item?.update({ 
            name: obj.name,
            permissions: obj.permissions,
        })
        return item ? item.get({ plain: true }) : null;
    }

    delete = async (id: string): Promise<number|null> => {
        const item: number | null = await Group.destroy({ where: { id: id }});
        return item;
    }
}

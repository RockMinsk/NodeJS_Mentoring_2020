import { Group } from './group.model';
import { UserGroup } from './user_group.model'
import { GroupInterface } from './group.interface';

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
        const item: Group | null = await Group.findOne({
            where: { id: id }
        });
        return item ? item.get({ plain: true }) : null;
    }

    // NOTE. Method is for checking name uniqueness
    getByName = async (name: string): Promise<GroupInterface|null> => {
        const item: Group | null = await Group.findOne({
            where: { name: name }
        });
        return item ? item.get({ plain: true }) : null;
    }

    add = async(obj: GroupInterface): Promise<GroupInterface|null> => {
        const item: Group = await Group.create(obj);
        return item.get({ plain: true });
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
        const items: Group[] = await Group.findAll({
            include: [{
                model: UserGroup
              }]
        });
        console.log(items);
        const item: number| null = await Group.destroy({where: { id: id }});
        return item;
    }
}

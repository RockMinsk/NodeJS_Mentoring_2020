import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/dbConnection'
import { GroupInterface, UserGroupInterface, Permissions } from './group.interface';
import { User } from '../users/user.model'

export class Group extends Model<GroupInterface> implements GroupInterface  {
    public id!: string;
    public name!: string;
    public permissions!: Array<Permissions>;
}

class UserGroup extends Model<UserGroupInterface> implements UserGroupInterface {
    public user_id!: string;
    public group_id!: string;
}

Group.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
            // defaultValue: Sequelize.UUIDV4
        },
        name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING
        },
        permissions: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    }, {
        sequelize,
        timestamps: false,
        schema: 'public',
        modelName: 'groups'
    }
);

UserGroup.init(
    {
        user_id: {
            allowNull: false,
            type: DataTypes.UUID
        },
        group_id: {
            allowNull: false,
            type: DataTypes.UUID
        }
    }, {
        sequelize,
        timestamps: false,
        schema: 'public',
        modelName: 'user_groups'
    }
);

Group.belongsToMany(User, {
    through: 'user_groups',
    as: 'users',
    foreignKey: 'group_id'
})

User.belongsToMany(Group, {
    through: 'user_groups',
    as: 'groups',
    foreignKey: 'user_id'
});

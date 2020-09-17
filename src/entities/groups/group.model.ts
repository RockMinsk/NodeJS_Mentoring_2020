import {
    Sequelize,
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    BelongsToManyRemoveAssociationsMixin,
    Association
}
from 'sequelize';
import { DB_CONNECTION_PROPERTIES } from '../../constants/constants';
import { GroupInterface, UserGroupInterface, Permissions } from './group.interface';
import { User } from '../users/user.model'

const sequelize = new Sequelize(DB_CONNECTION_PROPERTIES);

export class Group extends Model<GroupInterface> implements GroupInterface  {
    public id!: string;
    public name!: string;
    public permissions!: Permissions[];

    public delete!: BelongsToManyRemoveAssociationsMixin<UserGroup, number>;

    public static associations: {
        user_group: Association<Group, UserGroup>;
      };
}

export class UserGroup extends Model<UserGroupInterface> implements UserGroupInterface {
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
        modelName: 'user_group'
    }
);

// Group.belongsToMany(User, {
//     through: "user_group",
//     as: "users",
//     foreignKey: "group_id",
// })

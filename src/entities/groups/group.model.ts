import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/dbConnection'
import { GroupInterface, UserGroupInterface, Permissions } from './group.interface';
import { User, DB_USER_MODEL_NAME } from '../users/user.model'
import { DB_SCHEMA_NAME } from '../../constants/constants'

const DB_GROUP_MODEL_NAME: string = 'groups';
const DB_USER_GROUP_MODEL_NAME: string = 'user_group';
const DB_GROUP_FOREIGN_KEY: string = 'group_id';
const DB_USER_FOREIGN_KEY: string = 'user_id';

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
        underscored: true,
        freezeTableName: true,
        schema: DB_SCHEMA_NAME,
        modelName: DB_GROUP_MODEL_NAME
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
        underscored: true,
        freezeTableName: true,
        schema: DB_SCHEMA_NAME,
        modelName: DB_USER_GROUP_MODEL_NAME
    }
);

Group.belongsToMany(User, {
    through: DB_USER_GROUP_MODEL_NAME,
    as: DB_USER_MODEL_NAME,
    foreignKey: DB_GROUP_FOREIGN_KEY
})

User.belongsToMany(Group, {
    through: DB_USER_GROUP_MODEL_NAME,
    as: DB_GROUP_MODEL_NAME,
    foreignKey: DB_USER_FOREIGN_KEY
});

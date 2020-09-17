import {
    Sequelize,
    Model,
    DataTypes,
    Op,
    HasManyGetAssociationsMixin,
    BelongsToManyRemoveAssociationsMixin,
    Association
} from 'sequelize';
import { DB_CONNECTION_PROPERTIES } from '../../constants/constants';
import { UserInterface } from './user.interface';
import { Group, UserGroup } from '../groups/group.model';

const sequelize = new Sequelize(DB_CONNECTION_PROPERTIES);

export const operatorsAliases = {
  $like: Op.like,
  $not: Op.not
}

export class User extends Model<UserInterface> implements UserInterface {
    public id!: string;
    public login!: string;
    public password!: string;
    public age!: number;
    public is_deleted!: boolean;

    public delete!: BelongsToManyRemoveAssociationsMixin<UserGroup, number>;

    public static associations: {
        user_group: Association<User, UserGroup>;
      };
}

User.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
            // defaultValue: Sequelize.UUIDV4
        },
        login: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        age: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        is_deleted: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }
    }, {
        sequelize,
        timestamps: false,
        schema: 'public',
        modelName: 'users'
    }
);

// User.belongsToMany(Group, {
//     through: "user_group",
//     as: "groups",
//     foreignKey: "user_id"
// });

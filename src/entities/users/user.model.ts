import { Model, DataTypes, Op } from 'sequelize';
import { UserInterface } from './user.interface';
import { sequelize } from '../../db/dbConnection'

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

import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { DB_HOSTNAME, DB_PORT, DB_USER, DB_PASSWORD } from '../constants/constants';

const sequelize = new Sequelize({
    host: DB_HOSTNAME,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: 'postgres'
})

export const operatorsAliases = {
  $like: Op.like,
  $not: Op.not
}

export class User extends Model {}

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

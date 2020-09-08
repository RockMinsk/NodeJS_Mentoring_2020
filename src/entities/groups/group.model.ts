import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_HOSTNAME, DB_PORT, DB_USER, DB_PASSWORD } from '../../constants/constants';

const sequelize = new Sequelize({
    host: DB_HOSTNAME,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: 'postgres'
})

export class Group extends Model {}

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

import { Model, DataTypes } from 'sequelize';
import { AuthInterface } from './auth.interface';
import { sequelize } from '../db/dbConnection'
import { DB_SCHEMA_NAME } from '../constants/constants'

export const DB_AUTH_MODEL_NAME: string = 'tokens';

export class Authentication extends Model<AuthInterface> implements AuthInterface {
    public user_id!: string;
    public refresh_token!: string;
}

Authentication.init(
    {
        user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
            // defaultValue: Sequelize.UUIDV4
        },
        refresh_token: {
            allowNull: true,
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: DB_SCHEMA_NAME,
        modelName: DB_AUTH_MODEL_NAME
    }
);

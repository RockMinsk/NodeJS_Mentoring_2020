import { Sequelize } from 'sequelize';
import { DB_CONNECTION_PROPERTIES, DB_SYNC_FORCE } from '../constants/constants';

export const sequelize = new Sequelize(DB_CONNECTION_PROPERTIES);

export const dbSync = async () => await sequelize.sync({ force: DB_SYNC_FORCE });
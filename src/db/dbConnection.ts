import { Sequelize } from 'sequelize';
import { DB_CONNECTION_PROPERTIES } from '../constants/constants';

export const sequelize = new Sequelize(DB_CONNECTION_PROPERTIES);

export const dbSync = async () => await sequelize.sync();
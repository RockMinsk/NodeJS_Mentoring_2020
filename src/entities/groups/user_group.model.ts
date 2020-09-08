import { Sequelize, DataTypes } from 'sequelize';
import { User } from '../users/user.model';
import { Group } from './group.model';
import { DB_HOSTNAME, DB_PORT, DB_USER, DB_PASSWORD } from '../../constants/constants';

const sequelize = new Sequelize({
    host: DB_HOSTNAME,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: 'postgres'
})

export const UserGroup = sequelize.define('user_group', {
    user_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'user_id'
          }
    },
    group_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
            model: Group,
            key: 'group_id'
          }
    },
});

User.belongsToMany(Group, {
    through: UserGroup,
    as: "groups",
    foreignKey: "user_id"
});

Group.belongsToMany(User, {
    through: UserGroup,
    as: "users",
    foreignKey: "groups_id"
});
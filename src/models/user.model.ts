import { DataTypes,Model, Sequelize } from "sequelize";

enum RoleTypes {
    ADMIN = 'admin',
    USER = 'user'
}

interface IUserAttributes {
    id?: number,
    name: string,
    birthdate: Date,
    email: string,
    password: string,
    role: RoleTypes,
    deactivatedAt: Date | null
}


class User extends Model<IUserAttributes> implements IUserAttributes {
    declare id: number;
    declare name: string;
    declare birthdate: Date;
    declare email: string;
    declare password: string;
    declare role: RoleTypes;
    declare deactivatedAt: Date | null;
}

export function initUserModel(sequelize: Sequelize): void {
    User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(RoleTypes.ADMIN,RoleTypes.USER),
        allowNull: false,
    },
    deactivatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    sequelize, tableName: 'users', modelName: 'User', timestamps: false
})
}


export {User,RoleTypes}
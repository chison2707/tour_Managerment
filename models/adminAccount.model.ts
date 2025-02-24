import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const adminAccount = sequelize.define("adminAccount", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(11),
    },
    role_id: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING(20),
    },
    avatar: {
        type: DataTypes.STRING(250),
    },
}, {
    tableName: "admin_accounts",
    timestamps: true
});

export default adminAccount;
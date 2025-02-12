import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const User = sequelize.define("Order", {
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
    tokenUser: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(10),
    },
    avatar: {
        type: DataTypes.STRING(250),
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "users",
    timestamps: true
});

export default User;
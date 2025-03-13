"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User = database_1.default.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    tokenUser: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING(250),
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "users",
    timestamps: true
});
exports.default = User;

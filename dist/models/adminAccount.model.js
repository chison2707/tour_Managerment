"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const adminAccount = database_1.default.define("adminAccount", {
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
    token: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(11),
    },
    role_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING(250),
    },
}, {
    tableName: "admin_accounts",
    timestamps: true
});
exports.default = adminAccount;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ForgotPassword = database_1.default.define('ForgotPassword', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    otp: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false
    }
}, {
    tableName: 'forgot_password',
    timestamps: true
});
exports.default = ForgotPassword;

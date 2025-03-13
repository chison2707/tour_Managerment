"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, //use name đăng nhập
process.env.DATABASE_PASSWORD, //mật khẩu
{
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});
sequelize.authenticate()
    .then(() => { console.log('Connect success.'); })
    .catch((error) => { console.error('Error: ', error); });
exports.default = sequelize;

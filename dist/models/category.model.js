"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const slugify_1 = __importDefault(require("slugify"));
const Category = database_1.default.define("Category", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(500),
    },
    description: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    tableName: "categories",
    timestamps: true,
});
Category.beforeCreate((category) => {
    category["slug"] = (0, slugify_1.default)(`${category["title"]}-${Date.now()}`, {
        lower: true,
        strict: true
    });
});
exports.default = Category;

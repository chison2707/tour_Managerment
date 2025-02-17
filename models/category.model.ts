import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import slugify from "slugify";

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(500),
    },
    description: {
        type: DataTypes.TEXT('long'),
    },
    status: {
        type: DataTypes.STRING(20),
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: "categories",
    timestamps: true,
});

Category.beforeCreate((category) => {
    category["slug"] = slugify(`${category["title"]}-${Date.now()}`, {
        lower: true,
        strict: true
    });
});

export default Category;
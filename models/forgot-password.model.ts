import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const ForgotPassword = sequelize.define('ForgotPassword', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    otp: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    expireAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'forgot_password',
    timestamps: true
});

export default ForgotPassword;
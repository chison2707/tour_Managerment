import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME, //use name đăng nhập
    process.env.DATABASE_PASSWORD, //mật khẩu
    {
        host: process.env.DATABASE_HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate()
    .then(() => { console.log('Connect success.'); })
    .catch((error) => { console.error('Error: ', error); });

export default sequelize;
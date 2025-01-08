import express, { Express } from "express";
import dotenv from "dotenv";
import moment from "moment";
import bodyParser from "body-parser";

import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/system";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// client routes
clientRoutes(app);

// admin routes
adminRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

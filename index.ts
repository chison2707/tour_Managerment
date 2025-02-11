import express, { Express } from "express";
import dotenv from "dotenv";
import moment from "moment";
import bodyParser from "body-parser";
import path from 'path';

import flash from 'express-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
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

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end TinyMCE

app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// flash
app.use(cookieParser("GFDFGDFGDGDF"));
app.use(session({
    secret: 'GFDFGDFGDGDF',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
// end flash

// client routes
clientRoutes(app);

// admin routes
adminRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

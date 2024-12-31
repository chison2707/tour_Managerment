import express, { Express } from "express";
import dotenv from "dotenv";
import moment from "moment";

import clientRoutes from "./routes/client/index.route";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.moment = moment;

// client routes
clientRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

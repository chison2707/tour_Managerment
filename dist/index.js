"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const express_flash_1 = __importDefault(require("express-flash"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const index_route_2 = __importDefault(require("./routes/admin/index.route"));
const method_override_1 = __importDefault(require("method-override"));
const system_1 = require("./config/system");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");
// TinyMCE
app.use('/tinymce', express_1.default.static(path_1.default.join(__dirname, 'node_modules', 'tinymce')));
// end TinyMCE
app.locals.moment = moment_1.default;
app.locals.prefixAdmin = system_1.systemConfig.prefixAdmin;
// flash
app.use((0, cookie_parser_1.default)("GFDFGDFGDGDF"));
app.use((0, express_session_1.default)({
    secret: 'GFDFGDFGDGDF',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use((0, express_flash_1.default)());
// end flash
// client routes
(0, index_route_1.default)(app);
// admin routes
(0, index_route_2.default)(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

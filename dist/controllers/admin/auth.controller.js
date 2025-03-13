"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginPost = exports.login = void 0;
const md5_1 = __importDefault(require("md5"));
const system_1 = require("../../config/system");
const adminAccount_model_1 = __importDefault(require("../../models/adminAccount.model"));
//[GET] / admin/auth/login
const login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${system_1.systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    }
};
exports.login = login;
// [POST] /admin/auth/login
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield adminAccount_model_1.default.findOne({
        where: {
            email: email,
        },
        raw: true
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if ((0, md5_1.default)(password) != user["password"]) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect("back");
        return;
    }
    if (user["status"] == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("token", user["token"]);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/dashboard`);
});
exports.loginPost = loginPost;
//[GET] /admin/auth/logout
const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/login`);
};
exports.logout = logout;

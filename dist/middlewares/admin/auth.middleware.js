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
exports.requireAuth = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const system_1 = require("../../config/system");
const adminAccount_model_1 = __importDefault(require("../../models/adminAccount.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.token) {
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    else {
        const user = yield adminAccount_model_1.default.findOne({
            where: { token: req.cookies.token },
            raw: true,
            attributes: { exclude: ["password"] }
        });
        if (!user) {
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        else {
            const role = yield role_model_1.default.findOne({
                where: { id: user["role_id"] },
                attributes: ["title", "permissions"]
            });
            console.log(role["permissions"]);
            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
});
exports.requireAuth = requireAuth;

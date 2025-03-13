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
exports.deleteUser = exports.changeStatus = exports.detail = exports.index = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const system_1 = require("../../config/system");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
const sequelize_1 = require("sequelize");
//[GET] / admin/users
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("user_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý tài khoản user");
        return;
    }
    else {
        let find = { deleted: false };
        // search
        const objSearch = (0, search_1.default)(req.query);
        if (objSearch.keyword) {
            find["fullName"] = {
                [sequelize_1.Op.like]: `%${objSearch.keyword}%`
            };
        }
        // pagination
        const countUsers = yield user_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countUsers);
        // end pagination
        const users = yield user_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        res.render("admin/pages/users/index", {
            pageTitle: "Danh sách tài khoản user",
            users: users,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
//[GET] / admin/users/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("user_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý tài khoản user");
        return;
    }
    else {
        const id = req.params.id;
        const data = yield user_model_1.default.findOne({
            where: {
                id: id,
                deleted: false
            },
            raw: true
        });
        res.render("admin/pages/users/detail", {
            pageTitle: "Chi tiết tài khoản user",
            data: data
        });
    }
});
exports.detail = detail;
//[PATCH] / admin/users/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("user_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản user");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const status = req.params.status;
            yield user_model_1.default.update({
                status: status
            }, {
                where: {
                    id: id
                }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
        catch (error) {
            req.flash("error", "Cập nhật trạng thái thất bại");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
});
exports.changeStatus = changeStatus;
//[DELETE] / admin/users/delete/:id
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("user_delete")) {
        res.status(403).send("Bạn không có quyền xóa tài khoản user");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield user_model_1.default.destroy({
                where: {
                    id: id
                }
            });
            req.flash("success", "Xóa tài khoản thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
        catch (error) {
            req.flash("error", "Xóa tài khoản thất bại");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/users`);
        }
    }
});
exports.deleteUser = deleteUser;

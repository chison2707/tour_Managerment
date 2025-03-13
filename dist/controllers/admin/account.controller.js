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
exports.changeStatus = exports.deleteAccount = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
// import { systemConfig } from "../../config/config";
const md5_1 = __importDefault(require("md5"));
const adminAccount_model_1 = __importDefault(require("../../models/adminAccount.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const system_1 = require("../../config/system");
const generate_1 = require("../../helpers/generate");
const sequelize_1 = require("sequelize");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
//[GET] / admin/accounts
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_view")) {
        res.status(403).send("Bạn không có quyền xem tài khoản admin");
        return;
    }
    else {
        let find = {};
        // search
        const objSearch = (0, search_1.default)(req.query);
        if (objSearch.keyword) {
            find["fullName"] = {
                [sequelize_1.Op.like]: `%${objSearch.keyword}%`
            };
        }
        // pagination
        const countAccounts = yield adminAccount_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countAccounts);
        // end pagination
        // const accounts = await adminAccount.findAll();
        const accounts = yield adminAccount_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip
        });
        for (const record of accounts) {
            const role = yield role_model_1.default.findOne({
                where: {
                    id: record["role_id"]
                },
                raw: true
            });
            record["role"] = role;
        }
        res.render("admin/pages/accounts/index", {
            pageTitle: "Danh sách tài khoản admin",
            accounts: accounts,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
//[GET] / admin/accounts/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.findAll({
        where: {
            deleted: false
        },
        raw: true
    });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
});
exports.create = create;
//[PATCH] / admin/accounts/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_create")) {
        res.status(403).send("Bạn không có quyền tạo mới tài khoản admin");
        return;
    }
    else {
        const emailExists = yield adminAccount_model_1.default.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        });
        if (emailExists) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect("back");
        }
        else {
            req.body.password = (0, md5_1.default)(req.body.password);
            const token = (0, generate_1.generateRandomString)(20);
            yield adminAccount_model_1.default.create({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                role_id: req.body.role_id,
                status: req.body.status,
                token: token
            });
            req.flash("success", "Tạo tài khoản mới thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
});
exports.createPost = createPost;
//[GET] / admin/accounts/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = yield adminAccount_model_1.default.findOne({
        where: {
            id: id
        },
        raw: true
    });
    const roles = yield role_model_1.default.findAll({
        where: {
            deleted: false
        },
        raw: true
    });
    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    });
});
exports.edit = edit;
//[PATCH] / admin/accounts/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản admin");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const emailExists = yield adminAccount_model_1.default.findOne({
                where: {
                    id: { [sequelize_1.Op.ne]: id },
                    email: req.body.email,
                }
            });
            if (emailExists) {
                req.flash("error", `Email ${req.body.email} đã tồn tại`);
                return res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
            }
            else {
                if (req.body.password) {
                    req.body.password = (0, md5_1.default)(req.body.password);
                }
                else {
                    delete req.body.password;
                }
                yield adminAccount_model_1.default.update({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                    role_id: req.body.role_id,
                    status: req.body.status,
                }, {
                    where: {
                        id: id
                    }
                });
                req.flash("success", "Cập nhật tài khoản thành công");
                res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
            }
        }
        catch (error) {
            req.flash("error", "Cập nhật tài khoản thất bại");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
});
exports.editPatch = editPatch;
//[GET] / admin/accounts/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_view")) {
        res.status(403).send("Bạn không có quyền xem chi tiết tài khoản admin");
        return;
    }
    else {
        const id = req.params.id;
        const data = yield adminAccount_model_1.default.findOne({
            where: {
                id: id,
            },
            raw: true,
            attributes: {
                exclude: ['password', 'token']
            }
        });
        const role = yield role_model_1.default.findOne({
            where: {
                id: data["role_id"],
                deleted: false
            },
            raw: true
        });
        res.render("admin/pages/accounts/detail", {
            pageTitle: "Xem chi tiết tài khoản",
            data: data,
            role: role
        });
    }
});
exports.detail = detail;
//[DELETE] / admin/accounts/delete/:id
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_delete")) {
        res.status(403).send("Bạn không có quyền xóa tài khoản admin");
        return;
    }
    else {
        const id = req.params.id;
        yield adminAccount_model_1.default.destroy({ where: { id: id } });
        req.flash("success", "Xóa tài khoản thành công");
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.deleteAccount = deleteAccount;
//[PATCH] / admin/accounts/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("account_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản admin");
        return;
    }
    else {
        const status = req.params.status;
        const id = req.params.id;
        yield adminAccount_model_1.default.update({
            status: status
        }, {
            where: {
                id: id
            }
        });
        req.flash("success", "Cập nhật tài khoản thành công");
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
    }
});
exports.changeStatus = changeStatus;

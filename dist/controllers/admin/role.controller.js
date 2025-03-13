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
exports.permissionsPatch = exports.permissions = exports.deleteRole = exports.editPatch = exports.edit = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const system_1 = require("../../config/system");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
const sequelize_1 = require("sequelize");
//[GET] / admin/roles
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_view")) {
        res.status(403).send("Bạn không có quyền xem nhóm quyền");
        return;
    }
    else {
        let find = { deleted: false };
        // search
        const objSearch = (0, search_1.default)(req.query);
        if (objSearch.keyword) {
            find["title"] = {
                [sequelize_1.Op.like]: `%${objSearch.keyword}%`
            };
        }
        // pagination
        const countRoles = yield role_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countRoles);
        // end pagination
        const records = yield role_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        res.render("admin/pages/roles/index", {
            pageTitle: "Danh sách nhóm quyền",
            records: records,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
//[GET] / admin/roles/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/roles/create", {
        pageTitle: "Danh sách nhóm quyền"
    });
});
exports.create = create;
//[ POST] / admin/roles/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_create")) {
        res.status(403).send("Bạn không có quyền tạo nhóm quyền");
        return;
    }
    else {
        try {
            yield role_model_1.default.create({
                title: req.body.title,
                description: req.body.description,
            });
            req.flash('success', 'Thêm nhóm quyền mới thành công');
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
        catch (error) {
            req.flash('error', 'Thêm nhóm quyền mới thất bại');
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
    }
});
exports.createPost = createPost;
//[GET] / admin/roles/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_view")) {
        res.status(403).send("Bạn không có quyền xem nhóm quyền");
        return;
    }
    else {
        const id = req.params.id;
        const record = yield role_model_1.default.findOne({
            where: { id: id, deleted: false },
            raw: true
        });
        record["permissions"] = JSON.parse(record["permissions"]);
        res.render("admin/pages/roles/detail", {
            pageTitle: `Chi tiết ${record["title"]}`,
            record: record,
        });
    }
});
exports.detail = detail;
//[GET] / admin/roles/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const record = yield role_model_1.default.findOne({
        where: { id: id, deleted: false },
        raw: true
    });
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        record: record
    });
});
exports.edit = edit;
//[PATCH] / admin/roles/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa nhóm quyền");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield role_model_1.default.update({
                title: req.body.title,
                description: req.body.description,
            }, {
                where: { id: id }
            });
            req.flash('success', 'Cập nhật nhóm quyền thành công');
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
        catch (error) {
            req.flash('error', 'Lỗi');
            res.redirect(`back`);
        }
    }
});
exports.editPatch = editPatch;
//[ DELETE] / admin/roles/delete/:id
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_delete")) {
        res.status(403).send("Bạn không có quyền xóa nhóm quyền");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield role_model_1.default.destroy({ where: { id: id } });
            req.flash('success', 'Xóa nhóm quyền thành công');
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles`);
        }
        catch (error) {
            req.flash('success', 'lỗi');
            res.redirect(`back`);
        }
    }
});
exports.deleteRole = deleteRole;
//[GET] / admin/roles/permissions
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield role_model_1.default.findAll({
        where: { deleted: false },
        raw: true
    });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records,
    });
});
exports.permissions = permissions;
//[Patch] / admin/roles/permissions
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("role_permissions")) {
        res.status(403).send("Bạn không có quyền cập nhật phân quyền");
        return;
    }
    else {
        try {
            const permissions = JSON.parse(req.body.permissions);
            for (const item of permissions) {
                yield role_model_1.default.update({
                    permissions: item.permissions
                }, {
                    where: { id: item.id }
                });
            }
            req.flash('success', `Cập nhật phân quyền thành công!`);
        }
        catch (error) {
            req.flash('error', `Cập nhật phân quyền thất bại!`);
        }
        res.redirect("back");
    }
});
exports.permissionsPatch = permissionsPatch;

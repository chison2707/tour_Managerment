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
exports.detail = exports.deleteCategory = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const category_model_1 = __importDefault(require("../../models/category.model"));
const system_1 = require("../../config/system");
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
const sequelize_1 = require("sequelize");
// [GET] /admin/categories
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
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
        const countCategories = yield category_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countCategories);
        // end pagination
        const categories = yield category_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        res.render("admin/pages/category/index", {
            pageTitle: "Danh mục tour",
            categories: categories,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
// [GET] /admin/categories
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/category/create", {
        pageTitle: "Thêm danh mục tour"
    });
});
exports.create = create;
// [POST] /admin/categories
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_create")) {
        res.status(403).send("Bạn không có quyền thêm mới danh mục");
        return;
    }
    else {
        try {
            const dataCategory = {
                title: req.body.title,
                image: req.body.avatar,
                description: req.body.description,
                status: req.body.status,
            };
            yield category_model_1.default.create(dataCategory);
            req.flash("success", "Thêm danh mục thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
        catch (error) {
            req.flash("error", "Thêm danh mục thất bại");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
    }
});
exports.createPost = createPost;
// [GET] /admin/categories/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield category_model_1.default.findOne({
        where: {
            id: id,
            deleted: false,
        },
        raw: true
    });
    res.render("admin/pages/category/edit", {
        pageTitle: "Chỉnh sửa danh mục tour",
        category: category
    });
});
exports.edit = edit;
// [PATCH] /admin/categories/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa danh mục");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield category_model_1.default.update({
                title: req.body.title,
                image: req.body.avatar,
                description: req.body.description,
                status: req.body.status,
            }, {
                where: {
                    id: id,
                    deleted: false,
                }
            });
            req.flash("success", "Cập nhật danh mục tour thành công!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
        catch (error) {
            req.flash("error", "Cập nhật danh mục tour thất bại!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
    }
});
exports.editPatch = editPatch;
// [PATCH] /admin/categories/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa danh mục");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const status = req.params.status;
            yield category_model_1.default.update({
                status: status
            }, {
                where: {
                    id: id,
                    deleted: false,
                }
            });
            req.flash("success", "Cập nhật trạng thái danh mục tour thành công!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
        catch (error) {
            req.flash("error", "Cập nhật trạng thái danh mục tour thất bại!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
    }
});
exports.changeStatus = changeStatus;
// [DELETE] /admin/categories/delete/:id
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_delete")) {
        res.status(403).send("Bạn không có quyền xóa danh mục");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield category_model_1.default.destroy({
                where: { id: id }
            });
            req.flash("success", "Xóa danh mục tour thành công!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
        catch (error) {
            req.flash("error", "Xóa danh mục tour thất bại!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/categories`);
        }
    }
});
exports.deleteCategory = deleteCategory;
// [GET] /admin/categories/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("category_view")) {
        res.status(403).send("Bạn không có quyền xem danh mục");
        return;
    }
    else {
        const id = req.params.id;
        const category = yield category_model_1.default.findOne({
            where: {
                id: id,
                deleted: false,
            },
            raw: true
        });
        res.render("admin/pages/category/detail", {
            pageTitle: "Chi tiết tour",
            category: category
        });
    }
});
exports.detail = detail;

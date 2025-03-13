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
exports.detail = exports.deleteTour = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const generate_1 = require("../../helpers/generate");
const system_1 = require("../../config/system");
const tour_category_model_1 = __importDefault(require("../../models/tour-category.model"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
const sequelize_1 = require("sequelize");
// [GET]/admin/tours
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_view")) {
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
        const countTours = yield tour_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countTours);
        // end pagination
        const tours = yield tour_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        tours.forEach(item => {
            if (item["images"]) {
                const images = JSON.parse(item["images"]);
                item["image"] = images[0];
            }
            item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
        });
        res.render("admin/pages/tours/index", {
            pageTitle: "Danh sách tour",
            tours: tours,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
// [GET]/admin/tours/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.findAll({
        where: {
            deleted: false,
            status: 'active',
        },
        raw: true
    });
    res.render("admin/pages/tours/create", {
        pageTitle: "Thêm mới tour",
        categories: categories
    });
});
exports.create = create;
// [POST]/admin/tours/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_create")) {
        res.status(403).send("Bạn không có quyền thêm mới tour");
        return;
    }
    else {
        const countTour = yield tour_model_1.default.count();
        const code = (0, generate_1.generateTourCode)(countTour + 1);
        if (req.body.position === "") {
            req.body.position = countTour + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        const dataTour = {
            title: req.body.title,
            code: code,
            price: parseInt(req.body.price),
            discount: parseInt(req.body.discount),
            stock: parseInt(req.body.stock),
            timeStart: req.body.timeStart,
            position: req.body.position,
            status: req.body.status,
            images: JSON.stringify(req.body.images),
            information: req.body.information,
            schedule: req.body.schedule,
        };
        const tour = yield tour_model_1.default.create(dataTour);
        const tourId = tour["id"];
        const dataTourCategory = {
            tour_id: tourId,
            category_id: parseInt(req.body.category_id)
        };
        yield tour_category_model_1.default.create(dataTourCategory);
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
    }
});
exports.createPost = createPost;
// [GET]/admin/tours/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const tour = yield tour_model_1.default.findOne({
        where: {
            id: id,
            deleted: false,
            status: 'active',
        },
        raw: true
    });
    const tourCategory = yield tour_category_model_1.default.findOne({
        where: {
            tour_id: tour["id"]
        },
        raw: true
    });
    const categories = yield category_model_1.default.findAll({
        where: {
            deleted: false,
            status: 'active',
        },
        raw: true
    });
    res.render("admin/pages/tours/edit", {
        pageTitle: "Chỉnh sửa tour",
        tour: tour,
        categories: categories,
        tourCategory: tourCategory
    });
});
exports.edit = edit;
// [PATCH]/admin/tours/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tour");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const updateData = {
                title: req.body.title,
                price: parseInt(req.body.price),
                discount: parseInt(req.body.discount),
                stock: parseInt(req.body.stock),
                timeStart: req.body.timeStart,
                position: parseInt(req.body.position),
                status: req.body.status,
                information: req.body.information,
                schedule: req.body.schedule,
            };
            if (req.body.images) {
                updateData.images = JSON.stringify(req.body.images);
            }
            // Cập nhật Tour
            const [updated] = yield tour_model_1.default.update(updateData, {
                where: {
                    id: id,
                    deleted: false
                },
            });
            if (req.body.category_id) {
                yield tour_category_model_1.default.update({ category_id: parseInt(req.body.category_id) }, { where: { tour_id: id } });
            }
            if (updated) {
                res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
            }
            else {
                req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
                res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
            }
        }
        catch (error) {
            req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
        }
    }
});
exports.editPatch = editPatch;
// [PATCH]/admin/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tour");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const status = req.params.status;
            yield tour_model_1.default.update({
                status: status
            }, {
                where: {
                    id: id,
                }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
        }
        catch (error) {
            req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
        }
    }
});
exports.changeStatus = changeStatus;
// [DELETE]/admin/delete/:id
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_delete")) {
        res.status(403).send("Bạn không có quyền xóa tour");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield tour_category_model_1.default.destroy({ where: { tour_id: id } });
            yield tour_model_1.default.destroy({
                where: { id: id }
            });
            req.flash("success", "Xóa tour thành công!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
        }
        catch (error) {
            req.flash("error", "Xóa tour thất bại!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/tours`);
        }
    }
});
exports.deleteTour = deleteTour;
// [GET]/admin/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("tour_view")) {
        res.status(403).send("Bạn không có quyền xem tour");
        return;
    }
    else {
        const id = req.params.id;
        const tour = yield tour_model_1.default.findOne({
            where: {
                id: id,
                deleted: false,
            },
            raw: true
        });
        if (tour["images"]) {
            const images = JSON.parse(tour["images"]);
            tour["image"] = images[0];
        }
        const tourCategory = yield tour_category_model_1.default.findOne({
            where: {
                tour_id: tour["id"]
            },
        });
        const category = yield category_model_1.default.findOne({
            where: {
                id: tourCategory["category_id"]
            },
            raw: true
        });
        res.render("admin/pages/tours/detail", {
            pageTitle: "Danh sách tour",
            tour: tour,
            category: category
        });
    }
});
exports.detail = detail;

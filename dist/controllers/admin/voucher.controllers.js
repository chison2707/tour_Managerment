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
exports.deleteVoucher = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const voucher_model_1 = __importDefault(require("../../models/voucher.model"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const search_1 = __importDefault(require("../../helpers/search"));
const sequelize_1 = require("sequelize");
// [GET]/admin/vouchers
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("voucher_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý voucher");
        return;
    }
    else {
        let find = { deleted: false };
        // search
        const objSearch = (0, search_1.default)(req.query);
        if (objSearch.keyword) {
            find["code"] = {
                [sequelize_1.Op.like]: `%${objSearch.keyword}%`
            };
        }
        // pagination
        const countVouchers = yield voucher_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countVouchers);
        // end pagination
        const vouchers = yield voucher_model_1.default.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        res.render("admin/pages/vouchers/index", {
            pageTitle: "Danh sách voucher",
            vouchers: vouchers,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
});
exports.index = index;
// [GET]/admin/vouchers/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/vouchers/create", {
        pageTitle: "Tạo mới voucher",
    });
});
exports.create = create;
// [POST]/admin/vouchers/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("voucher_create")) {
        res.status(403).send("Bạn không có quyền thêm mới voucher");
        return;
    }
    else {
        try {
            if (new Date(req.body.expiredAt).getTime() < Date.now()) {
                req.flash('error', 'Ngày hết hạn phải lớn hơn ngày hiện tại');
                return res.redirect('back');
            }
            else {
                yield voucher_model_1.default.create({
                    code: req.body.code,
                    quantity: parseInt(req.body.quantity),
                    discount: parseInt(req.body.discount),
                    expiredAt: new Date(req.body.expiredAt),
                });
                req.flash('success', 'Tạo voucher thành công');
                res.redirect('/admin/vouchers');
            }
        }
        catch (error) {
            req.flash('success', 'Có lỗi');
            res.redirect('back');
        }
    }
});
exports.createPost = createPost;
// [GET]/admin/vouchers/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const voucher = yield voucher_model_1.default.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    res.render("admin/pages/vouchers/edit", {
        pageTitle: "Sửa voucher",
        voucher: voucher
    });
});
exports.edit = edit;
// [PATCH]/admin/vouchers/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("voucher_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa voucher");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const voucherOld = yield voucher_model_1.default.findOne({
                where: {
                    id: id
                },
                raw: true
            });
            const timeOld = new Date(voucherOld["expiredAt"]);
            const timeNew = new Date(req.body.expiredAt);
            if (timeNew >= timeOld) {
                yield voucher_model_1.default.update({
                    code: req.body.code,
                    quantity: req.body.quantity,
                    discount: req.body.discount,
                    expiredAt: timeNew
                }, {
                    where: {
                        id: id
                    }
                });
            }
            else {
                req.flash('error', 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hết hạn cũ');
                return res.redirect('back');
            }
            req.flash('success', 'Cập nhật voucher thành công!');
            res.redirect('/admin/vouchers');
        }
        catch (error) {
            req.flash('error', 'có lỗi');
            res.redirect('/admin/vouchers');
        }
    }
});
exports.editPatch = editPatch;
// [DELETE]/admin/vouchers/delete/:id
const deleteVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("voucher_delete")) {
        res.status(403).send("Bạn không có quyền xóa voucher");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield voucher_model_1.default.destroy({
                where: {
                    id: id
                }
            });
            req.flash('success', 'Cập nhật voucher thành công!');
            res.redirect('/admin/vouchers');
        }
        catch (error) {
            req.flash('error', 'có lỗi');
            res.redirect('/admin/vouchers');
        }
    }
});
exports.deleteVoucher = deleteVoucher;

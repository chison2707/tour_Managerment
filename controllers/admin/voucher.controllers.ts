import { Request, Response } from "express";
import Voucher from "../../models/voucher.model";
import paginationHelper from "../../helpers/pagination";
import searchHelper from "../../helpers/search";
import { Op } from "sequelize";

// [GET]/admin/vouchers
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("voucher_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý voucher");
        return;
    } else {
        let find = { deleted: false };

        // search
        const objSearch = searchHelper(req.query);
        if (objSearch.keyword) {
            find["code"] = {
                [Op.like]: `%${objSearch.keyword}%`
            };
        }

        // pagination
        const countVouchers = await Voucher.count({ where: find });
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countVouchers
        );
        // end pagination
        const vouchers = await Voucher.findAll({
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
};

// [GET]/admin/vouchers/create
export const create = async (req: Request, res: Response) => {

    res.render("admin/pages/vouchers/create", {
        pageTitle: "Tạo mới voucher",
    });
};

// [POST]/admin/vouchers/create
export const createPost = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("voucher_create")) {
        res.status(403).send("Bạn không có quyền thêm mới voucher");
        return;
    } else {
        try {
            if (new Date(req.body.expiredAt).getTime() < Date.now()) {
                req.flash('error', 'Ngày hết hạn phải lớn hơn ngày hiện tại');
                return res.redirect('back');
            } else {
                await Voucher.create({
                    code: req.body.code,
                    quantity: parseInt(req.body.quantity),
                    discount: parseInt(req.body.discount),
                    expiredAt: new Date(req.body.expiredAt),
                });
                req.flash('success', 'Tạo voucher thành công');
                res.redirect('/admin/vouchers');
            }
        } catch (error) {
            req.flash('success', 'Có lỗi');
            res.redirect('back');
        }
    }
};

// [GET]/admin/vouchers/edit/:id
export const edit = async (req: Request, res: Response) => {
    const voucher = await Voucher.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    res.render("admin/pages/vouchers/edit", {
        pageTitle: "Sửa voucher",
        voucher: voucher
    });
};
// [PATCH]/admin/vouchers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("voucher_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa voucher");
        return;
    } else {
        try {
            const id = req.params.id;
            const voucherOld = await Voucher.findOne({
                where: {
                    id: id
                },
                raw: true
            });
            const timeOld = new Date(voucherOld["expiredAt"]);
            const timeNew = new Date(req.body.expiredAt);
            if (timeNew >= timeOld) {
                await Voucher.update({
                    code: req.body.code,
                    quantity: req.body.quantity,
                    discount: req.body.discount,
                    expiredAt: timeNew
                }, {
                    where: {
                        id: id
                    }
                });
            } else {
                req.flash('error', 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hết hạn cũ');
                return res.redirect('back');
            }

            req.flash('success', 'Cập nhật voucher thành công!');
            res.redirect('/admin/vouchers');
        } catch (error) {
            req.flash('error', 'có lỗi');
            res.redirect('/admin/vouchers');
        }
    }
};

// [DELETE]/admin/vouchers/delete/:id
export const deleteVoucher = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("voucher_delete")) {
        res.status(403).send("Bạn không có quyền xóa voucher");
        return;
    } else {
        try {
            const id = req.params.id;
            await Voucher.destroy({
                where: {
                    id: id
                }
            });

            req.flash('success', 'Cập nhật voucher thành công!');
            res.redirect('/admin/vouchers');
        } catch (error) {
            req.flash('error', 'có lỗi');
            res.redirect('/admin/vouchers');
        }
    }
};
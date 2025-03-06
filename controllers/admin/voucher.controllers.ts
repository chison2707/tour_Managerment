import { Request, Response } from "express";
import Voucher from "../../models/voucher.model";

// [GET]/admin/vouchers
export const index = async (req: Request, res: Response) => {
    const vouchers = await Voucher.findAll({
        where: {
            deleted: false,
        },
        raw: true
    });
    res.render("admin/pages/vouchers/index", {
        pageTitle: "Danh sách voucher",
        vouchers: vouchers
    });
};

// [GET]/admin/vouchers/create
export const create = async (req: Request, res: Response) => {

    res.render("admin/pages/vouchers/create", {
        pageTitle: "Tạo mới voucher",
    });
};

// [POST]/admin/vouchers/create
export const createPost = async (req: Request, res: Response) => {
    if (new Date(req.body.expiredAt).getTime() < Date.now()) {
        req.flash('error', 'Ngày hết hạn phải lớn hơn ngày hiện tại');
        return res.redirect('back');
    } else {
        const voucher = await Voucher.create({
            code: req.body.code,
            quantity: req.body.quantity,
            discount: req.body.discount,
            expiredAt: new Date(req.body.expiredAt),
        });
        req.flash('success', 'Tạo voucher thành công');
        res.redirect('/admin/vouchers');
    }
};

// [GET]/admin/vouchers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await Voucher.update({
            status: status
        }, {
            where: {
                id: id
            }
        });
        req.flash('success', 'Cập nhật trạng thái voucher thành công!');
        res.redirect('/admin/vouchers');
    } catch (error) {
        req.flash('error', 'Cập nhật trạng thái voucher thất bại!');
        res.redirect('/admin/vouchers');
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
                expiredAt: timeNew,
                status: req.body.status
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
};
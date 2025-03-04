import { Request, response, Response } from "express";
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
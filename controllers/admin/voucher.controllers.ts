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
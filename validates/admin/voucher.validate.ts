import { NextFunction, Request, Response } from "express";

export const voucherValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.code) {
        req.flash('error', 'Vui lòng nhập mã voucher!');
        res.redirect("back");
        return;
    }
    if (parseInt(req.body.quantity) <= 0) {
        req.flash('error', 'Vui lòng nhập số lượng lớn hơn 0!');
        res.redirect("back");
        return;
    }
    if (parseInt(req.body.discount) <= 0) {
        req.flash('error', 'Vui lòng nhập % giảm giá lớn hơn 0!');
        res.redirect("back");
        return;
    }
    if (!req.body.expiredAt) {
        req.flash('error', 'Vui lòng nhập ngày tháng của hạn sử dụng!');
        res.redirect("back");
        return;
    }
    next();
}
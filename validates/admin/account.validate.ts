import { NextFunction, Request, Response } from "express";

export const accountValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại!');
        res.redirect("back");
        return;
    }
    if (!req.body.role_id) {
        req.flash('error', 'Vui lòng chọn phân quyền!');
        res.redirect("back");
        return;
    }
    if (!req.body.status) {
        req.flash('error', 'Vui lòng chọn trạng thái!');
        res.redirect("back");
        return;
    }
    next();
}
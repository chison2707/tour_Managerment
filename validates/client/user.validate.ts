import { NextFunction, Request, Response } from "express";

export const resetPasswordPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận lại mật khẩu!');
        res.redirect("back");
        return;
    }

    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không trùng khớp');
        res.redirect("back");
        return;
    }
    next();
}

export const registerPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullname) {
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

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhập lại mật khẩu!');
        res.redirect("back");
        return;
    }

    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Xác nhận mật khẩu không trùng khớp');
        res.redirect("back");
        return;
    }
    next();
}

export const editUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');
        res.redirect("back");
        return;
    }
    if (req.body.password) {
        if (req.body.password != req.body.confirmPassword) {
            req.flash('error', 'Xác nhận mật khẩu không trùng khớp');
            res.redirect("back");
            return;
        }
    }

    next();
}
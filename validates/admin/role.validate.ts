import { NextFunction, Request, Response } from "express";

export const roleValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề!');
        res.redirect("back");
        return;
    }
    if (!req.body.description) {
        req.flash('error', 'Vui lòng nhập mô tả!');
        res.redirect("back");
        return;
    }
    next();
}
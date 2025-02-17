import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề!');
        res.redirect("back");
        return;
    }
    if (!req.body.status) {
        req.flash('error', 'Vui lòng chọn active!');
        res.redirect("back");
        return;
    }
    next();
}
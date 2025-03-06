import { NextFunction, Request, Response } from "express";

export const tourValidate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề!');
        res.redirect("back");
        return;
    }
    if (!req.body.category_id) {
        req.flash('error', 'Vui lòng chọn danh mục!');
        res.redirect("back");
        return;
    }
    if (parseInt(req.body.price) <= 0) {
        req.flash('error', 'Vui lòng nhập giá lớn hơn 0!');
        res.redirect("back");
        return;
    }
    if (parseInt(req.body.discount) <= 0) {
        req.flash('error', 'Vui lòng nhập % giảm giá lớn hơn 0!');
        res.redirect("back");
        return;
    }
    if (parseInt(req.body.stock) <= 0) {
        req.flash('error', 'Vui lòng nhập số lượng lớn hơn 0!');
        res.redirect("back");
        return;
    }
    if (!req.body.timeStart) {
        req.flash('error', 'Vui lòng nhập ngày khởi hành!');
        res.redirect("back");
        return;
    }
    if (!req.body.schedule) {
        req.flash('error', 'Vui lòng nhập lịch trình tour!');
        res.redirect("back");
        return;
    }
    if (!req.body.status) {
        req.flash('error', 'Vui lòng chọn status!');
        res.redirect("back");
        return;
    }
    next();
}
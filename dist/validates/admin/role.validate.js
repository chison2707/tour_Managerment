"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleValidate = void 0;
const roleValidate = (req, res, next) => {
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
};
exports.roleValidate = roleValidate;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.registerPost = exports.resetPasswordPost = void 0;
const resetPasswordPost = (req, res, next) => {
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
};
exports.resetPasswordPost = resetPasswordPost;
const registerPost = (req, res, next) => {
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
};
exports.registerPost = registerPost;
const editUser = (req, res, next) => {
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
};
exports.editUser = editUser;

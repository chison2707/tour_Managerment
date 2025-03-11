import { Request, Response } from "express";
import md5 from 'md5';
import User from "../../models/user.model";
import * as generate from "../../helpers/generate";
import { sendMail } from "../../helpers/sendmail";
import ForgotPassword from "../../models/forgot-password.model";

// [GET]/users/
export const index = async (req: Request, res: Response) => {
    const user = await User.findOne({
        where: {
            tokenUser: req.cookies.tokenUser,
            deleted: false
        },
        attributes: { exclude: ["password"] }
    });
    res.render("client/pages/user/infor", {
        pageTitle: "Thông tin cá nhân",
        user: user
    });
}
// [GET]/users/login
export const login = async (req: Request, res: Response) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
}

// [GET]/users/register
export const register = async (req: Request, res: Response) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký"
    });
}

// [POST]/users/register
export const registerPost = async (req: Request, res: Response) => {
    // select * from user where deleted = false and email = req.body.email
    const existEmail = await User.findOne({
        where: {
            email: req.body.email,
            deleted: false
        },
        raw: true
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }
    // req.body.password = md5(req.body.password);
    const tokenUser = generate.generateRandomString(20);
    const newUser = {
        fullName: req.body.fullname,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: tokenUser
    };
    const user = await User.create(newUser);

    req.flash("success", "Đăng ký thành công");
    res.cookie("tokenUser", user.dataValues.tokenUser);
    res.redirect("/");
}

// [POST]/users/login
export const loginPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        where: {
            email: email,
            deleted: false
        }
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.dataValues.password) {
        req.flash("error", "Mật khẩu không đúng!");
        res.redirect("back");
        return;
    }

    if (user.dataValues.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("/");
        return;
    }

    res.cookie("tokenUser", user.dataValues.tokenUser);

    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
}

// [GET]/users/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("tokenUser");
    res.redirect(`/`);
}

// [GET]/users/password/forgot
export const forgotPass = async (req: Request, res: Response) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu"
    });
}

// [POST]/users/password/forgot
export const forgotPassPost = async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await User.findOne({
        where: {
            email: email,
            deleted: false
        },
        raw: true
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    // Tạo mã otp và lưu otp, email vào collection forgot password
    const otp = generate.generateRandomNumber(8);
    const objforgotPassword = {
        email: email,
        otp: otp,
    };

    await ForgotPassword.create(objforgotPassword);

    // gửi mã otp qua email của user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>.Mã OTP sẽ xóa khi bạn nhập và chuyển đến trang đổi mật khẩu. Lưu ý không được để lộ mã OTP
    `;

    sendMail(email, subject, html);
    res.redirect(`/users/password/otp?email=${email}`);
}

// [GET]/users/password/otp
export const otpPassword = async (req: Request, res: Response) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã otp",
        email: email
    });
}

// [POST]/users/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        where: {
            email: email,
            otp: otp
        }
    });

    if (!result) {
        req.flash("error", "Mã OTP không đúng!");
        res.redirect("back");
        return;
    };
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    await ForgotPassword.destroy({ where: { email: email } });

    res.cookie("tokenUser", user.dataValues.tokenUser);

    res.redirect(`/users/password/reset`);
}

// [GET]/users/password/reset
export const resetPassword = async (req: Request, res: Response) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
}

// [POST]/users/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.update({
        password: md5(password)
    }, {
        where: {
            tokenUser: tokenUser
        }
    });

    req.flash("success", "Đổi mật khẩu thành công!!!");
    res.redirect("/");
}
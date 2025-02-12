import { Request, Response } from "express";
import md5 from 'md5';
import User from "../../models/user.model";
import { generateRandomString } from "../../helpers/generate";

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
    req.body.password = md5(req.body.password);
    const tokenUser = generateRandomString(20);
    const newUser = {
        fullName: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
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
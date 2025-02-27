import { Request, Response } from "express";
import User from "../../models/user.model";

//[GET] / admin/users
export const index = async (req: Request, res: Response) => {
    const users = await User.findAll({
        where: { deleted: false },
        raw: true
    });
    res.render("admin/pages/users/index", {
        pageTitle: "Danh sách tài khoản user",
        users: users
    });
}

//[GET] / admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await User.findOne({
        where: {
            id: id,
            deleted: false
        },
        raw: true
    });
    res.render("admin/pages/users/detail", {
        pageTitle: "Chi tiết tài khoản user",
        data: data
    });
}
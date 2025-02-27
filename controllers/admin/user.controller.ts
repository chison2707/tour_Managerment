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
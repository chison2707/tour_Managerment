import { Request, Response } from "express";
import User from "../../models/user.model";
import { systemConfig } from "../../config/system";

//[GET] / admin/users
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("user_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý tài khoản user");
        return;
    } else {
        const users = await User.findAll({
            where: { deleted: false },
            raw: true
        });
        res.render("admin/pages/users/index", {
            pageTitle: "Danh sách tài khoản user",
            users: users
        });
    }
}

//[GET] / admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("user_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý tài khoản user");
        return;
    } else {
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
}

//[PATCH] / admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("user_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản user");
        return;
    } else {
        try {
            const id = req.params.id;
            const status = req.params.status;
            await User.update({
                status: status
            }, {
                where: {
                    id: id
                }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/users`);
        } catch (error) {
            req.flash("error", "Cập nhật trạng thái thất bại");
            res.redirect(`/${systemConfig.prefixAdmin}/users`);
        }
    }
}

//[DELETE] / admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("user_delete")) {
        res.status(403).send("Bạn không có quyền xóa tài khoản user");
        return;
    } else {
        try {
            const id = req.params.id;
            await User.destroy({
                where: {
                    id: id
                }
            });
            req.flash("success", "Xóa tài khoản thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/users`);
        } catch (error) {
            req.flash("error", "Xóa tài khoản thất bại");
            res.redirect(`/${systemConfig.prefixAdmin}/users`);
        }
    }
}
import { Request, Response } from "express";
import User from "../../models/user.model";
import { systemConfig } from "../../config/system";
import paginationHelper from "../../helpers/pagination";
import searchHelper from "../../helpers/search";
import { Op } from "sequelize";

//[GET] / admin/users
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("user_view")) {
        res.status(403).send("Bạn không có quyền xem quản lý tài khoản user");
        return;
    } else {
        let find = { deleted: false };

        // search
        const objSearch = searchHelper(req.query);
        if (objSearch.keyword) {
            find["fullName"] = {
                [Op.like]: `%${objSearch.keyword}%`
            };
        }
        // pagination
        const countUsers = await User.count({ where: find });
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countUsers
        );
        // end pagination
        const users = await User.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });
        res.render("admin/pages/users/index", {
            pageTitle: "Danh sách tài khoản user",
            users: users,
            keyword: objSearch.keyword,
            pagination: objPagination
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
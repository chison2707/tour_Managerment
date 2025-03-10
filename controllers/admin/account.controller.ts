import { Request, Response } from "express";
// import { systemConfig } from "../../config/config";
import md5 from "md5";
import adminAccount from "../../models/adminAccount.model";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import { generateRandomString } from "../../helpers/generate";
import { Op } from "sequelize";
import paginationHelper from "../../helpers/pagination";

//[GET] / admin/accounts
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_view")) {
        res.status(403).send("Bạn không có quyền xem tài khoản admin");
        return;
    } else {
        // pagination
        const countAccounts = await adminAccount.count();
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countAccounts
        );
        // end pagination

        // const accounts = await adminAccount.findAll();
        const accounts = await adminAccount.findAll({
            limit: objPagination.limitItems,
            offset: objPagination.skip
        });
        for (const record of accounts) {
            const role = await Role.findOne({
                where: {
                    id: record["role_id"]
                },
                raw: true
            });
            record["role"] = role;
        }

        res.render("admin/pages/accounts/index", {
            pageTitle: "Danh sách tài khoản admin",
            accounts: accounts,
            pagination: objPagination
        });
    }
}

//[GET] / admin/accounts/create
export const create = async (req: Request, res: Response) => {
    const roles = await Role.findAll({
        where: {
            deleted: false
        },
        raw: true
    });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

//[PATCH] / admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_create")) {
        res.status(403).send("Bạn không có quyền tạo mới tài khoản admin");
        return;
    } else {
        const emailExists = await adminAccount.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        });

        if (emailExists) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect("back");
        } else {
            req.body.password = md5(req.body.password);
            const token = generateRandomString(20);
            await adminAccount.create({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                role_id: req.body.role_id,
                status: req.body.status,
                token: token
            });
            req.flash("success", "Tạo tài khoản mới thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
        }
    }
}

//[GET] / admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await adminAccount.findOne({
        where: {
            id: id
        },
        raw: true
    });
    const roles = await Role.findAll({
        where: {
            deleted: false
        },
        raw: true
    });

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles
    });
}

//[PATCH] / admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản admin");
        return;
    } else {
        try {
            const id = req.params.id;
            const emailExists = await adminAccount.findOne({
                where: {
                    id: { [Op.ne]: id },
                    email: req.body.email,
                }
            });

            if (emailExists) {
                req.flash("error", `Email ${req.body.email} đã tồn tại`);
                return res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
            } else {
                if (req.body.password) {
                    req.body.password = md5(req.body.password);
                } else {
                    delete req.body.password;
                }

                await adminAccount.update({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                    role_id: req.body.role_id,
                    status: req.body.status,
                }, {
                    where: {
                        id: id
                    }
                });

                req.flash("success", "Cập nhật tài khoản thành công");
                res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
            }
        } catch (error) {
            req.flash("error", "Cập nhật tài khoản thất bại");
            res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
        }
    }
}

//[GET] / admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_view")) {
        res.status(403).send("Bạn không có quyền xem chi tiết tài khoản admin");
        return;
    } else {
        const id = req.params.id;
        const data = await adminAccount.findOne({
            where: {
                id: id,
            },
            raw: true,
            attributes: {
                exclude: ['password', 'token']
            }
        });

        const role = await Role.findOne({
            where: {
                id: data["role_id"],
                deleted: false
            },
            raw: true
        });

        res.render("admin/pages/accounts/detail", {
            pageTitle: "Xem chi tiết tài khoản",
            data: data,
            role: role
        });
    }
}

//[DELETE] / admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_delete")) {
        res.status(403).send("Bạn không có quyền xóa tài khoản admin");
        return;
    } else {
        const id = req.params.id;
        await adminAccount.destroy({ where: { id: id } });

        req.flash("success", "Xóa tài khoản thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}

//[PATCH] / admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("account_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa tài khoản admin");
        return;
    } else {
        const status = req.params.status;
        const id = req.params.id;
        await adminAccount.update({
            status: status
        }, {
            where: {
                id: id
            }
        });

        req.flash("success", "Cập nhật tài khoản thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}
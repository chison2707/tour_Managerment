import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import paginationHelper from "../../helpers/pagination";
import searchHelper from "../../helpers/search";
import { Op } from "sequelize";

//[GET] / admin/roles
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_view")) {
        res.status(403).send("Bạn không có quyền xem nhóm quyền");
        return;
    } else {
        let find = { deleted: false };

        // search
        const objSearch = searchHelper(req.query);
        if (objSearch.keyword) {
            find["title"] = {
                [Op.like]: `%${objSearch.keyword}%`
            };
        }

        // pagination
        const countRoles = await Role.count({ where: find });
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countRoles
        );
        // end pagination
        const records = await Role.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        })

        res.render("admin/pages/roles/index", {
            pageTitle: "Danh sách nhóm quyền",
            records: records,
            keyword: objSearch.keyword,
            pagination: objPagination
        });
    }
}

//[GET] / admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Danh sách nhóm quyền"
    });
}

//[ POST] / admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_create")) {
        res.status(403).send("Bạn không có quyền tạo nhóm quyền");
        return;
    } else {
        try {
            await Role.create({
                title: req.body.title,
                description: req.body.description,
            });
            req.flash('success', 'Thêm nhóm quyền mới thành công');
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        } catch (error) {
            req.flash('error', 'Thêm nhóm quyền mới thất bại');
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
    }
}

//[GET] / admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_view")) {
        res.status(403).send("Bạn không có quyền xem nhóm quyền");
        return;
    } else {
        const id = req.params.id;
        const record = await Role.findOne({
            where: { id: id, deleted: false },
            raw: true
        });
        record["permissions"] = JSON.parse(record["permissions"]);
        res.render("admin/pages/roles/detail", {
            pageTitle: `Chi tiết ${record["title"]}`,
            record: record,
        });
    }
}

//[GET] / admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const record = await Role.findOne({
        where: { id: id, deleted: false },
        raw: true
    });
    res.render("admin/pages/roles/edit", {
        pageTitle: "Chỉnh sửa nhóm quyền",
        record: record
    });
}

//[PATCH] / admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa nhóm quyền");
        return;
    } else {
        try {
            const id = req.params.id;
            await Role.update({
                title: req.body.title,
                description: req.body.description,
            }, {
                where: { id: id }
            })
            req.flash('success', 'Cập nhật nhóm quyền thành công');
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        } catch (error) {
            req.flash('error', 'Lỗi');
            res.redirect(`back`);
        }

    }

}

//[ DELETE] / admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_delete")) {
        res.status(403).send("Bạn không có quyền xóa nhóm quyền");
        return;
    } else {
        try {
            const id = req.params.id;
            await Role.destroy({ where: { id: id } });
            req.flash('success', 'Xóa nhóm quyền thành công');
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        } catch (error) {
            req.flash('success', 'lỗi');
            res.redirect(`back`);
        }
    }
}

//[GET] / admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    const records = await Role.findAll({
        where: { deleted: false },
        raw: true
    });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records,
    });
}

//[Patch] / admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("role_permissions")) {
        res.status(403).send("Bạn không có quyền cập nhật phân quyền");
        return;
    } else {
        try {
            const permissions = JSON.parse(req.body.permissions);

            for (const item of permissions) {
                await Role.update({
                    permissions: item.permissions
                }, {
                    where: { id: item.id }
                })
            }

            req.flash('success', `Cập nhật phân quyền thành công!`);
        } catch (error) {
            req.flash('error', `Cập nhật phân quyền thất bại!`);
        }
        res.redirect("back");
    }
}
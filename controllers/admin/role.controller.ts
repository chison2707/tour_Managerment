import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";

//[GET] / admin/roles
export const index = async (req: Request, res: Response) => {

    const records = await Role.findAll({
        where: { deleted: false },
        raw: true
    })

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền",
        records: records,
    });
}

//[GET] / admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Danh sách nhóm quyền"
    });
}

//[ POST] / admin/roles/create
export const createPost = async (req: Request, res: Response) => {
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
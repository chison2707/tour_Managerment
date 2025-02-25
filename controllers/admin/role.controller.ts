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

//[GET] / admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const record = await Role.findOne({
        where: { id: id, deleted: false },
        raw: true
    });
    res.render("admin/pages/roles/detail", {
        // const record = await Role.findOne({ _id: req.params.id });
        pageTitle: `Chi tiết ${record["title"]}`,
        record: record,
    });
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
    const id = req.params.id;
    await Role.update({
        title: req.body.title,
        description: req.body.description,
    }, {
        where: { id: id }
    })
    req.flash('success', 'Cập nhật nhóm quyền thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

//[ DELETE] / admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    const id = req.params.id;
    await Role.destroy({ where: { id: id } });
    req.flash('success', 'Xóa nhóm quyền thành công');
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
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
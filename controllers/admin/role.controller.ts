import { Request, Response } from "express";
import Role from "../../models/role.model";

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
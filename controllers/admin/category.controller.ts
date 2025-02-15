import { Request, Response } from "express-serve-static-core";
import Category from "../../models/category.model";

// [GET] /admin/categories
export const index = async (req: Request, res: Response) => {

    const categories = await Category.findAll({
        where: {
            deleted: false,
        },
        raw: true
    });

    res.render("admin/pages/category/index", {
        pageTitle: "Danh mục tour",
        categories: categories
    });
};

// [GET] /admin/categories
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/category/create", {
        pageTitle: "Thêm danh mục tour"
    });
};
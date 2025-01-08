import { Request, Response } from "express-serve-static-core";
import Category from "../../models/category.model";

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
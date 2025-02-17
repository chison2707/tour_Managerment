import { Request, Response } from "express-serve-static-core";
import Category from "../../models/category.model";
import { systemConfig } from "../../config/system";

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

// [POST] /admin/categories
export const createPost = async (req: Request, res: Response) => {
    try {
        const dataCategory = {
            title: req.body.title,
            image: req.body.avatar,
            description: req.body.description,
            status: req.body.status,
        };
        await Category.create(dataCategory);
        req.flash("success", "Thêm danh mục thành công");

        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        req.flash("error", "Thêm danh mục thất bại");
        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    }
};
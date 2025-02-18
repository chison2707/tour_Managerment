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

// [GET] /admin/categories/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await Category.findOne({
        where: {
            id: id,
            deleted: false,
        },
        raw: true
    });

    res.render("admin/pages/category/edit", {
        pageTitle: "Chỉnh sửa danh mục tour",
        category: category
    });
};

// [PATCH] /admin/categories/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await Category.update({
            title: req.body.title,
            image: req.body.avatar,
            description: req.body.description,
            status: req.body.status,
        }, {
            where: {
                id: id,
                deleted: false,
            }
        })

        req.flash("success", "Cập nhật danh mục tour thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        req.flash("error", "Cập nhật danh mục tour thất bại!");
        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    }
};

// [PATCH] /admin/categories/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await Category.update({
            status: status
        }, {
            where: {
                id: id,
                deleted: false,
            }
        })

        req.flash("success", "Cập nhật trạng thái danh mục tour thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    } catch (error) {
        req.flash("error", "Cập nhật trạng thái danh mục tour thất bại!");
        res.redirect(`/${systemConfig.prefixAdmin}/categories`);
    }
};
import { Request, Response } from "express-serve-static-core";
import Category from "../../models/category.model";
import { systemConfig } from "../../config/system";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/categories
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
        return;
    } else {
        let find = { deleted: false };
        // pagination
        const countProducts = await Category.count({ where: find });
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countProducts
        );
        // end pagination
        const categories = await Category.findAll({
            where: find,
            limit: objPagination.limitItems,
            offset: objPagination.skip,
            raw: true
        });

        res.render("admin/pages/category/index", {
            pageTitle: "Danh mục tour",
            categories: categories,
            pagination: objPagination
        });
    }
};

// [GET] /admin/categories
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/category/create", {
        pageTitle: "Thêm danh mục tour"
    });
};

// [POST] /admin/categories
export const createPost = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_create")) {
        res.status(403).send("Bạn không có quyền thêm mới danh mục");
        return;
    } else {
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
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa danh mục");
        return;
    } else {
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
    }
};

// [PATCH] /admin/categories/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa danh mục");
        return;
    } else {
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
    }
};

// [DELETE] /admin/categories/delete/:id
export const deleteCategory = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_delete")) {
        res.status(403).send("Bạn không có quyền xóa danh mục");
        return;
    } else {
        try {
            const id = req.params.id;
            await Category.destroy({
                where: { id: id }
            })

            req.flash("success", "Xóa danh mục tour thành công!");
            res.redirect(`/${systemConfig.prefixAdmin}/categories`);
        } catch (error) {
            req.flash("error", "Xóa danh mục tour thất bại!");
            res.redirect(`/${systemConfig.prefixAdmin}/categories`);
        }
    }
};

// [GET] /admin/categories/detail/:id
export const detail = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("category_view")) {
        res.status(403).send("Bạn không có quyền xem danh mục");
        return;
    } else {
        const id = req.params.id;
        const category = await Category.findOne({
            where: {
                id: id,
                deleted: false,
            },
            raw: true
        });
        res.render("admin/pages/category/detail", {
            pageTitle: "Chi tiết tour",
            category: category
        });
    }
};
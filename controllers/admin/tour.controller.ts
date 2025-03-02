import { Request, Response } from "express-serve-static-core";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import { generateTourCode } from "../../helpers/generate";
import { systemConfig } from "../../config/system";
import TourCategory from "../../models/tour-category.model";

// [GET]/admin/tours
export const index = async (req: Request, res: Response) => {
    const tours = await Tour.findAll({
        where: {
            deleted: false,
        },
        raw: true
    });

    tours.forEach(item => {
        if (item["images"]) {
            const images = JSON.parse(item["images"]);
            item["image"] = images[0];
        }
        item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
    });

    res.render("admin/pages/tours/index", {
        pageTitle: "Danh sách tour",
        tours: tours
    });
};

// [GET]/admin/tours/create
export const create = async (req: Request, res: Response) => {
    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: 'active',
        },
        raw: true
    });

    res.render("admin/pages/tours/create", {
        pageTitle: "Thêm mới tour",
        categories: categories
    });
};

// [POST]/admin/tours/create
export const createPost = async (req: Request, res: Response) => {
    const countTour = await Tour.count();
    const code = generateTourCode(countTour + 1);

    if (req.body.position === "") {
        req.body.position = countTour + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const dataTour = {
        title: req.body.title,
        code: code,
        price: parseInt(req.body.price),
        discount: parseInt(req.body.discount),
        stock: parseInt(req.body.stock),
        timeStart: req.body.timeStart,
        position: req.body.position,
        status: req.body.status,
        images: JSON.stringify(req.body.images),
        information: req.body.information,
        schedule: req.body.schedule,
    };
    const tour = await Tour.create(dataTour);
    const tourId = tour["id"];

    const dataTourCategory = {
        tour_id: tourId,
        category_id: parseInt(req.body.category_id)
    }

    await TourCategory.create(dataTourCategory);

    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
};

// [GET]/admin/tours/edit/:id
export const edit = async (req: Request, res: Response) => {
    const id = req.params.id;
    const tour = await Tour.findOne({
        where: {
            id: id,
            deleted: false,
            status: 'active',
        },
        raw: true
    });

    const tourCategory = await TourCategory.findOne({
        where: {
            tour_id: tour["id"]
        },
        raw: true
    });
    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: 'active',
        },
        raw: true
    });

    res.render("admin/pages/tours/edit", {
        pageTitle: "Chỉnh sửa tour",
        tour: tour,
        categories: categories,
        tourCategory: tourCategory
    });
};

// [PATCH]/admin/tours/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updateData: any = {
            title: req.body.title,
            price: parseInt(req.body.price),
            discount: parseInt(req.body.discount),
            stock: parseInt(req.body.stock),
            timeStart: req.body.timeStart,
            position: parseInt(req.body.position),
            status: req.body.status,
            information: req.body.information,
            schedule: req.body.schedule,
        };

        if (req.body.images) {
            updateData.images = JSON.stringify(req.body.images);
        }

        // Cập nhật Tour
        const [updated] = await Tour.update(updateData, {
            where: {
                id: id,
                deleted: false
            },
        });

        if (req.body.category_id) {
            await TourCategory.update(
                { category_id: parseInt(req.body.category_id) },
                { where: { tour_id: id } }
            );
        }

        if (updated) {
            res.redirect(`/${systemConfig.prefixAdmin}/tours`);
        } else {
            req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
            res.redirect(`/${systemConfig.prefixAdmin}/tours`);
        }
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
        res.redirect(`/${systemConfig.prefixAdmin}/tours`);
    }
};

// [PATCH]/admin/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await Tour.update(
            {
                status: status
            },
            {
                where: {
                    id: id,
                }
            });
        req.flash("success", "Cập nhật trạng thái thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/tours`);
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
        res.redirect(`/${systemConfig.prefixAdmin}/tours`);
    }
};

// [DELETE]/admin/delete/:id
export const deleteTour = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await TourCategory.destroy({ where: { tour_id: id } });
        await Tour.destroy({
            where: { id: id }
        });

        req.flash("success", "Xóa tour thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/tours`);
    } catch (error) {
        req.flash("error", "Xóa tour thất bại!");
        res.redirect(`/${systemConfig.prefixAdmin}/tours`);
    }
};

// [GET]/admin/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;

    const tour = await Tour.findOne({
        where: {
            id: id,
            deleted: false,
        },
        raw: true
    });
    if (tour["images"]) {
        const images = JSON.parse(tour["images"]);
        tour["image"] = images[0];
    }
    const tourCategory = await TourCategory.findOne({
        where: {
            tour_id: tour["id"]
        },
    });
    const category = await Category.findOne({
        where: {
            id: tourCategory["category_id"]
        },
        raw: true
    })
    res.render("admin/pages/tours/detail", {
        pageTitle: "Danh sách tour",
        tour: tour,
        category: category
    });
};
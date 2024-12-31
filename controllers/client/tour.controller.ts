import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET]/tours/:slugCategory
export const index = async (req: Request, res: Response) => {
    const slugCategory = req.params.slugCategory
    const tours = await sequelize.query(`
        SELECT tours.*, ROUND(price * (1 - discount/100),0) AS price_special
        FROM tours
        JOIN tours_categories ON tours.id = tours_categories.tour_id
        JOIN categories ON tours_categories.category_id = categories.id
        WHERE
            categories.slug = '${slugCategory}'
            AND categories.deleted = false
            AND categories.status = 'active'
            AND tours.deleted = false
            AND tours.status = 'active';
    `, {
        type: QueryTypes.SELECT
    });

    tours.forEach(item => {
        if (item["images"]) {
            const images = JSON.parse(item["images"]);
            item["image"] = images[0];
        }

        item["price_special"] = parseFloat(item["price_special"]);
    });


    res.render("client/pages/tours/index", {
        pageTitle: "Danh sách tours",
        tours: tours
    });
}

// [GET]/tours/detail/:slugTour
export const detail = async (req: Request, res: Response) => {
    const slugTour = req.params.slugTour;
    res.render("client/pages/tours/detail", {
        pageTitle: "Chi tiết tour"
    });
}
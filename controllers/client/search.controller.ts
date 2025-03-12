import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import sequelize from "../../config/database";
import { Op, QueryTypes } from "sequelize";

// [GET]/search/result?keyword=
export const index = async (req: Request, res: Response) => {
    let keyword = req.query.keyword ? req.query.keyword.toString().trim() : "";

    const tours = await sequelize.query(`
        SELECT tours.*, ROUND(price * (1 - discount/100),0) AS price_special
        FROM tours
        JOIN tours_categories ON tours.id = tours_categories.tour_id
        JOIN categories ON tours_categories.category_id = categories.id
        WHERE
            tours.title LIKE ?
            AND categories.deleted = false
            AND categories.status = 'active'
            AND tours.deleted = false
            AND tours.status = 'active';
    `, {
        replacements: [`%${keyword}%`],
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
        tours: tours,
        keyword: keyword
    });
}
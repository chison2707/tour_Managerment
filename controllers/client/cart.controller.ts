import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [GET]/cart
export const index = (req: Request, res: Response) => {
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng"
    });
}

// [POST]/cart/list-json
export const listJson = async (req: Request, res: Response) => {
    const tours = req.body;

    for (const tour of tours) {
        const inforTour = await Tour.findOne({
            where: {
                id: tour.tourId,
                deleted: false,
                status: 'active'
            },
            raw: true
        });
        tour["infor"] = inforTour;
        tour["image"] = JSON.parse(inforTour["images"])[0];
        tour["price_special"] = inforTour["price"] * (1 - inforTour["discount"] / 100);
        tour["total"] = tour["price_special"] * tour["quantity"];
    }

    res.json({
        tours: tours
    });
};
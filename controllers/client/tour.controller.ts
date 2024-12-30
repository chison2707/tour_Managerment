import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [GET]/tours
export const index = async (req: Request, res: Response) => {
    // select * from tour where deleted = false and status = 'active'
    const tours = await Tour.findAll({
        where: {
            deleted: false,
            status: 'active'
        },
        raw: true
    });

    res.render("client/pages/tours/index", {
        tours: tours
    });
}
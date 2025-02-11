import { Request, Response } from 'express';
import Category from '../../models/category.model';
// [GET]/
export const index = async (req: Request, res: Response) => {
    // select * from categories where deleted = false and status = 'active'
    const categories = await Category.findAll({
        where: {
            deleted: false,
            status: 'active'
        },
        limit: 3,
        raw: true
    });
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        categories: categories
    });
}
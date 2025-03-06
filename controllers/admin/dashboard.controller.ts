import { Request, Response } from "express";
import adminAccount from "../../models/adminAccount.model";
import Category from "../../models/category.model";
import Tour from "../../models/tour.model";
import User from "../../models/user.model";

//[GET] / admin/accounts
export const index = async (req: Request, res: Response) => {
    const statistic = {
        category: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        tour: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };
    statistic.category.total = await Category.count({ where: { deleted: false } });
    statistic.category.active = await Category.count({ where: { deleted: false, status: "active" } });
    statistic.category.inactive = await Category.count({ where: { deleted: false, status: "inactive" } });
    statistic.tour.total = await Tour.count({ where: { deleted: false } });
    statistic.tour.active = await Tour.count({ where: { deleted: false, status: "active" } });
    statistic.tour.inactive = await Tour.count({ where: { deleted: false, status: "inactive" } });
    statistic.account.total = await adminAccount.count();
    statistic.account.active = await adminAccount.count({ where: { status: "active" } });
    statistic.account.inactive = await adminAccount.count({ where: { status: "inactive" } });
    statistic.user.total = await User.count({ where: { deleted: false } });
    statistic.user.active = await User.count({ where: { deleted: false, status: "active" } });
    statistic.user.inactive = await User.count({ where: { deleted: false, status: "inactive" } });
    res.render("admin/pages/dashboards/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
}
import { Request, Response } from "express-serve-static-core";
import Order from "../../models/order.model";
import { systemConfig } from "../../config/system";
import OrderItem from "../../models/order-item.model";
import sequelize from "../../config/database";
import { QueryTypes, where } from "sequelize";
import Tour from "../../models/tour.model";

// [GET] /admin/orders
export const index = async (req: Request, res: Response) => {
    const orders = await sequelize.query(`
      SELECT 
        orders.id,
        orders.code AS order_code,
        orders.fullName AS customer_name,
        orders.phone AS customer_phone,
        orders.status,
    GROUP_CONCAT(
        CONCAT(tours.title, ' (', orders_item.quantity, ' x ', FORMAT(ROUND(tours.price * (1 - tours.discount/100),0), 0), '₫)') 
        SEPARATOR ', '
    ) AS tour_details,
    SUM(orders_item.quantity * ROUND(tours.price * (1 - tours.discount/100),0)) AS total_amount
    FROM orders
    JOIN orders_item ON orders.id = orders_item.orderId
    JOIN tours ON orders_item.tourId = tours.id
    WHERE orders.deleted = :deleted
    GROUP BY orders.id, orders.code, orders.fullName, orders.phone,orders.status;
    `, {
        type: QueryTypes.SELECT,
        replacements: { deleted: false }
    });

    res.render("admin/pages/order/index", {
        pageTitle: "Danh sách đơn hàng",
        orders: orders
    });
};

// [GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const order = await Order.findOne({
        where: {
            id: id,
            deleted: false
        },
        raw: true
    });

    const orderItem = await OrderItem.findAll({
        where: {
            orderId: order["id"]
        },
        raw: true
    });

    for (const item of orderItem) {
        item["price_special"] = item["price"] * (1 - item["discount"] / 100);
        item["total"] = item["price_special"] * item["quantity"];

        const tourInfo = await Tour.findOne({
            where: {
                id: item["tourId"]
            },
            raw: true
        });

        item["title"] = tourInfo["title"];
        item["slug"] = tourInfo["slug"];
        item["image"] = JSON.parse(tourInfo["images"])[0];
    }

    order["total_price"] = orderItem.reduce((sum, item) => sum + item["total"], 0);
    res.render("admin/pages/order/detail", {
        pageTitle: "Chi tiết đơn hàng",
        order: order,
        orderItem: orderItem
    });
};
// [GET] /admin/categories
export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await OrderItem.destroy({
            where: {
                orderId: id
            },
        });
        await Order.destroy({
            where: {
                id: id,
                deleted: false
            },
        });
        req.flash("success", "Xóa đơn hàng thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    } catch (error) {
        req.flash("error", "Xóa đơn hàng thất bại");
        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
};

// [GET] /admin/orders/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await Order.update(
            {
                status: status
            },
            {
                where: {
                    id: id,
                }
            });

        req.flash("success", "Cập nhật trạng thái đơn hàng thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    } catch (error) {
        req.flash("error", "Cập nhật trạng thái đơn hàng thất bại!");
        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
};
import { Request, Response } from "express-serve-static-core";
import Order from "../../models/order.model";
import { systemConfig } from "../../config/system";
import OrderItem from "../../models/order-item.model";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /admin/categories
export const index = async (req: Request, res: Response) => {
    const tours = await sequelize.query(`
      SELECT 
        orders.id AS order_id,
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
    GROUP BY orders.id, orders.code, orders.fullName, orders.phone;
    `, {
        type: QueryTypes.SELECT,
        replacements: { deleted: false }
    });

    res.render("admin/pages/order/index", {
        pageTitle: "Danh sách đơn hàng",
        tours: tours
    });
};
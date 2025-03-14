import { Request, Response } from "express-serve-static-core";
import Order from "../../models/order.model";
import { systemConfig } from "../../config/system";
import OrderItem from "../../models/order-item.model";
import sequelize from "../../config/database";
import { QueryTypes, where } from "sequelize";
import Tour from "../../models/tour.model";
import paginationHelper from "../../helpers/pagination";

// [GET] /admin/orders
export const index = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("order_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
        return;
    } else {
        let find = { deleted: false };
        // pagination
        const countOrders = await Order.count({ where: find });
        let objPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 5
            },
            req.query,
            countOrders
        );
        // end pagination
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
          GROUP BY orders.id, orders.code, orders.fullName, orders.phone,orders.status
          LIMIT :limitItems
          OFFSET :skip;
          `, {
            type: QueryTypes.SELECT,
            replacements: {
                deleted: false,
                limitItems: objPagination.limitItems,
                skip: objPagination.skip
            }
        });

        res.render("admin/pages/order/index", {
            pageTitle: "Danh sách đơn hàng",
            orders: orders,
            pagination: objPagination
        });
    }
};

// [GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("order_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
        return;
    } else {
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
    }
};
// [GET] /admin/categories
export const deleteOrder = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("order_delete")) {
        res.status(403).send("Bạn không có quyền xóa đơn hàng");
        return;
    } else {
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
    }
};

// [GET] /admin/orders/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const permissions = res.locals.role.permissions;

    if (!permissions.includes("order_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa đơn hàng");
        return;
    } else {
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
    }
};
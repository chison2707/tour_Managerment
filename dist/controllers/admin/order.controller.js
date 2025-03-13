"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = exports.deleteOrder = exports.detail = exports.index = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const system_1 = require("../../config/system");
const order_item_model_1 = __importDefault(require("../../models/order-item.model"));
const database_1 = __importDefault(require("../../config/database"));
const sequelize_1 = require("sequelize");
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
// [GET] /admin/orders
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("order_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
        return;
    }
    else {
        let find = { deleted: false };
        // pagination
        const countOrders = yield order_model_1.default.count({ where: find });
        let objPagination = (0, pagination_1.default)({
            currentPage: 1,
            limitItems: 5
        }, req.query, countOrders);
        // end pagination
        const orders = yield database_1.default.query(`
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
            type: sequelize_1.QueryTypes.SELECT,
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
});
exports.index = index;
// [GET] /admin/orders/detail/:id
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("order_view")) {
        res.status(403).send("Bạn không có quyền xem đơn hàng");
        return;
    }
    else {
        const id = req.params.id;
        const order = yield order_model_1.default.findOne({
            where: {
                id: id,
                deleted: false
            },
            raw: true
        });
        const orderItem = yield order_item_model_1.default.findAll({
            where: {
                orderId: order["id"]
            },
            raw: true
        });
        for (const item of orderItem) {
            item["price_special"] = item["price"] * (1 - item["discount"] / 100);
            item["total"] = item["price_special"] * item["quantity"];
            const tourInfo = yield tour_model_1.default.findOne({
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
});
exports.detail = detail;
// [GET] /admin/categories
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("order_delete")) {
        res.status(403).send("Bạn không có quyền xóa đơn hàng");
        return;
    }
    else {
        try {
            const id = req.params.id;
            yield order_item_model_1.default.destroy({
                where: {
                    orderId: id
                },
            });
            yield order_model_1.default.destroy({
                where: {
                    id: id,
                    deleted: false
                },
            });
            req.flash("success", "Xóa đơn hàng thành công");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/orders`);
        }
        catch (error) {
            req.flash("error", "Xóa đơn hàng thất bại");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/orders`);
        }
    }
});
exports.deleteOrder = deleteOrder;
// [GET] /admin/orders/change-status/:status/:id
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("order_edit")) {
        res.status(403).send("Bạn không có quyền chỉnh sửa đơn hàng");
        return;
    }
    else {
        try {
            const id = req.params.id;
            const status = req.params.status;
            yield order_model_1.default.update({
                status: status
            }, {
                where: {
                    id: id,
                }
            });
            req.flash("success", "Cập nhật trạng thái đơn hàng thành công!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/orders`);
        }
        catch (error) {
            req.flash("error", "Cập nhật trạng thái đơn hàng thất bại!");
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/orders`);
        }
    }
});
exports.changeStatus = changeStatus;

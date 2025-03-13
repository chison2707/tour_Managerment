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
exports.index = void 0;
const adminAccount_model_1 = __importDefault(require("../../models/adminAccount.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const tour_model_1 = __importDefault(require("../../models/tour.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
//[GET] / admin/accounts
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    statistic.category.total = yield category_model_1.default.count({ where: { deleted: false } });
    statistic.category.active = yield category_model_1.default.count({ where: { deleted: false, status: "active" } });
    statistic.category.inactive = yield category_model_1.default.count({ where: { deleted: false, status: "inactive" } });
    statistic.tour.total = yield tour_model_1.default.count({ where: { deleted: false } });
    statistic.tour.active = yield tour_model_1.default.count({ where: { deleted: false, status: "active" } });
    statistic.tour.inactive = yield tour_model_1.default.count({ where: { deleted: false, status: "inactive" } });
    statistic.account.total = yield adminAccount_model_1.default.count();
    statistic.account.active = yield adminAccount_model_1.default.count({ where: { status: "active" } });
    statistic.account.inactive = yield adminAccount_model_1.default.count({ where: { status: "inactive" } });
    statistic.user.total = yield user_model_1.default.count({ where: { deleted: false } });
    statistic.user.active = yield user_model_1.default.count({ where: { deleted: false, status: "active" } });
    statistic.user.inactive = yield user_model_1.default.count({ where: { deleted: false, status: "inactive" } });
    res.render("admin/pages/dashboards/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
});
exports.index = index;

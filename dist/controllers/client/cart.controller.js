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
exports.listJson = exports.index = void 0;
const tour_model_1 = __importDefault(require("../../models/tour.model"));
// [GET]/cart
const index = (req, res) => {
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng"
    });
};
exports.index = index;
// [POST]/cart/list-json
const listJson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tours = req.body;
    for (const tour of tours) {
        const inforTour = yield tour_model_1.default.findOne({
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
});
exports.listJson = listJson;

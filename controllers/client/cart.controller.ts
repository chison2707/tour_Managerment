import { Request, Response } from "express";

// [GET]/cart
export const index = (req: Request, res: Response) => {
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng"
    });
}
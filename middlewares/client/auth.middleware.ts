import { Request, Response, NextFunction } from "express"
import User from "../../models/user.model";
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/users/login`);
    } else {
        const user = await User.findOne({
            where: { tokenUser: req.cookies.tokenUser, deleted: false },
            attributes: { exclude: ["password"] }
        });
        if (!user) {
            res.redirect(`/users/login`);
        }
        next();
    }
}
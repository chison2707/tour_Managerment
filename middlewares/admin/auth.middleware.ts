import { NextFunction, Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import adminAccount from "../../models/adminAccount.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    } else {
        const user = await adminAccount.findOne({
            where: { token: req.cookies.token },
            raw: true,
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        else {
            const role = await Role.findOne({
                where: { id: user["role_id"] },
                attributes: ["title", "permissions"]
            });
            console.log(role["permissions"]);

            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
}
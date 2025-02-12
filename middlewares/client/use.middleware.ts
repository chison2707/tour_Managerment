import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';

export const infoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            where: {
                tokenUser: req.cookies.tokenUser,
                deleted: false
            },
            attributes: { exclude: ["password"] }
        });
        if (user) {
            res.locals.user = user;
        }
    }

    next();
}
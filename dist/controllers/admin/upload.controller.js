"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const index = (req, res) => {
    res.json({
        location: req.body.file
    });
};
exports.index = index;

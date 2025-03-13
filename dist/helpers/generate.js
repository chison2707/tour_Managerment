"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomString = exports.generateTourCode = exports.generateOrderCode = void 0;
// generate mã đơn hàng
const generateOrderCode = (number) => {
    const code = `OD${String(number).padStart(8, '0')}`;
    return code;
};
exports.generateOrderCode = generateOrderCode;
// generate mã tour
const generateTourCode = (number) => {
    const code = `TOUR${String(number).padStart(6, '0')}`;
    return code;
};
exports.generateTourCode = generateTourCode;
// generate mã tokenUser
const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
// generate mã otp
const generateRandomNumber = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateRandomNumber = generateRandomNumber;

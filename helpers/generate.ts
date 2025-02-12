// generate mã đơn hàng
export const generateOrderCode = (number: number): string => {
    const code = `OD${String(number).padStart(8, '0')}`;
    return code;
};

// generate mã tour
export const generateTourCode = (number: number): string => {
    const code = `TOUR${String(number).padStart(6, '0')}`;
    return code;
};

// generate mã tokenUser
export const generateRandomString = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";


    for (let i = 0; i < length; i++) {

        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

// generate mã otp
export const generateRandomNumber = (length: number): string => {
    const characters = "0123456789";
    let result = "";


    for (let i = 0; i < length; i++) {

        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (objPagination, query, countProducts) => {
    if (query.page) {
        objPagination.currentPage = parseInt(query.page);
    }
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItems;
    const totalPage = Math.ceil(countProducts / objPagination.limitItems);
    objPagination.totalPage = totalPage;
    return objPagination;
};
exports.default = paginationHelper;

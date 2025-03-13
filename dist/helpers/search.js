"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchHelper = (query) => {
    let objSearch = {
        keyword: ""
    };
    if (query.keyword) {
        objSearch.keyword = query.keyword;
    }
    return objSearch;
};
exports.default = searchHelper;

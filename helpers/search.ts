const searchHelper = (query) => {
    let objSearch = {
        keyword: ""
    }
    if (query.keyword) {
        objSearch.keyword = query.keyword;
    }
    return objSearch;
}
export default searchHelper;
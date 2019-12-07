module.exports = {
    eq: (v1, v2) => {
        return v1 == v2;
    },
    ne: (v1, v2) => {
        return v1 != v2;
    },
    lt: (v1, v2) => {
        return v1 < v2;
    },
    gt: (v1, v2) => {
        return v1 > v2;
    },
    lte: (v1, v2) => {
        return v1 <= v2;
    },
    gte: (v1, v2) => {
        return v1 >= v2;
    },
    and: (v1, v2) => {
        return v1 && v2;
    },
    or: (v1, v2) => {
        return v1 || v2;
    },
    resultsInfo: (offset, pageLimit, totalProducts, keyword) => {
        let html = "";
        let posFromOffset = offset + pageLimit;

        if (totalProducts > pageLimit) {
            if (posFromOffset > totalProducts) {
                posFromOffset = totalProducts;
            }
            html += "Showing " + (offset + 1) + "-" + posFromOffset + " of " + totalProducts;
        }
        else {
            html += "Showing " + totalProducts + " of " + totalProducts;
        }

        if (totalProducts > 1) {
            html += " results";
        }
        else {
            html += " result";
        }

        if (keyword) {
            html += " for <b>\"" + keyword + "\"</b>";
        }

        return html;
    },
    pagination: (pageCount, currentPage, searchCriteria) => {
        let html = "";
        let x = currentPage;

        if (!searchCriteria.keyword) {
            searchCriteria.keyword = "";
        }
        if (!searchCriteria.selectedCategoryVal) {
            searchCriteria.selectedCategoryVal = "";
        }
        if (!searchCriteria.priceFilter) {
            searchCriteria.priceFilter = "";
        }
        if (!searchCriteria.conditionFilter) {
            searchCriteria.conditionFilter = "";
        }
        if (!searchCriteria.sortF) {
            searchCriteria.sortF = "";
        }

        // Previous button
        if (x === 1) {
            html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + (x - 1) + "\">Previous</a></li>";
        }
        else {
            html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + (x - 1) + "\">Previous</a></li>";
        }

        // Page button
        for (let i = 1; i <= pageCount; i++) {
            if (currentPage === i) {
                html += "<li class=\"page-item active\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + i + "\">" + i + "</a></li>";
            }
            else {
                html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + i + "\">" + i + "</a></li>";
            }
        }

        // Next button
        if (x >= pageCount) {
            html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + (x - 1) + "\">Next</a></li>";
        }
        else {
            html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + searchCriteria.keyword + "&c=" + searchCriteria.selectedCategoryVal + "&pf=" + searchCriteria.priceFilter + "&cond" + searchCriteria.conditionFilter + "&sort=" + searchCriteria.sortF + "&page=" + (x + 1) + "\">Next</a></li>";
        }

        return html;
    },
    //temporary soluition for category display of items in search results
    //Author @Osbaldo Martinez
    categoryName: (cid) => {
        switch (cid) {
            case 1:
                return "Books";
            case 2:
                return "Electronics";
            case 3:
                return "Furniture";
            case 4:
                return "Health";
            case 5:
                return "Services";
            case 6:
                return "Sports";
            case 7:
                return "Supplies";
            case 8:
                return "Other";
        }
    },
    usernameOf: (email) => {
        ;
        if (typeof email === 'string') {
            return email.split("@")[0];
        }
        else {
            return email;
        }
    },
    json: (data) => {
        return JSON.stringify(data);
    }
}
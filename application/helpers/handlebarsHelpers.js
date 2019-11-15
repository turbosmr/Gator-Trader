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
            html += "Showing " + totalProducts;
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
    pagination: (pageCount, currentPage, category, keyword, priceFilter, conditionFilter, sortF) => {
        let html = "";
        let x = currentPage;

        if (!keyword) {
            keyword = "";
        }

        // Previous button
        if (x === 1) {
            html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + (x - 1) + "\">Previous</a></li>";
        }
        else {
            html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category  + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + (x - 1) + "\">Previous</a></li>";
        }

        // Page button
        for (let i = 1; i <= pageCount; i++) {
            if (currentPage === i) {
                html += "<li class=\"page-item active\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + i + "\">" + i + "</a></li>";
            }
            else {
                html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category  + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + i + "\">" + i + "</a></li>";
            }
        }

        // Next button
        if (x >= pageCount) {
            html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + (x - 1) + "\">Next</a></li>";
        }
        else {
            html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?k=" + keyword + "&c=" + category  + "&sort=" + sortF +"&pf="+priceFilter+ "&page=" + (x + 1) + "\">Next</a></li>";
        }

        return html;
    }
}
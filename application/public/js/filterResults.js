
$(document).ready(function() {
    $('#under25').click(function() {
        var searchKeyword = $('#searchKeyword').val();
       $.ajax({
            type: "get",
            data: {searchKeyword: searchKeyword},
            success: window.location.href = "/search/filter/price/under25?searchKeyword="+searchKeyword
        });
    });
    $('#25to50').click(function() {
        var searchKeyword = $('#searchKeyword').val();
       $.ajax({
            type: "get",
            data: {searchKeyword: searchKeyword},
            success: window.location.href = "/search/filter/price/25to50?searchKeyword="+searchKeyword
        });
    });
    $('#50to200').click(function() {
        var searchKeyword = $('#searchKeyword').val();
       $.ajax({
            type: "get",
            data: {searchKeyword: searchKeyword},
            success: window.location.href = "/search/filter/price/50to200?searchKeyword="+searchKeyword
        });
    });
    $('#over200').click(function() {
        var searchKeyword = $('#searchKeyword').val();
        //console.log(searchKeyword)
        // create ajax get request
       $.ajax({
            type: "get",
            data: {searchKeyword: searchKeyword},
            success: window.location.href = "/search/filter/price/over200?searchKeyword="+searchKeyword
        });
    });
});
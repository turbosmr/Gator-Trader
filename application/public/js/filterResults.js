
$(document).ready(function() {
    $('#under25').click(function() {
        var searchKeyword = $('#searchKeyword').val();
        //console.log(searchKeyword)
        // create ajax get request
       $.ajax({
            url: "/search/filter/price/under25",
            type: "get",
            data: {searchKeyword: searchKeyword}
        });
    });
});
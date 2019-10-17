$(document).ready(function () {
    $('#bar .typeahead').typeahead({
        name: 'saleItems',
        display: 'value',
        remote: 'http://localhost:3000/search/result?key=%QUERY',
        limit: 10
    });
});
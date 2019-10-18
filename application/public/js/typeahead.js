$(document).ready(function () {
    $('.typeahead').typeahead({
        name: 'suggestions',
        display: 'value',
        remote: 'http://localhost:3000/search/result/typeahead?key=%QUERY',
        limit: 10
    });
});
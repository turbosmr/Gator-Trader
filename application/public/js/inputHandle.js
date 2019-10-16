$('#search').ready(function () {
    $('input.typeahead').typeahead({
        name: 'countries',
        remote: 'http://localhost:3000/result?key=%QUERY',
        limit: 10
    });
});
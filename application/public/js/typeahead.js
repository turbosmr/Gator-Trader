$(document).ready(function () {
    $('.typeahead').typeahead({
        name: 'suggestions',
        display: 'value',
        remote: '/search/suggestions/typeahead?key=%QUERY',
        limit: 10
    });
    $(".tt-hint").addClass("form-control");
});
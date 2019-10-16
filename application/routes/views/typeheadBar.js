var salesItems = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'http://localhost:3000/search?key=%QUERY',
        wildcard: '%QUERY'
    }
});


$('#SearchBar .typeahead').typeahead(null, {
    name: 'best-pictures',
    display: 'value',
    source: salesItems
});
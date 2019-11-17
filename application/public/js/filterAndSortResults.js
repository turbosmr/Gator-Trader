//function used to filter and sort results
//Author: @Osbaldo Martinez & @Johnson
$(document).ready(function () {
    /* ---------- Filter by price ----------*/
    $('#under25, .under25').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'under25');
        url.searchParams.delete('page');
        url = url.toString();
        
        $.ajax({
            success: window.location.href = url
        });
    });

    $('#25to50, .25to50').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '25to50');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#50to200, .50to200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '50to200');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#over200, .over200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'over200');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Filter by condition ----------*/
    $('#new, .new').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'new');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used-excellent, .used-excellent').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'used - excellent');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used-good, .used-good').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'used - good');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used-fair, .used-fair').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'used - fair');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used-salvage, .used-salvage').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'used - salvage');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort Alphabetically: A-Z ----------*/
    $('#atoz, .atoz').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'atoz');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort by Price: Low to High ----------*/
    $('#ltoh, .ltoh').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'ltoh');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort by Price: High to Low ----------*/
    $('#htol, .htol').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'htol');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });
});
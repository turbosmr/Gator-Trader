//function used to filter and sort results
//Author: @Osbaldo Martinez & @Johnson
$(document).ready(function () {
    /* ---------- Filter by price ----------*/
    $('#under25').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'under25');
        url.searchParams.delete('page');
        url = url.toString();
        
        $.ajax({
            success: window.location.href = url
        });
    });

    $('#25to50').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '25to50');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#50to200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '50to200');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#over200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'over200');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Filter by condition ----------*/
    $('#new').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'new');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'used');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort Alphabetically ----------*/
    $('#atoz').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'atoz');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort High Price to Low Price ----------*/
    $('#htol').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'htol');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    /* ---------- Sort Low Price to High Price ----------*/
    $('#ltoh').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort', 'ltoh');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });
    
});
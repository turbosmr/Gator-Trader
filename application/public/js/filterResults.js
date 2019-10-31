
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
        url.searchParams.set('cond', 'New');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#used').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('cond', 'Used');
        url.searchParams.delete('page');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });
});
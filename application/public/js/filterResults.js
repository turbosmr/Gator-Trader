
$(document).ready(function () {
    $('#under25').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'under25');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#25to50').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '25to50');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#50to200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', '50to200');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });

    $('#over200').click(function () {
        var url = new URL(window.location.href);
        url.searchParams.set('pf', 'over200');
        url = url.toString();

        $.ajax({
            success: window.location.href = url
        });
    });
});
// Scrollable chat
$(document).ready(() => {
    $(function () {
        $('#conversation-container').animate({
            scrollTop: $("#conversation li").last().offset().top
        },
            'slow');
    });
});
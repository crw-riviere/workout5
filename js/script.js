$(document).ready(function () {
    $(window).load(function () {
        $('#pnlHomeLoad').fadeOut(1000, function () {
            $('#pnlLoadingBall').removeClass('animation-loading-ball');
            $('#pnlHomeNav').fadeIn('slow', function () {
                // Animation complete
            });
        });
    });

    $('.btnWorkout').click(function () {
        $('#pgeSettings').addClass('hidden');
        $('#pgeHome').addClass('hidden');
        $('#pgeWorkout').removeClass('hidden');
    });

    $('#btnSettings').click(function () {
        $('#pgeHome').addClass('hidden');
        $('#pgeSettings').removeClass('hidden');
    });

    $('.btnHome').click(function () {
        $('#pgeSettings').addClass('hidden');
        $('#pgeHome').removeClass('hidden');
    });
});
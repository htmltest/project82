$(document).ready(function() {

    $('.services-item h2').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.portfolio-more a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('loading')) {
            curLink.addClass('loading');
            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.portfolio .portfolio-list').append($(html).find('.portfolio-list').html());
                if ($(html).find('.portfolio-more').length > 0) {
                    $('.portfolio .portfolio-more a').attr('href', $(html).find('.portfolio-more a').attr('href'));
                } else {
                    $('.portfolio .portfolio-more').remove();
                }
                curLink.removeClass('loading');
            });
        }
        e.preventDefault();
    });

    $('.responses-item a').fancybox({
        baseTpl	: '<div class="fancybox-container" role="dialog" tabindex="-1">' +
            '<div class="fancybox-bg"></div>' +
            '<div class="fancybox-controls">' +
                '<div class="fancybox-infobar">' +
                    '<button data-fancybox-previous class="fancybox-button fancybox-button--left" title="Предыдущая"></button>' +
                    '<div class="fancybox-infobar__body">' +
                        '<span class="js-fancybox-index"></span>&nbsp;/&nbsp;<span class="js-fancybox-count"></span>' +
                    '</div>' +
                    '<button data-fancybox-next class="fancybox-button fancybox-button--right" title="Следующая"></button>' +
                '</div>' +
                '<div class="fancybox-buttons">' +
                    '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="Закрыть (Esc)"></button>' +
                '</div>' +
            '</div>' +
            '<div class="fancybox-slider-wrap">' +
                '<div class="fancybox-slider"></div>' +
            '</div>' +
            '<div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div>' +
        '</div>',
        slideShow : false,
        fullScreen : false,
        thumbs : false
    });

    $('.responses-list-inner').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true,
        arrows: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

});
$(document).ready(function() {

    $('.services-item h2').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.portfolio-list').isotope({
        itemSelector: '.portfolio-item'
    });

    $('.portfolio-menu a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.portfolio-menu li.active').removeClass('active');
            $('.portfolio-list').isotope({
                filter: curLi.data('filter')
            });
            curLi.addClass('active');
            var $subline = $('.portfolio-menu .subline');
            $subline
                .width($('.portfolio-menu li.active a').outerWidth())
                .css('left', $('.portfolio-menu li.active a').position().left)
                .data('origLeft', $subline.position().left)
                .data('origWidth', $subline.width());
        }
        e.preventDefault();
    });

    $('.portfolio-menu').each(function() {
        $('.portfolio-menu ul').append('<li class="subline"></li>');
        var $subline = $('.portfolio-menu .subline');

        if ($('.portfolio-menu li.active').length > 0) {
            $subline
                .width($('.portfolio-menu li.active a').outerWidth())
                .css('left', $('.portfolio-menu li.active a').position().left)
                .data('origLeft', $subline.position().left)
                .data('origWidth', $subline.width());
        } else {
            $subline
                .data('origLeft', 0)
                .data('origWidth', 0);
        }

        $('.portfolio-menu li a').hover(
            function() {
                var $el = $(this);
                var leftPos = $el.position().left;
                var newWidth = $el.outerWidth();
                $subline.stop().animate({
                    left: leftPos,
                    width: newWidth
                });
            },

            function() {
                $subline.stop().animate({
                    left: $subline.data('origLeft'),
                    width: $subline.data('origWidth')
                });
            }
        );
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

    $.validator.addMethod('maskPhone',
        function(value, element) {
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('body').on('click', '.window-link', function(e) {
        windowOpen($(this).attr('href'));
        e.preventDefault();
    });

    $('.services-item li a').click(function(e) {
        windowOpen($(this).attr('href'), null, function() {
            $('.window-services-menu li.active').parent().slideDown();
        });
        e.preventDefault();
    });

    $('body').on('click', '.window-services-menu > ul > li > a', function(e) {
        $(this).parent().find('ul').slideToggle();
        e.preventDefault();
    });

    $('body').on('click', '.window-services-menu > ul > li > ul > li > a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.window-services-menu > ul > li > ul > li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.window-services-menu > ul > li > ul > li').index(curLi);
            $('.window-services-tab:visible').stop(true, true).fadeOut(function() {
                $('.window-services-tab').eq(curIndex).fadeIn();
            });
        }
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input, .form-input textarea, .form-file input').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea, .form-file input').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea, .form-file input').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        $('.form-file-progress.error').removeClass('error');
    });

    curForm.find('.form-file input').fileupload({
        url: 'server/php/',
        dataType: 'json',
        done: function (e, data) {
            $('.form-file-progress').addClass('valid');
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('.form-file-progress').css(
                'width',
                progress + '%'
            );
        },
        fail: function (e, data) {
            $('.form-file-progress').addClass('error');
        }
    });

    if (curForm.hasClass('window-form')) {
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                windowOpen($(form).attr('action'), $(form).serialize());
            }
        });
    } else {
        curForm.validate({
            ignore: '',
        });
    }
}

function windowOpen(linkWindow, dataWindow = null, callbackWindow = null) {
    $('html').addClass('window-open');

    if ($('.window').length > 0) {
        $('.window').remove();
    }

    $('.wrapper').append('<div class="window"><div class="window-loading"></div></div>')

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close">Свернуть</a></div></div>')

            if ($('.window-container img').length > 0) {
                $('.window-container img').each(function() {
                    $(this).attr('src', $(this).attr('src'));
                });
                $('.window-container').data('curImg', 0);
                $('.window-container img').load(function() {
                    var curImg = $('.window-container').data('curImg');
                    curImg++;
                    $('.window-container').data('curImg', curImg);
                    if ($('.window-container img').length == curImg) {
                        $('.window-container').removeClass('window-container-load');
                        $('.window-loading').remove();
                        windowPosition();
                    }
                });
            } else {
                $('.window-container').removeClass('window-container-load');
                $('.window-loading').remove();
                windowPosition();
            }

            if (callbackWindow !== null) {
                callbackWindow.call();
            }

            $(window).resize(function() {
                windowPosition();
            });

            $('.window-close').click(function(e) {
                windowClose();
                e.preventDefault();
            });

            $('body').on('keyup', function(e) {
                if (e.keyCode == 27) {
                    windowClose();
                }
            });

            $('.window form').each(function() {
                initForm($(this));
            });

            $(document).click(function(e) {
                if ($(e.target).hasClass('window')) {
                    windowClose();
                }
            });
        }
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
    }
}
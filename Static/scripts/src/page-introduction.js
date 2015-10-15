define(['jquery', 'underscore', 'base/modules/animate', 'base/page-scroll'], function ($, _, animate, pageScroll) {

    'use strict';

    pageScroll.init();

    var heightPageHeader = 90; // percent
    var contentHeight = 0;
    var isInit = false;

    function calculateHeight(container) {
        if (!isInit) {
            isInit = true;

            if (!window.parent.$('iframe') || window.parent.$('iframe').length == 0) {
                container.parent().height($(window).height() * heightPageHeader / 100 + 'px');

                $('head').append('<style type="text/css">.page-introduction-container {height:' + $(window).height() * heightPageHeader / 100 + 'px' + ';}</style>');
            }

            var background = container.find('.page-introduction__background');
            contentHeight = background.height();
        }
    }

    function PageIntroduction(container) {
        calculateHeight(container);

        var content = container.find('.page-introduction__content');
        var arrowButton = container.find('.page-introduction__arrow');
        var baseBottom = parseInt(arrowButton.css('bottom'));
        var background = container.find('.page-introduction__background');
        contentHeight = background.height();

        var callbackScroll = _.debounce(function (scrollTop) {
            if (scrollTop > contentHeight)
                return;

            /*
            if (!container.hasClass('loaded')) {
                container.addClass('loaded');
            }
            if (scrollTop <= 20) {
                container.removeClass('loaded');
            }
            */
            background.css('top', (scrollTop / 2) + 'px');
            arrowButton.css({
                'bottom': (baseBottom - scrollTop) + 'px'
            });
            content.css({
                'margin-top': (scrollTop / 2) + 'px',
                'opacity': (1 - scrollTop * 1.5 / contentHeight)
            });
        }, 0);

        pageScroll.addCallback(callbackScroll);

        arrowButton.on('click', function () {
            $('html').velocity('scroll', {
                duration: 500, offset: contentHeight, easing: 'ease-in-out',
                complete: function () { }
            });
        });

        $(window).on('resize', function () {
            var timeout = setTimeout(function () {
                isInit = false;
                calculateHeight(container);
                clearTimeout(timeout);
            }, 500);
        });
    }

    return {
        init: function (container) {
            return new PageIntroduction(container);
        }
    };
});

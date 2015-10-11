define(['jquery', 'underscore', 'base/modules/animate', 'base/page-scroll'], function ($, _, animate, pageScroll) {

    'use strict';

    pageScroll.init();

    function PageIntroduction(container) {
        var background = container.find('.page-introduction__background');
        var content = container.find('.page-introduction__content');
        var arrowButton = container.find('.page-introduction__arrow');

        var contentHeight = background.height();

        var callbackScroll = function (scrollTop) {
            if (!container.hasClass('loaded')) {
                container.addClass('loaded');
            }
            background.css('top', (-scrollTop / 2) + 'px');
            content.css({
                'margin-top': (-scrollTop / 2) + 'px',
                'opacity': (1 - scrollTop * 1.5 / contentHeight)
            });
        };

        pageScroll.addCallback(callbackScroll);

        arrowButton.on('click', function () {
            $('html').velocity('scroll', {
                duration: 500, offset: contentHeight, easing: 'ease-in-out',
                complete: function () { }
            });
        });
    }

    return {
        init: function (container) {
            return new PageIntroduction(container);
        }
    };
});

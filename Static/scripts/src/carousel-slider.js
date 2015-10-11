define(['jquery', 'underscore', 'base/modules/animate', 'lib/owl.carousel'], function ($, _, animate, owl) {

    'use strict';

    function CarouselSlider(container) {
        if (container.find('.testimonial-carousel-container').children().length >= 2) {
            container.find('.testimonial-carousel-container').addClass('owl-carousel').owlCarousel({
                items: 1,
                smartSpeed: 500,
                loop: true,
                nav: true
            });
        }
    }

    return {
        init: function (container) {
            return new CarouselSlider(container);
        }
    };
});

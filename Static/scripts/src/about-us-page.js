define(['jquery', 'underscore', 'base/page-scroll-animation', 'base/page-scroll','base/count-up'], function ($, _, pageScrollAnimation, pageScroll) {
    function init(container) {
        pageScrollAnimation.init(container);
    }
    var heightW = $(window).height();
    var deltaH = 200;
    pageScroll.addCallback(function (scrollTop) {
        if (!$(".record-number").hasClass("counted") && ($(".record-number .container").offset().top < scrollTop + heightW - deltaH)) {
            $(".record-number").addClass("counted");
            countRecord();
        }
    });
    
    function countRecord() {
        $(".record-number").find(".statistic-number").each(function() {
            $(this).countTo({
                from: 0,
                to: $(this).attr("data-count"),
                speed: 2000,
                refreshInterval: 100,
                onComplete: function (value) {
                }
            });
        });
    }
    return {
        init: function (container) {
            init(container);
        }
    };
});
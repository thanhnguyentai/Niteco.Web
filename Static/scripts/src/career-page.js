define(['jquery', 'underscore', 'base/page-scroll-animation', 'base/request-page'], function ($, _, pageScrollAnimation, requestPage) {

    function init(container) {
        pageScrollAnimation.init(container);
        
        requestPage.registRequestByContainer(container.find('.job-details'));
    }
    return {
        init: function (container) {
            init(container);
        }
    };
});
define(['jquery', 'underscore', 'base/loading', 'base/modules/jitRequire', 'vendor/history', 'base/top-navigator'], function ($, _, loading, jitRequire, history, topNavigator) {

    'use strict';

    var isLoading = false;
    var currentUrl = "";
    var pageWrapper = $('.page-wrapper');
    var stateIndex = 1;
    var callbackHistory = null;
    var isLoadPageByStateChange = false;
    registerHistory();

    function registerHistory() {
        (function (window) {
            History.Adapter.bind(window, 'statechange', function () {
                var state = History.getState();
                if (state.url.indexOf(currentUrl) < 0) {
                    isLoadPageByStateChange = true;
                    loadPageByHref(state.url, null, function (href) {
                        isLoadPageByStateChange = false;
                        if (callbackHistory)
                            callbackHistory(href);
                    });
                }
            });
        })(window);
    }

    function loadPage(href, callback) {
        showLoading();
        $.ajax({
            url: href,
            type: 'GET',
            async: true,
            success: function (data) {
                hideLoading(function () {
                    displayLoadedPage(data, function (title) {
                        if (!isLoadPageByStateChange) {
                            History.pushState({ state: stateIndex++ }, title, href);
                        }

                        isLoading = false;
                        if (callback)
                            callback(href);
                    });
                });
            },
            error: function () {
                hideLoading();
                displayError();
            }
        });
    }

    function showLoading() {
        loading.startLoading();
        $('body').velocity('scroll', {
            duration: 250,
            offset: 0
        });
    }

    function hideLoading(callback) {
        loading.completeLoading(function () {
            if (callback)
                callback();
        });
    }

    function displayLoadedPage(data, callback) {
        var content = $(data).find('.content-container');
        var matches = data.match(/<title>(.*?)<\/title>/);
        var title = matches[1];

        var isBackHome = false;
        if (content.hasClass('home-container')) {
            isBackHome = true;
            content.addClass('loading-back');
        } else {
            content.addClass('loading');
        }

        pageWrapper.append(content);

        $('body').toggleClass('overflow-hidden');

        var timeout = setTimeout(function () {
            clearTimeout(timeout);

            var listContents = pageWrapper.find('.content-container');
            if (isBackHome) {
                listContents.addClass('animating-back');
            } else {
                listContents.addClass('animating');
            }

            listContents.eq(0).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
                for (var i = 0; i < listContents.length; i++) {
                    if (isBackHome) {
                        if (!listContents.eq(i).hasClass('loading-back')) {
                            listContents.eq(i).remove();
                        }
                    } else {
                        if (!listContents.eq(i).hasClass('loading')) {
                            listContents.eq(i).remove();
                        }
                    }
                }


                var timeout1 = setTimeout(function () {
                    clearTimeout(timeout1);
                    pageWrapper.find('.content-container').removeClass('loading loading-back animating animating-back');
                    jitRequire.findDeps(pageWrapper, function () {
                        var timeout2 = setTimeout(function () {
                            clearTimeout(timeout2);
                            $('body').toggleClass('overflow-hidden');

                            if (callback)
                                callback(title);
                        }, 500);
                    });
                }, 250);
            });
        }, 200);
    }

    function displayError() {

    }

    function validateUrl(href) {
        if (href && href != "#" && href != currentUrl) {
            currentUrl = href;
            return true;
        }
        return false;
    }

    function loadPageByHref(href, jqueryObj, callback) {
        if (isLoading) {
            return false;
        }

        if (validateUrl(href)) {
            isLoading = true;
            loadPage(href, callback);

            if (jqueryObj)
                jqueryObj.data('registed', 'true');
        }

        return false;
    }

    function registRequestByContainer(container, callback) {
        var items = container.find('a');
        registRequestByItems(items.toArray().map(function (e) { return $(e); }), callback);
    }

    function unregistRequestByContainer(container) {
        var items = container.find('a');
        unregistRequestByItems(items);
    }

    function registRequestByItems(items, callback) {
        for (var index in items) {
            if (!items[index].data('registed')) {
                items[index].on('click', function (e) {
                    e.preventDefault();
                    var href = $(this).attr('href');
                    loadPageByHref(href, $(this), callback);
                    return false;
                });
            }
        }
    }

    function unregistRequestByItems(items) {
        for (var index in items) {
            if (items[index].data('registed')) {
                items[index].off('click');
            }
        }
    }

    return {
        registRequestByContainer: registRequestByContainer,

        unregistRequestByContainer: unregistRequestByContainer,

        registRequestByItems: registRequestByItems,

        unregistRequestByItems: unregistRequestByItems,

        loadPageFromUrl: function (href) {
            loadPageByHref(href);
        },

        registerCallbackHistoryChange: function (callback) {
            callbackHistory = callback;
        }
    };
});

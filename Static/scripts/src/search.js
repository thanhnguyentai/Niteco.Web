define(['jquery', 'underscore', 'base/modules/animate', 'base/top-navigator', 'base/request-page', 'templates/search_result'], function ($, _, animate, topNavigator, requestPage, searchResult) {

    'use strict';

    var searchContainer = null;
    var position = null;
    var size = null;
    var searchAction = "";
    var timeoutToSearch = 1000;

    function init() {
        topNavigator.registerShowSearch(function (isMenuShow) {
            if (isMenuShow) {
                enableSearchBox();
            } else {
                disableSearchBox();
            }
        });

        searchAction = searchContainer.attr('data-action-search');

        var timeoutSearch = null;
        searchContainer.find('#searchBox').on('keyup', function (e) {
            if (timeoutSearch && e.which != 13)
                clearTimeout(timeoutSearch);

            var searchText = $(this).val();
            if (searchText.trim().length <= 0)
                return;

            if (e.which == 13) {
                search(searchText, generateSearchResult);
                return;
            }

            timeoutSearch = setTimeout(function () {
                search(searchText, generateSearchResult);
            }, timeoutToSearch);
        });

        topNavigator.getContainer().find('.top-navigator__menu-container').on('scroll', function () {
            enableSearchBox(true);
        });

        $(window).resize(function () {
            searchContainer.css('opacity',0);
            setTimeout(function () {
                enableSearchBox(true);
                searchContainer.css('opacity', 1);
            }, 500);
        });

        searchContainer.find('.search-default a').on('click', function (e) {
            e.preventDefault();
            var href = $(this).attr('href');
            openALink(href);
            return false;
        });
    }

    function generateSearchResult(data) {
        animate(searchContainer.find('.search-default'), 'transition.slideDownOut', { duration: 300 });
        var result = $(searchResult(data.data));
        searchContainer.find('.search-result').html('').append(result);

        var listSearchItems = result.find('.search-result__item');
        for (var i = 0; i < listSearchItems.length; i++) {
            animate(listSearchItems.eq(i), 'transition.slideUpIn', { duration: 200, delay: i * 200 });
            listSearchItems.eq(i).on('click', function (e) {
                e.preventDefault();
                var href = $(this).attr('href');
                openALink(href);
                return false;
            });
        }
    }

    function openALink(href) {
        closeSearchBox(function () {
            topNavigator.hideMenu();
            requestPage.loadPageFromUrl(href);
        });
    }

    function search(text, callback) {
        $.ajax({
            url: searchAction + "?q=" + text,
            type: 'GET',
            async: true,
            datatype: 'json',
            success: function (data) {
                console.log(data);
                if (data.success) {
                    if (callback)
                        callback(data);
                }
            },

            error: function () {
            }
        });
    }

    function registerEventShowSearch() {
        var showSearchPanel = _.debounce(function () {
            searchContainer.find('.seach-box__placeholder').css('display', 'none');
            searchContainer.addClass('expanding');
            animate(searchContainer, {
                'padding-right': 0,
                'top': 0,
                'right': 0,
                'width': '100%',
                'height': '100%'
            }, {
                duration: 500,
                easing: 'ease-in-out'
            }).then(function () {
                searchContainer.addClass('active');

                animate(searchContainer.find('.search-default'), 'transition.slideUpIn', { duration: 300 });
            });

            searchContainer.find('.close-button').one('click', function (e) {
                closeSearchBox();
            });
        }, 10);

        searchContainer.one('click', function () {
            showSearchPanel();
        });
    }

    function unregisterEventShowSearch() {
        searchContainer.off('click');
    }

    function enableSearchBox(isScroll) {
            
        position = topNavigator.getContainer().find('.top-navigator__search-container').offset();
        size = {
            width: topNavigator.getContainer().find('.top-navigator__search-container').outerWidth(),
            height: topNavigator.getContainer().find('.top-navigator__search-container').outerHeight()
        };

        searchContainer.css({
            top: position.top - $(window).scrollTop() + 'px',
            width: size.width + 'px',
            height: size.height + 'px',
            right: $(window).width() - position.left - size.width + 'px',
            display: 'block',
            opacity: 1
        });

        if (!isScroll)
            registerEventShowSearch();
    }

    function disableSearchBox() {
        searchContainer.css({
            width: 0,
            height: 0,
            display: 'none',
            opacity: 0
        });

        unregisterEventShowSearch();
    }

    function closeSearchBox(callback) {
        searchContainer.removeClass('active');
        searchContainer.find('.search-default').css('display', 'none');
        searchContainer.find('.search-result').html('');
        searchContainer.find('#searchBox').val('');

        var timeout = setTimeout(function () {
            clearTimeout(timeout);

            animate(searchContainer, {
                right: $(window).width() - position.left - size.width + 'px',
                top: position.top - $(window).scrollTop() + 'px',
                width: size.width + 'px',
                height: size.height + 'px',

                duration: 500, easing: 'ease-in-out'
            }).then(function () {
                searchContainer.removeClass('expanding');
                searchContainer.find('.seach-box__placeholder').css('display', 'block');
                
                var timeoutRegister = setTimeout(function () {
                    clearTimeout(timeoutRegister);
                    registerEventShowSearch();
                },0);

                if (callback)
                    callback();
            });
        }, 200);
    }

    return {
        init: function (container) {
            searchContainer = container;
            init();
        }
    };
});

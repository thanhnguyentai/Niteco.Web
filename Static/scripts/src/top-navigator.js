define(['jquery', 'underscore', 'base/modules/animate', 'base/request-page', 'base/page-scroll'], function ($, _, animate, requestPage, pageScroll) {

    'use strict';

    pageScroll.init();

    var menuContainer = null;
    var isMenuShowed = false;
    var callbackSearch = null;
    var enableToggleMenu = true;
    
    function registerEvent() {
        menuContainer.find('.hamburger-menu__button').on('click', showMenu);
        menuContainer.find('a').on('click', hideMenu);
        
        requestPage.registRequestByContainer(menuContainer, function(href) {
            selectMenu(href);
        });

        requestPage.registerCallbackHistoryChange(function(href) {
            selectMenu(href);
        });

        var scrollTopToDisplay = $(window).height() * 70 / 100;
        var absolutePosition = 'absolute';
        var fixedPosition = "fixed";
        var currentPosition = absolutePosition;

        var callbackScroll = _.debounce(function (scrollTop) {
            if (scrollTop > scrollTopToDisplay && currentPosition == fixedPosition)
                return;

            if (scrollTop > scrollTopToDisplay && currentPosition == absolutePosition) {
                currentPosition = fixedPosition;
                menuContainer.css({
                    'position': 'fixed',
                    'top': -menuContainer.height() + 'px'
                });
                menuContainer.addClass('scroll-menu');

                animate(menuContainer, { top: 0, duration: 500 });
            } else if (scrollTop <= scrollTopToDisplay && currentPosition == fixedPosition) {
                currentPosition = absolutePosition;
                animate(menuContainer, { top: -menuContainer.height() + 'px', duration: 500 }).then(function () {
                    menuContainer.css({
                        'position': 'absolute',
                        'top': '0'
                    });
                    menuContainer.removeClass('scroll-menu');
                });
            }
        }, 10);

        pageScroll.addCallback(function (scrollTop) {
            callbackScroll(scrollTop);
        });
    }
    
    function showMenu() {
        if (!enableToggleMenu)
            return;
        
        enableToggleMenu = false;
        isMenuShowed = !isMenuShowed;
        
        $(this).parents('body').find('.content-wrapper').toggleClass('show-menu');

        var callbackEnTransition = _.debounce(function () {
            if (isMenuShowed && callbackSearch) {
                var timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    callbackSearch(isMenuShowed);
                    enableToggleMenu = true;
                }, 250);
            } else {
                enableToggleMenu = true;
            }
        }, 10);
        
        $(this).parents('.top-navigator-container').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
            callbackEnTransition();
        });
        
        $(this).parents('.top-navigator-container').toggleClass('is-active'); 
        $('body').toggleClass('overflow-hidden');

        if (!isMenuShowed && callbackSearch)
            callbackSearch(isMenuShowed);
    }
    
    
    function selectMenu(href) {
        var listItems = menuContainer.find('.top-navigator__menu-container').find('a');
        for (var i = 0; i < listItems.length; i++) {
            if (listItems.eq(i).attr('href') == href) {
                listItems.eq(i).addClass('selected-item');
            } else {
                listItems.eq(i).removeClass('selected-item');
            }
        }
    }

    function hideMenu(e) {
        if (!isMenuShowed)
            return false;
        if (e) {
            e.preventDefault();
        }
        isMenuShowed = !isMenuShowed;
        
        menuContainer.toggleClass('is-active');
        menuContainer.parents('body').find('.content-wrapper').toggleClass('show-menu');
        $('body').removeClass('overflow-hidden');

        if (callbackSearch)
            callbackSearch(isMenuShowed);
        
        return false;
    }
    return {        
        init: function (container) {
            menuContainer = container;
            registerEvent();
        },
        
        registerShowSearch: function (callback) {
            callbackSearch = callback;
        },

        selectMenu: selectMenu,
        
        hideMenu: hideMenu,
        
        getContainer: function() {
            return menuContainer;
        }
    };
});

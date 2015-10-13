define(['jquery', 'underscore', 'base/modules/animate'], function ($, _, animate) {
    'use strict';


    var $items, $overlay,$contentLoading, $close,
        // transition end event name

            // window and body elements
        $window = $(window),
        // transitions support

            // current item's index
        current = -1;



    function initEvents() {
        $items = $('.project-item');
        if ($(".project-modal").length == 0) {
            var projectModal = getHTMLModal();
            $("body").append(projectModal);
        }


        $items.each(function () {

            var $item = $(this);
            $overlay = $(".project-modal");
            $close = $overlay.find('span.rb-close');
            $contentLoading = $overlay.find('.project-loading-content');
            $item.find('a').on('click', function (e) {
                e.preventDefault();
                showModel($item);
                return false;
            });
            $item.on('click', function () {
                showModel($item);
            });

        });

        $close.on('click', function () {
            closeModalDialog();
        });
    }
    
    function disableScroll() {
        $('body').addClass('overflow-hidden');
    }
    
    function enableScroll() {
        $('body').removeClass('overflow-hidden');
    }

    function showModel($item) {
        disableScroll();
        
        current = $item.index();

        $overlay.children(".project-preview").html($item.html());

        var layoutProp = getItemLayoutProp($item);
        $overlay.css({
            top: layoutProp.top,
            left: layoutProp.left,
            width: layoutProp.width,
            height: layoutProp.height,
            zIndex: 9999,
            pointerEvents: 'auto',
        });
        $overlay.show();
        $overlay.animate({ top: (0 + $window.scrollTop()), left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }, 500, function () {
            $overlay.css({ overflow: 'hidden' });
            $close.css({ opacity: 1 });
            bindEscapeKey();
            $.ajax({
                url: "/Static/compiled/pages/case-study-detail.html"
            }).done(function (data) {
                $contentLoading.html(data);
            });
            $overlay.on('click', function () {
                closeModalDialog();
            });
        });
    };

    function closeModalDialog() {
        enableScroll();
        
        if (current !== -1) {
            var layoutProp = getItemLayoutProp($items.eq(current));
            $close.css({ opacity: 0 });
            $overlay.animate({ top: layoutProp.top, left: layoutProp.left, width: layoutProp.width, height: layoutProp.height }, 500, function () {
                $overlay.css({
                    zIndex: 0,
                    pointerEvents: 'none',
                });
                $overlay.hide();
            });
        }
        current = -1;
    }

    function bindEscapeKey() {
        $("body").bind("keyup.myDialog", function (event) {
            if (event.which == 27) {
                // TODO: close the dialog

                closeModalDialog();

                $("body").unbind("keyup.myDialog");
            }
        });
    }

    function getItemLayoutProp($item) {

        var scrollT = $window.scrollTop(),
            scrollL = $window.scrollLeft(),
            itemOffset = $item.offset();

        return {
            left: itemOffset.left,
            top: itemOffset.top,
            width: $item.outerWidth(),
            height: $item.outerHeight()
        };

    }



    function getHTMLModal() {
        var projectModal = "<div class=\"project-modal js-project-modal\">";
        //projectModal += "<span class=\"rb-close\">close</span>";
        projectModal += "        <div class=\"project-preview\">";
        projectModal += "       <\/div>";
        projectModal += "        <div class=\"project-loading-content ajax-content-container\">";
        projectModal += "           <div class=\"loading-container-2\">";
        projectModal += "               <div class=\"loading\"></div>";
        projectModal += "               <div id=\"loading-text\">loading</div>";
        projectModal += "           </div>";
        projectModal += "       <\/div>";
        projectModal += "   <\/div>";
        return projectModal;

    }

    return {
        init: function () {
            initEvents();
        }
    };

});




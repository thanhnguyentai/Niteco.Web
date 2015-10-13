﻿define(['jquery', 'underscore', 'base/modules/animate'], function ($, _, animate) {
    "use strict";

    var container = null;

    function e() {
        var e = t.width();
        return 768 > e ? "mobile" : 992 > e ? "__subgroup" : "__group";
    }

    var t = $(window);

    function init() {
        if (container) {
            var listPersonGroup = container.find('.award-list--top .award-group');

            var bottomListContainer = container.find('.award-list--bottom');
            if (listPersonGroup && listPersonGroup.length > 0) {
                for (var i = 0; i < listPersonGroup.length; i++) {
                    bottomListContainer.append(listPersonGroup.eq(i).get(0).outerHTML);
                }
            }

            expandOurTeam();
        }
    }

    function expandOurTeam() {
        $(document).on("click", ".award", function () {
            var ourTeamSelector = $(".awards"),
                teamMember = ourTeamSelector.find(".award"),
                teamInfoSelector = ourTeamSelector.find(".award-info"),
                $this = $(this),
                memeberId = $this.data("award-id"),
                memberPreview = ourTeamSelector.find('.__award[data-award-id="' + memeberId + '"]'),
                memberDetail = teamInfoSelector.find('.award-details[data-award-id="' + memeberId + '"]'),
                memberVisible = ourTeamSelector.find(".award-details:visible"),
                showContentDetail = function (type) {
                    "slide" === type ? memberDetail.finish().slideDown(200) : memberDetail.finish().fadeIn(200),
                    teamMember.removeClass("__award--selected"),
                    memberPreview.addClass("__award--selected"),
                    ourTeamSelector.find(".__subgroup").removeClass("__subgroup--active"),
                    ourTeamSelector.find(".__group").removeClass("__group--active"),
                    memberPreview.closest(".__subgroup").addClass("__subgroup--active"),
                    memberPreview.closest(".__group").addClass("__group--active"), "mobile" === e() && $("html, body").animate({
                        scrollTop: memberPreview.offset().top
                    }, 300);
                };
            if ($this.hasClass("__award--selected"))
                memberPreview.removeClass("__award--selected"),
                memberVisible.finish().slideUp(200, function () {
                    memberPreview.closest(".__subgroup").removeClass("__subgroup--active"),
                    memberPreview.closest(".__group").removeClass("__group--active");
                }
                );
            else if (memberVisible.length) {
                var u = e();
                "mobile" === u ? memberVisible.finish().slideUp(200, function () {
                    showContentDetail("slide");
                }
                ) : memberPreview.parents("." + u).hasClass(u + "--active") ? memberVisible.finish().fadeOut(200, function () {
                    showContentDetail("fade");
                }
                ) : memberVisible.finish().slideUp(200, function () {
                    showContentDetail("slide");
                }
                );
            } else
                showContentDetail("slide");
        });
    };



    return {
        init: function (paramContainer) {
            container = paramContainer;

            init();
        }
    };

});




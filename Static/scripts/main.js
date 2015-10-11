define(['jquery', 'underscore', 'base/modules/jitRequire'
],
    function ($, _, jitRequire) {
        'use strict';
        jitRequire.findDeps($(document));
    });
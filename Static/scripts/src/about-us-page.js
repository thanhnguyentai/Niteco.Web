define(['jquery', 'underscore'], function ($, _) {
    return {
        init: function () {
            var startNum = 0;
            var stopNum = 440;
            var a = document.getElementsByClassName('statistic-number');
            function displayTime() {
                var timeDuration = 1 / stopNum;
                setTimeout(displayTime, timeDuration);

                if (stopNum < 100) {
                    startNum += 1;
                }
                else if (stopNum < 150) {
                    startNum += 2;
                }
                else if (stopNum < 200) {
                    startNum += 3;
                }
                else if (stopNum < 250) {
                    startNum += 4;
                }
                else {
                    startNum += 5;
                }
                if (startNum < stopNum + 1) {
                    $('#about-us-employees').html(startNum);
                }
                if (startNum > stopNum + 1) {
                    $('#about-us-employees').html(stopNum);
                }
            }
            displayTime();
        }
    };
});
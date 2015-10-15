define(['base/page-scroll-animation', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyB__eIsfbtydJhmiQwxQd7w30CgogsLk0k'], function (pageScrollAnimation) {
    var mappOfficeContainer = $(".map-office-section");
    var initMap = function() {
        //set your google maps parameters
        var map_zoom = 3;
        
        //var locations = [
        //      ['Causeway Bay, HongKong', 22.2859787, 114.1914919, 5],
        //      ['Palm Desert, CA 92260, USA', 33.6917281, -116.4075854, 4],
        //      ['Stockholm, Sweden', 59.3294, 18.0686, 3],
        //      ['Ho Chi Minh city, Vietnam', 10.7500, 106.6667, 2],
        //      ['Ha Noi, Vietnam', 21.0285, 105.8542, 1]
        //];
        var locations = eval(mappOfficeContainer.attr('data-locations'));
        //google map custom marker icon - .png fallback for IE11
        var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
        var marker_url = (is_internetExplorer11) ? '/img/cd-icon-location.png' : '/img/cd-icon-location.svg';

        var icon = {
            url: marker_url, // url
            //scaleSize: new google.maps.Size(10, 10), // size
            //origin: new google.maps.Point(0, 0), // origin
            //anchor: new google.maps.Point(0, 0) // anchor
        };

        //define the basic color of your map, plus a value for saturation and brightness
        var main_color = '#2d313f',
            saturation_value = -20,
            brightness_value = 5;

        //we define here the style of the map
        var style = [
            {
                //set saturation for the labels on the map
                elementType: "labels",
                stylers: [
                    { saturation: saturation_value }
                ]
            },
            {
//poi stands for point of interest - don't show these lables on the map
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                //don't show highways lables on the map
                featureType: 'road.highway',
                elementType: 'labels',
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                //don't show local road lables on the map
                featureType: "road.local",
                elementType: "labels.icon",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                //don't show arterial road lables on the map
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                //don't show road lables on the map
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [
                    { visibility: "off" }
                ]
            },
            //style different elements on the map
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.government",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.sport_complex",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.attraction",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.business",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "transit.station",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "landscape",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            }
        ];

        //set google map options
        var map_options = {
            center: new google.maps.LatLng(46.862496, 103.846656),
            zoom: map_zoom,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            styles: style,
        };
        //inizialize the map
        var map = new google.maps.Map(document.getElementById('google-container'), map_options);
        //add a custom marker to the map
        var infowindow = new google.maps.InfoWindow();

        var marker, i, currentMark;

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon: icon,
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                  
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                    currentMark = marker;
                };
            })(marker, i));
            

        }
        google.maps.event.addListener(infowindow, 'closeclick', function () {
            currentMark.setAnimation(null);
        });

        var zoomControlDiv = document.createElement('div');
        var zoomControl = new CustomZoomControl(zoomControlDiv, map);

        //insert the zoom div on the top left of the map
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);

    };

    //add custom buttons for the zoom-in/zoom-out on the map
    function CustomZoomControl(controlDiv, map) {
        //grap the zoom elements from the DOM and insert them in the map
        var controlUIzoomIn = document.getElementById('cd-zoom-in'),
            controlUIzoomOut = document.getElementById('cd-zoom-out');
        controlDiv.appendChild(controlUIzoomIn);
        controlDiv.appendChild(controlUIzoomOut);

        // Setup the click event listeners and zoom-in or out according to the clicked element
        google.maps.event.addDomListener(controlUIzoomIn, 'click', function () {
            map.setZoom(map.getZoom() + 1);
        });
        google.maps.event.addDomListener(controlUIzoomOut, 'click', function () {
            map.setZoom(map.getZoom() - 1);
        });
    }

    function initScrollAnimation(container) {
        pageScrollAnimation.init(container);
    }
    
    return {
        init: function (container) {
            initScrollAnimation(container);
            contactUsContainer = container;
            initMap();
        }
    };
});
jQuery( window ).on( 'elementor/frontend/init', function() {

    elementorFrontend.hooks.addAction( 'frontend/element_ready/wts-gmap.default', function( $scope ) {
        map = new_map($scope.find('.eae-markers'));

        function new_map( $el ) {
            $wrapper = $scope.find('.eae-markers');
            var zoom = $wrapper.data('zoom');
            var $markers = $el.find('.marker');
            var styles = $wrapper.data('style');
            var prevent_scroll = $wrapper.data('scroll');
            // vars
            var args = {
                zoom		: zoom,
                center		: new google.maps.LatLng(0, 0),
                mapTypeId	: google.maps.MapTypeId.ROADMAP,
                styles		: styles
            };

            // create map
            var map = new google.maps.Map( $el[0], args);

            // add a markers reference
            map.markers = [];

            // add markers
            $markers.each(function(){
                add_marker( jQuery(this), map );
            });

            // center map
            center_map( map, zoom );

            // return
            return map;
        }

        function add_marker( $marker, map ) {
            var animate = $wrapper.data('animate')
            $wrapper = $scope.find('.eae-markers');
            var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

            icon_img = $marker.attr('data-icon');
            if(icon_img != ''){
                var icon = {
                    url : $marker.attr('data-icon'),
                    scaledSize: new google.maps.Size($marker.attr('data-icon-size'), $marker.attr('data-icon-size'))
                };

            }


            //var icon = $marker.attr('data-icon');

            // create marker
            var marker = new google.maps.Marker({
                position	: latlng,
                map			: map,
                icon        : icon,
                animation: google.maps.Animation.DROP
            });
            if(animate == 'animate-yes'){
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            if(animate == 'animate-yes'){
                google.maps.event.addListener(marker, 'click', function() {
                    marker.setAnimation(null);
                });
            }



            // add to array
            map.markers.push( marker );
            // if marker contains HTML, add it to an infoWindow

            if( $marker.html() )
            {
                // create info window
                var infowindow = new google.maps.InfoWindow({
                    content		: $marker.html()
                });

                // show info window when marker is clicked
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open( map, marker );
                });


            }
            if(animate == 'animate-yes') {
                google.maps.event.addListener(infowindow, 'closeclick', function () {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                });
            }
        }

        function center_map( map, zoom ) {

            // vars
            var bounds = new google.maps.LatLngBounds();
            // loop through all markers and create bounds
            jQuery.each( map.markers, function( i, marker ){
                var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
                bounds.extend( latlng );
            });

            // only 1 marker?
            if( map.markers.length == 1 )
            {
                // set center of map
                map.setCenter( bounds.getCenter() );
                map.setZoom( zoom );
            }
            else
            {
                // fit to bounds
                map.fitBounds( bounds );
            }
        }
    });

    elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function ( $scope ) {

        var eae_slides = [];
        var eae_slides_json = [];
        var eae_transition;
        var eae_animation;
        var eae_custom_overlay;
        var eae_overlay;
        var eae_cover;
        var eae_delay;
        var eae_timer;
        var slider_wrapper = $scope.children('.eae-section-bs').children('.eae-section-bs-inner');

        if (slider_wrapper && slider_wrapper.data('eae-bg-slider')) {

            slider_images = slider_wrapper.data('eae-bg-slider');
            eae_transition = slider_wrapper.data('eae-bg-slider-transition');
            eae_animation = slider_wrapper.data('eae-bg-slider-animation');
            eae_custom_overlay = slider_wrapper.data('eae-bg-custom-overlay');
            if (eae_custom_overlay == 'yes') {
                eae_overlay = eae_editor.plugin_url + '/assets/lib/vegas/overlays/' + slider_wrapper.data('eae-bg-slider-overlay');
            } else {
                if (slider_wrapper.data('eae-bg-slider-overlay')) {
                    eae_overlay = eae_editor.plugin_url + '/assets/lib/vegas/overlays/' + slider_wrapper.data('eae-bg-slider-overlay');
                } else {
                    eae_overlay = eae_editor.plugin_url + '/assets/lib/vegas/overlays/' + slider_wrapper.data('eae-bg-slider-overlay');
                }
            }

            eae_cover = slider_wrapper.data('eae-bg-slider-cover');
            eae_delay = slider_wrapper.data('eae-bs-slider-delay');
            eae_timer = slider_wrapper.data('eae-bs-slider-timer');

            if (typeof slider_images != 'undefined') {
                eae_slides = slider_images.split(",");

                jQuery.each(eae_slides, function (key, value) {
                    var slide = [];
                    slide.src = value;
                    eae_slides_json.push(slide);
                });

                slider_wrapper.vegas({
                    slides: eae_slides_json,
                    transition: eae_transition,
                    animation: eae_animation,
                    overlay: eae_overlay,
                    cover: eae_cover,
                    delay: eae_delay,
                    timer: eae_timer,
                    init: function () {
                        if (eae_custom_overlay == 'yes') {
                            var ob_vegas_overlay = slider_wrapper.children('.vegas-overlay');
                            ob_vegas_overlay.css('background-image', '');
                        }
                    }
                });

            }
        }
    });

});

(function( $ ){

    $(window).on('elementor/frontend/init',function(){

        var ab_image = function($scope, $){
            ab_style = $scope.find('.eae-img-comp-container').data("ab-style");
            slider_pos = $scope.find('.eae-img-comp-container').data("slider-pos");
            if(ab_style == "horizontal"){
                horizontal($scope);
            }else{
               vertical();
            }

            function horizontal($scope) {
                var x, i, start_pos;
                /*find all elements with an "overlay" class:*/
                x = $scope.find(".eae-img-comp-overlay");
                start_pos = x.width();
                start_pos = start_pos * slider_pos /100;
                compareImages(x[0]);

                function compareImages(img) {
                    var slider, clicked = 0, w, h;
                    /*get the width and height of the img element*/
                    w = img.offsetWidth;
                    h = img.offsetHeight;
                    /*set the width of the img element to 50%:*/
                    img.style.width = start_pos + "px";
                    /*create slider:*/
                    slider = $scope.find(".eae-img-comp-slider");
                    slider = slider[0];
                    /*position the slider in the middle:*/
                    slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
                    slider.style.left = start_pos - (slider.offsetWidth / 2) + "px";
                    /*execute a function when the mouse button is pressed:*/
                    if(!$scope.hasClass('elementor-element-edit-mode')) {
                        slider.addEventListener("mousedown", slideReady);
                        //slider.addEventListener("mouseover", slideReady);
                        //img.addEventListener("mouseover", slideReady);

                        /*and another function when the mouse button is released:*/
                        window.addEventListener("mouseup", slideFinish);
                        //slider.addEventListener("mouseout", slideFinish);
                        //img.addEventListener("mouseout", slideFinish);
                        /*or touched (for touch screens:*/
                        slider.addEventListener("touchstart", slideReady);
                        /*and released (for touch screens:*/
                        window.addEventListener("touchstop", slideFinish);
                    }
                    function slideReady(e) {
                        /*prevent any other actions that may occur when moving over the image:*/
                        e.preventDefault();
                        /*the slider is now clicked and ready to move:*/
                        clicked = 1;
                        /*execute a function when the slider is moved:*/
                        window.addEventListener("mousemove", slideMove);
                        //window.addEventListener("mouseover", slideMove);
                        //window.addEventListener("touchmove", slideMove);
                        slider.addEventListener("touchmove", touchMoveaction);
                    }
                    function slideFinish() {
                        /*the slider is no longer clicked:*/
                        clicked = 0;
                    }
                    function slideMove(e) {
                        var pos;
                        /*if the slider is no longer clicked, exit this function:*/
                        if (clicked == 0) return false;
                        /*get the cursor's x position:*/
                        pos = getCursorPos(e);
                        /*prevent the slider from being positioned outside the image:*/
                        if (pos < 0) pos = 0;
                        if (pos > w) pos = w;
                        /*execute a function that will resize the overlay image according to the cursor:*/
                        slide(pos);
                    }

                    function touchMoveaction(e)
                    {
                        var pos;
                        /*if the slider is no longer clicked, exit this function:*/
                        if (clicked == 0) return false;
                        /*get the cursor's x position:*/
                        pos = getTouchPos(e);

                        /*prevent the slider from being positioned outside the image:*/
                        if (pos < 0) pos = 0;
                        if (pos > w) pos = w;
                        /*execute a function that will resize the overlay image according to the cursor:*/
                        slide(pos);
                    }

                    function getTouchPos(e) {
                        var a, x = 0;
                        a = img.getBoundingClientRect();

                        /*calculate the cursor's x coordinate, relative to the image:*/
                        x = e.changedTouches[0].clientX - a.left;
                         return x;
                    }

                    function getCursorPos(e) {
                        var a, x = 0;
                        e = e || window.event;
                        /*get the x positions of the image:*/
                        a = img.getBoundingClientRect();
                        /*calculate the cursor's x coordinate, relative to the image:*/
                        x = e.pageX - a.left;

                        /*consider any page scrolling:*/
                        //x = x - window.pageXOffset;
                        return x;
                    }
                    function slide(x) {
                        /*resize the image:*/
                        img.style.width = x + "px";
                        /*position the slider:*/
                        slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
                    }
                }
            }

            function vertical() {
                var x, i;
                /*find all elements with an "overlay" class:*/
                //x = document.getElementsByClassName("eae-img-comp-overlay");
                x = $scope.find(".eae-img-comp-overlay");
                start_pos = x.height();
                start_pos = start_pos * slider_pos /100;
                compareImages(x[0]);

                function compareImages(img) {
                    var slider, img, clicked = 0, w, h;
                    /*get the width and height of the img element*/
                    w = img.offsetWidth;
                    h = img.offsetHeight;
                    /*set the width of the img element to 50%:*/
                    img.style.height = start_pos + "px";
                    /*create slider:*/
                    slider = $scope.find(".eae-img-comp-slider");
                    slider = slider[0];
                    /*position the slider in the middle:*/
                    slider.style.top = start_pos - (slider.offsetHeight / 2) + "px";
                    slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
                    /*execute a function when the mouse button is pressed:*/
                    if(!$scope.hasClass('elementor-element-edit-mode')) {
                        slider.addEventListener("mousedown", slideReady);
                        /*and another function when the mouse button is released:*/
                        window.addEventListener("mouseup", slideFinish);
                        /*or touched (for touch screens:*/
                        slider.addEventListener("touchstart", slideReady);
                        /*and released (for touch screens:*/
                        window.addEventListener("touchstop", slideFinish);
                    }
                    function slideReady(e) {
                        /*prevent any other actions that may occur when moving over the image:*/
                        e.preventDefault();
                        /*the slider is now clicked and ready to move:*/
                        clicked = 1;
                        /*execute a function when the slider is moved:*/
                        window.addEventListener("mousemove", slideMove);
                        slider.addEventListener("touchmove", touchMoveaction);
                    }
                    function slideFinish() {
                        /*the slider is no longer clicked:*/
                        clicked = 0;
                    }
                    function slideMove(e) {
                        var pos;
                        /*if the slider is no longer clicked, exit this function:*/
                        if (clicked == 0) return false;
                        /*get the cursor's x position:*/
                        pos = getCursorPos(e)
                        /*prevent the slider from being positioned outside the image:*/
                        if (pos < 0) pos = 0;
                        if (pos > h) pos = h;
                        /*execute a function that will resize the overlay image according to the cursor:*/
                        slide(pos);
                    }

                    function getCursorPos(e) {
                        var a, x = 0;
                        e = e || window.event;
                        /*get the x positions of the image:*/
                        a = img.getBoundingClientRect();
                        /*calculate the cursor's x coordinate, relative to the image:*/
                        x = e.pageY - a.top;
                        /*consider any page scrolling:*/
                        x = x - window.pageYOffset;

                        return x;
                    }

                    function touchMoveaction(e)
                    {
                        var pos;
                        /*if the slider is no longer clicked, exit this function:*/
                        if (clicked == 0) return false;
                        /*get the cursor's x position:*/
                        pos = getTouchPos(e);

                        /*prevent the slider from being positioned outside the image:*/
                        if (pos < 0) pos = 0;
                        if (pos > h) pos = h;
                        /*execute a function that will resize the overlay image according to the cursor:*/
                        slide(pos);
                    }

                    function getTouchPos(e) {
                        var a, x = 0;
                        a = img.getBoundingClientRect();

                        /*calculate the cursor's x coordinate, relative to the image:*/
                        x = e.changedTouches[0].clientY - a.top;

                        //x = x - slider.offsetHeight;

                        return x;
                    }

                    function slide(x) {
                        /*resize the image:*/
                        img.style.height = x + "px";
                        /*position the slider:*/
                        slider.style.top = img.offsetHeight - (slider.offsetHeight / 2) + "px";
                    }
                }
            }
        }

        var ParticlesBG = function($scope, $){

            if($scope.hasClass('eae-particle-yes')){
                id = $scope.data('id');
                element_type = $scope.data('element_type');
                pdata = $scope.data('eae-particle');
                pdata_wrapper = $scope.find('.eae-particle-wrapper').data('eae-pdata');
                if(typeof pdata != 'undefined' && pdata != ''){
                    if($scope.find('.eae-section-bs').length > 0){
                        $scope.find('.eae-section-bs').after('<div class="eae-particle-wrapper" id="eae-particle-'+ id +'"></div>');
                        particlesJS('eae-particle-'+ id, pdata);
                    }
                    else{

                        if(element_type == 'column'){
                            $scope.find('.elementor-column-wrap').prepend('<div class="eae-particle-wrapper" id="eae-particle-'+ id +'"></div>');
                        }else{
                            $scope.prepend('<div class="eae-particle-wrapper" id="eae-particle-'+ id +'"></div>');
                        }

                        particlesJS('eae-particle-'+ id, pdata);
                    }


                }else if(typeof pdata_wrapper != 'undefined' && pdata_wrapper != ''){

                   // $scope.prepend('<div class="eae-particle-wrapper" id="eae-particle-'+ id +'"></div>');
                    //console.log('calling particle js else', JSON.parse(pdata_wrapper));
                    particlesJS('eae-particle-'+ id, JSON.parse(pdata_wrapper));
                }

            }

        };

        var EaePopup = function($scope, $){
            $preview_modal = $scope.find('.eae-popup-wrapper').data('preview-modal');
            $close_btn = $scope.find('.eae-popup-wrapper').data('close-btn');

           $magnific = $scope.find('.eae-popup-link').eaePopup({
                type: 'inline',

                disableOn: 0,

                key: null,

                midClick: false,

                mainClass: 'eae-popup eae-popup-'+$scope.find('.eae-popup-link').data('id'),

                preloader: true,

                focus: '', // CSS selector of input to focus after popup is opened

                closeOnContentClick: false,

                closeOnBgClick: true,

                closeBtnInside: $scope.find('.eae-popup-wrapper').data('close-in-out'),

                showCloseBtn: true,

                enableEscapeKey: false,

                modal: false,

                alignTop: false,

                removalDelay: 0,

                prependTo: null,

                fixedContentPos: 'auto',

                fixedBgPos: 'auto',

                overflowY: 'auto',

                closeMarkup: '<i class="eae-close '+ $close_btn +'"> </i>',

                tClose: 'Close (Esc)',

                tLoading: 'Loading...',

                autoFocusLast: true
            });

            if($preview_modal == 'yes'){
                if($scope.hasClass('elementor-element-edit-mode')) {
                    $scope.find('.eae-popup-link').click();
                }
            }
        };



        elementorFrontend.hooks.addAction( 'frontend/element_ready/wts-ab-image.default', ab_image);
        elementorFrontend.hooks.addAction( 'frontend/element_ready/global', ParticlesBG );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/wts-modal-popup.default', EaePopup );

        });

})(jQuery)


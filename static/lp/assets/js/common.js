$(function () {
	$('a[href*=\\#]:not([href=\\#])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
			if ($target.length) {
				if ($(this).parents('.menuBox').length) {
					setTimeout(function () {
						var targetOffset = $target.offset().top;
						$('html,body').animate({
							scrollTop: targetOffset
						}, 1000);
					}, 100);
				} else {
					var targetOffset = $target.offset().top;
					$('html,body').animate({
						scrollTop: targetOffset
					}, 1000);
				}
				return false;
			}
		}
	});
	
	$(window).resize(function(){
		$('.menuBox').outerHeight($(window).innerHeight());
	}).trigger('resize');
	
	var state = false;
	var scrollpos;

	$('.menu').on('click', function () {
		if (state == false) {
			scrollpos = $(window).scrollTop();
			$('body').addClass('fixed').css({
				'top': -scrollpos
			});
			$('.menu,.menuBox').addClass('active');
			state = true;
		} else {
			$('body').removeClass('fixed').css({
				'top': 0
			});
			window.scrollTo(0, scrollpos);
			$('.menu,.menuBox').removeClass('active');
			state = false;
		}
	});
    
    var currentSlide;
    
    if($('.comMv .mvInfo .slideUl').length){
        $('.comMv .mvInfo .slideUl').slick({
            centerMode: true,
            slidesToShow: 1,
            centerPadding: 0,
            variableWidth: true,
            slidesToScroll: 1,
            dots: false,
            pauseOnHover: false,
            autoplay: true,	
            fade: false,
            arrows: false,
            draggable: false,
            touchMove: false,
            autoplaySpeed: 4000,
        });

        $('.mvInfo .slideUl').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            $('.comMv .mvInfo .slideBox .txt').animate({opacity: 0}, 300, 'linear' ,function(){
                setTimeout(function(){
                   $('.comMv .mvInfo .slideBox .txt').animate({opacity: 1}, 300 , 'linear'); 
                },100);
            });
            $('.mvInfo .slideUl .slick-slide:not([data-slick-index='+ nextSlide +'])').find('li').removeClass('show').delay(800).removeClass('leave');
            $('.mvInfo .slideUl .slick-slide[data-slick-index='+ nextSlide +']').find('li').addClass('show');
        });

        var timer01 = setTimeout(function(){
            currentSlide = $('.comMv .mvInfo .slideUl').slick('slickCurrentSlide');
            $('.mvInfo .slideUl .slick-slide[data-slick-index='+ currentSlide +']').find('li').addClass('leave');
        },3500);
        
        var timer02;

        $('.mvInfo .slideUl').on('afterChange', function(event, slick, currentSlide){
            timer02 = setTimeout(function(){
                $('.mvInfo .slideUl .slick-slide[data-slick-index='+ currentSlide +']').find('li').addClass('leave');
            },3500);
        });

        $('.comMv .mvInfo .arrow li.next').click(function(){
            currentSlide = $('.comMv .mvInfo .slideUl').slick('slickCurrentSlide');
            $('.mvInfo .slideUl .slick-slide[data-slick-index='+ currentSlide +']').find('li').addClass('leave');
            setTimeout(function(){
                $('.comMv .mvInfo .slideUl').slick('slickNext');
            },500);
        });

        $('.comMv .mvInfo .arrow li.prev').click(function(){
            currentSlide = $('.comMv .mvInfo .slideUl').slick('slickCurrentSlide');
            $('.mvInfo .slideUl .slick-slide[data-slick-index='+ currentSlide +']').find('li').addClass('leave');
            setTimeout(function(){
                $('.comMv .mvInfo .slideUl').slick('slickPrev');
            },500);
        });
        
        $('.comMv .mvInfo .slideUl li .link').on('click', function() {
            $.fancybox.open( $('#pop'), {
                touch: false,
                afterLoad : function(instance, current) {
                    currentSlide = $('.comMv .mvInfo .slideUl').slick('slickCurrentSlide');
                    $('.comMv .mvInfo .slideUl').slick('slickPause');
                    $('.popBox .slideUl').slick('setPosition');
                    $('.popBox .slideUl').slick('slickGoTo',currentSlide);
                    $('.popBox .slideUl').slick('slickPlay');
                    clearTimeout(timer01);
                    clearTimeout(timer02);
                },
                afterClose : function(){
                    $('.comMv .mvInfo .slideUl').slick('slickPlay');
                    $('.popBox .slideUl').slick('slickPause');
                    timer01 = setTimeout(function(){
                        currentSlide = $('.comMv .mvInfo .slideUl').slick('slickCurrentSlide');
                        $('.mvInfo .slideUl .slick-slide[data-slick-index='+ currentSlide +']').find('li').addClass('leave');
                    },3500);
                }
            });
            return false;
        });
    }
    
    if($('.popBox').length){
        $('.popBox .slideUl').slick({
            centerMode: false,
            slidesToShow: 1,
            centerPadding: 0,
            variableWidth: false,
            slidesToScroll: 1,
            dots: false,
            pauseOnHover: false,
            autoplay: false,	
            fade: true,
            arrows: true,
            prevArrow: '.popBox .arrow li.prev',
            nextArrow: '.popBox .arrow li.next'
        });
        $('.popBox .popInner .close a').click(function(){
            parent.jQuery.fancybox.getInstance().close();
            return false;
        });  
    }

	if($('.fixBanner').length){
		$('.fixBanner .close').on('click', function () {
			$('.fixBanner').hide();
			return false;
		});
	}
});

$(window).on('load', function () {
	var localLink = window.location + '';
	if (localLink.indexOf("#") != -1 && localLink.slice(-1) != '#') {
		localLink = localLink.slice(localLink.indexOf("#") + 1);
		$('html,body').animate({
			scrollTop: $('#' + localLink).offset().top
		}, 500);
	}
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

var getEnvironment = function getEnvironment() {
    const path = window.location.origin;
    let env = '';
    if (path.indexOf('dev.spot-write.com') != -1) {
        env = 'dev';
    } else if (
        path.indexOf('stg.spot-write.com') != -1 ||
        path.indexOf('stg-admin.syarala.jp') != -1
    ) {
        env = 'stg';
    } else if (path.indexOf('spot-write.com') != -1) {
        env = 'prod';
    } else {
        env = 'local';
    }
    let apiPath = '';
    switch (env) {
        case 'dev':
        apiPath = 'https://dev-api.spot-write.com/';
        break;
        case 'stg':
        apiPath = 'https://stg-api.spot-write.com/';
        break;
        case 'prod':
        apiPath = 'https://api.spot-write.com/';
        break;
        default:
        apiPath = 'http://localhost/';
        break;
    }
    return apiPath;
};
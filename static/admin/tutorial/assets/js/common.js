$(function(){
	$('a[href*=\\#]:not([href=\\#])').click(function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				if($(this).parents('.menuBox').length){
					setTimeout(function(){
						var targetOffset = $target.offset().top;
						$('html,body').animate({scrollTop: targetOffset}, 1000);
					},100);
				}else{
					var targetOffset = $target.offset().top;
					$('html,body').animate({scrollTop: targetOffset}, 1000);
				}
				return false;
			}
		}
	});
	$('.comInnerUl li .comInner').matchHeight();
	$('.comInnerUl li .comInner .txt').matchHeight();
    
    $('.scroll-pane').each(function(){
        $(this).jScrollPane({
            autoReinitialise: true,
        });
        var api = $(this).data('jsp');
        var throttleTimeout;
        $(window).bind('resize',function(){
            if (!throttleTimeout) {
                throttleTimeout = setTimeout(function(){
                    api.reinitialise();
                    throttleTimeout = null;
                },50);
            }
        });
    });
    $('.prevLink a').click(function(){
        history.back();
        return false;
    })
});


$(window).on('load',function(){
	var localLink = window.location+'';
	if(localLink.indexOf("#") != -1 && localLink.slice(-1) != '#'){	
		localLink = localLink.slice(localLink.indexOf("#")+1);
		$('html,body').animate({scrollTop: $('#'+localLink).offset().top}, 500);
	}
});
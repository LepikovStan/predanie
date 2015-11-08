(function($){

	$(function() {
        $('.aside-menu .text').on('click', function(e) {
            $('.aside-menu .expanded').removeClass('expanded');
            $(e.target).closest('li').addClass('expanded')
        });
		
		$('.callback a').on('click', function(e) {
			$('.popup').addClass('show');
		
			return false;
		});
		
		$('.popup-close, .popup-substrate').on('click', function() {
			$('.popup').removeClass('show');
		});
		
		var bannerCounter = 0,
			bannerItemLength = $('.slides .slide').length;
			
		function changeCounter() {
			if (bannerCounter >= bannerItemLength - 1) {
                bannerCounter = 0;
            } else {
				bannerCounter = bannerCounter + 1;
			}
        }
		function hideBanner() {
            $('.slides .slide:eq('+bannerCounter+')')
                .animate({
                    left: -$('.slides').width()
                }, 500);
        }
        function showBanner() {
            $('.slides .slide:eq('+bannerCounter+')')
                .css({ left: $('.slides').width() })
                .animate({
                    left: 0
                }, 500);
        }
		function changeBannerPager() {
            $('.banners .pag-item').removeClass('active');
            $('.banners .pag-item:eq('+bannerCounter+')').addClass('active');
        }
		function slideBanner() {
            hideBanner();
            changeCounter();
            showBanner();
            changeBannerPager();
        }
		
		setInterval(slideBanner, 5000)
	});

})(jQuery,undefined)
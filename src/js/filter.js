(function($) {

	$(function() {

		$('.js-showMaster').click(function() {

		var master = $('#master');

		master.toggleClass('anm-master o-100 z-999');

		});

		$('.master-filter h3').each(function() {
			
			$(this).click(function() {
				var sibling = $(this).next('div');

				sibling.slideToggle();
			});

		});		

	});

})(jQuery);

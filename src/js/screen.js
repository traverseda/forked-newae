require('./drawer');
require('./polyfill.min');
require('./filter');
require('./search');

(function($) {

	$(function() {
    var nav = $('#nav'),
        drawer = $('#drawer'),
        drawerInner = drawer.find('div').first(),
        navH = nav.outerHeight();

    $('body').addClass('ready');

    $(window).scroll(function(e) {
      var fromTop = $(window).scrollTop();

      if($(window).scrollTop() > navH) {
        nav.addClass('anm-nav--on');
        nav.css('transform', 'translateY(-5.75em)');
        drawerInner.css('padding-top', '3.25em');

      } else {
        nav.removeClass('anm-nav--on');
        nav.css('transform', 'translateY(0em)');
        drawerInner.css('padding-top', '8.5em');

      }
    });

	});

})(jQuery);

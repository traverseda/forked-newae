(function($) {

  $(function() { 
    $('body').on('click', '[data-action=drawer], #drawer-overlay', function(e) {
      e.preventDefault();
      e.stopPropagation();

      toggleOverlay();
      toggleDrawer();

    });

    $('[data-core]').click(function(e) {
      e.preventDefault();

      var pk = $(this).data('core');
      var mount = $('#core-mount');

      $.post("/core/" + pk + '/', function(data) {
        mount.html(function() {
          return data;
        });
      })
        .done(function(data) {
          setTimeout(function() {
            toggleDrawer();
            toggleOverlay();
          }, 300);
        })
        .fail(function(data) {
          console.warn(data.responseText)
        })
        .always(function() {

        });

    });

    function toggleOverlay(override) {
      var drawerOverlay = $('#drawer-overlay');
      var t = (override != null) ? override : drawerOverlay;
      t.toggleClass('absolute--fill click-through o-20 o-0');

    }

    function toggleDrawer(override) {
      var drawer = $('#drawer');
      var t = (override != null) ? override : drawer;
      t.toggleClass('anm-drawer--on');

    }

  });

})(jQuery);

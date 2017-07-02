(function($) {

  $(function() {

    var body = $('body');
    var search = $('[data-action=open-search], [data-action=search]');
    var toggle = $('[data-action=toggle-search]');
    var input = $('[name=device-search]');
    var results = $('#search');
    var mount = $('#search-results');

    function toggleSearch() {
      body.toggleClass('overflow-y-hidden');
      results.toggleClass('click-through o-0 o-100 z-negative z-999');
    }

    body.on('click', function(e) {
      if(results.hasClass('click-through') == false) {
        toggleSearch();
      }
    });

    search.on('click', function(e) {
      e.stopPropagation();

      if(results.hasClass('click-through') == true) {
        toggleSearch();
      }

    });

    toggle.on('click', toggleSearch);

    input.on('change keypress blur', function(e) {
      setTimeout(function() {
        if(e.target.value.length < 1) {
          mount.addClass('dn');

        } else {
          var query = "q=" + e.target.value;

          if(!isNaN(e.target.value)) {
            query = "q=+pk:" + e.target.value;
          }

          $.post("/devices/?" + query, function(data) { 
            mount.html(function() {
              return data;
            });
          })
            .done(function(data) {
              mount.removeClass('dn');
            })
            .fail(function(data) {
              console.warn(data.responseText)
            })
        }

      }, 200);

    });

    results.click(function(e) {
      e.stopPropagation();
    });

  });

})(jQuery);

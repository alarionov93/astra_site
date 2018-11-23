;

document.onreadystatechange = function() {
	if (document.readyState == "complete") {
		$("i.hide-icon").css("visibility", "hidden");
	}
}

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function toggleFarmerDescription(farmerId) {
	disableScroll();
	event.stopPropagation();
	event.stopImmediatePropagation();
  $("#farmer-description"+farmerId).slideToggle();
  $("#farmer-description"+farmerId).toggleClass("shown");
	enableScroll();
}

function hideFarmerDescription(farmerId) {
	disableScroll();
	event.stopPropagation();
	event.stopImmediatePropagation();
	$("#farmer-description"+farmerId).slideUp();
	$(event.target).hide();
	$(event.target).siblings("i.show-icon").show();
	enableScroll();
}

$(document).ready(function() {
    $('.farmer-header-o').each(function(evt, elem) {
        $(this).on('click', function(evt, elem) {
          var self = this;
          var t = setTimeout(function() {
            $(self).parents().siblings('.farmer-description').stop(true, true).slideToggle(200);
            var icons = $(self).parents().siblings('#icons-block').find('i.fa');
            $(icons).each(function() {
              $(this).toggleClass('hidden-icon');
            });
          }, 200);

        });
    });
    $('.icons-block').each(function(evt, elem) {
        $(this).on('click', function(evt, elem) {
          var self = this;
          var t = setTimeout(function() {
            $(self).siblings('.farmer-description').stop(true, true).slideToggle(200);
            var icons = $(self).children();
            $(icons).each(function() {
              $(this).toggleClass('hidden-icon');
            });
          }, 200);
        });
    });
});
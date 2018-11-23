/**
 * Created by sanya on 17.03.16.
 */

;

ymaps.ready(init);
var myMap, placemark;

var coord1 = [57.999544, 56.301705];
var coord2 = [58.068200, 56.344613];

function init(){     
    myMap = new ymaps.Map("gmap", {
        center: [57.999544, 56.301705],
        zoom: 18
    });
    placemark = new ymaps.Placemark([57.999544, 56.301705], { hintContent: 'Автозапчасти', balloonContent: 'Ускоритель' });
    myMap.geoObjects.add(placemark);
}

function switchPlacemarks(placemark_coords) {
	var zoom = 18;
	myMap.setCenter(placemark_coords);
	myMap.setZoom(zoom);
	placemark = new ymaps.Placemark(placemark_coords, { hintContent: 'Автозапчасти', balloonContent: 'Ускоритель' });
    myMap.geoObjects.add(placemark);
    $('html, body').animate({
        scrollTop: $("#gmap").offset().top - 300
    }, 500);
}



function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + encodeURIComponent(value) + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

function all(a) {
	if (Array.isArray(a) == false) return false;
	if (a.length < 1) return false;
	for (var i = 0; i < a.length; i++) {
		if (typeof a[i] == "undefined") { // | a[i] == 0
			return false;
		}
	}
	return true;
}

function scroll(url)
{
	var url = window.location.hash; // вычисляем текущий якорь
	if (url) {
		var position_block = $(url).offset().top - 100; // получаем значение на сколько он далеко от вверха страницы
		$('body,html').animate({scrollTop: position_block}, 800); // опускаемся до нущного блока со скоростью 800
	}
	return false;
}	
	
UVM = new UViewModel();
ko.applyBindings(UVM);
UVM.waiter.show();

Date.prototype.toUserString = function () {
	var strDate = this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
	return strDate;
};

function replaceHeaderLogoWithLink() {
	var logoElem = $("#mainNav").find('#header-logo').children('a#full');
	var mobileElem = $("#mainNav").find('#header-logo').children('a#mobile');
	if (window.innerWidth < 768) {
		$(logoElem).css('display', 'none');
		$(mobileElem).css('display', 'block');
		$("#mainNav").find('#header-logo').css('margin-top', '10px');
	} else {
		$("#mainNav").find('#header-logo').css('margin-top', '0');
		$(mobileElem).css('display', 'none');
		$(logoElem).css('display', 'block');
	}
}

function deactivateCatNavLinks() {
	$("#categories-list").find("a").each(function() {
		$(this).css("font-weight", 400);
		$(this).css("background", "#fff");
	});
}

// TODO: jQuery extending example
jQuery.expr.filters.onscreen = function(el) { // only by height !
  var rect = el.getBoundingClientRect();
  return (rect.bottom > 100) && (rect.top > -rect.height && rect.top < window.innerHeight);
};

$(document).ready(function() {

	// String.prototype.includes = function(symbol) {
 //        var includes = false;
 //        for (var i = 0; i < this.length; i++) {
 //            if (this[i] == symbol) {
 //                includes = true;
 //            } 
 //        }
 //        return includes;
 //    };

  //   String.prototype.includesString = function(string) {
		// var includes = false;
  //       for (var i = 0; i < this.length; i++) {
  //       	for (var j = 0; j < string.length; j++) {
  //       		if (this[i] == ) {
	 //                includes = true;
	 //            } 
  //       	}
  //       }
  //       return includes;
  //   }
  	// $('#slider1').slick();
 //  	$('#slider1').slick({
	//   slidesToShow: 1,
	//   slidesToScroll: 1,
	//   arrows: false,
	//   fade: true,
	//   asNavFor: '#slider1-nav'
	// });
	// $('#slider1-nav').slick({
	//   slidesToShow: 3,
	//   slidesToScroll: 1,
	//   asNavFor: '#slider1',
	//   dots: true,
	//   centerMode: true,
	//   focusOnSelect: true
	// });

    String.prototype.startsWith = function(substr) {
    	var startsWith = false;
    	for (var i = 0; i < substr.length; i++) {
    		if(this[i] === substr[i]) {
    			startsWith = true;
    		} else {
    			startsWith = false;
    			break;
    		}
    	}
    	return startsWith;
    };

	if(window.location.hash.length > 0 && window.location.hash === "#feedback_form") {
		// $(document).ajaxComplete(function() {
		// 	$(document).scrollTop($(document).innerHeight());			
		// });
		scroll('#feedback_form');
	}
	if (window.location.href.includes('?query=')) {
		var query = decodeURIComponent(window.location.search.split('?query=')[1]);

		UVM.userQuery(query);
		UVM.getSearchResults();
	}
	replaceHeaderLogoWithLink();
	$('#cat-nav').affix({
	  offset: {
	    top: 470
	  }
	});

	$(document).on("scroll", function() {
		if ($(window).scrollTop() > 575 & $(window).innerWidth() > 760) {
			$("#categories-menu").css('position', 'fixed');
			$("#categories-menu").css('width', '20%');
			$("#categories-menu").css('top', '20px');
		} else {
			$("#categories-menu").css('position', '');
			$("#categories-menu").css('width', '');
			$("#categories-menu").css('top', '');
		}
	});

	$(document).on("click", ".cat-scroll", function() {
		var href = $(this).children("a").attr("href");
		deactivateCatNavLinks();
		$('body').animate({
			scrollTop: $(href).offset().top - $("#cat-nav").outerHeight()
		}, 500);
		$(this).children("a").css("font-weight", 600);
	});

	$(document).on("click", "#toTop", function() {
		$('body').animate({
			scrollTop: 0
		}, 500);
	});
	$(window).resize(function() {
		replaceHeaderLogoWithLink();
		// (window.innerWidth);
	});

	$(".fit-width").on("click", function(elem, event) {
		console.log(this);
	});
});

$(function() {
        
  $('.list-group-item').on('click', function() {
    $('.glyphicon', this)
      .toggleClass('glyphicon-chevron-right')
      .toggleClass('glyphicon-chevron-down');
  });

});
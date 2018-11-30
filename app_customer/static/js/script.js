/**
 * Created by sanya on 17.03.16.
 */

;

// ymaps.ready(init);
// var myMap, placemark;

// var coord1 = [57.999544, 56.301705];
// var coord2 = [58.068200, 56.344613];

// function init(){     
//     myMap = new ymaps.Map("gmap", {
//         center: [57.999544, 56.301705],
//         zoom: 18
//     });
//     placemark = new ymaps.Placemark([57.999544, 56.301705], { hintContent: 'Автозапчасти', balloonContent: 'Ускоритель' });
//     myMap.geoObjects.add(placemark);
// }

// function switchPlacemarks(placemark_coords) {
// 	var zoom = 18;
// 	myMap.setCenter(placemark_coords);
// 	myMap.setZoom(zoom);
// 	placemark = new ymaps.Placemark(placemark_coords, { hintContent: 'Автозапчасти', balloonContent: 'Ускоритель' });
//     myMap.geoObjects.add(placemark);
//     $('html, body').animate({
//         scrollTop: $("#gmap").offset().top - 300
//     }, 500);
// }



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

// TODO: jQuery extending example
jQuery.expr.filters.onscreen = function(el) { // only by height !
  var rect = el.getBoundingClientRect();
  return (rect.bottom > 100) && (rect.top > -rect.height && rect.top < window.innerHeight);
};

$(document).ready(function() {

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
});
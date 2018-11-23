;

$(document).ready(function() {
	$('.question-header').each(function(evt, elem) {
		$(this).on('click', function(evt, elem) {
	        $(this).next('.question-description').slideToggle();
	        var icons = $(this).children().find('i.fa');
	        $(icons).each(function() {
	        	$(this).toggleClass('hidden-icon');
	        });
	        // $(this).children().find('i.shown-icon').addClass('hidden-icon'); 
		});
	});
});
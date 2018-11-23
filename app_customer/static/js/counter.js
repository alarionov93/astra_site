;

function reverseCounter() {
	var date = new Date();
	var timestamp = date.getTime();
	var dateOfOpen = new Date(2016, 8, 15);
	var openTimestamp = dateOfOpen.getTime();
	var timestampDifference = parseInt(openTimestamp) - parseInt(timestamp);
	var seconds = Math.floor(timestampDifference / 1000);
	var days = Math.floor((seconds % 31536000) / 86400);
	var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	var minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	var seconds = (((seconds % 31536000) % 86400) % 3600) % 60;

	console.log();
	$("#date-container").empty();
	$("#date-container").append(days + " дней " + hours + " часов " + minutes + " минут " + seconds + " секунд");
}

var interval = setInterval(reverseCounter, 1000);

SVM = new SubscribeViewModel();
ko.applyBindings(SVM);
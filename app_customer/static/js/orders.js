;

document.onreadystatechange = function() {
	if (document.readyState == "complete") {
		VM.customer.isAuthenticated.subscribe(function() {
			VM.getOrderHistory(); //TODO: maybe this solution is a piece of shit
		});
	}
}
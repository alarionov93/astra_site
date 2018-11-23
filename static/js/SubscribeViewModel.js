;

function SubscribeViewModel() {
	var self = this;
	// IMPORTANT ! field of VM used in <!-- ko if: --> should be observable, not just js variable!!
	this.showErr = ko.observable(false);
	this.phone = ko.observable();
	this.email = ko.observable();

	this.phone.isValid = ko.computed(function() {
		var p = self.phone();
        return !!p && typeof p !== "undefined"
        && p.length !== 0 && p.length > 6 && p.match(/\D/i) == null;
	});

	this.email.isValid = ko.computed(function() {
		var e = self.email();
        return !!e && typeof e !== "undefined"
        && e.length >= 5 && e.includes("@");
	});

	this.isValid = ko.computed(function() {
		return !! self.phone.isValid() | self.email.isValid();
	});

	$("#subscribe-form").on("submit", function() {
		if(!self.isValid()) {
			event.preventDefault();
			self.showErr(true);
		}
		// console.log(event);
	});
}
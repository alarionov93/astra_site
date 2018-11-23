;

$settings = new Settings();

function UViewModel() {

	var self = this;
    self.waiter = new Waiter();
	self.customer = ko.observable({});
    self.customer.phone = ko.observable('');
    self.customer.email = ko.observable('');
    self.customer.firstName = ko.observable('');
    self.customer.lastName = ko.observable('');
    self.customer.address = ko.observable('');
    self.customer.lastLogin = ko.observable('');
    self.customer.isAuthenticated = ko.observable(false);
    self.customerVoted = ko.observable(false);
    self.customer.agreed = ko.observable(true);
    self.userQuery = ko.observable('');

    self.products = ko.observableArray();
    self.endpointCategories = ko.observableArray([]);

    // paginator
    self.nbPerPage = ko.observable(50);
    self.nbPerPageVariants = [10, 25, 50, 100];
    self.pageNumber = ko.observable(0);
    self.totalPages = ko.computed(function() {
        var div = Math.floor(self.products().length / self.nbPerPage());
        div += self.products().length % self.nbPerPage() > 0 ? 1 : 0;
        return div - 1;
    });
    
    self.paginatedProducts = ko.computed(function() {
        var first = self.pageNumber() * self.nbPerPage();
        return self.products.slice(first, first + self.nbPerPage());
    });
    self.hasPrevious = ko.computed(function() {
        return self.pageNumber() !== 0;
    });
    self.hasNext = ko.computed(function() {
        return self.pageNumber() !== self.totalPages();
    });
    self.next = function() {
        if(self.pageNumber() < self.totalPages()) {
            self.pageNumber(self.pageNumber() + 1);
        }
    }
    self.previous = function() {
        if(self.pageNumber() != 0) {
            self.pageNumber(self.pageNumber() - 1);
        }
    }

    self.firstShow = ko.observable(true);
    
    self.settings = ko.observable({});

    self.feedbackText = ko.observable('');

    self.categoryTabHeading = ko.observable('Featured');

    self.customer.phone.isValid = ko.computed(function() {
        var p = self.customer.phone();
        return !!p && typeof p !== "undefined"
        && p.length !== 0 && p.length > 6 && p.match(/\D/i) == null;
    });
    self.customer.email.isValid = ko.computed(function() {
        var e = self.customer.email();
        return !!e && typeof e !== "undefined"
        // TODO: replace includes for IE !!
        && e.length !== 0 && e.includes("@");
    });
    self.feedbackText.isValid = ko.computed(function() {
        var e = self.feedbackText();
        return !!e && typeof e !== "undefined"
        && e.length !== 0 && e.length < 500 && e.length > 2;
    });

    self.customer.firstName.isValid = ko.computed(function() {
        var e = self.customer.firstName();
        return !!e && typeof e !== "undefined"
        && e.length !== 0 && e.length < 500 && e.length > 2;
    });
    self.customer.lastName.isValid = ko.computed(function() {
        var e = self.customer.lastName();
        return !!e && typeof e !== "undefined"
        && e.length !== 0 && e.length < 500 && e.length > 2;
    });

	self.updateSettings = function() {
        $.get($settings.urls.settings).then(function (resp) {
            console.log(resp);
            var fullName = '';
            if(resp["customer_email"]) {
                self.customer.email(resp["customer_email"]);
                self.customer.isAuthenticated(true);
                if (self.customer.isAuthenticated()) {

                }
            }
            if(resp["customer_phone"]) {
                // TODO: use this style all around the javascript code !!
                self.customer.phone(resp["customer_phone"]);
                if (self.customer.isAuthenticated()) {

                }
            }
            if(resp["first_name"]) {
                // TODO: use this style all around the javascript code !!
                self.customer.firstName(resp["first_name"]);
            }
            if(resp["last_name"]) {
                // TODO: use this style all around the javascript code !!
                self.customer.lastName(resp["last_name"]);
            }
            fullName = self.customer.firstName() + ' ' + self.customer.lastName();
            if(fullName.length > 0) {
                if (self.customer.isAuthenticated()) {

                }
            }
            if(resp["last_login"]) {
                // TODO: use this style all around the javascript code !!
                self.customer.lastLogin(resp["last_login"]);
            }
            if(resp["address"]) {
                // TODO: use this style all around the javascript code !!
                self.customer.address(resp["address"]);
            }

            if(resp.settings) {
        		if (!all([resp["settings"]["admin_email"], resp["settings"]["shop_email"], resp["settings"]["site_name"],
					resp["settings"]["c_site_name"], resp["settings"]["company_addresses"], resp["settings"]["company_phone"]
        			])) {
                    console.error("Check all required settings in site settings");
        		}
                $settings.addSetting("adminEmail", resp["settings"]["admin_email"]);
                $settings.addSetting("shopEmail", resp["settings"]["shop_email"]);
                $settings.addSetting("siteName", resp["settings"]["site_name"]);
                $settings.addSetting("cSiteName", resp["settings"]["c_site_name"]);
                $settings.addSetting("company_addresses", resp["settings"]["company_addresses"]);
                $settings.addSetting("company_phones", resp["settings"]["company_phones"]);
            }

            if(resp["settings"]["min_order_sum"]) {
                $settings.addSetting("minOrderSum", resp["settings"]["min_order_sum"]);
            }

            if (resp.status == 0) {

            } else {
                console.log("Error:" + resp.status);                    
            }
        }).always(function() {
            $settings.isConfigured(true);
            self.settings($settings);
            self.waiter.hide();
        });
    };

    self.updateSettings();

    self.sendFeedback = function() {
        return function() {
            self.firstShow(false);
            if (self.feedbackText.isValid() && self.customer.email.isValid() && self.customer.firstName.isValid()) {
                var token = $('input[name*=csrf]').val();
                $.post($settings.urls.feedback, {
                    feedback: self.feedbackText(),
                    phone: self.customer.phone(),
                    firstName: self.customer.firstName(),
                    email: self.customer.email(),
                    agreed: self.customer.agreed(),
                    csrfmiddlewaretoken: token}).then(function (resp) {
                    // self.showResponse(true); // for form to be invisible, to show only msg or err!!
                    console.log(resp.status);
                    if (resp.status == 0) {
                        console.log(resp);
                        $("#msg").text(resp.success);
                        // self.hideFeedbackForm();
                        // self.customer.email('');
                        self.feedbackText('');
                        self.firstShow(true);
                        // self.customerVoted(true);
                        // self.showResponse(false);
                    } else if (resp.status == 3) {
                        $("#msg").text(resp.success);
                        // self.customer.email('');
                        self.feedbackText('');
                        // self.customerVoted(true);
                        // self.showResponse(false);
                    } else {
                        $("p#err").empty();
                        $("p#err").append("Ошибка сервера, повторите попытку позже.");
                        // self.showResponse(false);
                    }
                }).always();
            }
        }
    };

    self.getRandProducts = function() {
        var token = $('input[name*=csrf]').val();
        $.post($settings.urls.randProducts, {csrfmiddlewaretoken: token}).then(function (resp) {
            console.log(resp);
            if (resp) {
                self.products.removeAll();
                for (var i = 0; i < resp.length; i++) {
                    self.products.push(resp[i]);
                }
            }
        }).always(function() {
            self.categoryTabHeading('Популярные товары');
            self.waiter.hide();
        });
    };
    self.getRandProducts();

    self.getSearchResults = function() {
        self.waiter.show();
        var newUrl = updateQueryStringParameter(window.location.href, "query", self.userQuery());
        window.history.pushState({path: newUrl},'',newUrl);
        if (1) {
            var token = $('input[name*=csrf]').val();
            $.post($settings.urls.search.getRes, {
                query: self.userQuery(),
                csrfmiddlewaretoken: token}).then(function (resp) {
                    // console.log(resp.status);
                // if (resp.status == 0) {
                    console.log(resp);
                    self.products.removeAll();
                    for (var i = 0; i < resp['search_results'].length; i++) {
                        for (var prop in resp['search_results'][i]) {
                            self.products.push(resp['search_results'][i][prop]);
                        }
                    }
                    self.userQuery(resp['fixed_query']);
                // } else {
                    // $("p#err").empty();
                    // $("p#err").append("Ошибка сервера, повторите попытку позже.");
                // }
            }).always(function() {
                self.categoryTabHeading('Результаты поиска');
                self.waiter.hide();
            });
        }
    }

    self.getCategoriesDict = function() {
        self.waiter.show();
        $.get($settings.urls.categories.getDict).then(function (resp) {
            console.log(resp);
            if (resp) {
                $(".just-padding").empty();
                $(".just-padding").append('<ul id="ul_cat-list" onclick="hideshow(\'ul_cat-list\');">');
                // resp = {
                //     'fgfg fg': {
                //         'аываы': {
                //             'п': 'a', 
                //             'ж': 'b',
                //             'х': 'c'
                //         },
                //         'ghfdhd': {
                //             'б': 'a', 
                //             'д': 'b',
                //             'с': 'c'
                //         }
                //     }, 
                //     2: 'd',
                //     3: 'e'
                // };
                self.getCategoryContents(resp, 'cat-list', 0);
            }
        }).always(function() {
            self.waiter.hide();
        });
    }();

    // self.getCategoryContents = function(cat_obj, div) {
    //     var self = this;
    //     self.waiter.show();
    //     var end_rec = false;
    //     for (var prop in cat_obj) {
    //         end_rec = false; // ! important line
    //         var cat_id = '';
    //         if (typeof cat_obj[prop] == 'string') {
    //             end_rec = true;
    //             cat_id = cat_obj[prop];
    //         }

    //         var cat_id_tmp = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    //         var div_id_tmp = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    //         // console.log(cat_id_tmp);
    //         // $("#" + div.replace(" ", "")).append('<div style="padding-left:10px; color:#000;" id="' + prop.replace(" ", "") + '">' + prop + '</div>');
    //         var div_id = prop.replace(/\s/g, '_');
    //         // console.log(cat_id_tmp);
    //         $("#" + div.replace(/\s+/g, '')).append('<div id="' + cat_id_tmp + '">' + prop + '</div><div id="'++'"></div>');
    //         if (end_rec) {
    //             // TODO: append link to goods in category...
    //             var cat_obj_id = cat_obj[prop];
    //             var cat = {};
    //             cat["id"] = cat_obj_id;
    //             cat["name"] = prop;
    //             self.endpointCategories.push(cat);
    //             $("div#" + cat_id_tmp).attr("onclick","javascript: UVM.getCategoryProducts('" + cat_obj[prop] + "')");
    //             $("div#" + cat_id_tmp).children("i").remove();
    //             // console.log(cat_obj[prop]);
    //             // n += 1;
    //         } else {
    //             $('#' + div.replace(/\s+/g, '')).click(function(){
    //               $('#' + cat_id_tmp).animate({
    //                 opacity: 0.25,
    //                 left: "+=50",
    //                 height: "toggle"
    //               }, 500, function() {
    //                 // Animation complete.
    //               });
    //             });
    //             self.getCategoryContents(cat_obj[prop], cat_id_tmp) //prop
    //         }
    //     }
    //     self.waiter.hide();
    //     return end_rec;
    // }

    self.getCategoryContents = function(cat_obj, div, n) {
        for (prop in cat_obj) {
            var x = cat_obj[prop];
            var prop_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
            $("#ul_" + div).append('<li id="li_' + prop_id + '">' + prop + '</li>');
            if (typeof x != 'string') {
                $('#li_'+prop_id).append('<ul id="ul_' + prop_id + '"></ul>');
                $('#li_'+prop_id).attr("onclick", "javascript: hideshow(\'li_" + prop_id + "\');");
                self.getCategoryContents(x, prop_id, n+1);
            } else {
                var cat_obj_id = cat_obj[prop];
                var cat = {};
                cat["id"] = cat_obj_id;
                cat["name"] = prop;
                self.endpointCategories.push(cat);
                // $('#li_'+prop_id).attr("onclick", "javascript: hideshow(\'li_" + prop_id + "\');");
                $("#li_" + prop_id).attr("onclick","javascript: UVM.getCategoryProducts('" + cat_obj[prop] + "', event)");
                // $("#" + prop_id).children("i").remove();
            }
        }
        if (n == 0){
            $("#ul_cat-list > li ul").css("display", "none");
        }
    };

    self.endpointCategories.find = function(cat_id) {
        // console.log("Find:");
        // console.log(typeof cat_id);
        for (var i = 0; i < self.endpointCategories().length; i++) {
            // console.log(self.endpointCategories()[i]);
            if (parseInt(self.endpointCategories()[i]["id"]) === parseInt(cat_id)) {
                return self.endpointCategories()[i];
            }
        }
        return 0;
    }

    self.getCategoryProducts = function(cat_id, evt) {
        self.waiter.show();
        evt.preventDefault();
        var newUrl = window.location.origin + window.location.pathname;
        window.history.pushState({path: newUrl},'',newUrl);
        self.userQuery('');
        console.log(cat_id);
        $.get($settings.urls.categories.getProducts + '' + cat_id + '/').then(function (resp) {
            console.log(resp);
            if (resp) {
                self.products.removeAll();
                for (var i = 0; i < resp.length; i++) {
                    self.products.push(resp[i]);
                }
            }
        }).always(function() {
            var curCat = {};
            if (curCat = self.endpointCategories.find(cat_id)) {
                self.categoryTabHeading('Товары в категории '+curCat["name"]);
            } else {
                self.categoryTabHeading('Товары');
            }
            self.waiter.hide();
        });
    }
};

function hideshow(id) {
    console.log(id);
    this.event.stopPropagation();
    $('#' + id + ' > ul').animate({
        left: "+=50",
        height: "toggle"
    }, 200, function() {
        // Animation complete.
    });
}



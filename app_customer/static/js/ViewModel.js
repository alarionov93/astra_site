/**
 * Created by sanya on 17.03.16.
 */
;
$settings = new Settings();

function ViewModel() {
    var self = this;
    self.waiter = new Waiter();
    self.waiter.show();
    self.exShown = ko.observable(false);
    self.added = ko.observable(false);
    self.removed = ko.observable(false);
    self.msg = ko.observable("");
    self.products = ko.observableArray();
    self.products.loaded = ko.observable(false);
    self.shuffledProducts = ko.observableArray();
    self.categoriesWithProducts = ko.observableArray();
    self.cart = ko.observableArray();
    self.products.expanded = ko.observable(false);
    self.productToView = ko.observable(null);
    self.isViewing = ko.observable(false);

    self.order = ko.observable();
    self.order.number = ko.observable();
    self.orderCreated = ko.observable(false);
    self.orderFail = ko.observable(false);
    self.orderPopupShown = ko.observable(false);
    self.orders = ko.observableArray();
    self.orderComment = ko.observable('');
    self.orderStatuses = ko.observableArray();
    self.celebrationOrder = ko.observable(false);

    self.customer = ko.observable({});
    self.customer.phone = ko.observable('');
    self.customer.email = ko.observable('');
    self.customer.firstName = ko.observable('');
    self.customer.lastName = ko.observable('');
    self.customer.address = ko.observable('');
    self.customer.lastLogin = ko.observable('');
    self.customer.isAuthenticated = ko.observable(false);
    self.customer.password1 = ko.observable('');
    self.customer.password2 = ko.observable('');
    self.customerVoted = ko.observable(false);
    self.customer.agreed = ko.observable(true);
    self.customer.cityArea = ko.observable();
    self.deliveryType = ko.observable('');
    self.deliveryTime = ko.observable('');
    // self.customer.prefferedDeliveryDate = ko.observable();
    self.city = ko.observable();
    self.city.cityAreas = ko.observableArray();
    
    self.firstShow = ko.observable(true);
    self.firstShowPasswdWarn = ko.observable(true);
    self.feedbackText = ko.observable('');
    self.feedbackFormShown = ko.observable(false);
    self.purchaseFormShown = ko.observable(false);
    self.warningFormShown = ko.observable(false);
    self.userDataFormShown = ko.observable(false);
    self.positionNeeded = ko.observable('');
    self.showResponse = ko.observable(false);
    self.showMsg = ko.observable(false);
    self.leftInStockRequestedProd = ko.observable(0);
    self.categories = ko.observableArray();
    self.categories.loaded = ko.observable(false);
    self.notifyingFormShown = ko.observable(false); //form to show status and errors of user actions. TODO: choose other name for this!
    self.lkPopupShown = ko.observable(false);
    self.daysOfDelivery = ko.observable("");
    self.closestDateOfDelivery = ko.observable();
    // TODO: get this setting from server
    self.weekdaysOfDelivery = ko.observableArray();
    self.availableDeliveryTypes = ko.observableArray();
    self.descIsShown = ko.observable(false);
    // self.cart.prefferedDeliveryDate = ko.observable();
    self.selectedDeliveryTimePeriod = ko.observable();
    self.cart.weigthedProducts = ko.observableArray();
    self.deliveryType.subscribe(function(newVal) {
        setTimeout(function() {
            // (".order-form").children("form").find
            $("#inputArea").select2();
        }, 500);
    });
    self.ordersNotPaid = ko.observableArray();
    self.ordersToShow = ko.observableArray();
    self.showingAllOrders = ko.observable(); //this is used for buttons to mark one of them as 'active'
    /* product sales carousel */
    self.saleableProducts = ko.observableArray([]);
    self.saleProductsController = ko.observable();
    self.datesForDelivery = ko.observableArray();
    self.datesForDeliveryUpdated = ko.observable(false);
    // self.groupOfSaleProducts = ko.observable();

    /**
     * checks type
     * @param obj
     * @param type
     * @returns {boolean}
     */
    self.is = function (obj, type) {
        var checkingType = Object.prototype.toString.call(obj).split(" ")[1].split("]")[0];
        return obj !== undefined & obj !== null & type === checkingType;
    };

    self.cart.haveWeightedProducts = ko.computed(function() {
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].isWeighted() == true) {
                return true;
            }
        }
        return false;
    });
    self.cart.getWeightedProducts = ko.computed(function() {
        self.cart.weigthedProducts.removeAll();
        for (var i = 0; i < self.cart().length; i++) {
            if (self.cart()[i].isWeighted() == true) {
                self.cart.weigthedProducts.push(self.cart()[i]);
            }
        }
    });

    // self.filters = ko.observableArray(data.filters);
    // self.filter = ko.observable('');
    // self.cityAreasFiltered = ko.computed(function() {
    //     var filter = self.filter();
    //     if (!filter || filter == "None") {
    //         return self.cityAreas();
    //     } else {
    //         return ko.utils.arrayFilter(self.cityAreas(), function(i) {
    //             return i.name == filter;
    //         });
    //     }
    // });
    self.startChars = ko.observable("");
    ko.utils.stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    // self.cityAreasFiltered = ko.computed(function () {
    //     var filter = self.startChars().toLowerCase();
    //     if (self.is(!self.cityAreas, "Undefined")) {
    //         if (!filter) {
    //             return self.cityAreas();
    //         } else {
    //             return ko.utils.arrayFilter(self.cityAreas(), function(item) {
    //                 return ko.utils.stringStartsWith(item.name.toLowerCase(), filter);
    //             });
    //         }
    //     }
    // }, self);
    // var t = setInterval(updateFilteredList, 300);
    // function updateFilteredList() {
    //     $("input#search-env").blur();
    //     $("input#search-env").focus();
    // }
    
    self.cart.initialized = ko.observable(false);

    self.toggleDescription = function() {
        if(self.descIsShown() == false) {
            $("#question-description").show();
            self.descIsShown(true);
        } else {
            $("#question-description").hide();
            self.descIsShown(false);
        }
    };

    self.saleNotificationShown = ko.observable();
    self.showSaleNotification = function() {
        self.saleNotificationShown(true);
    };
    self.hideSaleNotification = function() {
        self.saleNotificationShown(false);
    };

    self.ableToOrder = ko.computed(function () {
        if($settings.minOrderSum() == null) {
            return false;
        }
        var totalMoreThanMin = ! ($settings.minOrderSum() > self.cart.total());
        var celebrationOrder = false;
        if ($settings.doNotCheckMinOrderSum) {
            celebrationOrder = self.cart().length > 0 && self.cart.find(parseInt($settings.prodIdToCancelMinOrderSum));
        }
        if (celebrationOrder) {
            self.celebrationOrder(true);
        }
        return celebrationOrder || totalMoreThanMin;
    });

    self.vkShareVisible = ko.computed(function() {
        return self.cart().length > 0 && !self.ableToOrder();
    });

    self.categories.collapseAll = function () {
        for (var i = 0; i < self.categories().length; i++) {
            self.categories()[i].collapse(false);
        }
    };

    self.toggleLkPopup = function () {
        if (self.lkPopupShown() == false) {
            self.lkPopupShown(true);
        } else {
            self.lkPopupShown(false);            
        }
    };
    self.hideLkPopup = function () {
        self.lkPopupShown(false);
    };

    /** deliveryDate - computes date of order could be delivered
     *  deliveryDateISO - view of deliveryDate to be represented at form's control
     *  minDeliveryDate - value to compare with deliveryDateISO witch user can change
     *  deliveryObjFromISODate - an object constructed from deliveryDateISO used in
     *       isValid of deliveryDateISO to compare with deliveryDate
     */

    self.dateToString = {
        get: function(date, mode) {
            if (date) {
                var year = date.getFullYear();
                var month = date.getMonth();
                var dayOfWeek = date.getUTCDay();
                var date = date.getDate();
                var monthStr;
                var dayOfWeekStr;

                switch (parseInt(month+1)) {
                    case 1: 
                        monthStr = "января";
                        break;
                    case 2: 
                        monthStr = "февраля";
                        break;
                    case 3: 
                        monthStr = "марта";
                        break;
                    case 4: 
                        monthStr = "апреля";
                        break;
                    case 5: 
                        monthStr = "мая";
                        break;
                    case 6: 
                        monthStr = "июня";
                        break;
                    case 7: 
                        monthStr = "июля";
                        break;
                    case 8: 
                        monthStr = "августа";
                        break;
                    case 9: 
                        monthStr = "сентября";
                        break;
                    case 10: 
                        monthStr = "октября";
                        break;
                    case 11: 
                        monthStr = "ноября";
                        break;
                    case 12: 
                        monthStr = "декабря";
                        break;
                }
                if(mode) {
                    switch (dayOfWeek) {
                        case 0: 
                            dayOfWeekStr = "в понедельник";
                            break;
                        case 1: 
                            dayOfWeekStr = "во вторник";
                            break;
                        case 2: 
                            dayOfWeekStr = "в среду";
                            break;
                        case 3: 
                            dayOfWeekStr = "в четверг";
                            break;
                        case 4: 
                            dayOfWeekStr = "в пятницу";
                            break;
                        case 5: 
                            dayOfWeekStr = "в субботу";
                            break;
                        case 6: 
                            dayOfWeekStr = "в воскресенье";
                            break;
                    }
                } else {
                    switch (dayOfWeek) {
                        case 0: 
                            dayOfWeekStr = "понедельник";
                            break;
                        case 1: 
                            dayOfWeekStr = "вторник";
                            break;
                        case 2: 
                            dayOfWeekStr = "среда";
                            break;
                        case 3: 
                            dayOfWeekStr = "четверг";
                            break;
                        case 4: 
                            dayOfWeekStr = "пятница";
                            break;
                        case 5: 
                            dayOfWeekStr = "суббота";
                            break;
                        case 6: 
                            dayOfWeekStr = "воскресенье";
                            break;
                    }
                }

                return dayOfWeekStr + ", " + date + " " + monthStr;
            }
        },
        set: function(value) { // format yyyy-mm-dd
            var date = new Date(value.split("-")[0], parseInt(value.split("-")[1]) - 1, value.split("-")[2]);
            return date;
        }
    };

    self.cart.deliveryDate = ko.computed(function () {
        if(self.cart().length > 0) {
            var dates = [];
            dates.max = function() {
                var maxDate = new Date(Math.max.apply(null,this));
                return maxDate;
            };

            for (var i = 0; i < self.cart().length; i++) {
                if(self.cart()[i].arrClosest !== -1) {
                    dates.push(self.cart()[i].deliveryDateObj());
                }
            }
            return dates.max() || null;
        } else {
            return null;
        }
    });

    self.cart.minDeliveryDate = ko.computed(function () {
        return self.cart.deliveryDate();
    });

    self.cart.deliveryDateObj = ko.observable();
    self.cart.deliveryDateISO = ko.observable();

    self.cart.deliveryDateISO.subscribe(function(value) {
        console.log(value);
        var date = new Date(value.split("-")[0], parseInt(value.split("-")[1]) - 1, value.split("-")[2]);
        self.cart.deliveryDateObj(date);
    });

    self.cart.deliveryDate.subscribe(function (value) {
        // self.cart.deliveryDateISO(value.toUserString());
        // self.cart.deliveryDateObj(value);
        // console.log(self.cart.deliveryDateISO());
    });

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
    self.positionNeeded.isValid = ko.computed(function() {
        var e = self.positionNeeded();
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
    self.customer.address.isValid = ko.computed(function() {
        var e = self.customer.address();
        var st = !!e && typeof e !== "undefined"
        && e.length !== 0 && e.length < 500 && e.length > 2;
        if(self.deliveryType() && self.deliveryType().id == $settings.deliveryTypeToShowAddress) {
            return st;
        } else {
            return true;
        }
    });
    self.customer.agreed.isValid = ko.computed(function() {
        var e = self.customer.agreed();
        return typeof e !== "undefined" && e == true;
    });
    self.customer.cityArea.isValid = ko.computed(function() {
       var e = self.customer.cityArea();
        var st = (typeof e !== "undefined");
        if(self.deliveryType() && self.deliveryType().id == $settings.deliveryTypeToShowAddress) {
            return st;
        } else {
            return true;
        }
    });
    self.deliveryType.isValid = ko.computed(function() {
        var e = self.deliveryType();
        return typeof e !== "undefined";
    });
    self.deliveryTime.isValid = ko.computed(function() {
        var e = self.deliveryTime();
        return typeof e !== "undefined";
    });
    self.cart.deliveryDateISO.isValid = ko.computed(function() {
        var e = self.cart.deliveryDateISO();
        return !! typeof e !== "undefined" && self.cart.deliveryDateObj() >= self.cart.minDeliveryDate();
        // if(self.deliveryType() && self.deliveryType().id == $settings.deliveryTypeToShowAddress) { //2nd part of this condition is showing that delivery type is "to home"
        //     return st;
        // } else {
        //     return true;
        // }
    });
    self.selectedDeliveryTimePeriod.isValid = ko.computed(function() {
        var e = self.selectedDeliveryTimePeriod();
        if ($settings && $settings.isConfigured()) {
            var st = typeof e !== "undefined";
            if ($settings.deliveryTimePeriods().length == 0) { // this is for client to be able to order with dt periods not configured
                return true;
            } else {
                return st;
            }
        }
    });
    self.customer.isValid = ko.computed(function () {
        var st = (self.customer.email.isValid() && 
            self.customer.phone.isValid() && 
            self.customer.firstName.isValid() && 
            self.customer.lastName.isValid() && 
            self.customer.address.isValid() && 
            self.customer.agreed.isValid() && 
            self.cart.deliveryDateISO.isValid() && 
            self.selectedDeliveryTimePeriod.isValid() &&
            self.customer.cityArea.isValid() &&
            self.deliveryType.isValid());
        console.log(st);
        return st;
    });

    // carrot quest update user data
    // self.customer.firstName.subscribe(function (newValue) {
    //     carrotquest.identify({
    //         '$name': newValue + ' ' + self.customer.lastName()
    //     })
    // });
    //
    // self.customer.phone.subscribe(function (newValue) {
    //     carrotquest.identify({
    //         '$phone': newValue
    //     })
    // });
    //
    // self.customer.lastName.subscribe(function (newValue) {
    //     carrotquest.identify({
    //         '$name': self.customer.firstName() + ' ' + newValue
    //     })
    // });

    self.cart.total = ko.computed(function() {
        var total = 0;
        if (self.cart() !== undefined && self.cart().length > 0) {
            var products = self.cart();
            for (var i = 0; i < products.length; i++) {
                total += parseInt(products[i].price());
            }
        }
        return total;
    });

    self.cart.totalDiscount = ko.computed(function() {
        var sum = 0;
        if (self.cart.total() !== undefined && self.cart().length > 0) {
            sum = parseInt(self.cart.total()) / 100 * 85;
            return parseFloat(sum.toFixed(2));
        }
    });

    self.cart.dateOfDeliveryIsLate = ko.computed(function() {
        if (typeof self.cart.deliveryDateObj() !== "undefined") {
            return self.weekdaysOfDelivery().indexOf(self.cart.deliveryDateObj().getDay()) === -1;
        }
        // return self.cart.minDeliveryDate() < self.cart.deliveryDateObj();
    });

    self.cart.datesDiff = ko.computed(function() {
        // TODO: use self.datesForDelivery here
        // TODO: use datesForDeliveryFull(true) here to recalculate closestToMinDate every time,
        // TODO: datepicker appears or month changed. Set datesForDeliveryFull(false) in this method
        // if (self.datesForDeliveryUpdated() == true) {
        //     var closestToMinDate;
        //     for (var i = 0; i < self.datesForDelivery().length; i++) {
        //         var curDate = self.datesForDelivery()[i];
        //         var found = false;
        //         if (curDate > self.cart.minDeliveryDate()) {
        //             // first enter in this case means curDate is next to cart min delivery date. That's it, store it.
        //             found = true;
        //             closestToMinDate = curDate;
        //             break;
        //         }
        //     }
        // }
        // if (closestToMinDate)
        //     return parseInt(closestToMinDate - self.cart.minDeliveryDate()) / (3600 * 24 * 1000);
        // else
            return parseInt(self.cart.deliveryDateObj() - self.cart.minDeliveryDate()) / (3600 * 24 * 1000);
    });

    self.cart.processRuDays = function(days) {
        if (days > 0 && days < 5) {
            switch (days) {
                case 1:
                    return "день";
                case 2:
                case 3:
                case 4:
                    return "дня";
            }
        } else if (days > 20 && (days % 10) < 5) {
            switch (days % 10) {
                case 1:
                    return "день";
                case 2:
                case 3:
                case 4:
                    return "дня";
            }
        } else {
            return "дней";
        }
    };

    $.get($settings.urls.api.categories).then(function (resp) {
        var categories = resp.categories;
        console.log(resp);
        if(resp.length == 0) {
            // TODO: handle it?
        } else {
            self.categories.removeAll();
            for (var j = 0; j < categories.length; j++) {
                var category;
                var p_items = categories[j].items;
                categories[j].products = [];
                for (var i = 0; i < p_items.length; i++) {
                    product = new Product(p_items[i].id,
                                    categories[j].id,
                                    categories[j].name,
                                    categories[j].link,
                                    p_items[i].name,
                                    p_items[i].contents,
                                    p_items[i].best_before,
                                    p_items[i].storage_conditions,
                                    p_items[i].seller_rec,
                                    p_items[i].description,
                                    p_items[i].fatness,
                                    p_items[i].energy,
                                    p_items[i].time_of_growth,
                                    p_items[i].is_in_sale,
                                    p_items[i].price_per_min_amount,
                                    p_items[i].is_in_stock, 
                                    p_items[i].left_in_stock,
                                    p_items[i].images,
                                    p_items[i].minimal_amount,
                                    p_items[i].units,
                                    p_items[i].seller,
                                    p_items[i].max_saleable_amount,
                                    p_items[i].farmer_arrival,
                                    p_items[i].arrival_day_closest
                                );
                    categories[j].products.push(product);
                    if (product.prodIsInSale) {
                        self.saleableProducts.push(product);
                    }
                }
                delete categories[j].items;
                category = new Category(categories[j].id, categories[j].name, categories[j].products, categories[j].link);
                self.categories.push(category);
            }
            console.log(self.categories());
            self.categories.loaded(true);
            self.showAllProducts();
            self.updateCart();
            /* product sales carousel */
            self.saleProductsController(new SaleProductsController(self.saleableProducts()));
            // $(".show-cats-block").css('display', 'block');
            // $(".hide-cats-block").css('display', 'block');
        }
    }).always(function() {
        scroll();
        self.waiter.hide();
        self.saleProductsController().productTilesRendered(true); // recalculatinng tile count for the right position
    }).fail(function (resp) {
        // self.showNotifyingForm();
        $("p#err").empty();
        $("p#err").append("Ошибка сервера, повторите попытку позже.");
        // console.error(resp);
    });

    self.equals = function(obj, secObj) {
        var stat;
        for(var key in obj) {
            if (key == "id") {
                if(obj.hasOwnProperty(key) && secObj.hasOwnProperty(key)) {
                    if(secObj[key] != obj[key]) {
                        return false;
                    }
                }
            } else {
                continue;
            }
        }

        return true;
    };

    self.shuffle = function(arr) {
        var newLength = 2;
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        self.shuffledProducts(arr.slice(0,3));
    };

    self.showInitProducts = function () {
        
    };

    self.showAllProducts = function() {
        
    };

    self.products.find = function (id) {
        var product;
        for (var i = 0; i < self.categories().length; i++) {
            var cat = self.categories()[i];
            for (var j = 0; j < cat.products.length; j++) {
                if (parseInt(id) == cat.products[j].id) {
                    product = cat.products[j];
                    var found = 1;
                }
            }
        }
        if (!found) {
            console.warn("Can not found product, seems that it arent loaded.");
        }

        return product;
    };

    self.cart.find = function (id) {
        var product = null;
        for (var i = 0; i < self.cart().length; i++) {
            if (parseInt(id) == self.cart()[i].id) {
                product = self.cart()[i];
            }
        }

        return product;
    };
    self.orders.findNotPaid = function () {
        self.ordersNotPaid.removeAll();
        for (var i = 0; i < self.orders().length; i++) {
            if (!self.orders()[i].isPaid() && !self.orders()[i].isCancelled()) {
                self.ordersNotPaid.push(self.orders()[i]);
            }
        }
    };
    self.showAllOrders = function () {
        self.showingAllOrders(true);
        self.ordersToShow.removeAll();
        for (var i = 0; i < self.orders().length; i++) {
            self.ordersToShow.push(self.orders()[i]);
        }
    };
    self.showNotPaidOrders = function () {
        self.showingAllOrders(false);
        self.ordersToShow.removeAll();
        for (var i = 0; i < self.ordersNotPaid().length; i++) {
            self.ordersToShow.push(self.ordersNotPaid()[i]);
        }
    };

    self.categories.find = function (id) {
        var category;
        for (var i = 0; i < self.categories().length; i++) {
            if (parseInt(id) == self.categories()[i].id) {
                category = self.categories()[i];
            }
        }

        return category;
    };

    self.updateCart = function() {
        if(self.categories.loaded() == true) {
            $.get($settings.urls.cart.update).then(function (resp) {
                console.log(resp);
                var fullName = '';
                if(resp["customer_email"]) {
                    self.customer.email(resp["customer_email"]);
                    self.customer.isAuthenticated(true);
                    if (self.customer.isAuthenticated()) {
                        carrotquest.identify({
                            '$email': self.customer.email()
                        });
                    }
                }
                if(resp["customer_phone"]) {
                    // TODO: use this style all around the javascript code !!
                    self.customer.phone(resp["customer_phone"]);
                    if (self.customer.isAuthenticated()) {
                        carrotquest.identify({
                            '$phone': self.customer.phone()
                        });
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
                        carrotquest.identify({
                            '$name': fullName
                        });
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
                    $settings.addSetting("adminEmail", resp["settings"]["admin_email"]);
                    $settings.addSetting("shopEmail", resp["settings"]["shop_email"]);
                    $settings.addSetting("siteName", resp["settings"]["site_name"]);
                    $settings.addSetting("cSiteName", resp["settings"]["c_site_name"]);
                }

                if(resp["settings"]["min_order_sum"]) {
                    $settings.addSetting("minOrderSum", resp["settings"]["min_order_sum"]);
                }

                if (resp.status == 0) {
                    self.cart.removeAll();
                    for (var i = 0; i < resp.cart.length; i++) {
                        p = self.products.find(parseInt(resp.cart[i].id)); //find element in products
                        if (p) {
                            p.isInCart(true);
                            p.count(resp.cart[i].count); //++ its count
                            self.cart.push(p);
                        } else {
                            console.warn("Seems that product with id=" + resp.cart[i].id + " is switched off.");
                        }
                    }
                    self.cart.initialized(true);
                } else {
                    console.log("Error:" + resp.status);                    
                }
            }).always(function() {
                $settings.isConfigured(true);
            });
        }
    };
    // addToCart should be invoked with .bind() !!
    // TODO: add config.js with all URLs for ajax !!
    self.addToCart = function(vm, evt, product) {
        var product = this;
        evt.stopPropagation();
        var data = {
            id: product.id, 
            count: product.count()
        };
        // carrot quest report here
        if(product.images && product.images.length > 0) {
            var prodImg = $settings.serverRoot + product.images[0].thumb;
        } else {
            var prodImg = $settings.noProdImg;
        }
        carrotquest.track('$cart_added', {
            $name: product.name,
            $url: 'http://eshfresh.org/#'+product.catLink,
            $amount: product.cost,
            $img: prodImg
        });
        if (product.count() <= product.leftInStock) {   
            $.get($settings.urls.cart.add + $.param(data)).then(function (resp) {
                console.log(resp.status);
                if (resp.status == 0) {
                    self.cart.removeAll();
                    for (var i = 0; i < resp.cart.length; i++) {
                        p = self.products.find(resp.cart[i].id); //find element in products
                        if (p) {
                            p.isInCart(true);
                            p.count(resp.cart[i].count); //++ its count
                            self.cart.push(p);
                            // if (parseInt(p.id) == 158) {
                            //     yaCounter14925691.reachGoal('click_tvorog_5');
                            // }
                            // if (parseInt(p.id) == 9) {
                            //     yaCounter14925691.reachGoal('click_kozsyrmyag');
                            // }
                        } else {
                            console.warn("Seems that product with id=" + resp.cart[i].id + " is switched off.");
                        }
                    }
                } else {
                    console.log("Error:" + resp.status);                    
                }
            }).always();
        } else {
            self.showNotificationForm(product, evt, true);
        }
    };

    self.deleteFromCart = function(productId) {
        return function() {
            var data = {
                product_id: productId,
            };
            $.get($settings.urls.cart.remove+$.param(data)).then(function (resp) {
                // delete from productsInCart, if server deletes from session
                console.log(resp.status);
                if (resp.status == 0) {
                    var productToDelete = self.cart.find(productId);
                    var deleted = self.cart.remove(productToDelete);
                    // productToDelete.leftInStock++;
                    console.log(deleted);
                }
            }).always().fail(function () {
                self.showNotifyingForm();
                $("p#err").empty();
                $("p#err").append("Ошибка сервера, повторите попытку позже.");
            });
        }
    };

    self.removeAllFromCart = function() {
        $.get($settings.urls.cart.removeAll).then(function (resp) {
            console.log(resp.status);
            if (resp.status == 0) {
                self.cart.removeAll();
            }
        }).always();
    };

    self.showNotifyingForm = function () {
        $('body').css('overflow', 'hidden');
        self.notifyingFormShown(true);
    };

    self.hideNotifyingForm = function () {
        $('body').css('overflow', 'visible');
        self.notifyingFormShown(false);
    };

    self.showWarnPopup = ko.computed(function () {
        if (self.cart.initialized() && self.cart.haveWeightedProducts() && localStorage.getItem("userWarned") == null && location.pathname.startsWith("/cart")) { // TODO: rewrite this piece of shit
            self.warningFormShown(true);
            $('body').css('overflow', 'hidden');
            // localStorage.setItem("userWarned", "1");
            return self.cart.initialized() && self.cart.haveWeightedProducts() && localStorage.getItem("userWarned") == null && location.pathname.startsWith("/cart");
        }
        return false;
    });

    self.hideWarnPopup = function () {
        $('body').css('overflow', 'visible');
        self.warningFormShown(false);
    };

    self.showFeedbackForm = function() {
        return function () {
            $('body').css('overflow', 'hidden');
            self.firstShow(true);
            self.feedbackFormShown(true);
            setTimeout(function() {
                $(".feedback-form").css('display', 'block');
                $(".feedback-back").css('display', 'block');
            }, 200);
        }
    };

    self.hideFeedbackForm = function() {
        return function() {
            $('body').css('overflow', 'visible');
            self.feedbackFormShown(false);
            // self.showResponse(false);
            self.customerVoted(false);
        }
    };

    self.showPurchaseForm = function() {
        return function () {
            $('body').css('overflow', 'hidden');
            self.firstShow(true);
            self.purchaseFormShown(true);
        }
    };

    self.hidePurchaseForm = function() {
        return function() {
            $('body').css('overflow', 'visible');
            self.purchaseFormShown(false);
            // self.showResponse(false);
        }
    };

    self.showUserDataForm = function(vm, evt) {
        // return function () {
            // evt.stopPropagation();
            $('body').css('overflow', 'hidden');
            self.firstShow(true);
            self.lkPopupShown(false);
            self.firstShowPasswdWarn(true);
            self.userDataFormShown(true);
            yaCounter14925691.reachGoal('account');
            $().on();
            // $('#user-data-tabs a[href="#user-data"]').tab('show');
            // $('#user-data-tabs').on('a', 'click', function (e) {
            //   e.preventDefault();
            //   $(this).tab('show');
            // });
            // return evt;
        // }
    };

    self.hideUserDataForm = function() {
        return function() {
            $('body').css('overflow', 'visible');
            $("div#err").empty();
            self.userDataFormShown(false);
            // self.showResponse(false);
        }
    };
    ko.subscribable.fn.subscribeExtended = function (callback) {
        var oldValue;
        this.subscribe(function (_oldValue) {
            oldValue = _oldValue;
        }, this, 'beforeChange');

        this.subscribe(function (newValue) {
            callback(newValue, oldValue);
        });
    };
    self.refreshUserDataButtonVisible = ko.observable(false);

    self.editingFirstName = ko.observable(false);
    self.editingLastName = ko.observable(false);
    self.editingPhone = ko.observable(false);
    self.editingAddress = ko.observable(false);

    self.editingUserData = ko.computed(function () {
        var editing = self.editingFirstName() | self.editingLastName() | self.editingPhone() | self.editingAddress();
        if (editing) {
            self.refreshUserDataButtonVisible(editing);
        }
        
        return editing;
    });

    self.refreshUserPasswdButtonVisible = ko.observable(false);
    self.editingPasswd1 = ko.observable(false);
    self.editingPasswd2 = ko.observable(false);
    self.editingUserPasswd = ko.computed(function () {
        var editing = self.editingPasswd1() | self.editingPasswd2();
        if (editing) {
            self.refreshUserPasswdButtonVisible(editing);
        }

        return editing;
    });
    self.customer.passwordIsValid = ko.observable(true); //for using in template data-bind
    // TODO: move all to the top
    self.customer.password = ko.observable(); // for isValid()
    self.customer.password.isValid = function () { // for validation in self.refreshUserPasswd()
        var e1 = self.customer.password1();
        var e2 = self.customer.password2();
        var rx = new RegExp('^[a-zA-Z0-9_]+(,[a-zA-Z0-9_]+)*$');
        var m = !!(e1.match(rx) && e2.match(rx));
        var res = !!(typeof e1 !== "undefined" && typeof e2 !== "undefined" && m == true && e1.length > 6 && e2.length > 6 && e1 === e2);
        if (res) {

        }
        return res;
    };

    self.refreshUserData = function() {
        $("div#msg").empty();
        $("div#err").empty();
        $("div#msg").css("opacity", 0);
        $("div#err").css("opacity", 0);
        if(self.customer.isAuthenticated()) {
            var token = $('input[name*=csrf]').val();
            if ($settings.new_csrf.length > 0) {
                token = $settings.new_csrf;
            }
            $.post($settings.urls.account.update, {
                    phone: self.customer.phone(),
                    firstName: self.customer.firstName(),
                    lastName: self.customer.lastName(),
                    address: self.customer.address(),
                    csrfmiddlewaretoken: token}).then(function (resp) {
                console.log(resp);
                if(resp.length == 0) {
                    // TODO: handle it?
                } else {
                    if (resp.status == 0) {
                        $("p#err").empty();
                        if(resp["customer_phone"]) {
                            self.customer.phone(resp["customer_phone"]);
                        }
                        if(resp["first_name"]) {
                            self.customer.firstName(resp["first_name"]);
                        }
                        if(resp["last_name"]) {
                            self.customer.lastName(resp["last_name"]);
                        }
                        if(resp["address"]) {
                            self.customer.address(resp["address"]);
                        }
                        self.refreshUserDataButtonVisible(false);
                        $("div#msg").empty();
                        $("div#err").css("opacity", 0);
                        $("div#msg").css("opacity", 1);
                        $("div#msg").append("<i class='fa fa-check-square-o'></i> Обновлено!");
                        $('div#msg').animate({opacity: 0}, 2500);
                    } else {
                        self.showUserDataForm();
                        $("div#err").empty();
                        $("div#err").css("opacity", 1);
                        $("div#err").append("<i class='fa fa-ban'></i> "+resp.error);
                    }
                }
            }).always().fail(function () {
                self.showUserDataForm();
                $("div#err").empty();
                $("div#err").css("opacity", 1);
                $("div#err").append("Ошибка сервера, повторите попытку позже.");
            });
        } else {
            console.warn("Fuck you!");
        }
    };

    self.refreshUserPasswd = function() {
        $("div#msg").empty();
        $("div#err").empty();
        $("div#msg").css("opacity", 0);
        $("div#err").css("opacity", 0);
        if (self.customer.isAuthenticated()) {
            self.firstShowPasswdWarn(false);
            var formValid = self.customer.password.isValid();
            if (formValid) {
                self.customer.passwordIsValid(true);
                var token = $('input[name*=csrf]').val();
                if ($settings.new_csrf.length > 0) {
                    token = $settings.new_csrf;
                }
                $.post($settings.urls.password.update, {
                    password1: self.customer.password1(),
                    password2: self.customer.password2(),
                    csrfmiddlewaretoken: token
                }).then(function (resp) {
                    console.log(resp);
                    if (resp.length == 0) {
                        // TODO: handle it?
                    } else {
                        if (resp.status == 0) {
                            // self.waiter.show();
                            //location.href = resp["redirect_url"];
                            // location.search = resp["redirect_search"];
                            $("p#err").empty();
                            self.refreshUserPasswdButtonVisible(false);
                            $("div#msg").empty();
                            $("div#err").css("opacity", 0);
                            $("div#msg").css("opacity", 1);
                            $("div#msg").append("<i class='fa fa-check-square-o'></i> Обновлено!");
                            $('div#msg').animate({opacity: 0}, 2500);
                            self.firstShowPasswdWarn(true);
                            self.customer.password1('');
                            self.customer.password2('');
                            // var csrf_input = $("#userData-form").find("input[name=csrfmiddlewaretoken]");
                            // $(csrf_input).val(resp['new_csrf']);
                            $settings.new_csrf = resp['new_csrf'];
                            // location.reload();
                        } else {
                            self.showUserDataForm();
                            $("div#err").empty();
                            $("div#err").css("opacity", 1);
                            $("div#err").append("<i class='fa fa-ban'></i> "+resp.error);
                        }
                    }
                }).always().fail(function () {
                    self.showUserDataForm();
                    $("div#err").empty();
                    $("div#err").css("opacity", 1);
                    $("div#err").append("Ошибка сервера, повторите попытку позже.");
                });
            } else {
                self.customer.passwordIsValid(false);
            }
        } else {
            console.warn("Fuck you!");
        }
    };

    self.showOrderPopup = function() {
        return function() {
            carrotquest.track('$order_started');
            $('body').css('overflow', 'hidden');
            self.firstShow(true);
            self.orderPopupShown(true);

            $.datepicker.regional['ru'] = {
                closeText: 'Закрыть',
                prevText: '&#x3c;Пред',
                nextText: 'След&#x3e;',
                currentText: 'Сегодня',
                monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
                dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
                dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
                dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false
            };
            $.datepicker.setDefaults($.datepicker.regional['ru']);
            var date = new Date();

            $("#inputDate").datepicker({
                  changeMonth: true,
                  changeYear: true,
                  yearRange: "2012:2060",
                  dateFormat: "yy-mm-dd",
                  minDate: self.cart.minDeliveryDate(),
                  defaultDate: date,
                  beforeShowDay: function(date) {
                    // TODO: get weekdays of delivery dynamically here !!
                    // TODO: use self.weekdays([1,3,5])
                    var weekdays = self.weekdaysOfDelivery();
                    if (weekdays.indexOf(date.getDay()) !== -1) {
                        self.datesForDelivery.push(date);
                        return [true, "event", "Дата доставки фермером"];
                    } else {
                        return [true, '', ""];
                    }
                 }
            });
            self.datesForDeliveryUpdated(true);
            // TODO: here set datesForDeliveryUpdated(true) to use in callback in self.datesDiff()
        };
    };

    self.hideOrderPopup = function() {
        return function() {
            $('body').css('overflow', 'visible');
            self.orderPopupShown(false);
            $(".background").hide();
        }
    };

    self.notificationFormShown = ko.observable(false);
    self.showNotificationForm = function(product, evt, showMsg) {
        $('body').css('overflow', 'hidden');
        $("p#err").empty();
        self.firstShow(true);
        localStorage.setItem("productInterestedIn", JSON.stringify(product.id));
        self.notificationFormShown(true);
        // if (self.customer.isAuthenticated() == true) {
        //     self.sendNotifyMe();
        // } // TODO: fix this section!
        if (showMsg) {
            self.leftInStockRequestedProd(product.leftInStock);
            self.showMsg(true);
        }
        setTimeout(function() {
            $(".notification-form").css('display', 'block');
            $(".notification-back").css('display', 'block');
        }, 200);
    };

    self.hideNotificationForm = function() {
        return function() {
            $('body').css('overflow', 'visible');
            self.notificationFormShown(false);
            localStorage.removeItem("productInterestedIn");
            // self.showResponse(false);
            self.leftInStockRequestedProd(0);
            self.showMsg(false);
        }
    };

    // TODO: make waited after make order click!!
    self.makeOrder = function() {
        return function() {
            self.firstShow(false);
            if (self.customer.isValid()) {
                self.waiter.show();
                var token = $('input[name*=csrf]').val();
                if ($settings.new_csrf.length > 0) {
                    token = $settings.new_csrf;
                }
                var products = [];
                for (var i = 0; i < self.cart().length; i++) {
                    var p = self.cart()[i];
                    var _p = {};
                    _p.id = p.id;
                    _p.name = p.name;
                    _p.count = p.count();
                    _p.amount = p.positionAmount();
                    _p.units = p.units;
                    _p.price = p.price();
                    products.push(_p);
                }
                $.post($settings.urls.orders.create, {
                    phone: self.customer.phone(),
                    celebrationOrder: self.celebrationOrder(),
                    email: self.customer.email(),
                    firstName: self.customer.firstName(),
                    lastName: self.customer.lastName(),
                    orderNumber: self.order.number(),
                    address: self.customer.address(),
                    area: JSON.stringify(self.customer.cityArea()),
                    comment: self.orderComment(),
                    agreed: self.customer.agreed(),
                    deliveryType: JSON.stringify(self.deliveryType()),
                    deliveryTime: self.deliveryTime(),
                    deliveryDateISO: self.cart.deliveryDateISO(),
                    deliveryTimePeriod: JSON.stringify(self.selectedDeliveryTimePeriod()),
                    positions: JSON.stringify(products),
                    total: self.cart.total(),
                    csrfmiddlewaretoken: token}).then(function (resp) {
                    // self.showResponse(true); // for form to be invisible, to show only msg or err!!
                    console.log(resp.status);
                    if (resp.status == 0) {
                        console.log(resp);
                        carrotquest.track('Успешно отправил форму совершения заказа', {
                          email: self.customer.email()
                        });
                        // self.cart.removeAll();
                        var order = resp.order;
                        carrotquest.track('$order_completed', {
                            $order_id: order.number,
                            $order_id_human: '',
                            $order_amount: order.total
                        });
                        // self.order(new Order(order.date, order.number, order.phone, order.email, order.items, order.total,
                        //      order.address, order.city_area, order.delivery_type, order.delivery_price, order.delivery_date, order.delivery_time_period, order.status, resp.success));
                        // self.orderCreated(true);
                        yaCounter14925691.reachGoal('create_order');
                        location.pathname = resp["redirect_url"];
                        self.hideOrderPopup();
                    }
                    if (resp.status == 3) {
                        $("p#err").empty();
                        $("p#err").append("Сумма заказа меньше чем " + $settings.minOrderSum());
                    }
                    if (resp.status == 6) {
                        $("p#err").empty();
                        $("p#err").append(resp.error);
                    }
                }).always(self.waiter.hide).fail(function () {
                    $("p#err").empty();
                    $("p#err").append("Ошибка сервера, повторите попытку позже.");
                });
            } else {

            }
        }
    };

    self.sendFeedback = function() {
        return function() {
            self.firstShow(false);
            if (self.feedbackText.isValid() && self.customer.email.isValid() && self.customer.firstName.isValid()) {
                self.waiter.show();
                var token = $('input[name*=csrf]').val();
                if ($settings.new_csrf.length > 0) {
                    token = $settings.new_csrf;
                }
                $.post($settings.urls.feedback, {
                    feedback: self.feedbackText(),
                    phone: self.customer.phone(),
                    firstName: self.customer.firstName(),
                    lastName: self.customer.lastName(),
                    email: self.customer.email(),
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
                }).always(self.waiter.hide);
            }
        }
    };

    self.sendPurchase = function() {
        return function() {
            self.firstShow(false);
            if (self.positionNeeded.isValid() && self.customer.email.isValid()) {
                self.waiter.show();
                var token = $('input[name*=csrf]').val();
                if ($settings.new_csrf.length > 0) {
                    token = $settings.new_csrf;
                }
                $.post($settings.urls.purchase, {
                    purchase: self.positionNeeded(),
                    email: self.customer.email(),
                    csrfmiddlewaretoken: token}).then(function (resp) {
                    // self.showResponse(true); // for form to be invisible, to show only msg or err!!
                    console.log(resp.status);
                    if (resp.status == 0) {
                        console.log(resp);
                        $("#msg").text(resp.success);
                        // self.hideFeedbackForm();
                        // self.customer.email('');
                        self.positionNeeded('');
                    } else {
                        $("p#err").empty();
                        $("p#err").append("Ошибка сервера, повторите попытку позже.");
                    }
                }).always(self.waiter.hide);
            }
        }
    };
    //TODO: BIG TODO !! ADD .fail() on ALL ajax usages in project!!! to avoid server errors not showing on client
    self.sendNotifyMe = function() {
        return function() {
            self.firstShow(false);
            $("p#err").empty();
            if (self.customer.email.isValid() && localStorage.getItem("productInterestedIn")) {
                self.waiter.show();
                var token = $('input[name*=csrf]').val();
                if ($settings.new_csrf.length > 0) {
                    token = $settings.new_csrf;
                }
                $.post($settings.urls.notify_me, {
                    product_id: localStorage.getItem("productInterestedIn"),
                    email: self.customer.email(),
                    csrfmiddlewaretoken: token}).then(function (resp) {
                    // self.showResponse(true); // for form to be invisible, to show only msg or err!!
                    console.log(resp.status);
                    if (resp.status == 0) {
                        console.log(resp);
                        $("#msg").text(resp.success);
                        // self.hideFeedbackForm();
                        // self.customer.email('');
                        localStorage.removeItem("productInterestedIn"); //local storage here ?
                    } else if (resp.status == 3) {
                        $("p#err").append(resp["error"]);
                    } else {
                        $("p#err").append("Ошибка сервера, повторите попытку позже.");
                    }
                }).always(self.waiter.hide).fail(function () {
                    $("p#err").empty();
                    $("p#err").append("Ошибка сервера, повторите попытку позже.");
                });
            }
        }
    };

    self.getProduct = function(productId, evt, vm) {
        return function () {
            $('body').css('overflow', 'hidden');
            var product = self.products.find(productId);
            self.productToView(product);
            if(product.images && product.images.length > 0) {
                var prodImg = $settings.serverRoot + product.images[0].thumb;
            } else {
                var prodImg = $settings.noProdImg;
            }
            carrotquest.track('$product_viewed', {
                $name: product.name,
                $url: 'http://eshfresh.org/#'+product.catLink,
                $amount: product.cost,
                $img: prodImg
            });
            // carrotquest.track('Открыл просмотр продукта из категории "' + product.catName + '"', {
            //   product: product.name,
            //   productId: product.id,
            //   categoryName: product.catName,
            //   categoriId: product.catId
            // });
            $(".tap-icon-cont").on("click", function(elem, event) {
                // console.log(this);
                if (! $(this).siblings("#photo-container").children(".fit-width").hasClass("full-height")) {
                    $(this).siblings("#photo-container").children(".fit-width").addClass("full-height");
                    $(this).children(".tap-icon").css("opacity", 0);
                } else {
                    $(this).siblings("#photo-container").children(".fit-width").removeClass("full-height");
                    $(this).children(".tap-icon").css("opacity", 0.6);
                }
            });
        }
    };

    self.viewingOff = function() {
        return function () {
            self.productToView(null);
            $('body').css('overflow', 'visible');
        }
    };

    self.syncCart = function(productId, productCount) {
        // var product = this;
        // evt.stopPropagation();
        if (event.target.className.includes("btn")) {
            event.target.blur();
        } else {
            event.target.parentNode.blur();
            event.currentTarget.blur();
        }
        var data = {
            prodId: productId, 
            prodCount: productCount
        };

        $.get($settings.urls.cart.sync +$.param(data)).then(function (resp) {
            console.log(resp.status);
            if (resp.status == 0) {
                
            } else {
                console.log("Error:" + resp.status);                    
            }
        }).always().fail(function (resp) {
            $("#count-ctl").empty();
            $("#count-ctl").append('<p class="text-danger">Ошибка сервера, обновите страницу.</p>');
            $("p#err").empty();
            $("p#err").append("Ошибка сервера, повторите попытку позже.");
        });
    };

    self.showExplDeliveryDate = function() {
        self.exShown(true);
    };
    self.hideExplDeliveryDate = function() {
        self.exShown(false);
    };

    self.shareDescription = ko.computed(function() {
        var text = encodeURIComponent("Друзья! Я сейчас заказываю фермерские продукты на  ешьфреш.рф. Я заказал все, что нужно, но до минимального заказа осталось " + ($settings.minOrderSum() - self.cart.total()) + " рублей. Посмотрите ассортимент, напишите мне в личку и мы вместе оформим заказ!");

        return text;
    });
    self.shareVk = ko.computed(function() {
        var paramsForUrl = {
            image: 'http://eshfresh.org/static/img/main-logo.png'
        };
        var paramsUrlEncoded = $.param(paramsForUrl);
        var url = 'http://eshfresh.org&description='+ self.shareDescription() + '&' + paramsUrlEncoded + '&noparse=true';
        // url = encodeURI(url);
        if (document.getElementById('vk_share_button') == null) {
            console.warn("Can not find vk block");
        } else {
            if (window.VK) {
                // document.getElementById('vk_share_button').innerHTML = VK.Share.button({
                //     // url: "http://eshfresh.org",
                //     // title: "Title",
                //     // description: self.shareDescription(),
                //     // image: "http://eshfresh.org/static/img/main-logo.png",
                //     // noparse: true
                //     url: url
                // },
                // {
                //     type: 'custom', text: '<img src="../static/img/social_buttons/vk_green.png" width="30" height="30">'
                // });
            }
        }
        // return url;
        // var vkButton = document.getElementById("vk_share_button");
        // if (!vkButton || $(vkButton).children("a")[0] == undefined) {
        //     console.warn("Can not find vk button");
        // } else {
        //     var oldUrl = $(vkButton).children("a")[0].href;
        //     $(vkButton).children("a")[0].href = decodeURIComponent(oldUrl);
        // }
    });
    self.decodedUrlFroVkShare = ko.computed(function () {
        if (self.shareVk()) {
            console.log("Change vk link href here");
        }
    });
}
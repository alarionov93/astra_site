/**
 * Created by sanya on 17.03.16.
 */
;

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

function Product(id, catId, catName, catLink, name, contents, bestBefore, storageCond, sellerRec, desc, fatness, energy, time_of_growth,
                 is_in_sale, cost, inStock, leftInStock, images,
    min, units, seller, maxSale, farmerArrival, arrClosest, isInCart, count) {
	var self = this;
	this.id = id;
    this.catId = catId;
    this.catName = catName;
    this.catLink = catLink;
    this.name = name;
    this.contents = contents;
    this.bestBefore = bestBefore;
    this.storageCond = storageCond;
    this.sellerRec = sellerRec;
    this.desc = desc;
    this.fatness = fatness;
    this.energy = energy;
    this.timeOfGrowth = time_of_growth;
    this.prodIsInSale = is_in_sale; //exactly product, not seller is in sale
    this.cost = cost;
    this.inStock = inStock; // boolean field!!
    this.leftInStock = leftInStock;
    this.images = images;
    this.units = units;
    this.minAmount = min;
    this.seller = seller;
    // this.arrivalAt = arrival;
    this.maxSale = maxSale;
    this.farmerArrival = farmerArrival;
    this.arrClosest = parseInt(arrClosest["delivery_day"]); //day in month
    this.arrClosestMonth = parseInt(arrClosest["delivery_month"])-1;
    this.arrClosestYear = parseInt(arrClosest["delivery_year"]);
    this.deliveryDateObj = ko.observable();
    this.hasMetadata = ko.computed(function () {
        return !! (self.contents || self.bestBefore || self.storageCond || self.sellerRec || self.desc || self.fatness
            || self.energy || self.timeOfGrowth);
    });
    this.isWeighted = ko.computed(function() {
        return self.units == "кг";
    });
    this.isInSale = ko.computed(function() {
        return !!self.seller.in_sale; //seller of this product has a sale
    });
    this.prepareContents = function() {
        if (self.contents) {
            self.contents = self.contents.split("\n");
        }
        if (self.desc) {
            self.desc = self.desc.split("\n");
        }
        if (self.energy) {
            self.energy = self.energy.split("\n");
        }
    }();

    this.arrivalAtString = ko.computed(function() {
        if (self.arrClosest !== -1) {
            var now = new Date();
            var year = self.arrClosestYear;
            var month = self.arrClosestMonth;
            var date = self.arrClosest;
            var delivery_date = new Date(year, month, date);
            self.deliveryDateObj(delivery_date);
            var dayOfWeek = delivery_date.getUTCDay(); //TODO: IMPORTANT! USE getUTCDay ONLY!!
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
            switch (dayOfWeek) {
                case 0: 
                    dayOfWeekStr = "пн";
                    break;
                case 1: 
                    dayOfWeekStr = "вт";
                    break;
                case 2: 
                    dayOfWeekStr = "ср";
                    break;
                case 3: 
                    dayOfWeekStr = "чт";
                    break;
                case 4: 
                    dayOfWeekStr = "пт";
                    break;
                case 5: 
                    dayOfWeekStr = "сб";
                    break;
                case 6: 
                    dayOfWeekStr = "вс";
                    break;
            }

            return dayOfWeekStr + ", " + date + " " + monthStr;
        }

    });

    if(isInCart) {
    	this.isInCart = ko.observable(true);
    } else {
    	this.isInCart = ko.observable(false);
    }
    if (count) {
        this.count = ko.observable(count);
    } else {
        this.count = ko.observable(1);
    }

    // this.count.isValid = ko.computed(function() {
    //     if (self.count() < 1) {
    //         self.count(0);
    //         return true;
    //     }
    //     return true;
    // });

    this.positionAmount = ko.computed(function() {
        var amount = (self.count() * self.minAmount).toFixed(2);
        if (parseInt(amount[amount.length-1]) == 0) {
            amount = (self.count() * self.minAmount).toFixed(1);
        }
        if (parseInt(amount.split(".")[1]) == 0) {
            amount = (self.count() * self.minAmount).toFixed(0);
        }
        return amount;
    });
    this.pureCount = count;
    this.count.subscribe(function(value) {
	    self.pureCount = value;
	});
	this.price = ko.computed(function() {
    	if(self.count() > 1) {
    		return self.cost * self.count();
    	}
    	
    	return self.cost;
    });
    this.increaseCount = function(syncCart) {
        return function(syncCart) {
            var count = parseInt(self.count());
            self.count(count + 1);
            if (syncCart) {
                VM.syncCart(self.id, self.count());
            }
        };
    };
    this.decreaseCount = function(syncCart) {
        return function(syncCart) {
            var count = parseInt(self.count());
            if(count > 1) {
                self.count(count - 1);
                if (syncCart) {
                    VM.syncCart(self.id, self.count());
                }
            }
        };
    };
}

function Order(id, date, number, phone, email, products, total, address, cityArea, deliveryType, deliveryPrice, deliveryDate, deliveryTimePeriod, companyAddress, status, paymentStatus, msg) {
    var self = this;
    this.id = id;
    this.date = date;
    this.number = number;
    this.phone = phone;
    this.email = email;
    this.items = products;
    this.total = total;
    this.address = address;
    this.cityArea = cityArea;
    this.deliveryType = deliveryType;
    this.deliveryPrice = deliveryPrice;
    this.deliveryDate = deliveryDate;
    this.deliveryTimePeriod = deliveryTimePeriod;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.companyAddress = companyAddress;
    this.success = msg;

    self.isPaid = ko.computed(function() {
        var found = false;
        for (var i = 0; i < $settings.paymentStatusesPaidIds.length; i++) {
            if(parseInt($settings.paymentStatusesPaidIds[i]) === parseInt(self.paymentStatus.value)) {
                found = true;
            }
        }

        return found;
    });
    self.isCancelled = ko.computed(function () {
        var found = false;
        for (var i = 0; i < $settings.paymentStatusesCancelledIds.length; i++) {
            if(parseInt($settings.paymentStatusesCancelledIds[i]) === parseInt(self.paymentStatus.value)) {
                found = true;
            }
        }

        return found;
    });

    self.payLink = ko.computed(function() {
        if (!self.isCancelled() && !self.isPaid()) {
            return location.origin + "/cart/pay/" + self.id + "/";            
        }
    });
}

function Waiter() {
    var self = this;
    self.status = ko.observable(false);
    self.show = function () {
        self.status(true);
    };
    self.hide = function () {
        self.status(false);
    };
}

function DeliveryType(name, id) {
    this.name = name;
    this.id = id;
}

function Category(id, name, products, link) {
    var self = this;
    this.id = id;
    this.name = name;
    this.products = products;
    this.link = link;
    this.productsToShow = ko.observableArray(); //important !! Do NOT initialize observableArrays with some arrays from outside of a constructor!!
    // this.productsToShow.subscribe(function(value) {
    //     this.products = value;
    // });

    // TODO: initialize productsToShow() !!

    this.expanded = ko.observable(false);
    self.scrollHeight = ko.observable(0);

    this.init = function() {
        for (var i = 0; i < $settings.countOfProductsToShow; i++) {
            if(self.products[i] != undefined) {
                self.productsToShow.push(self.products[i]);
            }
        }
    }();

    this.expand = function() {
        disableScroll();
        VM.categories.collapseAll();
        self.productsToShow.removeAll();
        for (var i = 0; i < self.products.length; i++) {
            self.productsToShow.push(self.products[i]);
        }
        console.log(self.productsToShow());
        self.expanded(true);
        enableScroll();
    };
    /**
     *
     * @param scroll (boolean)
     * if true: force page to scroll
     * to the top of collapsed category
     */
    this.collapse = function(scroll) {
        // disableScroll();
        self.productsToShow.removeAll();
        for (var i = 0; i < $settings.countOfProductsToShow; i++) {
            if(self.products[i] != undefined) {
                self.productsToShow.push(self.products[i]);
            }
        }
        console.log(self.productsToShow());
        // TODO: set go back to top of this category DONE
        if (scroll) {
            $('body').animate({
                scrollTop: $("#" + self.link).position().top - $settings.categoriesHeaderHeight
            }, 500);
        }
        self.expanded(false);
        // enableScroll();
    };
    this.showCollapseButton = ko.computed(function() {
        var height = self.scrollHeight() > 0;
        var catIsOnScreen = $('.products-container#' + self.link).is(':onscreen');

        return !!catIsOnScreen;
    });
}

function CityArea(id, name, deliveryPrice, freeShippingPrice) {
    this.id = id;
    this.name = name;
    this.deliveryPrice = deliveryPrice;
    this.freeShippingPrice = freeShippingPrice;
}
/**
 *
 * @param saleProducts //array
 * @constructor
 */
function SaleProductsController(saleProducts) {
    var self = this;

    this.saleProducts = saleProducts;
    this.productTilesRendered = ko.observable(false); //needs to re-evaluate computed value in SaleProductsController
    // this.screenWidth = ko.observable(window.innerWidth); //initial value
    // this.prodCountInGroup = ko.computed(function () {
    //     if (self.productTilesRendered()) {
    //         var recalculate = true;
    //     }
    //     var tiles = $(".sale-product-tile");
    //     var i = 0, tile;
    //     switch (true) {
    //         case self.screenWidth() > 992:
    //             // TODO: change classes of .sale-product-tile as 12/return value
    //             // TODO: for example: return value = 4 -> class value = 12/4 = 3 (!!!)
    //             for (i = 0; i < tiles.length; i++) {
    //                 tile = $(tiles).get(i);
    //                 // $(tile).removeClass();
    //                 // $(tile).addClass("sale-product-tile col-lg-3 col-sm-3 col-xs-3");
    //             }
    //             return 4;
    //         case self.screenWidth() > 768:
    //             for (i = 0; i < tiles.length; i++) {
    //                 tile = $(tiles).get(i);
    //                 // $(tile).removeClass();
    //                 // $(tile).addClass("sale-product-tile col-lg-4 col-sm-4 col-xs-4");
    //             }
    //             return 3;
    //         case self.screenWidth() > 560:
    //             for (i = 0; i < tiles.length; i++) {
    //                 tile = $(tiles).get(i);
    //                 // $(tile).removeClass();
    //                 // $(tile).addClass("sale-product-tile col-lg-6 col-sm-6 col-xs-6");
    //             }
    //             return 2;
    //         default:
    //             return 2;
    //     }
    // });
    // this.groups = ko.observableArray();
    // this.groupsCount = ko.computed(function () {
    //     var remainder = parseInt(self.saleProducts.length) % parseInt(self.prodCountInGroup());
    //     var count = ~~(parseInt(self.saleProducts.length) / parseInt(self.prodCountInGroup()));
    //     if (remainder) {
    //         return count+1;
    //     }
    //     return count;
    // });
    // this.updateGroups = ko.computed(function() {
    //     self.groups.removeAll();
    //     var prodWithinGroup = [];
    //     for (var j = 0; j <= self.groupsCount()-1; j++) {
    //         var product;
    //         prodWithinGroup = [];
    //         for (var i = 0; i < self.prodCountInGroup(); i++) {
    //             product = self.saleProducts[i + (j * self.prodCountInGroup())];
    //             if (product !== undefined) {
    //                 prodWithinGroup.push(product);
    //             }
    //         }
    //         self.groups.push(prodWithinGroup);
    //     }
    // });
    // $(window).resize(function() {
    //     self.screenWidth(window.innerWidth);
    // });
    /* new properties */
    this.listRight = function() {
        var blockToScroll = $('#sale-products-container')[0];
        if ($(blockToScroll)[0].scrollLeft + window.innerWidth <= $(blockToScroll)[0].scrollWidth) {
            $(blockToScroll).animate({
                scrollLeft: $(blockToScroll)[0].scrollLeft + 300
            }, 500);
        }
    };
    this.listLeft = function () {
        var blockToScroll = $('#sale-products-container')[0];
        if ($(blockToScroll)[0].scrollLeft > 0) {
            $(blockToScroll).animate({
                scrollLeft: $(blockToScroll)[0].scrollLeft - 300
            }, 500);
        }
    };
    this.productsInSale = ko.observableArray(saleProducts);
}
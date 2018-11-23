;

// function ProductListViewModel() {
// 	var self = this;
// 	self.products = ko.observableArray();

// 	self.updateSortOrder = function(productId) {
//         var token = $('input[name*=csrf]').val();
//         var sort_id = 1;
// 		var data = {
//             sort_id: sort_id,
//             csrfmiddlewaretoken: token
//         };
//         $.post('products/sort/'+productId+'/', $.param(data)).then(function (resp) {
//             console.log(resp);
//         }).always().fail(function () {
//         });
// 	}
// }

// PLVM = new ProductListViewModel();
// ko.applyBindings(PLVM);

//TODO: why KO is not firing event????

$(document).ready(function() {
	// $(".sort-update").each(function() {
	// 	$(this).click(function() {
	// 		console.log(this);
	// 	});
	// });
	$(document).keypress(function(e) {
	    if(e.which == 13) {
			e.preventDefault();
	    	console.log(this);
	    	console.log(e);
	    }
	});
});


function updateSortOrder(productId) {
    var token = $('input[name*=csrf]').val();
    var sort_id = $('input#product-'+productId).val();
	var data = {
        sort_id: sort_id,
        csrfmiddlewaretoken: token
    };
    $.post('products/sort/'+productId+'/', $.param(data)).then(function (resp) {
        console.log(resp);
        if (resp.status == 0) {
            $("input#product-"+productId).parents("tr").css("background-color", "#248624");
            $("input#product-"+productId).parents("tr").css("transition", "0.2s");
            setTimeout(function() {
                $("input#product-"+productId).parents("tr").css("background-color", "");
            }, 700);
        } else {
            $("input#product-"+productId).parents("tr").css("background-color", "#f00");
            $("input#product-"+productId).parents("tr").css("transition", "0.2s");
            setTimeout(function() {
                $("input#product-"+productId).parents("tr").css("background-color", "");
            }, 700);
        }
    }).always().fail(function () {
        $("input#product-"+productId).parents("tr").css("background-color", "#f00");
        $("input#product-"+productId).parents("tr").css("transition", "0.2s");
        setTimeout(function() {
        	$("input#product-"+productId).parents("tr").css("background-color", "");
        }, 700);
    	console.error("Falied!");
    });
}

function updateProdCategory(productId) {
    var token = $('input[name*=csrf]').val();
    var cat_id = $('select#change-cat-'+productId).val();
	var data = {
        cat_id: cat_id,
        csrfmiddlewaretoken: token
    };
    $.post('change_category/'+productId+'/', $.param(data)).then(function (resp) {
        console.log(resp);
        if (resp.status == 0) {
            $("select#change-cat-"+productId).parents("tr").css("background-color", "#248624");
            $("select#change-cat-"+productId).parents("tr").css("transition", "0.2s");
            setTimeout(function() {
                $("select#change-cat-"+productId).parents("tr").css("background-color", "");
            }, 700);
        } else {
            $("select#change-cat-"+productId).parents("tr").css("background-color", "#f00");
            $("select#change-cat-"+productId).parents("tr").css("transition", "0.2s");
            setTimeout(function() {
                $("select#change-cat-"+productId).parents("tr").css("background-color", "");
            }, 700);
        }
    }).always().fail(function () {
        $("select#change-cat-"+productId).parents("tr").css("background-color", "#f00");
        $("select#change-cat-"+productId).parents("tr").css("transition", "0.2s");
        setTimeout(function() {
            $("select#change-cat-"+productId).parents("tr").css("background-color", "");
        }, 700);
    	console.error("Falied!");
    });
}
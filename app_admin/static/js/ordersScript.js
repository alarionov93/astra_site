/**
 * Created by sanya on 09.01.17.
 */
// function OrdersViewModel() {
//     var self = this;
//     self.orders = ko.observableArray();
// }

$(document).ready(function() {
    $(".checkOrder").each(function(index) {
        $(this).on('click', function() {
            console.log(newLocation);
            console.log(index);
            if(event.target.id == "checkOrderControl") {
                updateOrderChecked(parseInt(event.target.name)); //TODO: 9 is temp value
            } else {
                window.location = newLocation;
            }
        });
    });
});

function updateOrderChecked(id) {
    console.log("Update checked order");
    $.ajax({
      type: 'GET',
      url: 'checked/'+id,
      data: {},
      success: function(res) {
        console.log(res);
      }
    });
}


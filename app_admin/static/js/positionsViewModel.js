/**
 * Created by sanya on 25.05.17.
 */

function PositionsViewModel() {
    var self = this;

    var t = setInterval(function() {
        $.get('/admin_zhopa_123/items_new/', function(resp) {
            console.log(resp);
            if (resp['ready'] !== 0) {
                clearInterval(t);
                return 0;
            }
        })}, 10000
    );

    // $.get('/admin_zhopa_123/items_new/', function(resp) {
    //     console.log(resp);
    // });
}

$(document).ready(function () {
    var form = $('form#period_select');
    form.submit(function(evt) {
        evt.preventDefault();
        var period = $('input[name=period]').val();
        var url = "/admin_zhopa_123/items_new/";
        if (typeof period !== "undefined" && period.length > 0) {
            url = "/admin_zhopa_123/items_new/?period=" + period
        }
        console.log('Submitted period form.');
        $.get(url, function(resp) {
            console.log(resp);
        });
    })
});

var PVM = new PositionsViewModel();
// ko.applyBindings(PVM);
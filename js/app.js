/**
 * Modules
 */

import * as orders from "./orders.js"

/**
 * Create a bunch of random orders
 */

const _orders = orders.getOrders();



/**
 * Document is ready...
 * This function:
 * • Says "Hi!"
 * • Embeds the randomly generated orders JSON into the DOM
 * • Builds the orders and inserts them into the DOM
 */
$(function() {
//#region

    // Embed the orders into the DOM
    $("#order_store").text(JSON.stringify(_orders))

    // Hello there!
    console.log( "Hi!" );

    /**
     * Build the Orders
     * and add to DOM
     */
    
    for (var i = 0; i < _orders.length; i++) {
        var dom = $(`
        <div class="order" id="${_orders[i].orderNum}">
            <h4 class="order-title">Order #${_orders[i].orderNum}</h4>
            <div class="order-content">
                <!-- THE LEFT SIDE OF AN ORDER -->
                <div class="order-left">
                    <div class="order-left-details">
                        <p class="order-detail stat">Status: <span class="prop">${_orders[i].orderStat}</span></p>
                        <p class="order-detail date">Placed <span class="prop">${_orders[i].orderDay}, ${_orders[i].orderMonth} ${_orders[i].orderDayNum}, ${_orders[i].orderYear}</span> at <span class="prop">${_orders[i].orderTime}</span></p>
                        <p class="order-detail items"><span class="prop">${_orders[i].items.length}</span> Item(s) <span class="view-items link">Show Items</span></p>
                        <div class="items-details">
                        </div>
                    </div>
                </div>
                <div class="order-right">
                    <span class="view-order link" value="${_orders[i].orderNum}">View Order</span>
                    <span class="go-back link" value="${_orders[i].orderNum}">Return</span>
                </div>
            </div>
        </div>
        `);

        // Add the items to the order dom
        for (var n = 0; n < _orders[i].items.length; n++) {
            // Avoid nested loop indexes by just grabbing the item
            var theItem = _orders[i].items[n];

            $(dom).find(".items-details").append(`
                <p class="item-container"><span class="item">${theItem.name}</span> <span class="view-art link" value="${theItem.id}">View Artwork</span></p>
            `)
        }


        $("#hist-orders").append(dom);

    }

    
    // console.log(_orders);
//#endregion
});


/**
 * User clicks a "View Items" link in an order
 */
 $(document).on("click", ".view-items", function() {
//#region
    // alert("Clicked!");
    // Display the items for this order.
    // console.log();
    if ($(this).text().includes("Show")) {
        $(this).text("Hide Items")
    } else {
        $(this).text("Show Items")
    }
    $(this).parent().next().slideToggle();
//#endregion
});

/**
 * User clicks a "View Order" link in an order
 */
$(document).on("click", ".view-order", function() {
    // What order will we display?
    var whatOrder = $(this).attr("value");

    /**
     * Hide and show things
     * Update text
     */
    // Hide all other orders
    $(".order").each(function( index ) {
        if ($( this ).attr("id") != whatOrder) {
            $( this ).hide();
        } else {
            
            // Grab this order from _orders
            for (var i = 0; i < _orders.length; i++) {
                if (_orders[i].orderNum == whatOrder) {
                    // Make DOM adjustments and show items
                    showDetails(this, _orders[i]);
                }
                
            }
                
        }
    });





    // Look up this order in the list of orders returned by the orders.getOrders(); function

    
})

/**
 * User clicks a "Go Back" link in an order
 */

$(document).on("click", ".go-back", function() {
    var whatOrder = $(this).attr("value");

    var jDom = $("#" + whatOrder)

    // Show the filter area
    $("#hist-filter-area").show();

    // Hide Order History header
    $("#hist-head").show();

    // Hide the .item-details, if it's not hidden already
    $(jDom).find(".item-details").show()

    // Hide the .item, if it's not hidden already
    $(jDom).find(".items").show();

    // Show the "Go Back" link instead of the "View Order" link
    $(jDom).find(".go-back").hide();
    $(jDom).find(".view-order").show();

    // Detach the order-details
    $(jDom).find(".order-details").remove();

    // Show all orders
    $(".order").show();

});


function showDetails(jDom, theOrder) {
    /*
    // SLIDE
        // Hide the filter area
        $("#hist-filter-area").slideUp();

        // Hide Order History header
        $("#hist-head").slideUp();

        // Hide the .item-details, if it's not hidden already
        $(jDom).find(".item-details").slideUp();

        // Hide the .item
        $(jDom).find(".items").slideUp();

        // Hide the .item-details, if it's not hidden already
        $(jDom).find(".items-details").slideUp();
    */
    
    // NO SLIDE
        // Hide the filter area
        $("#hist-filter-area").hide();

        // Hide Order History header
        $("#hist-head").hide();

        // Hide the .item-details, if it's not hidden already
        $(jDom).find(".item-details").hide()

        // Hide the .item
        $(jDom).find(".items").hide();

        // Hide the .item-details, if it's not hidden already
        $(jDom).find(".items-details").hide();


    // Swap text if we have to
    var viewItemsLink = $(jDom).find(".view-items");
    if (viewItemsLink.text().includes("Show")) {
        viewItemsLink.text("Hide Items")
    } else {
        viewItemsLink.text("Show Items")
    }

    // Show the "Go Back" link instead of the "View Order" link

    $(jDom).find(".go-back").show();
    $(jDom).find(".view-order").hide();

    if (!$(jDom).find(".order-details").length) {
        // Create the parent
        var dom = `
        <div class="order-details">
        </div>
        `

        // Attach to jDom
        $(jDom).find(".order-content").after(dom)

        // For every item in theOrder.items;
        for (var n = 0; n < theOrder.items.length; n++) {
            var thisItem = theOrder.items[n];

            // Add to dom
            $(jDom).find(".order-details").append(`
                <div class="itm-bucket">
                    <div class="itm-thumb">
                        <img src="${thisItem.jpg}" class="img-thumb" alt="">
                        
                    </div>
                    <div class="itm-details">
                        <div class="itm-det">
                            <span class="itm-title">Product:</span><span class="itm-prop">${thisItem.name}</span>
                        </div>
                        <div class="itm-det">
                            <span class="itm-title">Service:</span><span class="itm-prop">${thisItem.service}</span>
                        </div>
                        <div class="itm-det">
                            <span class="itm-title">Grand Total:</span><span class="itm-prop">${intToCash(thisItem.gt)}</span>
                        </div>
                        <div class="itm-det">
                            <span class="itm-title">Total Due at Checkout:</span><span class="itm-prop">${intToCash(thisItem.dn)}</span>
                        </div>
                        <div class="itm-det">
                            <span class="itm-showmore link">View Details</span>
                            <span class="itm-showart link">View Artwork</span>

                        </div>

                    </div>
                </div>
            `)
        }
    }

    





}



/**
 * Sidebar Behavior ---------------------------------------------------------------------------------------------------
 * https://codepen.io/detonationbox0/pen/bGwoBeg
 */
//#region

/**
 * User clicks on a side-navigation button
 */
 $(document).on("click", ".nav-btn", function() {
    // User clicked on a button in the nav
    // Which one did they click?
    var show = $(this).attr("id").split("-")[0];
    var hide = $(this).attr("id").split("-")[1];

    $(`#page-${show}`).css("display", "flex");
    $(`#page-${hide}`).hide();
    // alert(showHide);

    if (show == "hist") {
        /**
         * NAVIGATING TO HISTORY
         */
        $("#head > h2").text("Order History");
    } else {
        /**
         * NAVIGATING TO CART
         */
         $("#head > h2").text("Shopping Cart");
    }

})


var menuItems = `
<div class="menu-items">
    <div class="menu-item menu-name">Shopping Cart</div>
    <div class="menu-item hov nav-btn" id="cart-hist"><i class="far fa-circle menu-circle"></i>Cart</div>
    <div class="menu-item hov nav-btn" id="hist-cart"><i class="far fa-circle menu-circle"></i>Order History</div>
</div>
`
$(".menu").on("mouseenter", function() {
  if ($(this).attr("id") == "cart") {
    $(this).find('.fas').after(menuItems);
  }
}).on("mouseleave", function() {
    if ($(this).attr("id") == "cart") {
        $(this).find('.menu-items').remove();
    }
});

//#endregion

function intToCash(num) {
    return num.toLocaleString('en-US', {style:'currency', currency:'USD'})
}
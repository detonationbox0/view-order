/**
 * Modules
 */

import * as orders from "./orders.js"
// import { printJS } from "./print.min.js";

/**
 * Create a bunch of random orders
 */

const _orders = orders.getOrders();
// console.log(_orders)


/**
 * Document is ready...
 * This function:
 * • Says "Hi!"
 * • Embeds the randomly generated orders JSON into the DOM
 * • Builds the orders and inserts them into the DOM
 */
$(function() {
//#region

    // FLYOUT
    // DEBUG
    console.log(_orders[0].items[0]);
    // $("#fo").animate({width: "300px"}, 300, function() {
    //     $("#fo-content").fadeIn("fast");
    // });

    /**
     * Initialize Date Pickers
     */
     $( ".datepicker" ).datepicker();



    // Hello there!
    console.log( "Hi!" );

    // Embed the orders into the DOM
    $("#order_store").text(JSON.stringify(_orders))


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

                    </div>
                </div>
                <div class="order-right">
                    <span class="view-order link" value="${_orders[i].orderNum}">View Order</span>
                    <span class="go-back link" value="${_orders[i].orderNum}">Return</span>
                </div>

            </div>
            <p class="order-detail items"><span class="prop">${_orders[i].items.length}</span> Item(s) <span class="view-items link">Show Items</span></p>
            <div class="items-details">
            </div>
        </div>
        `);

        // For each store, add DOM
        var stores = [];
        for (var n = 0; n < _orders[i].items.length; n++) {
            var storename = _orders[i].items[n].shipto;

            if (!stores.includes(storename)) {

                // Create bucket including this item
                $(dom).find(".items-details").append(`
                    <div class="items-storename" value="${storename}">${storename}<i class="fas fa-chevron-right fa-sm rotate-90"></i></div>
                    <div class="items-items" >
                        <p class="item-container"><span class="item link" value="${_orders[i].items[n].id}">${_orders[i].items[n].name}</span></p>
                    </div>                
                `);

                stores.push(storename); // Add to bucket because it's not there yet

            } else {
                // Store is already in bucket, add item to the bucket
                $(dom).find(".items-details").find(`.items-storename[value=\"${storename}\"]`).next().append(`
                    <p class="item-container"><span class="item link" value="${_orders[i].items[n].id}">${_orders[i].items[n].name}</span></p>
                `)
            }


        }

       /**
        for (var n = 0; n < _orders[i].items.length; n++) {
            // Avoid nested loop indexes by just grabbing the item
            var theItem = _orders[i].items[n];

            $(dom).find(".items-details").append(`
                <p class="item-container"><span class="item">${theItem.name}</span> <span class="view-item link" value="${theItem.id}">View Details</span></p>
            `)
        }
         */
        // Add the items to the order dom



        $("#hist-orders").append(dom);



        // console.log("Number of orders:")
        // console.log();



    }


    /**
     * Initialize and set up Orders Placed In... area
     */
    //#region
    //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay); // Number of days since Jan 1
    // console.log("Days since jan 1: " + day)
    $("#date-sel").append(`<option value="${day}">${now.getFullYear()}</option>`)

    $('#date-sel').select2({
        minimumResultsForSearch: -1
    });

    var showHideOrders = countOrdersFrom(_orders, 7);
    console.log("Hide these orders:");

    // Update order count
    $(".num-orders").text(showHideOrders[0].length)

    console.log(showHideOrders[1]);
    for (var i = 0; i < showHideOrders[1].length; i++) {
        $("#" + showHideOrders[1][i]).hide();
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
//#region
    // If the fly over is already visible, hide it before continuing
    $("#fo-content").empty();
    $("#fo").animate({width: "0px"}, 100, function() {
    });



    // $("#hist-orders").animate({margin: "10px auto 10px 10px"}, 100, function() {
    // });
    


    // Grab the order
    var orderID = $(this).attr("value");


        // Hide other orders
        // $(".order").not(`#${orderID}`).slideUp();

    for (var n = 0; n < _orders.length; n++) {
        if (_orders[n].orderNum == Number(orderID)) {
            var theOrder = _orders[n];
        }
    }
    console.log(theOrder);

    // FLYOUT
    $("#fo").animate({width: "300px"}, 300, function() {

        /**
         * Create Order Details DOM
         */

        var dom = `
        <div id="fo-name">Order #${theOrder.orderNum}</div>
        <div id="fo-details">
            <div class="fo-stores">
                <!-- Order's stores go here -->
            </div>
        </div>
        <div id="fo-totals">
            <div class="fo-totals-area">
                <div class="fo-totals-name">Total Store(s)</div>
                <div class="fo-totals-val fo-num-stores">$0.00</div>
            </div>
            <div class="fo-totals-area">
                <div class="fo-totals-name">Total Items(s)</div>
                <div class="fo-totals-val fo-total-items">4</div>
            </div>
            <div class="fo-totals-area">
                <div class="fo-totals-name fo-b">Order Total</div>
                <div class="fo-totals-val fo-b fo-order-total">$6,000.00</div>
            </div>
            <div class="fo-totals-area">
                <div class="fo-totals-name fo-b">Due Now</div>
                <div class="fo-totals-val fo-b fo-due-now">$123.00</div>
            </div>
        </div>
        <div id="fo-actions">
            <button class="fo-button" id="fo-close">Close</button>
            <button class="fo-button print" id="fo-print-order" onclick="printJS('fo-content', 'html')">Print</button>
        </div>
        `
        // Append the DOM skeleton
        $("#fo-content").empty().append(dom);

        // Analyze and build order details
        var orderDetails = {
            count:0
        };

        // Grab the stores from the order
        var stores = [];

        // Add the stores
        for (var x = 0; x < theOrder.items.length; x++) {
            if (!stores.includes(theOrder.items[x].shipto)) {

                // Calculate this item's total cost
                var totalC = (theOrder.items[x].tmc + theOrder.items[x].tpc);
                var strTotalC = intToCash(totalC);

                console.log(totalC);

                $(".fo-stores").append(`
                    <div class="fo-store" store="${theOrder.items[x].shipto}">
                        <div class="fo-store-title" value="">
                            <div class="fo-store-name">${theOrder.items[x].shipto}</div>
                            <div class="fo-store-items" value="${theOrder.orderNum}"><span class="count">1</span> Item(s)</div>
                        </div>
                        <div class="fo-store-details">
                            <div class="fo-store-detail">
                                <div class="fo-store-total">Total Due</div>
                                <div class="fo-store-total-price" value="${totalC}">${strTotalC}</div>
                            </div>
                            <div class="fo-store-detail dn">
                                <div class="fo-store-total dn-title">Total Due</div>
                                <div class="fo-store-due-price dn-price" value="${theOrder.items[x].tpc}">${intToCash(theOrder.items[x].tpc)}</div>
                            </div>
                        </div>
                    </div>
                `);

                stores.push(theOrder.items[x].shipto);

            } else {

                /**
                 * Store already exists. Perform calculations, update prices for store
                 * ===================================================================
                 */

                // Create a new total price
                var storeSel = `.fo-store[store="${theOrder.items[x].shipto}"]`;
                var curTotal = Number($(storeSel).find(".fo-store-total-price").attr("value"));
                var addTotal = (theOrder.items[x].tmc + theOrder.items[x].tpc);

                // Create a new print only price
                var poCurTotal = Number($(storeSel).find(".fo-store-due-price").attr("value"));
                var poAddTotal = (poCurTotal + theOrder.items[x].tpc);

                console.log(`poAddTotal: ${poAddTotal}`)

                // Update existing total price to new total price
                $(storeSel).find(".fo-store-total-price").text(intToCash(curTotal + addTotal)).attr("value", curTotal + addTotal);

                // Update existing total due price to new total due price
                $(storeSel).find(".fo-store-due-price").text(intToCash(poAddTotal)).attr("value", poAddTotal);

                
                // Increase item count for store ("x Item(s)")
                $(storeSel)
                    .find(".count") // Item count's span within the store
                        .text(
                            Number( // Coerce current count to number
                                $(`.fo-store[store="${theOrder.items[x].shipto}"]`)
                                    .find(".count")
                                        .text()
                            ) + 1 // Add 1 to the item's count (which is 1 by default)
                        )
            }
            
        }

        // Calculate totals for all stores, update totals in order details
        var totalDues = $(".fo-stores").find(".fo-store-total-price"); // Array of DOM elems
        var numTotal = 0;
        for (var i = 0; i < totalDues.length; i++) {
            numTotal = numTotal + Number($(totalDues[i]).attr("value"))
        }

        // Calculate total number of orders, update order count in order details
        var lenOrders = $(".fo-stores").find(".count");
        var numOrders = 0;
        for (var i = 0; i < lenOrders.length; i++) {
            numOrders = numOrders + Number($(lenOrders[i]).text())
        }
        
        // Calculate totals for all due nows, update total due now in order details
        var lenDueNow = $(".fo-stores").find(".fo-store-due-price");
        var numDueNow = 0;
        for (var i = 0; i < lenOrders.length; i++) {
            numDueNow = numDueNow + Number($(lenDueNow[i]).attr("value"))
        }


        // console.log()
        // console.log(`numOrders = ${}`)

        // Update order summary values
        $(".fo-num-stores").text(totalDues.length);
        $(".fo-total-items").text(numOrders);
        $(".fo-order-total").text(intToCash(numTotal));
        $(".fo-due-now").text(intToCash(numDueNow));

        // console.log(`numTotal = ${numTotal}`)

/*
        var storesDOM = `
        <div class="fo-store">
            <div class="fo-store-title">
                <div class="fo-store-name">Marco's Pizza - Delaware - 1010</div>
                <div class="fo-store-items">2 Item(s)</div>
            </div>
            <div class="fo-store-details">
                <div class="fo-store-detail">
                    <div class="fo-store-total">Total Due</div>
                    <div class="fo-store-total-price">$0.00</div>
                </div>
                <div class="fo-store-detail dn">
                    <div class="fo-store-total dn-title">Total Due</div>
                    <div class="fo-store-total-price dn-price">$0.00</div>
                </div>
            </div>
        </div>
        `
*/
        
        $("#fo-content").fadeIn("fast");
    });

    /*
    
    */




    // console.log("Clicked");
//#endregion
})

/**
 * User clicks a "Close" link in an order
 */
 $(document).on("click", ".fo-button", function() {
//#region
    $("#fo-content").fadeOut("fast", function() {

        // FLY BACK
        $("#fo").animate({width: "0px"}, 300, function() {
        });
    });
    // FLYOUT

    // console.log("Clicked");
//#endregion
})


/**
 * User clicks a "View Details button"
 */
$(document).on("click", ".item", function() {
//#region
    // If the fly over is already visible, hide it before continuing
    $("#fo-content").empty();
    $("#fo").animate({width: "0px"}, 100, function() {
    });

    // Which item are we looking at?
    var itemID = $(this).attr("value");
    console.log(itemID);

    var theItem = undefined;

    // Get this item's details
    for (var i = 0; i < _orders.length; i++) {
        for (var n = 0; n <_orders[i].items.length; n++) {
            var checkOrder = _orders[i].items[n];
            if (checkOrder.id == itemID) {
                theItem = checkOrder;
                continue;
            }
        }
        // continue;
    }

    console.log(theItem);

    // FLY IN
    $("#fo").animate({width: "300px"}, 300, function() {
        var dom = `
        <div id="fo-thumb">
            <img src="${theItem.jpg}" alt="" id="fo-img">
        </div>
        <div class="image-links">
            <a class="link image-link" target="_blank" href="${theItem.jpg.replace("ArtworkThumbnail", "ArtworkThumbnailPDF").replace(".jpeg", ".pdf")}">View Artwork</a>
            <a class="link image-link" target="_blank" href="mailto:todd@themailshark.com">Email Artwork</a>
        </div>
        <div id="or-details">
            <div class="or-section" id="or-dm">
                <div class="or-section-head">Mailing</div>
                <div class="or-detail">
                    <div class="or-detail-name">Quantity:</div>
                    <div class="or-detail-val or-qty">${theItem.qty}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">Price per Piece:</div>
                    <div class="or-detail-val or-ppp">${intToCash(theItem.ppp)}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">First In-Home Week:</div>
                    <div class="or-detail-val or-inhome">${theItem.inhome}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">Mailing Weeks:</div>
                    <div class="or-detail-val or-weeks">${theItem.weeks}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name or-b">Total Mailing Cost:</div>
                    <div class="or-detail-val or-tmc or-b">${intToCash(theItem.tmc)}</div>
                </div>
            </div>
            <div class="or-section" id="or-pc">
                <div class="or-section-head">Print Copies</div>
                <div class="or-detail">
                    <div class="or-detail-name">Ship To:</div>
                    <div class="or-detail-val or-shipto">${theItem.shipto}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">Print Copies:</div>
                    <div class="or-detail-val or-pqty">${theItem.pqty}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">Print Cost:</div>
                    <div class="or-detail-val or-pc">${theItem.pc}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name or-ship">Shipping:</div>
                    <div class="or-detail-val or-ship">${intToCash(theItem.ship)}</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name or-b or-tpc">Total Print Cost:</div>
                    <div class="or-detail-val or-tpc or-b">${intToCash(theItem.tpc)}</div>
                </div>
            </div>
            <div class="or-section" id="or-tc">
                <div class="or-detail">
                    <div class="or-detail-name">Payment Method:</div>
                    <div class="or-detail-val or-pm">CC - Ending in 1713</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name">Debit On:</div>
                    <div class="or-detail-val or-do">Monday</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name or-b">Grand Total:</div>
                    <div class="or-detail-val or-b or-gt">$17,310.99</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name  or-b">Total Weekly Cost:</div>
                    <div class="or-detail-val or-b or-twc">$670.46</div>
                </div>
                <div class="or-detail">
                    <div class="or-detail-name or-b or-ship">Payments Begin:</div>
                    <div class="or-detail-val or-b or-pb">August 3, 2021</div>
                </div>
                <div class="or-detail or-sum">
                    <div class="or-detail-name or-b or-tpc">Due Now:</div>
                    <div class="or-detail-val or-b">$0.00</div>
                </div>
            </div>
            <div id="fo-actions">
                <button class="fo-button" id="fo-close">Close</button>
                <button class="fo-button print" id="fo-print-item" onclick="printJS({
                    printable:"fo-content",
                    type:"html"
                })">Print</button>
            </div>
        </div>
        `

        $("#fo-content").empty().append(dom).fadeIn("fast");
    });
//#endregion
});

/**
 * User clicks a filter option
 */

$(document).on("click", ".filter-link", function() {
//#region
/** OBSOLETE ↓

    var whichFilter = $(this).text().toLowerCase();

    // Show all orders
    $(".order").show();

    switch (whichFilter) {
        case "date":
            console.log("Sliding down...")
            $("#filter-slide").slideDown();
            $(".filter-controls").empty().append(`
                <div class="filter-control date-control">
                    <p class="filter-name">Start Date</p>
                    <input type="text" class="datepicker">
                </div>
                <div class="filter-control date-control">
                    <p class="filter-name">End Date</p>
                    <input type="text" class="datepicker">
                </div>
                `);


            // Init the datepicker
            console.log("Initing the datepickers...")
            $(".datepicker" ).datepicker();
            break;
        case "search":
            console.log("Sliding down...")
            $("#filter-slide").slideDown();
            $(".filter-controls").empty().append(`
                <div class="filter-control hidden-control search-control">
                    <input type="text" id="search-text" placeholder="Search orders...">
                </div>
                `);
            break;
        case "store":
            console.log("Sliding down...")
            $("#filter-slide").slideDown();
            $(".filter-controls").empty().append(`
                <div class="filter-control hidden-control store-control">
                    <select name="stores[]" class="sel sel-store">
                    </select>
                </div>
                `);
            // Loop _orders and add stores 
            var stores = [];
            for (var i = 0; i < _orders.length; i++) {
                for (var n = 0; n < _orders[i].items.length; n++) {
                    if (!stores.includes(_orders[i].items[n].shipto)) {
                        stores.push(_orders[i].items[n].shipto);
                    }
                }
            }
            for (var i = 0; i < stores.length; i++) {
                $(".sel-store").append(`
                    <option>${stores[i]}</option>
                `)
            }

            $('.sel-store').select2();
            break;

        case "product":
            console.log("Sliding down...")
            $("#filter-slide").slideDown();
            $(".filter-controls").empty().append(`
            <div class="filter-control hidden-control product-control">
                <select name="stores[]" class="sel sel-prods">
                </select>
            </div> 
                `);
            // Loop _orders and add products
            var prods = [];
            for (var i = 0; i < _orders.length; i++) {
                for (var n = 0; n < _orders[i].items.length; n++) {
                    if (!prods.includes(_orders[i].items[n].name)) {
                        prods.push(_orders[i].items[n].name);
                    }
                }
            }
            for (var i = 0; i < prods.length; i++) {
                $(".sel-prods").append(`
                    <option>${prods[i]}</option>
                `)
            }
            
            $('.sel-prods').select2();
            break;
    }


 */
//#endregion

});

/**
 * User presses Enter after they've typed something into the searchbar
 */
$(document).on("keyup", "#search-text", function(event) {
    if (event.keyCode === 13) {
        $("#search-button").click();
    }
})


/**
 * User clicks the Search button
 */

$(document).on("click", "#search-button", function() {
//#region
    var typed = $("#search-text").val().toLowerCase(); // Full value of the text field

    if (typed == "") {
        // Cleared. Reset filter to whatever is selected
        var sel = $('#date-sel').trigger("change");

    } else {
        // Loop orders and hide if the order content does not include typed text
        var orders = $(".order");
        for (var i = 0; i < orders.length; i++) {
            var txtOrder = $(orders[i]).html().toLowerCase();
            if (!txtOrder.includes(typed)) {
                // Hide the order
                $(orders[i]).hide();
            } else {
                // Show the order if it's hidden
                $(orders[i]).show();
            }
        }
    }
//#endregion

});

/**
 * User chose a filter from a dropdown
 */

$(document).on("change", ".sel", function() {
//#region
    // alert();
    var filter = $(this).find(":selected").text().toLowerCase();

    // Loop orders and hide if the order content does not include chosen item
    var orders = $(".order");
    for (var i = 0; i < orders.length; i++) {
        var txtOrder = $(orders[i]).html().toLowerCase();
        if (!txtOrder.includes(filter)) {
            // Hide the order
            $(orders[i]).hide();
        } else {
            // Show the order if it's hidden
            $(orders[i]).show();
        }
    }


//#endregion
})

/**
 * User clicks a Store Name
 */

$(document).on("click", ".items-storename", function() {
//#region
    var iTag = $(this).find('i');
    $(this).next().slideToggle("fast", function() {
        // Spin the arrow
        // In callback because if user clicked again before
        // animation completes, arrow rotates to wrong direction
        iTag.toggleClass("rotate-90");
    });

//#endregion
});

/**
 * User clicks the thumbnail
 * 
 */

$(document).on("click", "#fo-img", function() {
//#region
    // alert();
    var pdfURL = $(this).attr("src").replace("ArtworkThumbnail", "ArtworkThumbnailPDF").replace(".jpeg", ".pdf");
    window.open(pdfURL);
//#endregion
})


$(document).on("change", "#date-sel", function() {
//#region 
    
    var numOfDays = $(this).find(":selected").attr("value");
    var showHideOrders = countOrdersFrom(_orders, Number(numOfDays));
    console.log("Hide these orders:");

    // Update order count
    $(".num-orders").text(showHideOrders[0].length)

    console.log(showHideOrders[1]);
    for (var i = 0; i < showHideOrders[1].length; i++) {
        $("#" + showHideOrders[1][i]).hide();
    }

    for (var i = 0; i < showHideOrders[0].length; i++) {
        $("#" + showHideOrders[0][i]).show();
    }
//#endregion
})

/**
 * User clicks on the filter date button
 */
$(document).on("click", "#filter-date-button", function() {
//#region
    console.log("clicked")
    if($(this).text().includes("Hide")) {
        $(this).text("Custom Filter");
        $(".fly-down-dates").slideUp();
        $("#date-sel").prop("disabled", false);
    } else {
        $(this).text("Hide Filter");
        $(".fly-down-dates").slideDown();
        $("#date-sel").prop("disabled", true);
    }
//#endregion
});

$(document).on("click", ".fo-store-items", function () {


    // Get order ID
    var orderID = $(this).attr("value");

    // Get store name
    var storeName = $(this).prev().text();

    // Hide the order's Show Items if it's showing
    if ($(`#${orderID}`).find(".view-items").text().includes("Hide")) {
        $(`#${orderID}`).find(".view-items").click();
    }


    // Hide the order details
    $("#fo-content").empty();
    $("#fo").animate({width: "0px"}, 100, function() {
    });

    // Hide all of the stores stuff in the order and rotate the arrows
    $(`#${orderID}`).find(".items-items").hide();
    $(`#${orderID}`).find(".items-storename").find("i").removeClass("rotate-90")
    

    // Expand the store stuff
    $(`#${orderID}`).find(".view-items").click();

    // Expand the specific store
    // Show the after
    $(`#${orderID}`).find(`div[value="${storeName}"]`).next().show();
    $(`#${orderID}`).find(`div[value="${storeName}"]`).find("i").addClass("rotate-90")
    // $(`#${orderID}`).find(`div[value="${storeName}"]`).next().show();
    // $(`#${orderID}`).find(`div[value="${storeName}"]`).click();

    // $("#fo-content").animate()

})




/**
 * Sidebar Behavior ---------------------------------------------------------------------------------------------------
 * https://codepen.io/detonationbox0/pen/bGwoBeg
 */
//#region

/**
 * User clicks on a side-navigation button
 */
 $(document).on("click", ".nav-btn, .od-btn-history", function() {

     console.log("Clicked")
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


/**
 * 
 * @param {Number} num The number to convert to currency
 * @returns The number converted to a currency string ($0.00)
 */

function intToCash(num) {
    return num.toLocaleString('en-US', {style:'currency', currency:'USD'})
}

function countOrdersFrom(allOrders, num) {
    var hideOrders = [];
    var showOrders = [];
    for (var x = 0; x < allOrders.length; x++) {

        var orderDate = new Date(allOrders[x].orderDate);
        console.log(orderDate);

        var oldDate = new Date();
        oldDate.setDate(oldDate.getDate()-num);



        if (Date.parse(orderDate) < Date.parse(oldDate)) {
            console.log(`${orderDate} is older than ${oldDate}`);
            // HIDE THE ORDER
            hideOrders.push(allOrders[x].orderNum);
        } else {
            console.log(`${orderDate} is newer than ${oldDate}`);
            // SHOW THE ORDER
            showOrders.push(allOrders[x].orderNum);
        }



    }

    return [showOrders, hideOrders];

    // console.log("Hide these orders:")
    // console.log(hideOrders);
}
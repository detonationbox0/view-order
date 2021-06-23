
var stores = [
    "Marco's Pizza - Delaware - 1010",
    "Marco's Pizza - Tiffin - 1029",
    "Marco's Pizza - Fostoria - 1034",
    "Marco's Pizza - Sandusky 1035"
]

var stati = [
    "Placed",
    "Received",
    "On Hold",
    "Cancelled",
    "Printed",
    "Shipped"
]

var type = [
    "Direct Mail",
    "Print Only"
]

var banks = [
    "ACH",
    "CC"
]

var prods = [
    "New! 2 Toppings. 12 Slices. Box Topper",
    "30\" x 40\" Interior Pizza Bowls Window Cling",
    "24\" x 36\" Cut Carbs Into Tasty Pieces Poster",
    "New! Now Hiring (Red Hat) Box Topper"
]

var services = [
    "Direct Mail"
];




// Random order generator
export function getOrders() {
    // Create orders

    // Create anything from 10 - 20 orders
    var numOrders = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    
    // Create bucket to add orders to
    var orderBucket = [];

    for (var i = 0; i < numOrders; i++) {

        // Create a random 8 digit order number starting with 1
        var orderNum = Math.floor(Math.random() * (19999999 - 10000000 + 1)) + 10000000;

        // Get a random status
        var orderStat = stati[Math.floor(Math.random()*stati.length)];
        
        var rndDaysAgo = Math.floor(Math.random() * (30 - 10 + 1)) + 10; // Get date random days ago
        var rndDateInPast = dayjs().subtract(rndDaysAgo, 'day');
        // Order information
        var order = {
            orderNum: orderNum,
            orderStat:orderStat,
            orderDay: rndDateInPast.format('dddd'),
            orderDayNum: rndDateInPast.format('D'),
            orderMonth:rndDateInPast.format('MMMM'), 
            orderYear:rndDateInPast.format("YYYY"), 
            orderTime:rndDateInPast.format("h:mm:ss a"),
            items: [ // Bucket for random items
            ]
        }

        // Create anything from 2 to 6 random items for the order
        // add the random item to the items bucket in the order
        var numItems = Math.floor(Math.random() * (6 - 2 + 1)) + 2;  
        for (var n = 0; n < numItems; n++) {
            var madeItem = order.items.push(createItem());
        }

        // Add order to bucket
        orderBucket.push(order);
    } 

    // Returns a collection of random orders
    // with random items
    return orderBucket;

}

/**
 * Returns a random item
 */
function createItem() {
    
    // To save time, we will use the same item just shipped to different stores
    
    var store = stores[Math.floor(Math.random()*stores.length)]; // Random store
    var bank = banks[Math.floor(Math.random()*banks.length)] + " - Ending in " + (Math.floor(Math.random() * (1999 - 1000 + 1)) + 1000); // Random bank info
    var twentyEightDaysLater = dayjs().add(28, 'day').format("MMMM D, YYYY"); // 28 Days in the Future
    var id = '_' + Math.random().toString(36).substr(2, 9); // Random sequence
    var prod = prods[Math.floor(Math.random()*prods.length)]; // Random product

    var item = {
        id:id, // Unique Identifier
        jpg:"http://www.themailshark.com/prepress/img/example/Artwork_1_23155-8003_91_91_893.jpg", // JPEG Thumbnail
        pdf:"http://www.themailshark.com/prepress/img/example/Artwork_1_23155-8003_91_91_893.pdf", // PDF Proof
        name:prod,
        service:"Direct Mail",
        qty:5000, // Quantity
        ppp:0.455, // Price per Piece
        inhome:twentyEightDaysLater, // In-Home Date
        weeks:4, // Mailing Weeks
        shipto:store, // Name of Store
        pqty: 500, // Print Copies
        pppp:0.785, // Print Price per Piece
        ship:14.34, // Shipping Cost
        pm:bank, // Payment Method
        pb:twentyEightDaysLater, // Payments Begin
        dn:0 // Due Now
    }
   
    // Calculate the rest
    item.tmc = item.ppp * item.qty; // Total Mailing Cost
    item.pc = item.pppp * item.pqty; // Print Cost
    item.tpc = item.pc + item.ship; // Total Print Cost
    item.gt = item.tmc + item.tpc; // Grand Total
    item.twc = item.gt / item.weeks; // Total Weekly Cost


    return item;
}


var stores = [
    "Marco's Pizza - Delaware - 1010",
    "Marco's Pizza - Tiffin - 1029",
    "Marco's Pizza - Fostoria - 1034",
    "Marco's Pizza - Sandusky 1035",
    "Marco's Pizza - Middletown - 1037",
    "Marco's Pizza - Fremont - 1040",
    "Marco's Pizza - Lorain 1042",
    "Marco's Pizza - North Olmsted 1047",
    "Marco's Pizza - Leslie - 1049",
    "Marco's Pizza - Ann Arbor - 1052",
    "Marco's Pizza - North Ridgeville 1053",
    "Marco's Pizza - Norwalk - 1054",
    "Marco's Pizza - Fort Wayne - 1055",
    "Marco's Pizza - Ann Arbor - 1056",
    "Marco's Pizza - Lorain 1058"
]

var stati = [
    "Completed"
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
    {
        prod:"New! 2 Toppings. 12 Slices.",
        thumb:"http://www.themailshark.com/prepress/img/example/Artwork_1_20348-1029_125_153_943"
    },
    {
        prod:"30\" x 40\" Interior Give Your Fork Something To Bag About",
        thumb:"http://www.themailshark.com/prepress/img/example/Artwork_1_20348-1029_99_99_944"
    },
    {
        prod:"24\" x 36\" Cut Carbs Into Tasty Pieces",
        thumb:"http://www.themailshark.com/prepress/img/example/Artwork_1_20348-1029_79_79_945"
    },
    {
        prod:"New! Now Hiring (Red Hat)",
        thumb:"http://www.themailshark.com/prepress/img/example/Artwork_1_20348-1029_154_194_946"
    },
    {
        prod:"New! Interior 2 Pizzas Are Better Than 1",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_118_111"
    },
    {
        prod:"New! Interior Pizzas Tasty Sidekicks",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_130_122"
    },
    {
        prod:"New! Interior Craving Intensified (National)",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_156_128"
    },
    {
        prod:"New! Interior Make Lunch A Big Deal",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_158_130"
    },
    {
        prod:"New! Interior Healthy Appetite? Nailed It.",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_159_131"
    },
    {
        prod:"New! Interior Cut Carbs Into Tasty Slices",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_169_141"
    },
    {
        prod:"New! Interior Some Say Leftovers, We Call 'Em Encores",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_172_144"
    },
    {
        prod:"New! Melty. Saucy. Savory. Pizza-y. (National)",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_175_147"
    },
    {
        prod:"New! Interior Unlimited Medium 1-Topping Pizzas",
        thumb:"http://www.themailshark.com/prepress/img/example/ArtworkThumbnail_1_88_88"
    }
    
]

var services = [
    "Direct Mail"
];




// Random order generator
export function getOrders() {
    // Create orders

    // Create anything from 60 - 80 orders
    var numOrders = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
    
    // Create bucket to add orders to
    var orderBucket = [];

    for (var i = 0; i < numOrders; i++) {

        // Create a random 8 digit order number starting with 1
        var orderNum = Math.floor(Math.random() * (19999999 - 10000000 + 1)) + 10000000;

        // Get a random status
        var orderStat = stati[Math.floor(Math.random()*stati.length)];

        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay); // Number of days since Jan 1
        console.log(day);

        var rndDaysAgo = Math.floor(Math.floor(Math.random() * (day - 1 + 1)) + 1); // Get random day between now and Jan 1

        var rndDateInPast = dayjs().subtract(rndDaysAgo, 'day');

        // console.log("Random date in past:")
        // console.log(rndDateInPast.$d)

        // Order information
        var order = {
            orderNum: orderNum,
            orderStat:orderStat,
            orderDate: rndDateInPast.$d,
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

    // Sort orders by date placed

    orderBucket.sort(function(a, b) {
        return new Date(b.orderDate) - new Date(a.orderDate);
    });

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
    var rndProd = prods[Math.floor(Math.random()*prods.length)]; // Random product
    var prod = rndProd.prod; // Random product's name
    var prodJpg = rndProd.thumb + ".jpeg"; // Random product's thumb
    var prodPdf = rndProd.thumb + ".pdf"; // Random product's thumb

    var item = {
        id:id, // Unique Identifier
        jpg:prodJpg, // JPEG Thumbnail
        pdf:prodPdf, // PDF Proof
        name:prod,
        service:"Direct Mail",
        do:"Monday",
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
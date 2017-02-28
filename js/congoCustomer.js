const mysql = require('mysql');
const prompt = require('prompt');

var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "congo_db"
});

connection.connect(function (err) {
  if (err) throw (err)
  console.log("Connected as id " + connection.threadId);
});

//prompts
var schema = {
  properties: {
    purchaseId: {
      description: "Please enter the id of the item you would like to purchase",
      pattern: /^[1-9][0-9]?/,
      message: 'Please enter a valid id number',
      required: true
    },
    purchaseQuantity: {
      description: "Please enter the quantity of items you would like to purchase",
      pattern: /^[1-9][0-9]?/,
      message: 'Please enter a valid quantity',
      required: true,
    }
  }
};

connection.query('SELECT * FROM products', function (err,products) {
  if (err) throw (err);
  var itemIds = [];
  console.log(products);

  products.forEach(function (item) {
    itemIds.push(item.item_id)
  });

//starts prompts
  prompt.start();

//gets input from user using schema object  
  prompt.get(schema, function (err, user) {

    var purchaseId = parseInt(user.purchaseId);
    var purchaseQuantity = parseInt(user.purchaseQuantity);

    console.log(user.purchaseId);
    console.log(typeof(purchaseQuantity));

    if (itemIds.indexOf(purchaseId) === -1) {
      console.log("This item does not exist")
    } else {
      products.forEach(function (item) {
        var itemId = item.item_id;
        var itemPrice = item.price;
        var itemQuantity = item.stock_quantity;

        if (itemId === purchaseId) {
          if (itemQuantity < purchaseQuantity) {
            console.log("Please select fewer itmes")
          } else {
            var purchaseTotal = itemPrice * purchaseQuantity;
            console.log(`Your total is: $${purchaseTotal}`);
          };
        };
      });
    };
  });
});
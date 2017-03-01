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

//mysql query for products table
connection.query('SELECT * FROM products', function (err,products) {
  if (err) throw (err);
  var itemIds = [];   //empty array to store id's of products//

  console.log(products);

  //loop through products table and push id's of products to itemIds array
  products.forEach(function (item) {
    itemIds.push(item.item_id)
  });

//starts prompts
  prompt.start();

//gets input from user using schema object  
  prompt.get(schema, function (err, user) {

    //user input stored in these variables
    var purchaseId = parseInt(user.purchaseId);   
    var purchaseQuantity = parseInt(user.purchaseQuantity);

    //check if id entered by user exists in products table using itemIds array
    if (itemIds.indexOf(purchaseId) === -1) {
      console.log("This item does not exist")
    } else { //loop through products table
      products.forEach(function (item) {
        var itemId = item.item_id;
        var itemPrice = item.price;
        var itemQuantity = item.stock_quantity;

        //finds item in product table matching itemId entered by user
        if (itemId === purchaseId) {
          //if item quntity is less than user entered purchase quantity transaction is declined
          if (itemQuantity < purchaseQuantity) {
            console.log("Please select fewer itmes")
          } else { //complete transaction when item quantity is more than purchase quantity

            var purchaseTotal = itemPrice * purchaseQuantity;   //variable for transaction price
            var updatedQuantity = itemQuantity - purchaseQuantity;    //variable for updated stock_quantity in products table

            console.log(`Your total is: $${purchaseTotal}`);
            
          //updates item in products table with updatedQuantity
            connection.query(`UPDATE products SET ? WHERE ?`, [{stock_quantity: updatedQuantity}, {item_id: itemId}], function (err,res) {
              if (err) throw (err);
            });
          };
        };
      });
    };
  });
});
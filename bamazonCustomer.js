var mysql = require ("mysql");
var inquirer = require ("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "JW55cw04",
    database: "bamazon"
});

connection.connect(function(error){
    if (error){
        console.log("Error code: " + error);
        return;
    } else {
        console.log("Connected to database as connection " + connection.threadId);
    };
});

// A query which returns all data for songs sung by a specific artist
function findProduct(productName){
    connection.query("SELECT * FROM products WHERE ?", {"product_name": productName}, function (error, results, fields) {
        // error will be an Error if one occurred during the query 
        if (error) console.log("Error: " + error);
        // results will contain the results of the query 
        // fields will contain information about the returned results fields (if any) 
        for (var i = 0; i < results.length; i++){
            //
        }
    });
}

// A query which returns all data for songs sung by a specific artist
function printAllProducts(){
    connection.query("SELECT * FROM products", function (error, results, fields) {
        // error will be an Error if one occurred during the query 
        if (error) console.log("Error: " + error);
        // results will contain the results of the query 
        // fields will contain information about the returned results fields (if any) 
        console.log("-----All Products for Sale------");
        for (var i = 0; i < results.length; i++){
            console.log("Product #" + results[i].item_id);
            console.log("Name: " + results[i].product_name);
            // console.log("Department: " + results[i].department_name);
            console.log("Price: " + results[i].price);
            console.log("-----");
        };
    });
}

function checkAmount(productId, purchaseAmount){
    //check the database
    //return true if amount is available
    //return false if amount is not available
};

function updateInventory(productID, purchaseAmount){
    //remove the content from the database
    for (var i = 0; i < purchaseAmount; i++){
        //remove one line from the database with this productID

    }
};

printAllProducts();

inquirer.prompt([
      {
        type: "input",
        name: "purchaseId",
        message: "Which item would you like to buy (Enter the Product ID Number)? ",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            return true;
          }
          return false;
        }
      },
      {
        type: "input",
        name: "purchaseAmount",
        message: "What quantity would you like to buy? ",
        validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            return true;
          }
          return false;
      }
    ]).then(function(input) {
        //check to see if there is enough quantity left
        if (checkAmount(input,purchaseId, input.purchaseAmount)){
            //if there is enough quantity, update the purchaseID
            updateInventory(input.purchaseId, input.purchaseAmount);
        //else: tell them "insufficient quantity"
        } else {
            console.log("Insufficient quantity");
        }
    });
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

function startShopping(){
    //print all products in the inventory 
    connection.query("SELECT * FROM products", function (error, results, fields) {
        // error will return true if one occurred during the query 
        if (error) {
            console.log("Error: " + error);
            return;
        };
        // display 'results', which will contain the results of the query 
        console.log("-----Start: all products for sale------");
        for (var i = 0; i < results.length; i++){
            console.log(" >>> Product #" + results[i].item_id + " <<< ");
            console.log("Name: " + results[i].product_name);
            //console.log("Department: " + results[i].department_name);
            console.log("Price: " + results[i].price);
            console.log("Quantity: " + results[i].stock_quantity);
        };
        console.log("-----End: all products for sale------");
        //ask the customer what they want to buy and how much
        inquirer.prompt([
            {
                type: "input",
                name: "purchaseId",
                message: "Which item would you like to buy (Enter the Product ID Number)? "
            },
            {
                type: "input",
                name: "purchaseAmount",
                message: "What quantity would you like to buy? "
            }
        ]).then(function(input) {
            //check to see if there is enough quantity left, and if so update inventory
            checkInventory(input.purchaseId, input.purchaseAmount, function(inventoryAvailable) {
                if (inventoryAvailable) {
                    //if inventory is available, update.
                    updateInventory(input.purchaseId, input.purchaseAmount);
                } else {
                    //if no quantity is available, tell the user this 
                    console.log("Insufficient quantity");
                };
                
            });
        });
    });

}

function checkInventory(itemId, purchaseAmount, callback){
    //check the database and see how many items are left 
    connection.query("SELECT * FROM products WHERE ?", {"item_id": itemId}, function (error, results, fields) {
        // error will be an Error if one occurred during the query 
        if (error) {
            console.log("Error: " + error);
            return;
        };
        // results will contain the results of the query 
        var quantityAvailable = results[0].stock_quantity;
        var price = results[0].price;
        //see if quantity is available 
        var result = (quantityAvailable >= purchaseAmount);
        //run the callback and pass it the result 
        callback(result);
    });
};

function updateInventory(itemId, purchaseQuantity){
    //check the database for the item by Id
    connection.query("SELECT * FROM products WHERE ?", {"item_id": itemId}, function (error, results, fields) {
        // error will be an Error if one occurred during the query 
        if (error) {
            console.log("Error: " + error);
            return;
        };
        // get the information from the result necessary to make the update 
        var currentInventory = results[0].stock_quantity;
        var newInventory = currentInventory - purchaseQuantity;
        var price = results[0].price;
        //update the inventory by Id
        connection.query("UPDATE products SET ? WHERE ?", [{"stock_quantity": newInventory}, {"item_id": itemId}], function(error, response){ 
            if (error) {
                throw error;
            };
            //display a thank you note and the customer's total price 
            console.log("Thank you for your purchase! We have updated our inventory");
            var totalCost = purchaseQuantity * price; 
            console.log("Your total purchase price is $" + totalCost);
        });
    });
};

startShopping();
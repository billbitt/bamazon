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

function commandLineInterface(){
    //ask the manager for input
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            
        },
    ]).then(function(input) {
        //run the proper action based on the manager's selection
        if (input.selection === "View Products for Sale"){
            viewProducts();
        } else if (input.selection === "View Low Inventory"){
            viewLowInventory();
        } else if (input.selection === "Add to Inventory"){
            addInventory();
        } else if (input.selection === "Add New Product"){
            addNewProduct();
        };
    });
}

function viewProducts(){
    //query the database for all products 
    connection.query("SELECT * FROM products", function (error, results, fields) {
        // error will return true if one occurred during the query 
        if (error) {
            console.log("Error: " + error);
            return;
        };
        // list all items in the inventory 
        console.log("-----Start: all products in inventory-----");
        for (var i = 0; i < results.length; i++){
            console.log("Product #" + results[i].item_id);
            console.log("Name: " + results[i].product_name);
            console.log("Price: " + results[i].price);
            console.log("Quantity: " + results[i].stock_quantity);
            console.log("-----");
        };
        console.log("-----End: all products in inventory-----");
        //return to manager prompt
        commandLineInterface();
    });
}

function viewLowInventory(){
    //query the database for all products where quantity is less than 5
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (error, results, fields) {
        // error will return true if one occurred during the query 
        if (error) {
            console.log("Error: " + error);
            return;
        };
        // list all items in the inventory 
        console.log("-----Start: all products with low inventory-----");
        for (var i = 0; i < results.length; i++){
            console.log("--- Product #" + results[i].item_id + " ---");
            console.log("Name: " + results[i].product_name);
            console.log("Price: " + results[i].price);
            console.log("Quantity: " + results[i].stock_quantity);
        };
        console.log("-----End: all products with low inventory-----");
        //return to manager prompt
        commandLineInterface();
    });
}

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Which item would you like to add inventory too? (Enter the Product #) "
        },
        {
            type: "input",
            name: "increaseQuantity",
            message: "What quantity would you like to add? "
        }
    ]).then(function(input) {
        //store the user's input in variables
        var itemId = input.itemId;
        var increaseQuantity = parseInt(input.increaseQuantity);
        //check the database for the item by Id
        connection.query("SELECT * FROM products WHERE ?", {"item_id": itemId}, function (error, results, fields) {
            // error will be an Error if one occurred during the query 
            if (error) {
                console.log("Error: " + error);
                return;
            };
            // get the quantity information from the result necessary to make the update 
            var currentInventory = parseInt(results[0].stock_quantity);
            var newInventory = currentInventory + increaseQuantity;
            //update the inventory by Id
            connection.query("UPDATE products SET ? WHERE ?", [{"stock_quantity": newInventory}, {"item_id": itemId}], function(error, response){ 
                if (error) {
                    console.log("Error: " + error);
                    return;
                };
                //display a note that the inventory has been updated  
                console.log("Your inventory has been updated");
                commandLineInterface();
            });
        });
    });
}

function addNewProduct(){

}


//start app
commandLineInterface();
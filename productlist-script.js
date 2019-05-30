// Create an array to store objects
var arr = [];

// Create axios get request
axios
  .get("https://productlistapi.herokuapp.com")
  .then(function(response) {
    // Insert all data to array
    arr.push(response.data);
    receiveDataFromBoxes(arr);

    // All Data is here at arr[0]
    // console.log(arr[0]);
  })
  .catch(function(error) {
    console.log(error);
  });

// Take data for processing
function receiveDataFromBoxes(arr) {
  // Iterating over entries in data
  arr[0].forEach((value, i) => {
    //All objects put into Boxes
    createBoxTemplates(value, i);

    //Execute when the specific checkbox selected
    $("#isSelected" + i).click(function() {
      var $myDiv = $(this);

      //To access the location of both checkbox and texts
      var obj = {
        sku: $myDiv.siblings("#skuValue").text(),
        name: $myDiv.siblings("#nameValue").text(),
        price: $myDiv
          .siblings("#priceValue")
          .find("text")
          .text(),
        unique: $myDiv
          .siblings("#uniqueValue")
          .find("text")
          .text(),
        handlerType: $myDiv
          .siblings("#uniqueValue")
          .find("span")
          .text()
      };

      // Click event for "Apply" Button
      $("#sendButton").click(function() {
        // Create new array to hold objects
        var updatedArr = [];

        // Make put request implement deleting product

        // Explanation: I've used "Put" method because I need to send
        // objects of product, "Delete" method doesn't send request body
        axios
          .put("https://productlistapi.herokuapp.com", obj)
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });

        // To see new product list after deleting one or more products
        $("#productListDiv").empty();

        //Sending get request after delete
        axios
          .get("https://productlistapi.herokuapp.com")
          .then(function(response) {
            // Insert all data to array
            updatedArr.push(response.data);
            receiveDataFromBoxes(updatedArr);
            // console.log(arr[0]);
          })
          .catch(function(error) {
            console.log(error);
          });
      });

      // console.log(obj);
    });
  });
}

// Understanding which kind of product to delete
function getTypeByProductBox($myDiv) {
  var myType;

  // Get the type, If not the table you want to delete will be missing
  if (
    $myDiv
      .siblings("#uniqueValue")
      .find("span")
      .text() == "MB"
  )
    myType = "BOOK";
  else if (
    $myDiv
      .siblings("#uniqueValue")
      .find("span")
      .text() == "KG"
  )
    myType = "DVDDISC";
  else myType = "FURNITURE";

  return myType;
}

// Box creator for seperate type of products
function createBoxTemplates(myType, i) {
  //Use p and div tags for storing elements
  var newP = $("<p></p>");
  var skuDiv = $("<div>" + Object.values(myType)[0] + "</div>");
  var nameDiv = $("<div>" + Object.values(myType)[1] + "</div>");
  var priceDiv = $(
    "<div><text>" + Object.values(myType)[2] + "</text> $</div>"
  );

  //this is for printing type data succesful, for example KG for weight
  if (Object.keys(myType)[3] == "weight")
    var uniqueDiv = $(
      "<div>Weight: <text>" +
        Object.values(myType)[3] +
        "</text> <span>KG<span></div>"
    );
  else if (Object.keys(myType)[3] == "size")
    var uniqueDiv = $(
      "<div>Size: <text>" +
        Object.values(myType)[3] +
        "</text> <span>MB<span></div>"
    );
  else
    var uniqueDiv = $(
      "<div><span>Dimensions</span>: <text>" +
        Object.values(myType)[3] +
        "</text></div>"
    );

  //Add all div's into the p tag
  skuDiv.appendTo(newP);
  nameDiv.appendTo(newP);
  priceDiv.appendTo(newP);
  uniqueDiv.appendTo(newP);

  //Assign id attribute of all type values
  skuDiv.prop("id", "skuValue");
  nameDiv.prop("id", "nameValue");
  priceDiv.prop("id", "priceValue");
  uniqueDiv.prop("id", "uniqueValue");

  //Create checkboxes and insert into the p tag
  $("<input />", {
    type: "checkbox",
    id: "isSelected" + i,
    name: "productCheck"
  }).appendTo(newP);

  // Add the p tag into the productListDiv created before
  $("#productListDiv").append(newP);
}

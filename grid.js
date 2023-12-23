// Define the number of rows and columns for the spreadsheet
let rows = 100;
let cols = 26;

// Selecting elements from the HTML document
let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

// Creating and appending elements for column addresses
for (let i = 0; i < rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = i + 1; // Display row numbers starting from 1
  addressColCont.appendChild(addressCol);
}

// Creating and appending elements for row addresses (A-Z)
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerText = String.fromCharCode(65 + i); // Display column letters from A to Z
  addressRowCont.appendChild(addressRow);
}

// Creating and populating cells within the grid
for (let i = 0; i < rows; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-cont");

  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", "true"); // Enable cell editing
    cell.setAttribute("spellcheck", "false"); // Disable spellcheck

    // Set identifiers for row and column positions
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);

    rowCont.appendChild(cell);

    // Add event listener to update the address bar when a cell is clicked
    addListenerForAddressBarDisplay(cell, i, j);
  }

  cellsCont.appendChild(rowCont); // Append row container to the main cells container
}

// Function to update the address bar when a cell is clicked
function addListenerForAddressBarDisplay(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowID = i + 1; // Increment row number to start from 1 instead of 0
    let colID = String.fromCharCode(65 + j); // Convert column index to corresponding letter
    addressBar.value = `${colID}${rowID}`; // Display cell address in the address bar
  });
}

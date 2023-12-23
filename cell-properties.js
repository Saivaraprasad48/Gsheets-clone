let collectedSheetDB = []; // Holds all the created SheetDBs
let sheetDB = []; // Stores cell properties for each row and column

// Auto-create a new sheet upon initialization
{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// Selectors for cell properties
// ... (omitting repetitive declarations)

let activeColorProp = "#d1d8e0"; // Color for active property UI
let inactiveColorProp = "#ecf0f1"; // Color for inactive property UI

// Event listeners for cell property changes
// Each listener updates data and UI based on the property change
// ... (handling for bold, italic, underline, fontSize, fontFamily, fontColor, BGcolor, alignment)

// Apply listeners to all cells to display properties when clicked
let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

// Attach listener to display cell properties when clicked
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    // Retrieve the cell properties for the clicked cell's address
    let address = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    // Apply cell properties to the clicked cell
    // Updates the cell's UI based on its stored properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    // ... (applying other styles based on cell properties)

    // Update UI properties container to reflect the selected cell's properties
    // ... (updating UI property containers)

    // Retrieve and display formula and value in the formula bar and cell
    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}

// Function to retrieve cell and its properties based on address
function getCellAndCellProp(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

// Function to decode row and column IDs from the cell address
function decodeRIDCIDFromAddress(address) {
  let rid = Number(address.slice(1) - 1);
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}

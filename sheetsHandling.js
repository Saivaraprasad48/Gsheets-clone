let activeSheetColor = "#ced6e0"; // Color for the active sheet
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

// Handling the addition of a new sheet
addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  // Set a unique ID for the new sheet
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);

  // Create the sheet structure and add it to the sheets folder
  sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;
  sheetsFolderCont.appendChild(sheet);
  sheet.scrollIntoView();

  // Create and manage the sheet's data, UI, and properties
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click(); // Make the new sheet active
});

// Handling the removal of a sheet
function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // Right-click to remove the sheet
    if (e.button !== 2) return;

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length === 1) {
      alert("You need to have at least one sheet!!");
      return;
    }

    // Confirmation for sheet removal
    let response = confirm(
      "Your sheet will be removed permanently. Are you sure?"
    );
    if (response === false) return;

    let sheetIdx = Number(sheet.getAttribute("id"));
    // Remove sheet data and update UI
    collectedSheetDB.splice(sheetIdx, 1);
    collectedGraphComponent.splice(sheetIdx, 1);
    handleSheetUIRemoval(sheet);

    // Assign active sheet data to the first sheet after removal
    sheetDB = collectedSheetDB[0];
    graphComponentMatrix = collectedGraphComponent[0];
    handleSheetProperties();
  });
}

// Update the UI after removing a sheet
function handleSheetUIRemoval(sheet) {
  sheet.remove();
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

// Handling data for different sheets
function handleSheetDB(sheetIdx) {
  sheetDB = collectedSheetDB[sheetIdx];
  graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

// Handle properties and UI when switching between sheets
function handleSheetProperties() {
  // Click on all cells in the new sheet to update properties
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }
  // Click on the first cell via DOM
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

// Update UI for active sheet
function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetColor;
}

// Activate the clicked sheet
function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
    console.log(sheetDB); // Log the current sheet data
  });
}

// Create an empty sheet database structure
function createSheetDB() {
  let sheetDB = [];
  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProp = {
        // Define default cell properties
      };
      sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
  }
  collectedSheetDB.push(sheetDB); // Store the created sheet in the collection
}

// Create an empty graph component matrix
function createGraphComponentMatrix() {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      // Create an empty array for multiple child relations
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectedGraphComponent.push(graphComponentMatrix); // Store the created matrix in the collection
}

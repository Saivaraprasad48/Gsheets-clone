let ctrlKey;

// Event listeners to track Ctrl key state
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey; // Update the Ctrl key status on keydown
});

document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey; // Update the Ctrl key status on keyup
});

// Iterate through all cells and attach click event listeners for selection
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

// Event handling for cell selection
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    // Select cells within a range when the Ctrl key is held down
    if (!ctrlKey) return; // Exit if Ctrl key is not pressed

    // Reset selection if already two cells are selected
    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    // UI: Highlight the selected cell
    cell.style.border = "3px solid #218c74";

    // Store the row and column IDs of the selected cell
    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]); // Store the selected cell's coordinates
  });
}

// Function to reset UI to default for selected cells
function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey"; // Reset cell border
  }
}

// Event handling for copy button
let copyData = [];
copyBtn.addEventListener("click", (e) => {
  // Copy selected cell data to paste later
  if (rangeStorage.length < 2) return; // Exit if not enough cells are selected
  copyData = []; // Reset copy data

  // Get the start and end rows/columns from the rangeStorage
  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  // Copy data within the selected range to copyData array
  for (let i = strow; i <= endrow; i++) {
    let copyRow = [];
    for (let j = stcol; j <= endcol; j++) {
      let cellProp = sheetDB[i][j]; // Get cell properties from the DB
      copyRow.push(cellProp); // Store cell properties in copyRow
    }
    copyData.push(copyRow); // Push each row of cell properties to copyData
  }

  defaultSelectedCellsUI(); // Reset cell UI after copying
});

// Event handling for cut button
cutBtn.addEventListener("click", (e) => {
  // Cut selected cells' data
  if (rangeStorage.length < 2) return; // Exit if not enough cells are selected

  // Get the start and end rows/columns from the rangeStorage
  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  // Iterate through the selected range and reset cell properties in DB and UI
  for (let i = strow; i <= endrow; i++) {
    for (let j = stcol; j <= endcol; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

      // Reset cell properties in the DB
      let cellProp = sheetDB[i][j];
      cellProp.value = "";
      // Reset other properties to default (bold, italic, etc.)
      // ...

      // Click the cell to reset its UI
      cell.click();
    }
  }

  defaultSelectedCellsUI(); // Reset cell UI after cutting
});

// Event handling for paste button
pasteBtn.addEventListener("click", (e) => {
  // Paste copied data into selected cells
  if (rangeStorage.length < 2) return; // Exit if not enough cells are selected

  // Calculate the row and column difference for pasting data
  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  // Get the starting row and column for pasting data
  let address = addressBar.value;
  let [stRow, stCol] = decodeRIDCIDFromAddress(address);

  // Iterate through the selected range and paste data into cells
  for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue; // Skip if cell not found

      // Paste cell properties from copied data to DB and UI
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];
      // Update cell properties in the DB
      cellProp.value = data.value;
      // Update other properties with copied data
      // ...

      cell.click(); // Click the cell to update its UI
    }
  }
});

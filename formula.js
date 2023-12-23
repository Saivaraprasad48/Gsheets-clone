// Event listeners for cells to trigger formula evaluation when blurred
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    // Selecting each cell in the grid
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

    // Adding blur event listener to each cell
    cell.addEventListener("blur", (e) => {
      // Retrieve the current value in the address bar
      let address = addressBar.value;

      // Get the active cell and its properties
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;

      // Check if the entered data matches the existing cell value
      if (enteredData === cellProp.value) return;

      // Update the cell properties with the new entered data
      cellProp.value = enteredData;

      // Remove parent-child relationship and formula for the cell
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";

      // Update children cells with the modified value
      updateChildrenCells(address);
    });
  }
}

// Event listener for formula bar to trigger evaluation on Enter key press
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
  // Check if the Enter key is pressed and a formula is entered
  if (e.key === "Enter" && formulaBar.value) {
    // Retrieve the current address and cell properties
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    // Check if the input formula is different from the existing formula
    if (formulaBar.value !== cellProp.formula)
      removeChildFromParent(cellProp.formula);

    // Add the child cell to the parent based on the formula
    addChildToGraphComponent(formulaBar.value, address);

    // Check if the formula causes a cyclic dependency
    let cycleResponse = isGraphCylic(graphComponentMatrix);
    if (cycleResponse) {
      // Handle cyclic formula
      // Confirm with the user to trace the cyclic path
      let response = confirm(
        "Your formula is cyclic. Do you want to trace your path?"
      );
      while (response === true) {
        await isGraphCylicTracePath(graphComponentMatrix, cycleResponse);
        response = confirm(
          "Your formula is cyclic. Do you want to trace your path?"
        );
      }

      // Remove child cell from the parent and return
      removeChildFromGraphComponent(formulaBar.value, address);
      return;
    }

    // Evaluate the formula and update the UI and cell properties
    let evaluatedValue = evaluateFormula(formulaBar.value);
    setCellUIAndCellProp(evaluatedValue, formulaBar.value, address);
    addChildToParent(formulaBar.value);

    // Update children cells with the new formula
    updateChildrenCells(address);
  }
});

// Functions to manage parent-child relationships in the graph component
// These functions help in adding or removing relationships between cells

// Function to add child cells to the parent cell in the graph component
function addChildToGraphComponent(formula, childAddress) {
  // Retrieve row and column IDs for the child cell
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);

  // Split the formula into individual elements
  let encodedFormula = formula.split(" ");

  // Iterate through the encoded formula to add relationships
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    // Check if the value represents a column (A-Z)
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);

      // Add the child cell to the parent cell in the graph component
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

// Function to remove child cells from the parent cell in the graph component
function removeChildFromGraphComponent(formula, childAddress) {
  // Retrieve row and column IDs for the child cell
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);

  // Split the formula into individual elements
  let encodedFormula = formula.split(" ");

  // Iterate through the encoded formula to remove relationships
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    // Check if the value represents a column (A-Z)
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);

      // Remove the child cell from the parent cell in the graph component
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

// Function to update children cells recursively based on parent changes
function updateChildrenCells(parentAddress) {
  // Retrieve the parent cell and its properties
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  // Iterate through children cells and update them based on the parent changes
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;

    // Evaluate the child formula and update the UI and cell properties
    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);

    // Recursively update children cells if any
    updateChildrenCells(childAddress);
  }
}

// Function to add child cell addresses to the parent cell properties
function addChildToParent(formula) {
  // Retrieve the child cell address from the address bar
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  // Iterate through the encoded formula to add children to the parent
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    // Check if the value represents a column (A-Z)
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);

      // Add the child cell address to the parent cell properties
      parentCellProp.children.push(childAddress);
    }
  }
}

// Function to remove child cell addresses from the parent cell properties
function removeChildFromParent(formula) {
  // Retrieve the child cell address from the address bar
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");

  // Iterate through the encoded formula to remove children from the parent
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    // Check if the value represents a column (A-Z)
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);

      // Find the index of the child cell and remove it from the parent cell properties
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

// Function to evaluate a formula using cell values
function evaluateFormula(formula) {
  // Split the formula into individual elements
  let encodedFormula = formula.split(" ");

  // Iterate through the encoded formula to evaluate the expression
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);

    // Check if the value represents a column (A-Z)
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);

      // Replace the cell reference in the formula with its actual value
      encodedFormula[i] = cellProp.value;
    }
  }

  // Join the encoded formula elements and evaluate the expression
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

// Function to update the UI and cell properties based on evaluated value and formula
function setCellUIAndCellProp(evaluatedValue, formula, address) {
  // Retrieve the cell and its properties based on the address
  let [cell, cellProp] = getCellAndCellProp(address);

  // Update the cell's UI with the evaluated value
  cell.innerText = evaluatedValue;

  // Update the cell's properties with the evaluated value and formula
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}

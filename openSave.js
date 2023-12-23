let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Download Task or File
downloadBtn.addEventListener("click", (e) => {
  // Convert the sheetDB and graphComponentMatrix into JSON data
  let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
  let file = new Blob([jsonData], { type: "application/json" });

  // Create a link element and trigger the download of the JSON file
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "SheetData.json";
  a.click();
});

// Open task (upload)
openBtn.addEventListener("click", (e) => {
  // Opens file explorer to select a file
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  // Listen for file selection in the file explorer
  input.addEventListener("change", (e) => {
    let fr = new FileReader();
    let files = input.files;
    let fileObj = files[0];

    // Read the contents of the selected file
    fr.readAsText(fileObj);
    fr.addEventListener("load", (e) => {
      // Parse the JSON data from the loaded file
      let readSheetData = JSON.parse(fr.result);

      // Create a new sheet with default data
      addSheetBtn.click();

      // Assign the loaded sheetDB and graphComponentMatrix to the global variables
      sheetDB = readSheetData[0];
      graphComponentMatrix = readSheetData[1];

      // Update the collected sheetDB and graphComponentMatrix
      collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
      collectedGraphComponent[collectedGraphComponent.length - 1] =
        graphComponentMatrix;

      // Handle sheet properties and UI updates
      handleSheetProperties();
    });
  });
});

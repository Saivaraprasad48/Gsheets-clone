// Function to create a delay using promises
function colorPromise() {
  return new Promise((resolve, reject) => {
    // Wait for 1 second before resolving the promise
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

// Async function to trace the cyclic path with color indications
async function isGraphCylicTracePath(graphComponentMatrix, cycleResponse) {
  let [srcr, srcc] = cycleResponse;

  // Initialize arrays to track visited nodes
  let visited = []; // Node visit trace
  let dfsVisited = []; // Stack visit trace

  // Initialize visited and dfsVisited arrays
  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  // Initiate depth-first search to trace the cyclic path
  let response = await dfsCycleDetectionTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );

  // Return whether a cycle was found or not
  if (response === true) return Promise.resolve(true);
  return Promise.resolve(false);
}

// Function to apply colors to cells during cyclic path tracing
async function dfsCycleDetectionTracePath(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  // Mark the cell as visited and in the stack
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  // Get the cell for coloring
  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
  cell.style.backgroundColor = "lightblue"; // Highlight the cell
  await colorPromise(); // Wait for 1 second

  // Explore the neighboring cells for cyclic path
  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
    if (visited[nbrr][nbrc] === false) {
      let response = await dfsCycleDetectionTracePath(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response === true) {
        cell.style.backgroundColor = "transparent"; // Remove highlighting
        await colorPromise();
        return Promise.resolve(true);
      }
    }
    // If a cycle is found, indicate the cyclic cell and backtrack
    else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${nbrr}"][cid="${nbrc}"]`
      );

      cyclicCell.style.backgroundColor = "lightsalmon"; // Highlight cyclic cell
      await colorPromise();
      cyclicCell.style.backgroundColor = "transparent"; // Remove highlighting

      cell.style.backgroundColor = "transparent"; // Backtrack highlighting
      await colorPromise();
      return Promise.resolve(true);
    }
  }

  // If no cycle found, mark the cell as unvisited and backtrack
  dfsVisited[srcr][srcc] = false;
  return Promise.resolve(false);
}

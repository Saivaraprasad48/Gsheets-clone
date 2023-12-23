// Storage for graph components and matrix
let collectedGraphComponent = []; // Stores graph components
let graphComponentMatrix = []; // Stores the matrix representing the graph

// Function to check if the graph has cycles (True for cyclic, False for acyclic)
function isGraphCylic(graphComponentMatrix) {
  let visited = []; // Keeps track of visited nodes
  let dfsVisited = []; // Keeps track of nodes in the current traversal path

  // Initializing the visited and dfsVisited arrays
  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false); // Initially, no nodes are visited
      dfsVisitedRow.push(false); // Initially, no nodes are in the current traversal path
    }
    visited.push(visitedRow); // Pushing the row into the visited array
    dfsVisited.push(dfsVisitedRow); // Pushing the row into the dfsVisited array
  }

  // Traversing through the graph matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // If the node hasn't been visited, perform a depth-first search (DFS)
      if (visited[i][j] === false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        // If a cycle is found, return the coordinates where it starts
        if (response == true) return [i, j];
      }
    }
  }

  return null; // If no cycle is found, return null
}

// Function to perform DFS for cycle detection
function dfsCycleDetection(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true; // Marking the node as visited
  dfsVisited[srcr][srcc] = true; // Marking the node in the current traversal path

  // Looping through the adjacent nodes
  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children]; // Getting neighboring node coordinates
    // If the neighboring node hasn't been visited, perform DFS on it
    if (visited[nbrr][nbrc] === false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response === true) return true; // If a cycle is found, stop further exploration
    } else if (
      visited[nbrr][nbrc] === true &&
      dfsVisited[nbrr][nbrc] === true
    ) {
      return true; // If a cycle is detected in the current traversal path, return true
    }
  }

  dfsVisited[srcr][srcc] = false; // Resetting node in the current traversal path
  return false; // Return false if no cycle is found
}

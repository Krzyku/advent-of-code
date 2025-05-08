import fs from "fs";
import { execSync } from "child_process";

const nodes = new Map();
const edges = [];

const isInput = (node) => /^x|y/.test(node);

const addInputNode = (node) => {
  if (!nodes.has(node) && isInput(node)) {
    nodes.set(node, `fillcolor=skyblue;shape=circle`);
  }
};

const opToShape = {
  OR: "invhouse",
  AND: "box",
  XOR: "trapezium",
};

const addGateNode = (op, node, x1, x2) => {
  if (nodes.has(node)) {
    return;
  }

  const isOutput = node.startsWith("z");
  let color = "lightgray";

  if (op !== "XOR" && isOutput) {
    color = "orangered";
  }

  // if (op === "XOR") {
  //   const isValid = isOutput ?
  //   if (!connectedToInput) {
  //     color = "orangered";
  //   }
  // }

  nodes.set(
    node,
    `shape=${opToShape[op]};label="${op}\n${node}";fillcolor=${color}`
  );
};

fs.readFileSync("./input.txt", "utf-8")
  .split("\n\n")[1]
  .trim()
  .split("\n")
  .forEach((line) => {
    const [x1, op, x2, _, y] = line.split(" ");

    addInputNode(x1);
    addInputNode(x2);
    addGateNode(op, y, x1, x2);

    edges.push(`${x1} -> ${y}`);
    edges.push(`${x2} -> ${y}`);
  });

const EOL = ";\n  ";
const nodesWithStyle = [...nodes.entries()].map(
  ([key, style]) => `${key} [${style}]`
);

const dotGraph = `
  digraph structs {
    rankdir=LR;
    node [style=filled];
    ${nodesWithStyle.join(EOL)};
    ${edges.join(EOL)};
  }
`;

// console.log(dotGraph);
execSync(`echo '${dotGraph}' | dot -Tsvg > graph.svg`);
console.log("Graph generated at graph.svg");

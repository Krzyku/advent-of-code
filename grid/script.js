const $input = document.querySelector("textarea");
const $table = document.querySelector("table");
const $position = document.querySelector("#position");
const $colors = document.querySelector("#colors-list");

const COLORS = [
  "#8be9fd",
  "#50fa7b",
  "#ffb86c",
  "#ff79c6",
  "#bd93f9",
  "#ff5555",
  "#f1fa8c",
];

function main() {
  const rawData = $input.value.trim();
  const rows = rawData.split("\n").map((row) => row.split(""));
  const chars = Array.from(new Set(rows.flat()));
  const charColorMap = chars.reduce((acc, char, i) => {
    acc[char] = COLORS[i % COLORS.length];
    return acc;
  }, {});

  $input.rows = rows.length;

  $table.innerHTML = "";

  const xAxis$ = document.createElement("tr");
  xAxis$.appendChild(document.createElement("td"));
  rows[0].forEach((_, x) => {
    const $td = document.createElement("td");
    $td.innerHTML = x.toString().split("").join("<br/>");
    xAxis$.appendChild($td);
  });
  $table.appendChild(xAxis$);

  rows.forEach((row, y) => {
    const $tr = document.createElement("tr");
    const y$ = document.createElement("td");
    y$.textContent = y;
    $tr.appendChild(y$);

    row.forEach((char, x) => {
      const $td = document.createElement("td");
      $td.textContent = char;
      $td.style.color = charColorMap[char];
      $tr.appendChild($td);
    });
    $table.appendChild($tr);
  });
}

main();

$input.addEventListener("input", main);

$table.addEventListener("mousemove", (e) => {
  const $td = e.target;
  const $tr = $td.parentNode;
  const x = $td.cellIndex - 1;
  const y = $tr.rowIndex - 1;

  $position.textContent = x < 0 || y < 0 ? "" : `x:${x}, y:${y}`;
});

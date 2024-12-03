const store = (() => {
  const key = "aoc-last-submission-time";

  return {
    write: (data) => {
      localStorage.setItem(key, String(data));
    },
    read: () => {
      const data = localStorage.getItem(key);
      return data ? Number(data) : null;
    },
    clear: () => {
      localStorage.removeItem(key);
    },
  };
})();

const ONE_SECOND = 1000;
const div = document.createElement("div");
div.id = "aoc-timer";

function timer() {
  const start = store.read();

  if (!start) {
    return;
  }

  const interval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - start) / ONE_SECOND);

    div.textContent = `Time since last submission: ${elapsedSeconds} seconds`;

    if (elapsedSeconds >= 60) {
      clearInterval(interval);
      store.clear();
      div.textContent = "";
    }
  }, ONE_SECOND);
}

function main() {
  const form = document.querySelector("form");

  if (!form) {
    return;
  }

  form.appendChild(div);

  form.addEventListener("submit", (event) => {
    store.write(Date.now());
    timer();
  });
}

if (window.location.hostname === "adventofcode.com") {
  main();
  timer();
}

// if (window.location.hostname === "adventofcode.com") {
//   let lastSubmissionTime = null; // Store the timestamp of the last submission
//   const displayTimer = document.createElement("div");

//   // Style the timer display
//   displayTimer.style.position = "fixed";
//   displayTimer.style.bottom = "10px";
//   displayTimer.style.right = "10px";
//   displayTimer.style.padding = "10px";
//   displayTimer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//   displayTimer.style.color = "white";
//   displayTimer.style.fontSize = "16px";
//   displayTimer.style.borderRadius = "5px";
//   displayTimer.style.zIndex = "1000";
//   displayTimer.textContent = "Time since last submission: -- seconds";
//   document.body.appendChild(displayTimer);

//   // Attach event listener to the form
//   const form = document.querySelector("form");
//   if (form) {
//     form.addEventListener("submit", (event) => {
//       lastSubmissionTime = Date.now();

//       // Start the timer
//       updateTimer();

//       // Allow form submission to proceed
//     });
//   } else {
//     console.error("No form found on the page.");
//   }

//   function updateTimer() {
//     if (lastSubmissionTime !== null) {
//       setInterval(() => {
//         const elapsedSeconds = Math.floor(
//           (Date.now() - lastSubmissionTime) / 1000
//         );
//         displayTimer.textContent = `Time since last submission: ${elapsedSeconds} seconds`;
//       }, 1000);
//     }
//   }
// }

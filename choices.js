const addBtn = document.getElementById("add-choice");
const proceedBtn = document.getElementById("proceed");
const choicesList = document.getElementById("choices-list");

addBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("choice-input");
  input.placeholder = `Choice ${choicesList.children.length + 1}`;
  choicesList.appendChild(input);
});

proceedBtn.addEventListener("click", () => {
  const choices = Array.from(document.querySelectorAll(".choice-input"))
    .map(inp => inp.value.trim())
    .filter(val => val !== "");

  if (choices.length < 2) {
    alert("Please enter at least two choices!");
    return;
  }

  // Store in localStorage for wheel page
  localStorage.setItem("choices", JSON.stringify(choices));
  window.location.href = "wheel.html";
});

function copyCode() {
  const lines = document.querySelectorAll(".line-numbers li");
  let codeText = "";
  lines.forEach((li) => {
    codeText += li.innerText + "\n";
  });

  navigator.clipboard
    .writeText(codeText)
    .then(() => {})
    .catch((err) => {
      console.error("Failed to copy code: ", err);
    });
}

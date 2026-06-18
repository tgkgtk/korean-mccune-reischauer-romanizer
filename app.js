(function initApp() {
  "use strict";

  const sourceText = document.querySelector("#source-text");
  const outputText = document.querySelector("#output-text");
  const wordDivisionToggle = document.querySelector("#word-division-toggle");
  const personNameToggle = document.querySelector("#person-name-toggle");
  const capitalizeToggle = document.querySelector("#capitalize-toggle");
  const fileInput = document.querySelector("#file-input");
  const sampleButton = document.querySelector("#sample-button");
  const clearButton = document.querySelector("#clear-button");
  const copyButton = document.querySelector("#copy-button");
  const downloadButton = document.querySelector("#download-button");
  const countStatus = document.querySelector("#count-status");
  const copyStatus = document.querySelector("#copy-status");

  const sample = [
    "한글은 한국어를 적는 문자입니다.",
    "[소래마을]에서 부산까지 기차를 탑니다.",
    "평양과 개성은 역사적으로 중요한 도시입니다."
  ].join("\n");

  function sentenceCaseHints(text) {
    return text.replace(/(^|[.!?]\s+)([a-zŏŭ])/g, (match, prefix, letter) => prefix + letter.toUpperCase());
  }

  function updateOutput() {
    let romanized = window.McCuneReischauer.romanizeText(sourceText.value, {
      wordDivision: wordDivisionToggle.checked,
      personNameHyphens: personNameToggle.checked
    });

    if (capitalizeToggle.checked) {
      romanized = sentenceCaseHints(romanized);
    }

    outputText.value = romanized;
    const count = window.McCuneReischauer.countHangulSyllables(sourceText.value);
    countStatus.textContent = `${count.toLocaleString()} Korean syllable${count === 1 ? "" : "s"}`;
  }

  function flashStatus(message) {
    copyStatus.textContent = message;
    window.clearTimeout(flashStatus.timer);
    flashStatus.timer = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2200);
  }

  sourceText.addEventListener("input", updateOutput);
  wordDivisionToggle.addEventListener("change", updateOutput);
  personNameToggle.addEventListener("change", updateOutput);
  capitalizeToggle.addEventListener("change", updateOutput);

  sampleButton.addEventListener("click", () => {
    sourceText.value = sample;
    updateOutput();
    sourceText.focus();
  });

  clearButton.addEventListener("click", () => {
    sourceText.value = "";
    updateOutput();
    sourceText.focus();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    sourceText.value = await file.text();
    fileInput.value = "";
    updateOutput();
  });

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(outputText.value);
    flashStatus("Copied");
  });

  downloadButton.addEventListener("click", () => {
    const blob = new Blob([outputText.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mccune-reischauer.txt";
    link.click();
    URL.revokeObjectURL(url);
    flashStatus("Downloaded");
  });

  updateOutput();
})();

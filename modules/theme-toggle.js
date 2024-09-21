/*
 * Copyright (c) 2024 LupLab
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  const editorThemeSelect = document.getElementById("editor-theme-select");

  // Function to set the global theme
  function setGlobalTheme(theme) {
    htmlElement.setAttribute("data-bs-theme", theme);

    // Update button icon and text
    const icon = themeToggleBtn.querySelector("i");
    const text = themeToggleBtn.querySelector("span");

    if (theme === "light") {
      icon.classList.replace("bi-moon", "bi-sun");
      text.textContent = "Light Mode";
    } else {
      icon.classList.replace("bi-sun", "bi-moon");
      text.textContent = "Dark Mode";
    }
  }

  // Load global theme preference on page load
  const storedGlobalTheme = localStorage.getItem("globalTheme");
  if (storedGlobalTheme) {
    setGlobalTheme(storedGlobalTheme);
  } else {
    // Default to light mode if no preference is stored
    setGlobalTheme("light");
  }

  // Function to apply the editor theme to all CodeMirror instances
  function applyEditorTheme(theme) {
    // Get all CodeMirror instances (do this inside the function)
    const codeMirrors = document.querySelectorAll(".CodeMirror");
    codeMirrors.forEach((cm) => {
      cm.CodeMirror.setOption("theme", theme);
    });

    // Highlight selected theme in dropdown
    highlightSelectedTheme(theme);
  }

  // Function to highlight the selected theme in the dropdown
  function highlightSelectedTheme(theme) {
    const items = editorThemeSelect.querySelectorAll(".dropdown-item");
    items.forEach((item) => {
      item.classList.toggle("active", item.textContent === theme);
    });
  }

  // Listen for changes for the theme toggle
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    setGlobalTheme(newTheme);
    localStorage.setItem("globalTheme", newTheme);

    // Apply default editor theme based on new global theme if no preference
    const defaultEditorTheme = newTheme === "dark" ? "darcula" : "default";
    const storedEditorTheme = localStorage.getItem("editorTheme");
    if (!storedEditorTheme) {
      applyEditorTheme(defaultEditorTheme);
    }
  });

  // Listen for changes for the editor theme selector
  editorThemeSelect.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.tagName === "A") {
      const selectedTheme = event.target.textContent;

      // Handle "Reset" option
      if (selectedTheme === "-- reset --") {
        localStorage.removeItem("editorTheme");
        const currentGlobalTheme = htmlElement.getAttribute("data-bs-theme");
        const defaultTheme =
          currentGlobalTheme === "dark" ? "darcula" : "default";
        applyEditorTheme(defaultTheme);
      } else {
        applyEditorTheme(selectedTheme);
        localStorage.setItem("editorTheme", selectedTheme);
      }
    }
  });

  // Add "Reset" option to dropdown:
  // Defaults to theme default (default vs darcula)
  const resetItem = document.createElement("li");
  const resetLink = document.createElement("a");
  resetLink.classList.add("dropdown-item");
  resetLink.href = "#";
  resetLink.textContent = "-- reset --";
  resetItem.appendChild(resetLink);
  editorThemeSelect.appendChild(resetItem);

  // MutationObserver to detect when CodeMirror instances are added since CodeMirror is added after the DOM is loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains("CodeMirror")) {
            // Apply the current theme to the newly added CodeMirror instance:
            const currentTheme = htmlElement.getAttribute("data-bs-theme");
            const defaultTheme =
              currentTheme === "dark" ? "darcula" : "default";
            applyEditorTheme(defaultTheme);
          }
        });
      }
    });
  });

  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
});

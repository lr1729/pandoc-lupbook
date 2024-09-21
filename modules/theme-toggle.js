/*
 * Copyright (c) 2024 LupLab
 * SPDX-License-Identifier: AGPL-3.0-only
 */


// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Listen for changes for the theme toggle
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const isLightMode = currentTheme === "light";

    // Toggle between light and dark themes
    htmlElement.setAttribute("data-bs-theme", isLightMode ? "dark" : "light");

    // Update button icon and text
    const icon = themeToggleBtn.querySelector("i");
    const text = themeToggleBtn.querySelector("span");

    if (isLightMode) {
      icon.classList.replace("bi-moon", "bi-sun");
      text.textContent = "Light Mode";
    } else {
      icon.classList.replace("bi-sun", "bi-moon");
      text.textContent = "Dark Mode";
    }
  });
});


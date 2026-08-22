const themeToggleButton = document.querySelector(".theme-toggle-button");
const footerText = document.querySelector(".footer p");

if (themeToggleButton) {
  const lightTheme = {
    background: themeToggleButton.dataset.lightBackground,
    text: themeToggleButton.dataset.lightText,
    accent: themeToggleButton.dataset.lightAccent,
  };
  const darkTheme = {
    background: themeToggleButton.dataset.darkBackground,
    text: themeToggleButton.dataset.darkText,
    accent: themeToggleButton.dataset.darkAccent,
  };

  themeToggleButton.addEventListener("click", () => {
    const currentBackground = getComputedStyle(document.documentElement)
      .getPropertyValue("--background-color")
      .trim();
    const nextTheme = currentBackground === lightTheme.background ? darkTheme : lightTheme;

    document.documentElement.style.setProperty("--background-color", nextTheme.background);
    document.documentElement.style.setProperty("--text-color", nextTheme.text);
    document.documentElement.style.setProperty("--accent-color", nextTheme.accent);
  });
}

if (footerText) {
  footerText.textContent = `© ${new Date().getFullYear()} Shun "Sqlio" Tonegawa`;
}

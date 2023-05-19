function applyTheme(theme : string) {
  // we're dark by default, but shoelace is light by default...
  // hence a little bit of awkwardness here
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('sl-theme-dark');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('sl-theme-dark');
  }
}

export function getTheme() {
  let theme = localStorage.getItem('theme');
  if (!theme) {
    // initialize theme based on system preference
    let prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    theme = prefersLight ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  }

  return theme;
}

export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
  return newTheme;
}

// initializing
const currentTheme = getTheme();
applyTheme(currentTheme);
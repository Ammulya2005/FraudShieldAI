
/* =========================================================
   FRAUDSHIELD AI
   LIGHT / DARK THEME MANAGER
   ========================================================= */


/* =========================================================
   STORAGE KEY
   ========================================================= */

const THEME_STORAGE_KEY =
  'fraudshield-theme';



/* =========================================================
   GET SAVED THEME
   ========================================================= */

function getSavedTheme() {

  const savedTheme =
    localStorage.getItem(
      THEME_STORAGE_KEY
    );


  if (
    savedTheme === 'light' ||
    savedTheme === 'dark'
  ) {

    return savedTheme;

  }


  /*
   * Default theme
   *
   * Change this to "light" if you want
   * the application to start in light mode.
   */

  return 'dark';
}



/* =========================================================
   UPDATE BUTTON
   ========================================================= */

function updateThemeButton(theme) {

  const button =
    document.getElementById(
      'btn-theme-toggle'
    );


  if (!button) {
    return;
  }


  if (theme === 'dark') {

    button.innerHTML =
      '☀️ Light';

    button.title =
      'Switch to light mode';

    button.setAttribute(
      'aria-label',
      'Switch to light mode'
    );

  }

  else {

    button.innerHTML =
      '🌙 Dark';

    button.title =
      'Switch to dark mode';

    button.setAttribute(
      'aria-label',
      'Switch to dark mode'
    );

  }

}



/* =========================================================
   APPLY THEME
   ========================================================= */

export function applyTheme(theme) {


  if (
    theme !== 'light' &&
    theme !== 'dark'
  ) {

    theme = 'dark';

  }


  /*
   * Apply theme to <html>
   */

  document.documentElement.setAttribute(
    'data-theme',
    theme
  );


  /*
   * Save preference
   */

  localStorage.setItem(
    THEME_STORAGE_KEY,
    theme
  );


  /*
   * Update toggle button
   */

  updateThemeButton(theme);


  /*
   * Tell charts and other components
   * that the theme changed.
   */

  window.dispatchEvent(
    new CustomEvent(
      'fraudshield-theme-changed',
      {
        detail: {
          theme: theme
        }
      }
    )
  );

}



/* =========================================================
   TOGGLE THEME
   ========================================================= */

export function toggleTheme() {

  const currentTheme =
    document.documentElement.getAttribute(
      'data-theme'
    ) || 'dark';


  const newTheme =
    currentTheme === 'dark'
      ? 'light'
      : 'dark';


  applyTheme(newTheme);

}



/* =========================================================
   INITIALIZE THEME
   ========================================================= */

export function initTheme() {


  /*
   * Load previously selected theme
   */

  const savedTheme =
    getSavedTheme();


  applyTheme(savedTheme);


  /*
   * Theme button click
   */

  document.addEventListener(
    'click',
    function (event) {

      const button =
        event.target.closest(
          '#btn-theme-toggle'
        );


      if (!button) {
        return;
      }


      toggleTheme();

    }
  );

}
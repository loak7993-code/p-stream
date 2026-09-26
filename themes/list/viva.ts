import { createTheme } from "../types";

/**
 * StreamViva — "Sunset Marquee"
 * Warm cinema-dark palette: espresso-black backgrounds lit by
 * amber-gold marquee light with coral accents.
 */
const tokens = {
  black: "hsla(20, 12%, 0%, 1)",
  white: "hsla(36, 100%, 98%, 1)", // warm white
  semantic: {
    red: {
      c100: "hsla(4, 88%, 70%, 1)", // Error text
      c200: "hsla(4, 78%, 62%, 1)", // Video player scraping error
      c300: "hsla(4, 68%, 55%, 1)", // Danger button
      c400: "hsla(4, 58%, 44%, 1)",
    },
    green: {
      c100: "hsla(150, 55%, 62%, 1)", // Success text
      c200: "hsla(152, 48%, 50%, 1)", // Video player scraping success
      c300: "hsla(152, 45%, 42%, 1)",
      c400: "hsla(152, 45%, 31%, 1)",
    },
    silver: {
      c100: "hsla(38, 42%, 88%, 1)", // Primary button hover
      c200: "hsla(32, 30%, 79%, 1)",
      c300: "hsla(28, 18%, 64%, 1)", // Secondary button text
      c400: "hsla(25, 14%, 52%, 1)", // Main text in video player context
    },
    yellow: {
      c100: "hsla(46, 100%, 82%, 1)", // Best onboarding highlight
      c200: "hsla(44, 98%, 72%, 1)", // Dropdown highlight hover
      c300: "hsla(42, 82%, 60%, 1)",
      c400: "hsla(40, 60%, 48%, 1)", // Dropdown highlight
    },
    rose: {
      c100: "hsla(350, 82%, 66%, 1)", // Authentication error text
      c200: "hsla(350, 62%, 42%, 1)", // Danger button hover
      c300: "hsla(350, 60%, 38%, 1)", // Danger button
      c400: "hsla(350, 58%, 30%, 1)",
    },
  },
  // amber ramp — the marquee gold (primary accent)
  amber: {
    c50: "hsla(40, 100%, 85%, 1)", // Link hover, settings titles
    c100: "hsla(38, 98%, 78%, 1)", // Link, logo text, player audio set
    c200: "hsla(36, 96%, 68%, 1)", // Progress filled, loading accent
    c300: "hsla(34, 92%, 60%, 1)", // Toggle, onboarding bar filled
    c400: "hsla(32, 84%, 54%, 1)", // Large card icon
    c500: "hsla(30, 70%, 40%, 1)", // Background accent A
    c600: "hsla(28, 62%, 30%, 1)",
    c700: "hsla(26, 55%, 21%, 1)",
    c800: "hsla(24, 48%, 14%, 1)",
    c900: "hsla(22, 40%, 8%, 1)",
  },
  // ember ramp — the coral viva (secondary accent)
  ember: {
    c50: "hsla(8, 100%, 84%, 1)",
    c100: "hsla(8, 92%, 74%, 1)",
    c200: "hsla(8, 84%, 64%, 1)", // Global accent B
    c300: "hsla(8, 74%, 56%, 1)",
    c400: "hsla(8, 64%, 46%, 1)",
    c500: "hsla(8, 56%, 34%, 1)",
    c600: "hsla(8, 50%, 25%, 1)",
    c700: "hsla(8, 44%, 18%, 1)",
    c800: "hsla(8, 38%, 12%, 1)",
    c900: "hsla(8, 32%, 7%, 1)",
  },
  // ash ramp — warm neutrals (surfaces)
  ash: {
    c50: "hsla(28, 10%, 55%, 1)",
    c100: "hsla(26, 12%, 44%, 1)", // Secondary text, badge text
    c200: "hsla(24, 12%, 34%, 1)", // Media card bar, player buttons bg
    c300: "hsla(22, 14%, 25%, 1)", // Cancel button hover, divider
    c400: "hsla(20, 14%, 20%, 1)", // Card border and background
    c500: "hsla(18, 13%, 17%, 1)", // Cancel button, modal background
    c600: "hsla(16, 12%, 14%, 1)", // Background secondary
    c700: "hsla(14, 12%, 11%, 1)", // Secondary button, card badges
    c800: "hsla(12, 11%, 8%, 1)", // Background main
    c900: "hsla(10, 10%, 6%, 1)", // Hover shadows, player context
  },
  // shade ramp — deep warm darks (page backgrounds)
  shade: {
    c25: "hsla(34, 60%, 60%, 1)", // Media card hover accent (gold glow)
    c50: "hsla(30, 14%, 74%, 1)", // Theme secondary color, main text
    c100: "hsla(26, 12%, 56%, 1)", // Search placeholder and icon
    c200: "hsla(22, 12%, 42%, 1)", // Pill background hover
    c300: "hsla(18, 12%, 30%, 1)", // Pill background, auth border
    c400: "hsla(16, 11%, 22%, 1)", // Background secondary hover
    c500: "hsla(14, 10%, 17%, 1)", // Search background, focus
    c600: "hsla(12, 10%, 13%, 1)", // Modal background, dropdown bg
    c700: "hsla(10, 10%, 10%, 1)", // Dropdown alt background
    c800: "hsla(9, 10%, 8%, 1)", // Background main, onboarding card
    c900: "hsla(8, 9%, 5%, 1)", // Media card hover shadow
  },
};

export default createTheme({
  name: "viva",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.amber.c200,
        secondary: tokens.shade.c50,
        ghost: tokens.white,
      },

      // Branding
      pill: {
        background: tokens.shade.c300,
        backgroundHover: tokens.shade.c200,
        highlight: tokens.amber.c200,
        activeBackground: tokens.shade.c300,
      },

      global: {
        accentA: tokens.amber.c200,
        accentB: tokens.ember.c200,
      },

      lightBar: {
        light: tokens.amber.c400,
      },

      // Buttons
      buttons: {
        toggle: tokens.amber.c300,
        toggleDisabled: tokens.ash.c500,
        danger: tokens.semantic.rose.c300,
        dangerHover: tokens.semantic.rose.c200,
        secondary: tokens.ash.c700,
        secondaryText: tokens.semantic.silver.c300,
        secondaryHover: tokens.ash.c700,
        primary: tokens.white,
        primaryText: tokens.black,
        primaryHover: tokens.semantic.silver.c100,
        purple: tokens.ember.c500,
        purpleHover: tokens.ember.c400,
        cancel: tokens.ash.c500,
        cancelHover: tokens.ash.c300,
      },

      // only used for body colors/textures
      background: {
        main: tokens.shade.c900,
        secondary: tokens.shade.c600,
        secondaryHover: tokens.shade.c400,
        accentA: tokens.amber.c500,
        accentB: tokens.ember.c500,
      },

      // Modals
      modal: {
        background: tokens.shade.c800,
      },

      // typography
      type: {
        logo: tokens.amber.c100,
        emphasis: tokens.white,
        text: tokens.shade.c50,
        dimmed: tokens.shade.c50,
        divider: tokens.ash.c500,
        secondary: tokens.ash.c100,
        danger: tokens.semantic.red.c100,
        success: tokens.semantic.green.c100,
        link: tokens.amber.c100,
        linkHover: tokens.amber.c50,
      },

      // search bar
      search: {
        background: tokens.shade.c500,
        hoverBackground: tokens.shade.c600,
        focused: tokens.shade.c400,
        placeholder: tokens.shade.c100,
        icon: tokens.shade.c100,
        text: tokens.white,
      },

      // media cards
      mediaCard: {
        hoverBackground: tokens.shade.c600,
        hoverAccent: tokens.shade.c25,
        hoverShadow: tokens.shade.c900,
        shadow: tokens.shade.c700,
        barColor: tokens.ash.c200,
        barFillColor: tokens.amber.c100,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100,
      },

      // Large card
      largeCard: {
        background: tokens.shade.c600,
        icon: tokens.amber.c400,
      },

      // Dropdown
      dropdown: {
        background: tokens.shade.c600,
        altBackground: tokens.shade.c700,
        hoverBackground: tokens.shade.c500,
        highlight: tokens.semantic.yellow.c400,
        highlightHover: tokens.semantic.yellow.c200,
        text: tokens.shade.c50,
        secondary: tokens.shade.c100,
        border: tokens.shade.c400,
        contentBackground: tokens.shade.c500,
      },

      // Passphrase
      authentication: {
        border: tokens.shade.c300,
        inputBg: tokens.shade.c600,
        inputBgHover: tokens.shade.c500,
        wordBackground: tokens.shade.c500,
        copyText: tokens.shade.c100,
        copyTextHover: tokens.ash.c50,
        errorText: tokens.semantic.rose.c100,
      },

      // Settings page
      settings: {
        sidebar: {
          activeLink: tokens.shade.c600,
          badge: tokens.shade.c900,
          type: {
            secondary: tokens.shade.c200,
            inactive: tokens.shade.c50,
            icon: tokens.shade.c50,
            iconActivated: tokens.amber.c200,
            activated: tokens.amber.c50,
          },
        },
        card: {
          border: tokens.shade.c400,
          background: tokens.shade.c400,
          altBackground: tokens.shade.c400,
        },
        saveBar: {
          background: tokens.shade.c800,
        },
      },

      // Utilities
      utils: {
        divider: tokens.ash.c300,
      },

      // Onboarding
      onboarding: {
        bar: tokens.shade.c400,
        barFilled: tokens.amber.c300,
        divider: tokens.shade.c200,
        card: tokens.shade.c800,
        cardHover: tokens.shade.c700,
        border: tokens.shade.c600,
        good: tokens.amber.c100,
        best: tokens.semantic.yellow.c100,
        link: tokens.amber.c100,
      },

      // Error page
      errors: {
        card: tokens.shade.c800,
        border: tokens.ash.c500,
        type: {
          secondary: tokens.ash.c100,
        },
      },

      // About page
      about: {
        circle: tokens.ash.c500,
        circleText: tokens.ash.c50,
      },

      // edit badge
      editBadge: {
        bg: tokens.ash.c500,
        bgHover: tokens.ash.c400,
        text: tokens.ash.c50,
      },

      progress: {
        background: tokens.ash.c50,
        preloaded: tokens.ash.c50,
        filled: tokens.amber.c200,
      },

      // video player
      video: {
        buttonBackground: tokens.ash.c200,
        autoPlay: {
          background: tokens.ash.c700,
          hover: tokens.ash.c500,
        },
        scraping: {
          card: tokens.shade.c700,
          error: tokens.semantic.red.c200,
          success: tokens.semantic.green.c200,
          loading: tokens.amber.c200,
          noresult: tokens.ash.c100,
        },
        audio: {
          set: tokens.amber.c200,
        },
        context: {
          background: tokens.ash.c900,
          light: tokens.shade.c50,
          border: tokens.ash.c600,
          hoverColor: tokens.ash.c600,
          buttonFocus: tokens.ash.c500,
          flagBg: tokens.ash.c500,
          inputBg: tokens.ash.c600,
          buttonOverInputHover: tokens.ash.c500,
          inputPlaceholder: tokens.ash.c200,
          cardBorder: tokens.ash.c700,
          slider: tokens.ash.c50,
          sliderFilled: tokens.amber.c200,
          error: tokens.semantic.red.c200,
          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900,
          },
          closeHover: tokens.ash.c800,
          type: {
            main: tokens.semantic.silver.c400,
            secondary: tokens.ash.c200,
            accent: tokens.amber.c200,
          },
        },
      },
    },
  },
});

import { createTheme } from "../types";

/**
 * StreamViva — "Midnight Signal"
 * Cold broadcast-room aesthetic: blue-black voids, electric cyan signal,
 * hairline borders. Late-night transmission vibes.
 */
const tokens = {
  black: "hsla(222, 28%, 0%, 1)",
  white: "hsla(210, 40%, 98%, 1)", // cold white
  semantic: {
    red: {
      c100: "hsla(0, 92%, 72%, 1)", // Error text
      c200: "hsla(0, 84%, 64%, 1)", // Video player scraping error
      c300: "hsla(0, 76%, 56%, 1)", // Danger button
      c400: "hsla(0, 66%, 45%, 1)",
    },
    green: {
      c100: "hsla(160, 70%, 62%, 1)", // Success text
      c200: "hsla(162, 60%, 50%, 1)", // Video player scraping success
      c300: "hsla(162, 52%, 42%, 1)",
      c400: "hsla(162, 52%, 31%, 1)",
    },
    silver: {
      c100: "hsla(210, 36%, 88%, 1)", // Primary button hover
      c200: "hsla(210, 28%, 78%, 1)",
      c300: "hsla(211, 20%, 64%, 1)", // Secondary button text
      c400: "hsla(211, 16%, 52%, 1)", // Main text in video player context
    },
    yellow: {
      c100: "hsla(56, 100%, 80%, 1)", // Best onboarding highlight
      c200: "hsla(60, 96%, 70%, 1)", // Dropdown highlight hover
      c300: "hsla(62, 84%, 58%, 1)",
      c400: "hsla(60, 62%, 46%, 1)", // Dropdown highlight
    },
    rose: {
      c100: "hsla(348, 86%, 68%, 1)", // Authentication error text
      c200: "hsla(348, 62%, 42%, 1)", // Danger button hover
      c300: "hsla(348, 60%, 38%, 1)", // Danger button
      c400: "hsla(348, 58%, 30%, 1)",
    },
  },
  // cyan ramp — the signal (primary accent)
  cyan: {
    c50: "hsla(190, 96%, 84%, 1)", // Link hover, settings titles
    c100: "hsla(190, 94%, 76%, 1)", // Link, logo text, player audio set
    c200: "hsla(189, 92%, 64%, 1)", // Progress filled, loading accent
    c300: "hsla(188, 90%, 54%, 1)", // Toggle, onboarding bar filled
    c400: "hsla(187, 84%, 46%, 1)", // Large card icon
    c500: "hsla(210, 60%, 30%, 1)", // Background accent A
    c600: "hsla(214, 56%, 22%, 1)",
    c700: "hsla(218, 52%, 15%, 1)",
    c800: "hsla(220, 48%, 10%, 1)",
    c900: "hsla(222, 44%, 6%, 1)",
  },
  // magenta ramp — the interference (secondary accent)
  magenta: {
    c50: "hsla(286, 92%, 82%, 1)",
    c100: "hsla(288, 88%, 74%, 1)",
    c200: "hsla(290, 82%, 64%, 1)", // Global accent B
    c300: "hsla(292, 74%, 56%, 1)",
    c400: "hsla(294, 64%, 46%, 1)",
    c500: "hsla(270, 48%, 32%, 1)",
    c600: "hsla(270, 44%, 24%, 1)",
    c700: "hsla(272, 40%, 17%, 1)",
    c800: "hsla(274, 36%, 12%, 1)",
    c900: "hsla(276, 32%, 7%, 1)",
  },
  // ash ramp — cold neutrals (surfaces)
  ash: {
    c50: "hsla(213, 14%, 54%, 1)",
    c100: "hsla(213, 14%, 44%, 1)", // Secondary text, badge text
    c200: "hsla(213, 13%, 34%, 1)", // Media card bar, player buttons bg
    c300: "hsla(213, 12%, 25%, 1)", // Cancel button hover, divider
    c400: "hsla(213, 13%, 20%, 1)", // Card border and background
    c500: "hsla(213, 12%, 17%, 1)", // Cancel button, modal background
    c600: "hsla(214, 13%, 14%, 1)", // Background secondary
    c700: "hsla(215, 13%, 11%, 1)", // Secondary button, card badges
    c800: "hsla(216, 13%, 8%, 1)", // Background main
    c900: "hsla(218, 13%, 6%, 1)", // Hover shadows, player context
  },
  // shade ramp — deep cold darks (page backgrounds)
  shade: {
    c25: "hsla(190, 90%, 60%, 1)", // Media card hover accent (cyan signal)
    c50: "hsla(211, 22%, 74%, 1)", // Theme secondary color, main text
    c100: "hsla(212, 16%, 56%, 1)", // Search placeholder and icon
    c200: "hsla(213, 14%, 42%, 1)", // Pill background hover
    c300: "hsla(214, 13%, 30%, 1)", // Pill background, auth border
    c400: "hsla(215, 13%, 22%, 1)", // Background secondary hover
    c500: "hsla(216, 12%, 17%, 1)", // Search background, focus
    c600: "hsla(217, 13%, 13%, 1)", // Modal background, dropdown bg
    c700: "hsla(218, 13%, 10%, 1)", // Dropdown alt background
    c800: "hsla(219, 14%, 8%, 1)", // Background main, onboarding card
    c900: "hsla(220, 15%, 5%, 1)", // Media card hover shadow
  },
};

export default createTheme({
  name: "signal",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.cyan.c200,
        secondary: tokens.shade.c50,
        ghost: tokens.white,
      },

      // Branding
      pill: {
        background: tokens.shade.c300,
        backgroundHover: tokens.shade.c200,
        highlight: tokens.cyan.c200,
        activeBackground: tokens.shade.c300,
      },

      global: {
        accentA: tokens.cyan.c200,
        accentB: tokens.magenta.c200,
      },

      lightBar: {
        light: tokens.cyan.c400,
      },

      // Buttons
      buttons: {
        toggle: tokens.cyan.c300,
        toggleDisabled: tokens.ash.c500,
        danger: tokens.semantic.rose.c300,
        dangerHover: tokens.semantic.rose.c200,
        secondary: tokens.ash.c700,
        secondaryText: tokens.semantic.silver.c300,
        secondaryHover: tokens.ash.c700,
        primary: tokens.white,
        primaryText: tokens.black,
        primaryHover: tokens.semantic.silver.c100,
        purple: tokens.magenta.c500,
        purpleHover: tokens.magenta.c400,
        cancel: tokens.ash.c500,
        cancelHover: tokens.ash.c300,
      },

      // only used for body colors/textures
      background: {
        main: tokens.shade.c900,
        secondary: tokens.shade.c600,
        secondaryHover: tokens.shade.c400,
        accentA: tokens.cyan.c500,
        accentB: tokens.magenta.c500,
      },

      // Modals
      modal: {
        background: tokens.shade.c800,
      },

      // typography
      type: {
        logo: tokens.cyan.c100,
        emphasis: tokens.white,
        text: tokens.shade.c50,
        dimmed: tokens.shade.c50,
        divider: tokens.ash.c500,
        secondary: tokens.ash.c100,
        danger: tokens.semantic.red.c100,
        success: tokens.semantic.green.c100,
        link: tokens.cyan.c100,
        linkHover: tokens.cyan.c50,
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
        barFillColor: tokens.cyan.c100,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100,
      },

      // Large card
      largeCard: {
        background: tokens.shade.c600,
        icon: tokens.cyan.c400,
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
            iconActivated: tokens.cyan.c200,
            activated: tokens.cyan.c50,
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
        barFilled: tokens.cyan.c300,
        divider: tokens.shade.c200,
        card: tokens.shade.c800,
        cardHover: tokens.shade.c700,
        border: tokens.shade.c600,
        good: tokens.cyan.c100,
        best: tokens.semantic.yellow.c100,
        link: tokens.cyan.c100,
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
        filled: tokens.cyan.c200,
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
          loading: tokens.cyan.c200,
          noresult: tokens.ash.c100,
        },
        audio: {
          set: tokens.cyan.c200,
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
          sliderFilled: tokens.cyan.c200,
          error: tokens.semantic.red.c200,
          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900,
          },
          closeHover: tokens.ash.c800,
          type: {
            main: tokens.semantic.silver.c400,
            secondary: tokens.ash.c200,
            accent: tokens.cyan.c200,
          },
        },
      },
    },
  },
});

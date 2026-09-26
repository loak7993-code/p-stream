import { createTheme } from "../types";

/**
 * StreamViva — "Silk"
 * Refined premium dark: layered charcoal surfaces, a single soft
 * iris-lavender accent, pearl highlights. Quiet luxury, no noise.
 */
const tokens = {
  black: "hsla(240, 8%, 0%, 1)",
  white: "hsla(240, 30%, 99%, 1)",
  semantic: {
    red: {
      c100: "hsla(2, 84%, 72%, 1)",
      c200: "hsla(2, 76%, 64%, 1)",
      c300: "hsla(2, 68%, 56%, 1)",
      c400: "hsla(2, 58%, 45%, 1)",
    },
    green: {
      c100: "hsla(152, 52%, 66%, 1)",
      c200: "hsla(152, 46%, 54%, 1)",
      c300: "hsla(152, 42%, 44%, 1)",
      c400: "hsla(152, 42%, 33%, 1)",
    },
    silver: {
      c100: "hsla(240, 24%, 90%, 1)",
      c200: "hsla(240, 18%, 80%, 1)",
      c300: "hsla(240, 12%, 66%, 1)",
      c400: "hsla(240, 10%, 54%, 1)",
    },
    yellow: {
      c100: "hsla(48, 100%, 82%, 1)",
      c200: "hsla(48, 96%, 72%, 1)",
      c300: "hsla(48, 84%, 60%, 1)",
      c400: "hsla(48, 62%, 48%, 1)",
    },
    rose: {
      c100: "hsla(342, 84%, 68%, 1)",
      c200: "hsla(342, 62%, 44%, 1)",
      c300: "hsla(342, 58%, 40%, 1)",
      c400: "hsla(342, 56%, 32%, 1)",
    },
  },
  // iris ramp — the single accent: soft violet-blue
  iris: {
    c50: "hsla(240, 100%, 88%, 1)",
    c100: "hsla(243, 92%, 80%, 1)",
    c200: "hsla(245, 84%, 70%, 1)", // progress filled, loading accent
    c300: "hsla(247, 76%, 62%, 1)", // toggle, onboarding bar
    c400: "hsla(249, 66%, 54%, 1)", // large card icon
    c500: "hsla(250, 48%, 38%, 1)", // background accent A
    c600: "hsla(251, 44%, 28%, 1)",
    c700: "hsla(252, 40%, 19%, 1)",
    c800: "hsla(253, 36%, 13%, 1)",
    c900: "hsla(254, 32%, 8%, 1)",
  },
  // pearl ramp — highlights for text-on-accent moments
  pearl: {
    c50: "hsla(40, 60%, 92%, 1)",
    c100: "hsla(40, 50%, 86%, 1)",
    c200: "hsla(42, 40%, 78%, 1)",
    c300: "hsla(42, 30%, 66%, 1)",
    c400: "hsla(42, 24%, 52%, 1)",
    c500: "hsla(42, 20%, 38%, 1)",
    c600: "hsla(42, 18%, 28%, 1)",
    c700: "hsla(42, 16%, 19%, 1)",
    c800: "hsla(42, 14%, 13%, 1)",
    c900: "hsla(42, 12%, 7%, 1)",
  },
  // ash ramp — layered neutral surfaces (subtle violet cast)
  ash: {
    c50: "hsla(240, 8%, 54%, 1)",
    c100: "hsla(240, 8%, 46%, 1)",
    c200: "hsla(240, 8%, 36%, 1)",
    c300: "hsla(240, 8%, 27%, 1)",
    c400: "hsla(240, 8%, 21%, 1)",
    c500: "hsla(240, 8%, 17%, 1)",
    c600: "hsla(240, 8%, 14%, 1)",
    c700: "hsla(240, 8%, 11%, 1)",
    c800: "hsla(240, 8%, 8%, 1)",
    c900: "hsla(240, 8%, 6%, 1)",
  },
  // shade ramp — page depth
  shade: {
    c25: "hsla(245, 70%, 72%, 1)", // media card hover accent (iris glow)
    c50: "hsla(240, 14%, 78%, 1)",
    c100: "hsla(240, 10%, 58%, 1)",
    c200: "hsla(240, 9%, 44%, 1)",
    c300: "hsla(240, 9%, 32%, 1)",
    c400: "hsla(240, 9%, 23%, 1)",
    c500: "hsla(240, 9%, 18%, 1)",
    c600: "hsla(240, 9%, 14%, 1)",
    c700: "hsla(240, 9%, 11%, 1)",
    c800: "hsla(240, 9%, 9%, 1)",
    c900: "hsla(240, 9%, 6%, 1)",
  },
};

export default createTheme({
  name: "silk",
  extend: {
    colors: {
      themePreview: {
        primary: tokens.iris.c200,
        secondary: tokens.shade.c50,
        ghost: tokens.white,
      },

      pill: {
        background: "hsla(240, 9%, 32%, 0.55)",
        backgroundHover: "hsla(240, 9%, 44%, 0.6)",
        highlight: tokens.iris.c200,
        activeBackground: "hsla(240, 9%, 32%, 0.55)",
      },

      global: {
        accentA: tokens.iris.c200,
        accentB: tokens.iris.c300,
      },

      lightBar: {
        light: tokens.iris.c400,
      },

      buttons: {
        toggle: tokens.iris.c300,
        toggleDisabled: tokens.ash.c500,
        danger: tokens.semantic.rose.c300,
        dangerHover: tokens.semantic.rose.c200,
        secondary: tokens.ash.c700,
        secondaryText: tokens.semantic.silver.c300,
        secondaryHover: tokens.ash.c700,
        primary: tokens.white,
        primaryText: tokens.black,
        primaryHover: tokens.semantic.silver.c100,
        purple: tokens.iris.c500,
        purpleHover: tokens.iris.c400,
        cancel: tokens.ash.c500,
        cancelHover: tokens.ash.c300,
      },

      background: {
        main: "hsla(240, 9%, 6%, 1)",
        secondary: tokens.shade.c600,
        secondaryHover: tokens.shade.c400,
        accentA: tokens.iris.c500,
        accentB: tokens.pearl.c500,
      },

      modal: {
        background: tokens.shade.c800,
      },

      type: {
        logo: tokens.iris.c100,
        emphasis: tokens.white,
        text: tokens.shade.c50,
        dimmed: tokens.shade.c50,
        divider: tokens.ash.c500,
        secondary: tokens.ash.c100,
        danger: tokens.semantic.red.c100,
        success: tokens.semantic.green.c100,
        link: tokens.iris.c100,
        linkHover: tokens.iris.c50,
      },

      search: {
        background: "hsla(240, 9%, 14%, 0.8)",
        hoverBackground: "hsla(240, 9%, 18%, 0.9)",
        focused: "hsla(240, 9%, 21%, 0.9)",
        placeholder: tokens.shade.c100,
        icon: tokens.shade.c100,
        text: tokens.white,
      },

      mediaCard: {
        hoverBackground: "hsla(240, 9%, 14%, 0.9)",
        hoverAccent: tokens.shade.c25,
        hoverShadow: "hsla(240, 9%, 4%, 0.9)",
        shadow: "hsla(240, 9%, 5%, 0.8)",
        barColor: tokens.ash.c200,
        barFillColor: tokens.iris.c100,
        badge: tokens.shade.c700,
        badgeText: tokens.ash.c100,
      },

      largeCard: {
        background: tokens.shade.c600,
        icon: tokens.iris.c400,
      },

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

      authentication: {
        border: tokens.shade.c300,
        inputBg: tokens.shade.c600,
        inputBgHover: tokens.shade.c500,
        wordBackground: tokens.shade.c500,
        copyText: tokens.shade.c100,
        copyTextHover: tokens.ash.c50,
        errorText: tokens.semantic.rose.c100,
      },

      settings: {
        sidebar: {
          activeLink: tokens.shade.c600,
          badge: tokens.shade.c900,
          type: {
            secondary: tokens.shade.c200,
            inactive: tokens.shade.c50,
            icon: tokens.shade.c50,
            iconActivated: tokens.iris.c200,
            activated: tokens.iris.c50,
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

      utils: {
        divider: tokens.ash.c300,
      },

      onboarding: {
        bar: tokens.shade.c400,
        barFilled: tokens.iris.c300,
        divider: tokens.shade.c200,
        card: tokens.shade.c800,
        cardHover: tokens.shade.c700,
        border: tokens.shade.c600,
        good: tokens.iris.c100,
        best: tokens.semantic.yellow.c100,
        link: tokens.iris.c100,
      },

      errors: {
        card: tokens.shade.c800,
        border: tokens.ash.c500,
        type: {
          secondary: tokens.ash.c100,
        },
      },

      about: {
        circle: tokens.ash.c500,
        circleText: tokens.ash.c50,
      },

      editBadge: {
        bg: tokens.ash.c500,
        bgHover: tokens.ash.c400,
        text: tokens.ash.c50,
      },

      progress: {
        background: tokens.ash.c50,
        preloaded: tokens.ash.c50,
        filled: tokens.iris.c200,
      },

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
          loading: tokens.iris.c200,
          noresult: tokens.ash.c100,
        },
        audio: {
          set: tokens.iris.c200,
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
          sliderFilled: tokens.iris.c200,
          error: tokens.semantic.red.c200,
          buttons: {
            list: tokens.ash.c700,
            active: tokens.ash.c900,
          },
          closeHover: tokens.ash.c800,
          type: {
            main: tokens.semantic.silver.c400,
            secondary: tokens.ash.c200,
            accent: tokens.iris.c200,
          },
        },
      },
    },
  },
});

export { }

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    orange: SimplePaletteColorOptions;
    brown: SimplePaletteColorOptions;
    blue: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;
    gray_1: SimplePaletteColorOptions;
    gray_2: SimplePaletteColorOptions;
    gray_3: SimplePaletteColorOptions;
    gray_4: SimplePaletteColorOptions;
    gray_5: SimplePaletteColorOptions;
    gray_6: SimplePaletteColorOptions;

    [key: string]: Palette['primary'];
  }
  interface PaletteOptions {
    orange: SimplePaletteColorOptions;
    brown: SimplePaletteColorOptions;
    blue: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;
    gray_1: SimplePaletteColorOptions;
    gray_2: SimplePaletteColorOptions;
    gray_3: SimplePaletteColorOptions;
    gray_4: SimplePaletteColorOptions;
    gray_5: SimplePaletteColorOptions;
    gray_6: SimplePaletteColorOptions;
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    orange: true;
    brown: true;
    blue: true;
    white: true;
    gray_1: SimplePaletteColorOptions;
    gray_2: SimplePaletteColorOptions;
    gray_3: SimplePaletteColorOptions;
    gray_4: SimplePaletteColorOptions;
    gray_5: SimplePaletteColorOptions;
    gray_6: SimplePaletteColorOptions;
  }
}
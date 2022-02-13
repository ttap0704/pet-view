export { }

declare module '@mui/material/styles' {
  interface Palette {
    [key: string]: Palette['primary'];
  }
  interface PaletteOptions {
    orange: PaletteOptions['primary'];
    brown: PaletteOptions['primary'];
    blue: PaletteOptions['primary'];
    white: PaletteOptions['primary'];
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
  }
}
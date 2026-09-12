/**
 * Type declarations for CSS module imports and CSS side-effect imports.
 */

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  // side-effect import - no exports
}

declare module '@/global.css' {
  // side-effect import - no exports
}

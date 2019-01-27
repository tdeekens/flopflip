declare function invariant(
  testValue: any,
  format?: string,
  ...extra: any[]
): void;

declare module 'tiny-invariant' {
  export = invariant;
}

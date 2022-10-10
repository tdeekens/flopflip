declare function invariant(
  testValue: any,
  format?: string,
  ...extra: readonly any[]
): void;

declare module 'tiny-invariant' {
  export = invariant;
}

# @flopflip/adapter-utilities

## 1.0.5

### Patch Changes

- [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d) [#1382](https://github.com/tdeekens/flopflip/pull/1382) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: add manypkg for validation for workspaces

- Updated dependencies [[`498f3bc`](https://github.com/tdeekens/flopflip/commit/498f3bcdc605f60bd8e72924cdef08c4a079d4f1), [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d)]:
  - @flopflip/types@4.1.3

## 1.0.4

### Patch Changes

- Updated dependencies [[`0fbcac4`](https://github.com/tdeekens/flopflip/commit/0fbcac4d42568dda5fad6f1e33ff605b954301ee)]:
  - @flopflip/types@4.1.2

## 1.0.3

### Patch Changes

- Updated dependencies [[`badd563`](https://github.com/tdeekens/flopflip/commit/badd563fb90f0af3a0e364d4393a108c0b7ebec8)]:
  - @flopflip/types@4.1.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e)]:
  - @flopflip/types@4.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`e9b47fd`](https://github.com/tdeekens/flopflip/commit/e9b47fd613452d5ec5d3bf7af1dcc1cc2d9c11a7)]:
  - @flopflip/types@4.0.1

## 1.0.0

### Major Changes

- [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9) [#1362](https://github.com/tdeekens/flopflip/pull/1362) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: updateFlags to be only on adapter

  The `updateFlags` export from each adapter is no longer present. Please use the `adapter.updateFlags` function instead. The prior was a re-export of the latter for longer anyway.

  This affects also other locations you should hopefully not be affected by:

  1. `test-utils`: does not export `updateFlags` anymore. Use `adapter.updateFlags`
  2. Globals: The globals on the window do not contain a `window.__flopflip__.[id].updateFlags` anymore

* [`2310e35`](https://github.com/tdeekens/flopflip/commit/2310e356c2c9f81d68bc88b7aaf25442da100c57) [#1356](https://github.com/tdeekens/flopflip/pull/1356) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: add and use shared adapter utilities

### Patch Changes

- [`0aff3a2`](https://github.com/tdeekens/flopflip/commit/0aff3a21d4b6ac581db0e795d48fde9aa63b61bb) [#1360](https://github.com/tdeekens/flopflip/pull/1360) Thanks [@tdeekens](https://github.com/tdeekens)! - fix/splitio normlaization

- Updated dependencies [[`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12), [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404), [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7), [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88), [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c)]:
  - @flopflip/types@4.0.0

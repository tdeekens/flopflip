---
'@flopflip/react-broadcast': patch
---

fix(react-broadcast): keep flags and status per `Configure`

`Configure` stored flags and adapter status in one module-level store. A remounted `Configure` started with the flags and status of the previous mount, and several `Configure` trees shared one state. Each `Configure` now has its own store.

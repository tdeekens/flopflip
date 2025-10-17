---
name: OpenSpec: Archive
description: Archive a deployed OpenSpec change and update specs.
category: OpenSpec
tags: [openspec, archive]
---
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.

**Steps**
1. Identify the requested change ID (via the prompt or `openspec list`).
2. Run `openspec archive <id> --yes` to let the CLI move the change and apply spec updates without prompts (use `--skip-specs` only for tooling-only work).
3. Review the command output to confirm the target specs were updated and the change landed in `changes/archive/`.
4. Validate with `openspec validate --strict` and inspect with `openspec show <id>` if anything looks off.

**Reference**
- Inspect refreshed specs with `openspec list --specs` and address any validation issues before handing off.
<!-- OPENSPEC:END -->

# Vue Phaser game SPA (Stage0 template)

## Quick start

This repo is a **Stage0 merge template** for a Vue 3 + Phaser 3 game SPA. After merge, consumers get a project README from `README.md.template` (product documentation with specifications applied). The file you are reading now is **only for people working on or testing the template**.

See the [Template Guide](https://github.com/agile-learning-institute/stage0_runbook_merge/blob/main/TEMPLATE_GUIDE.md). Processing rules live in [`.stage0_template/process.yaml`](./.stage0_template/process.yaml). Sample specification YAMLs are under [`.stage0_template/Specifications/`](./.stage0_template/Specifications/).

Set **`SERVICE_NAME`** to the architecture domain name for the SPA (e.g. `game`) when merging.

## Template commands

```sh
# Test the template (Docker merge vs test_expected; uses ~/tmp/testRepo)
make test

# Diff one output path after a test run
make diff README.md

# Refresh test_expected from last test output
make take README.md

make clean

# Merge into current directory (destructive: removes .stage0_template)
# Example:
SERVICE_NAME=game make merge ./.stage0_template/Specifications
```

The merge step **`Makefile` → `/dev/null`** drops the template-only `Makefile` from the merged tree so downstream projects are not given these maintenance targets.

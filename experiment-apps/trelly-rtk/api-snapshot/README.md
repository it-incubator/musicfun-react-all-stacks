# Trelly API snapshot

Snapshot of https://trelly.it-incubator.app/api-json taken on 2026-11-08, the version this app was built against.

- `openapi.json` — the full spec, pretty-printed with sorted keys (stable for `diff`)
- `endpoints.txt` — a compact view: every operation with params, bodies, responses and schemas (descriptions and examples stripped)

Compare with the live API:

```bash
python3 snapshot.py /tmp/trelly-new && diff -u endpoints.txt /tmp/trelly-new/endpoints.txt
```

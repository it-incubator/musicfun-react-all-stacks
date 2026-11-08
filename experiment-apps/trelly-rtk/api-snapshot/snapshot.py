"""Download the Trelly OpenAPI spec and write a diff-friendly snapshot.

Usage: python3 snapshot.py [out_dir]   (default: this folder)
"""
import json
import os
import sys
import urllib.request

URL = "https://trelly.it-incubator.app/api-json"
out = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
os.makedirs(out, exist_ok=True)

spec = json.load(urllib.request.urlopen(URL))
with open(os.path.join(out, "openapi.json"), "w") as f:
    json.dump(spec, f, indent=2, sort_keys=True, ensure_ascii=False)


def strip(x):
    if isinstance(x, dict):
        return {k: strip(v) for k, v in x.items() if k not in ("description", "example")}
    if isinstance(x, list):
        return [strip(v) for v in x]
    return x


lines = []
for path, ops in sorted(spec["paths"].items()):
    for method, op in sorted(ops.items()):
        lines.append(f"{method.upper():6} {path}  [{op.get('operationId')}]")
        for p in op.get("parameters", []):
            lines.append(
                f"    param {p['in']}:{p['name']} required={p.get('required', False)} "
                f"schema={json.dumps(p.get('schema'), sort_keys=True)}"
            )
        body = op.get("requestBody")
        if body:
            for ct, c in sorted(body["content"].items()):
                lines.append(f"    body {ct}: {json.dumps(c.get('schema'), sort_keys=True)}")
        for code, r in sorted(op.get("responses", {}).items()):
            schemas = {ct: c.get("schema") for ct, c in r.get("content", {}).items()}
            lines.append(f"    {code}: {json.dumps(schemas, sort_keys=True)}")
        lines.append(f"    security: {json.dumps(op.get('security'))}")
lines += ["", "== SCHEMAS =="]
for name, schema in sorted(spec["components"]["schemas"].items()):
    lines.append(f"{name}: {json.dumps(strip(schema), sort_keys=True, ensure_ascii=False)}")

with open(os.path.join(out, "endpoints.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")
print(f"{len(spec['paths'])} paths, {sum(len(v) for v in spec['paths'].values())} operations -> {out}")

#!/usr/bin/env python3
"""Synchronize the public catalog cache-busting version with the published catalog."""

import json
import os
import re
from pathlib import Path

version = os.environ.get("DATA_VERSION")
if not version:
    raise SystemExit("DATA_VERSION is required")

catalog_path = Path("research/PEDAL_INDEX.json")
catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
catalog["version"] = version
catalog_path.write_text(
    json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

pattern = re.compile(r"""(const DATA_VERSION\s*=\s*['"])[^'"]+(['"])""")

for html_path in (Path("index.html"), Path("pedal-detail.html")):
    html = html_path.read_text(encoding="utf-8")
    updated, count = pattern.subn(
        lambda match: match.group(1) + version + match.group(2),
        html,
        count=1,
    )
    if count != 1:
        raise SystemExit(f"Could not update DATA_VERSION in {html_path}")
    html_path.write_text(updated, encoding="utf-8")

print(f"Publishing catalog with DATA_VERSION={version}")

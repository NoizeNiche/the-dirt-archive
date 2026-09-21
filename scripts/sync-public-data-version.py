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

runtime_path = Path("assets/js/archive-core.js")
runtime = runtime_path.read_text(encoding="utf-8")
pattern = re.compile(r"""(const ARCHIVE_DATA_VERSION\s*=\s*['"])[^'"]+(['"])""")
updated, count = pattern.subn(
    lambda match: match.group(1) + version + match.group(2),
    runtime,
    count=1,
)
if count != 1:
    raise SystemExit(f"Could not update ARCHIVE_DATA_VERSION in {runtime_path}")
runtime_path.write_text(updated, encoding="utf-8")

print(f"Publishing catalog with ARCHIVE_DATA_VERSION={version}")

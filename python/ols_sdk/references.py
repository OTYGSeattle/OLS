from __future__ import annotations

from pathlib import Path
from typing import Any, Optional, Union


def resolve_reference(
    reference: str,
    index: dict[str, dict[str, Any]],
    package_root: Optional[Union[str, Path]] = None,
    source: Optional[Union[str, Path]] = None,
) -> Optional[dict[str, Any]]:
    local = reference
    if reference.startswith("urn:ols:"):
        local = reference[8:].replace(":", ".")
    elif ":" in reference and "/" not in reference:
        local = reference.rsplit(":", 1)[-1]
    if reference in index:
        return index[reference]
    if local in index:
        return index[local]
    if package_root and source and ("/" in reference or reference.endswith(".json")):
        root = Path(package_root).resolve()
        candidate = (Path(source).parent / reference).resolve()
        try:
            candidate.relative_to(root)
        except ValueError:
            return None
        return next(
            (item for item in index.values() if Path(str(item.get("__source", ""))).resolve() == candidate), None
        )
    return None

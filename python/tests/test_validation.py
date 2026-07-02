from pathlib import Path

from openliturgy.validation import validate_document


def test_malformed_json_is_layer_one(tmp_path: Path) -> None:
    source = tmp_path / "bad.json"
    source.write_text("{", encoding="utf-8")
    result = validate_document(source)
    assert not result.valid
    assert result.diagnostics[0].code == "OLS_JSON_PARSE"

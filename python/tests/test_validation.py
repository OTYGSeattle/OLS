import json
from pathlib import Path

from openliturgy.validation import validate_document, validate_package


def test_malformed_json_is_layer_one(tmp_path: Path) -> None:
    source = tmp_path / "bad.json"
    source.write_text("{", encoding="utf-8")
    result = validate_document(source)
    assert not result.valid
    assert result.diagnostics[0].code == "OLS_JSON_PARSE"


def test_undeclared_and_missing_files_in_manifest(tmp_path: Path) -> None:
    manifest = {
        "$schema": "https://ols.otyg.org/schema/v1.0/manifest.schema.json",
        "ols_version": "1.0.0",
        "type": "manifest",
        "package": "org.openliturgy.test",
        "version": "1.0.1",
        "title": { "en": "Test package" },
        "license": "Apache-2.0",
        "files": ["missing-file.ols.json"]
    }
    (tmp_path / "manifest.ols.json").write_text(json.dumps(manifest), encoding="utf-8")

    extra = {
        "$schema": "https://ols.otyg.org/schema/v1.0/ordo.schema.json",
        "ols_version": "1.0.0",
        "type": "ordo",
        "id": "test-ordo",
        "sections": ["sec-word"]
    }
    (tmp_path / "extra.ols.json").write_text(json.dumps(extra), encoding="utf-8")

    result = validate_package(tmp_path)
    assert not result.valid
    assert any(d.code == "OLS_MANIFEST_FILE_NOT_FOUND" for d in result.diagnostics)
    assert any(d.code == "OLS_MANIFEST_FILE_UNDECLARED" for d in result.diagnostics)


def test_warning_for_uppercase_entity_ids(tmp_path: Path) -> None:
    manifest = {
        "$schema": "https://ols.otyg.org/schema/v1.0/manifest.schema.json",
        "ols_version": "1.0.0",
        "type": "manifest",
        "package": "org.openliturgy.test",
        "version": "1.0.1",
        "title": { "en": "Test package" },
        "license": "Apache-2.0",
        "files": ["ordo.ols.json"]
    }
    (tmp_path / "manifest.ols.json").write_text(json.dumps(manifest), encoding="utf-8")

    ordo = {
        "$schema": "https://ols.otyg.org/schema/v1.0/ordo.schema.json",
        "ols_version": "1.0.0",
        "type": "ordo",
        "id": "TEST-ordo-uppercase",
        "sections": ["sec-word"]
    }
    (tmp_path / "ordo.ols.json").write_text(json.dumps(ordo), encoding="utf-8")

    result = validate_package(tmp_path)
    assert any(d.code == "OLS_ID_UPPERCASE" and d.severity == "warning" for d in result.diagnostics)

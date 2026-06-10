import json
import logging
import os
import pickle
from typing import Any, Tuple

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.getenv("AI_MODEL_DIR", os.path.join(BASE_DIR, "saved_models"))

logger = logging.getLogger(__name__)


def _status(filename: str, loaded: bool, error: str | None = None) -> dict:
    return {
        "filename": filename,
        "loaded": loaded,
        "error": error,
    }


def load_pickle(filename: str) -> Tuple[Any | None, dict]:
    path = os.path.join(MODEL_DIR, filename)

    try:
        with open(path, "rb") as file:
            return pickle.load(file), _status(filename, True)
    except Exception as exc:
        logger.warning("AI model load failed for %s: %s", filename, exc)
        return None, _status(filename, False, exc.__class__.__name__)


def load_json(filename: str, default: Any) -> Tuple[Any, dict]:
    path = os.path.join(MODEL_DIR, filename)

    try:
        with open(path, encoding="utf-8") as file:
            return json.load(file), _status(filename, True)
    except Exception as exc:
        logger.warning("AI config load failed for %s: %s", filename, exc)
        return default, _status(filename, False, exc.__class__.__name__)

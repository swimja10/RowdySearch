import sys
from pathlib import Path

# Lets the tests import the pipeline's files the same way the pipeline does.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "pipeline"))

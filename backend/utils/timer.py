import time
from contextlib import contextmanager
from utils.logger import get_logger

logger = get_logger("timer")

@contextmanager
def timed(stage: str):
    start = time.time()
    yield
    duration = round(time.time() - start, 2)
    logger.info(f"{stage} completed in {duration}s")
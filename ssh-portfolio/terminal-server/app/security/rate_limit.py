"""In-memory sliding-window rate limiter (per process)."""
from __future__ import annotations

import time
from collections import deque
from typing import Callable


class SlidingWindowLimiter:
    def __init__(self, limit: int, window_seconds: float,
                 clock: Callable[[], float] = time.monotonic, max_keys: int = 20000) -> None:
        self.limit = limit
        self.window = window_seconds
        self._clock = clock
        self._max_keys = max_keys
        self._hits: dict[str, deque[float]] = {}

    def _live(self, key: str, now: float) -> deque[float]:
        q = self._hits.get(key)
        if q is None:
            return deque()
        while q and now - q[0] >= self.window:
            q.popleft()
        if not q:
            self._hits.pop(key, None)
        return q

    def allow(self, key: str) -> bool:
        """Record a hit and return True if it fits in the window."""
        now = self._clock()
        if len(self._hits) > self._max_keys:
            for k in list(self._hits):
                self._live(k, now)
        q = self._live(key, now)
        if len(q) >= self.limit:
            return False
        q.append(now)
        self._hits[key] = q
        return True

    def retry_after(self, key: str) -> float:
        now = self._clock()
        q = self._live(key, now)
        if len(q) < self.limit:
            return 0.0
        return max(0.0, self.window - (now - q[0]))

    def release(self, key: str) -> None:
        """Undo the most recent hit (e.g. delivery failed on our side)."""
        q = self._hits.get(key)
        if q:
            q.pop()
            if not q:
                self._hits.pop(key, None)

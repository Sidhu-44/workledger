from fastapi import Query

from config import settings


def pagination_params(
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.DEFAULT_PAGE_SIZE, ge=1, le=settings.MAX_PAGE_SIZE),
):
    return {"page": page, "page_size": page_size}

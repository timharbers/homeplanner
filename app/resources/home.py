"""Routes for the simple backend home response."""

from fastapi import APIRouter
from fastapi.responses import FileResponse, PlainTextResponse

router = APIRouter()


@router.get("/", include_in_schema=False, response_class=PlainTextResponse)
def root_path() -> str:
    """Return a simple text response for the backend home."""
    return "Welcome to the SettleGuide.app backend service."


@router.get("/favicon.ico", include_in_schema=False)
async def favicon() -> FileResponse:
    """Serve the favicon for the API."""
    return FileResponse(
        "static/favicon.ico", media_type="image/vnd.microsoft.icon"
    )

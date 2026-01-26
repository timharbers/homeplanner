"""Include all the other routes into one router."""

from fastapi import APIRouter

from app.config.settings import get_settings
from app.resources import (
    api_key,
    auth,
    floor,
    heartbeat,
    home,
    household,
    invitation,
    room,
    task,
    user,
)

api_router = APIRouter(prefix=get_settings().api_root)

api_router.include_router(user.router)
api_router.include_router(auth.router)
api_router.include_router(api_key.router)
api_router.include_router(floor.router)
api_router.include_router(household.router)
api_router.include_router(invitation.router)
api_router.include_router(room.router)
api_router.include_router(task.router)
api_router.include_router(heartbeat.router)

if not get_settings().no_root_route:
    api_router.include_router(home.router)

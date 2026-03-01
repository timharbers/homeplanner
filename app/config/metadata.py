"""This file contains Custom Metadata for your API Project.

Be aware, this will be re-generated any time you run the
'api-admin custom metadata' command!
"""

from app.config.helpers import MetadataBase

custom_metadata = MetadataBase(
    title="SettleGuide.app",
    name="settle-guide",
    description="SettleGuide is a smart post-move task planner that organizes your new home setup by room, priority, and dependencies — so you always know what to tackle next.",
    repository="https://github.com/timharbers/homeplanner",
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    contact={
        "name": "Tim Harbers",
        "url": "https://www.settleguide.app",
    },
    email="twhf.harbers@gmail.com",
    year="2026",
)

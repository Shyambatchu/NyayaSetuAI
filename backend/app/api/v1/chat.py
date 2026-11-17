import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_session
from app.schemas.chat import CreateSessionResponse, MessageResponse, SendMessageRequest

router = APIRouter()


def _iso(moment: datetime) -> str:
    return moment.strftime("%Y-%m-%dT%H:%M:%S.") + f"{moment.microsecond // 1000:03d}Z"


def _now_iso() -> str:
    return _iso(datetime.now(timezone.utc))


def _now_iso_offset(days: int) -> str:
    return _iso(datetime.now(timezone.utc) + timedelta(days=days))


@router.post("/sessions", response_model=CreateSessionResponse)
async def create_session(session: AsyncSession = Depends(get_session)) -> CreateSessionResponse:
    user_id = str(uuid.uuid4())
    chat_session_id = str(uuid.uuid4())
    guest_expires_at = _now_iso_offset(days=settings.GUEST_EXPIRY_DAYS)

    await session.execute(
        text(
            "INSERT INTO users (id, role, is_guest, guest_expires_at) "
            "VALUES (:id, 'user', 1, :guest_expires_at)"
        ),
        {"id": user_id, "guest_expires_at": guest_expires_at},
    )
    await session.execute(
        text("INSERT INTO chat_sessions (id, user_id, language) VALUES (:id, :user_id, 'en')"),
        {"id": chat_session_id, "user_id": user_id},
    )
    await session.commit()
    return CreateSessionResponse(session_id=chat_session_id, user_id=user_id)


@router.post("/sessions/{session_id}/messages", response_model=MessageResponse)
async def send_message(
    session_id: str,
    body: SendMessageRequest,
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    row = (
        await session.execute(
            text("SELECT user_id FROM chat_sessions WHERE id = :id AND deleted_at IS NULL"),
            {"id": session_id},
        )
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="session_not_found")
    user_id = row[0]

    user_message_id = str(uuid.uuid4())
    await session.execute(
        text(
            "INSERT INTO chat_messages (id, session_id, user_id, role, language, content) "
            "VALUES (:id, :session_id, :user_id, 'user', 'en', :content)"
        ),
        {"id": user_message_id, "session_id": session_id, "user_id": user_id, "content": body.content},
    )

    # Phase 1 stub: the real RAG pipeline (retrieval, generation, citation
    # validation) lands in Phase 3. Until then every answer is honestly
    # insufficient_sources, not a guess.
    assistant_message_id = str(uuid.uuid4())
    created_at = _now_iso()
    stub_content = (
        "The retrieval and answer pipeline isn't built yet (Phase 3 of the roadmap) — "
        "this reply only proves the chat wiring and deployment work end to end."
    )
    await session.execute(
        text(
            "INSERT INTO chat_messages "
            "(id, session_id, user_id, role, language, content, answer_status, created_at) "
            "VALUES (:id, :session_id, :user_id, 'assistant', 'en', :content, 'insufficient_sources', :created_at)"
        ),
        {
            "id": assistant_message_id,
            "session_id": session_id,
            "user_id": user_id,
            "content": stub_content,
            "created_at": created_at,
        },
    )
    await session.execute(
        text("UPDATE chat_sessions SET last_message_at = :now WHERE id = :id"),
        {"now": created_at, "id": session_id},
    )
    await session.commit()

    return MessageResponse(
        id=assistant_message_id,
        role="assistant",
        content=stub_content,
        answer_status="insufficient_sources",
        created_at=created_at,
    )

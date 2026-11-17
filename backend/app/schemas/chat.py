from pydantic import BaseModel


class CreateSessionResponse(BaseModel):
    session_id: str
    user_id: str


class SendMessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    answer_status: str | None
    created_at: str

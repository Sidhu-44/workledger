from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    history: Optional[List[ChatHistoryItem]] = None


class ChatResponse(BaseModel):
    reply: str
"""
AI-Ready endpoints.

These are intentionally NOT implemented yet -- they exist so the frontend and
API contract are already in place, and each one can be wired up to a real
provider later (OpenAI, Gemini, an OCR service, WhatsApp/SMS gateways, etc.)
without changing the routes the frontend calls.

To implement one: replace the `raise HTTPException(501, ...)` body with a
call into services/ai_service.py (create it) that talks to the provider,
using the *_API_KEY settings already wired up in config.py.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database.database import get_db
from models.user import User
from schemas.ai_chat import ChatRequest, ChatResponse
from schemas.ai_insights import DashboardInsights
from services.ai_chat_service import AiChatService
from services.insights_service import InsightsService

router = APIRouter(prefix="/api/ai", tags=["AI Ready (Future)"])

NOT_IMPLEMENTED = "This feature is planned but not yet implemented."


@router.post("/voice-input")
async def voice_input(audio: UploadFile, current_user: User = Depends(get_current_user)):
    """Future: transcribe a voice note into a work-entry draft (customer, amount, description)."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.post("/ocr")
async def ocr_extract(image: UploadFile, current_user: User = Depends(get_current_user)):
    """Future: OCR a handwritten note or receipt photo into structured work-entry fields."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.post("/natural-language-search")
async def nl_search(query: str, current_user: User = Depends(get_current_user)):
    """Future: e.g. 'how much did Ramesh pay me last month' -> structured query + answer."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.get("/predict-monthly-earnings")
async def predict_earnings(current_user: User = Depends(get_current_user)):
    """Future: forecast next month's earnings from historical work-entry trends."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.get("/expense-analysis")
async def expense_analysis(current_user: User = Depends(get_current_user)):
    """Future: analyze spending/earning patterns and flag anomalies."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.get("/auto-summary")
async def auto_summary(current_user: User = Depends(get_current_user)):
    """Future: LLM-generated plain-language summary of this month's activity."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.post("/reminders/whatsapp")
async def whatsapp_reminder(work_entry_id: str, current_user: User = Depends(get_current_user)):
    """Future: send a WhatsApp payment-due reminder to the customer for a work entry."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.post("/reminders/sms")
async def sms_reminder(work_entry_id: str, current_user: User = Depends(get_current_user)):
    """Future: send an SMS payment-due reminder to the customer for a work entry."""
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=NOT_IMPLEMENTED)


@router.get("/dashboard-insights", response_model=DashboardInsights)
def dashboard_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Computes AI Business Insights for the logged-in user's data.

    Fully implemented today using plain SQL aggregation + Python (see
    services/insights_service.py) -- no external AI provider is called.
    The response shape is designed so a future version can hand this same
    computed data to Gemini/OpenAI and swap in LLM-generated `recommendations`
    without changing this route or the frontend that consumes it.
    """
    return InsightsService(db).get_dashboard_insights(current_user.id)


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Gemini 2.5 Flash-powered chat, grounded in the logged-in user's real data
    (see services/ai_chat_service.py). Falls back to the rule-based reply on
    any Gemini error, timeout, or missing API key.
    """
    reply = await AiChatService(db, current_user).generate_reply(payload.message, payload.history)
    return ChatResponse(reply=reply)
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chatbot_service import chatbot_service

router = APIRouter(prefix="/chat", tags=["AI Security Assistant"])

class ChatQuery(BaseModel):
    message: str

@router.post("/ask")
def ask_chatbot(req: ChatQuery):
    if not req.message.strip():
        return {
            "query": "",
            "response": "Please enter a security question or threat query.",
            "suggested_actions": []
        }
    return chatbot_service.process_query(req.message.strip())

from fastapi import APIRouter
from app.services.awareness_service import awareness_service

router = APIRouter(prefix="/awareness", tags=["Security Awareness & Intel"])

@router.get("/quizzes")
def get_quizzes():
    return awareness_service.get_quizzes()

@router.get("/news")
def get_news():
    return awareness_service.get_news()

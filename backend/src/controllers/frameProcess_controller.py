from fastapi import APIRouter
import base64
from ..services.ai_recognition import AiRecognition
from ..schemas import ImageRequest
from typing import Dict

router = APIRouter()

service = AiRecognition()

# @router.post("/imagebase64")
# async def process_image(request:ImageRequest) -> Dict[str,str]:
#     try:
        


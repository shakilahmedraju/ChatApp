import json
from fastapi import WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database, auth
from typing import Dict, List
from fastapi.encoders import jsonable_encoder


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
        self.user_conversations: Dict[int, List[int]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast_to_conversation(self, message: str, conversation_id: int, db: Session):
        # Get all users in the conversation
        conversation = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
        if conversation:
            for user in conversation.users:
                if user.id in self.active_connections:
                    await self.active_connections[user.id].send_text(message)

manager = ConnectionManager()

async def handle_websocket(websocket: WebSocket, token: str, db: Session = Depends(database.get_db)):
    try:
        print("🟡 Received token:", token)
        # user = await auth.get_current_user(token, db)
        user = await auth.get_current_user_ws(token, db)
        print("🟢 Authenticated user:", user.username)
        await manager.connect(websocket, user.id)
        print("🟢 WebSocket connected successfully")
        
        try:
            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                print("📩 Received data:", message_data)
                
                # Handle different message types
                if message_data["type"] == "chat_message":
                    # Save message to database
                    db_message = models.Message(
                        content=message_data["content"],
                        conversation_id=message_data["conversation_id"],
                        sender_id=user.id
                    )
                    db.add(db_message)
                    db.commit()
                    db.refresh(db_message)
                    
                    # Get the message with sender info
                    message_with_sender = db.query(models.Message).filter(models.Message.id == db_message.id).first()
                    
                    # Broadcast to all users in the conversation
                    response_data = {
                        "type": "chat_message",
                        "message": schemas.Message.from_orm(message_with_sender).dict()
                    }
                    # await manager.broadcast_to_conversation(json.dumps(response_data), message_data["conversation_id"], db)
                    await manager.broadcast_to_conversation(
                        json.dumps(jsonable_encoder(response_data)),
                        message_data["conversation_id"],
                        db
                    )
        except WebSocketDisconnect:
            print("🔴 WebSocket disconnected:", user.username)
            manager.disconnect(user.id)

    except Exception as e:
        print("❌ WebSocket error:", e)
        await websocket.close(code=1008, reason=str(e))
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
                
                # # Handle different message types
                # if message_data["type"] == "chat_message":
                #     # Save message to database
                #     db_message = models.Message(
                #         content=message_data["content"],
                #         conversation_id=message_data["conversation_id"],
                #         sender_id=user.id
                #     )
                #     db.add(db_message)
                #     db.commit()
                #     db.refresh(db_message)
                    
                #     # Get the message with sender info
                #     message_with_sender = db.query(models.Message).filter(models.Message.id == db_message.id).first()
                    
                #     # Broadcast to all users in the conversation
                #     response_data = {
                #         "type": "chat_message",
                #         "message": schemas.Message.from_orm(message_with_sender).dict()
                #     }
                #     # await manager.broadcast_to_conversation(json.dumps(response_data), message_data["conversation_id"], db)
                #     await manager.broadcast_to_conversation(
                #         json.dumps(jsonable_encoder(response_data)),
                #         message_data["conversation_id"],
                #         db
                #     )


                if message_data["type"] == "chat_message":
                    # Save message
                    db_message = models.Message(
                        content=message_data.get("content"),
                        conversation_id=message_data["conversation_id"],
                        sender_id=user.id
                    )
                    db.add(db_message)
                    db.commit()
                    db.refresh(db_message)

                    # Save attachments if exist
                    attachments = message_data.get("attachments", [])
                    for att in attachments:
                        db_att = models.MessageAttachment(
                            message_id=db_message.id,
                            file_url=att["file_url"],
                            file_name=att["file_name"],
                            file_type=att.get("file_type")
                        )
                        db.add(db_att)
                    db.commit()

                    db.refresh(db_message)

                    response_data = {
                        "type": "chat_message",
                        "message": schemas.Message.from_orm(db_message).dict()
                    }
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






# import json
# from fastapi import WebSocket, WebSocketDisconnect, Depends
# from sqlalchemy.orm import Session
# from typing import Dict, List
# from fastapi.encoders import jsonable_encoder
# from . import models, schemas, database, auth


# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: Dict[int, WebSocket] = {}         # user_id -> websocket
#         self.user_conversations: Dict[int, List[int]] = {}         # user_id -> list of conversation_ids

#     async def connect(self, websocket: WebSocket, user_id: int, conversations: List[int]):
#         """Accept websocket and store user subscriptions."""
#         await websocket.accept()
#         self.active_connections[user_id] = websocket
#         self.user_conversations[user_id] = conversations
#         print(f"🟢 User {user_id} connected, conversations: {conversations}")

#     def disconnect(self, user_id: int):
#         """Remove user connection and conversation subscriptions."""
#         self.active_connections.pop(user_id, None)
#         self.user_conversations.pop(user_id, None)
#         print(f"🔴 User {user_id} disconnected")

#     async def send_personal_message(self, message: dict, user_id: int):
#         """Send a message to a single user."""
#         if user_id in self.active_connections:
#             await self.active_connections[user_id].send_text(json.dumps(message))

#     async def broadcast_to_conversation(self, message: dict, conversation_id: int):
#         """Send message to all connected users in a conversation."""
#         for user_id, conv_ids in self.user_conversations.items():
#             if conversation_id in conv_ids and user_id in self.active_connections:
#                 await self.active_connections[user_id].send_text(json.dumps(message))


# manager = ConnectionManager()


# async def handle_websocket(websocket: WebSocket, token: str, db: Session = Depends(database.get_db)):
#     try:
#         # Authenticate user from token
#         user = await auth.get_current_user_ws(token, db)
#         print(f"🟡 Authenticated user: {user.username}")

#         # Fetch conversations for this user
#         user_conversations = [c.id for c in db.query(models.Conversation)
#                               .filter(models.Conversation.users.any(id=user.id)).all()]

#         # Connect and store subscriptions
#         await manager.connect(websocket, user.id, user_conversations)

#         try:
#             while True:
#                 data = await websocket.receive_text()
#                 message_data = json.loads(data)
#                 print(f"📩 Received data from {user.username}: {message_data}")

#                 msg_type = message_data.get("type")

#                 if msg_type == "chat_message":
#                     # Save message
#                     db_message = models.Message(
#                         content=message_data.get("content"),
#                         conversation_id=message_data["conversation_id"],
#                         sender_id=user.id
#                     )
#                     db.add(db_message)
#                     db.commit()
#                     db.refresh(db_message)

#                     # Save attachments
#                     for att in message_data.get("attachments", []):
#                         db_att = models.MessageAttachment(
#                             message_id=db_message.id,
#                             file_url=att["file_url"],
#                             file_name=att["file_name"],
#                             file_type=att.get("file_type")
#                         )
#                         db.add(db_att)
#                     db.commit()
#                     db.refresh(db_message)

#                     # Broadcast message to all connected participants
#                     response_data = {
#                         "type": "chat_message",
#                         "message": schemas.Message.from_orm(db_message).dict()
#                     }
#                     await manager.broadcast_to_conversation(response_data, message_data["conversation_id"])

#                 elif msg_type == "typing":
#                     # Optional: notify others that this user is typing
#                     response_data = {
#                         "type": "typing",
#                         "conversation_id": message_data["conversation_id"],
#                         "user_id": user.id
#                     }
#                     await manager.broadcast_to_conversation(response_data, message_data["conversation_id"])

#         except WebSocketDisconnect:
#             print(f"🔴 WebSocket disconnected: {user.username}")
#             manager.disconnect(user.id)

#     except Exception as e:
#         print(f"❌ WebSocket error: {e}")
#         await websocket.close(code=1008, reason=str(e))

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    # email: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

# Add this new schema for login
class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    conversation_id: int

class Message(MessageBase):
    id: int
    sender_id: int
    conversation_id: int
    created_at: datetime
    sender: User

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    name: Optional[str] = None
    is_group: bool = False

class ConversationCreate(ConversationBase):
    user_ids: List[int]

class Conversation(ConversationBase):
    id: int
    created_at: datetime
    users: List[User]
    messages: List[Message]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
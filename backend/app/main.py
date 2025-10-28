from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocket
from sqlalchemy.orm import Session
from datetime import timedelta
import json
from . import websocket as ws_manager

from . import models, schemas, database, auth, websocket
from .database import get_db, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chat API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://chat-app-six-lilac.vercel.app"],  #  React app URL
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# @app.post("/login", response_model=schemas.Token)
# def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     authenticated_user = auth.authenticate_user(db, user.username, user.password)
#     if not authenticated_user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#         )
#     access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = auth.create_access_token(
#         data={"sub": authenticated_user.username}, expires_delta=access_token_expires
#     )
#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": authenticated_user
#     }

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Check if login is with username or email
    if user.username:
        authenticated_user = auth.authenticate_user(db, user.username, user.password)
    elif user.email:
        # Find user by email and then authenticate
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            authenticated_user = auth.authenticate_user(db, db_user.username, user.password)
        else:
            authenticated_user = None
    else:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Either username or email must be provided"
        )

    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": authenticated_user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": authenticated_user
    }

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/users", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.post("/conversations", response_model=schemas.Conversation)
def create_conversation(
    conversation: schemas.ConversationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # For one-to-one chat, check if conversation already exists
    if not conversation.is_group and len(conversation.user_ids) == 1:
        existing_conv = db.query(models.Conversation).filter(
            models.Conversation.is_group == 0,
            models.Conversation.users.any(models.User.id == current_user.id),
            models.Conversation.users.any(models.User.id == conversation.user_ids[0])
        ).first()
        
        if existing_conv:
            print("existing")
            return existing_conv

    # Create new conversation
    db_conversation = models.Conversation(
        name=conversation.name,
        is_group=1 if conversation.is_group else 0
    )
    
    # Add current user to conversation
    db_conversation.users.append(current_user)
    
    # Add other users
    for user_id in conversation.user_ids:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            db_conversation.users.append(user)
    
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@app.get("/conversations", response_model=list[schemas.Conversation])
def get_conversations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    conversations = db.query(models.Conversation).filter(
        models.Conversation.users.any(id=current_user.id)
    ).all()
    return conversations

@app.get("/conversations/{conversation_id}", response_model=schemas.Conversation)
def get_conversation(
    conversation_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.users.any(id=current_user.id)
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

# @app.get("/conversations/{conversation_id}/messages", response_model=list[schemas.Message])
# def get_messages(
#     conversation_id: int,
#     skip: int = 0,
#     limit: int = 100,
#     current_user: models.User = Depends(auth.get_current_user),
#     db: Session = Depends(get_db)
# ):
#     # Verify user is in conversation
#     conversation = db.query(models.Conversation).filter(
#         models.Conversation.id == conversation_id,
#         models.Conversation.users.any(id=current_user.id)
#     ).first()
    
#     if not conversation:
#         raise HTTPException(status_code=404, detail="Conversation not found")
    
#     messages = db.query(models.Message).filter(
#         models.Message.conversation_id == conversation_id
#     ).order_by(models.Message.created_at).offset(skip).limit(limit).all()
    
#     return messages

@app.get("/conversations/{conversation_id}/messages", response_model=list[schemas.Message])
def get_messages(
    conversation_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, gt=0, le=200),  # Limit max 200 to avoid huge payload
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get paginated messages for a conversation.
    - Latest messages come last (so they appear at bottom in frontend).
    - Use `skip` and `limit` for infinite scroll / pagination.
    """

    # Verify user is in conversation
    conversation = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.users.any(id=current_user.id)
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Fetch messages descending by created_at (latest first)
    query = (
        db.query(models.Message)
        .filter(models.Message.conversation_id == conversation_id)
        .order_by(models.Message.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    messages = query.all()

    # Return messages reversed (oldest first) so frontend can append at bottom
    return list(reversed(messages))

# @app.websocket("/ws")
# async def websocket_endpoint(
#     websocket: WebSocket,
#     token: str,
#     db: Session = Depends(get_db)
# ):
#     await websocket.handle_websocket(websocket, token, db)

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db)
):
    print("token:", token)
    await ws_manager.handle_websocket(websocket, token, db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
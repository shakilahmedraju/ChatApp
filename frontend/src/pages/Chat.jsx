
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { conversationsAPI, usersAPI } from '../services/api';
// import { webSocketService } from '../utils/websocket';
// import ConversationList from './ConversationList';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';
// import NewChatModal from './NewChatModal';


// function Chat() {
//   const { user, logout } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Ref to ensure we add WebSocket handler only once
//   const handlerRegistered = useRef(false);

//   useEffect(() => {
//     if (user) {
//       initializeChat();
//     }

//     return () => {
//       webSocketService.disconnect();
//       handlerRegistered.current = false; // Reset for future reconnects
//     };
//   }, [user]);

//   const initializeChat = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchConversations(), fetchUsers()]);

//       const token = localStorage.getItem('token');
//       if (token) {
//         webSocketService.connect(token);

//         // Add message handler only once
//         if (!handlerRegistered.current) {
//           webSocketService.addMessageHandler((data) => {
//             if (data.type === 'chat_message') {
//               setMessages(prev => [...prev, data.message]);

//               setConversations(prev => 
//                 prev.map(conv => 
//                   conv.id === data.message.conversation_id 
//                     ? { ...conv, last_message: data.message }
//                     : conv
//                 )
//               );
//             }
//           });
//           handlerRegistered.current = true;
//         }
//       }
//     } catch (error) {
//       console.error('Failed to initialize chat:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchConversations = async () => {
//     try {
//       const response = await conversationsAPI.getConversations();
//       setConversations(response.data);
//     } catch (error) {
//       console.error('Failed to fetch conversations:', error);
//     }
//   };

//   const fetchMessages = async (conversationId) => {
//     try {
//       const response = await conversationsAPI.getMessages(conversationId);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Failed to fetch messages:', error);
//     }
//   };



//   const fetchUsers = async () => {
//     try {
//       const response = await usersAPI.getUsers();
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//     }
//   };

//   const handleSelectConversation = (conversation) => {
//     setActiveConversation(conversation);
//     fetchMessages(conversation.id);
//   };

//   const handleSendMessage = async (messageContent) => {
//     if (!activeConversation || !webSocketService.isConnected()) return;

//     const messageData = {
//       type: 'chat_message',
//       content: messageContent,
//       conversation_id: activeConversation.id
//     };

//     webSocketService.sendMessage(messageData);
//   };

//   const handleCreateConversation = async (conversationData) => {
//     try {
//       const response = await conversationsAPI.createConversation(conversationData);
//       const newConversation = response.data;

//       setConversations(prev => [...prev, newConversation]);
//       setActiveConversation(newConversation);
//       setMessages([]);
//       setShowNewChatModal(false);
//     } catch (error) {
//       console.error('Failed to create conversation:', error);
//     }
//   };

//   const getConversationDisplayName = (conversation) => {
//     if (!conversation) return '';

//     if (conversation.is_group) {
//       return conversation.name || 'Group Chat';
//     }

//     const otherUser = conversation.users.find(u => u.id !== user.id);
//     return otherUser ? otherUser.username : 'Unknown User';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
//             <button
//               onClick={logout}
//               className="cursor-pointer px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//             >
//               Logout
//             </button>
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span>Welcome,</span>
//             <span className="font-semibold">{user?.username}</span>
//           </div>
//           <button
//             onClick={() => setShowNewChatModal(true)}
//             className="cursor-pointer w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             New Chat
//           </button>
//         </div>

//         <ConversationList
//           conversations={conversations}
//           activeConversation={activeConversation}
//           onSelectConversation={handleSelectConversation}
//           currentUser={user}
//         />
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {activeConversation ? (
//           <>
//             <div className="p-4 border-b border-gray-200 bg-white">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {getConversationDisplayName(activeConversation)}
//               </h2>
//               {activeConversation.is_group && (
//                 <div className="text-sm text-gray-500">
//                   {activeConversation.users.length} members
//                 </div>
//               )}
//             </div>

//             <MessageList messages={messages} currentUser={user} />         



//             <MessageInput
//               onSendMessage={handleSendMessage}
//               disabled={!webSocketService.isConnected()}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
//               <p>Select a conversation from the sidebar or start a new chat</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* New Chat Modal */}
//       <NewChatModal
//         isOpen={showNewChatModal}
//         onClose={() => setShowNewChatModal(false)}
//         onCreateConversation={handleCreateConversation}
//         users={users}
//         currentUser={user}
//       />
//     </div>
//   );
// }

// export default Chat;





// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { conversationsAPI, usersAPI } from '../services/api';
// import { webSocketService } from '../utils/websocket';
// import ConversationList from '../components/ConversationList';
// import MessageList from '../components/MessageList';
// import MessageInput from '../components/MessageInput';
// import NewChatModal from '../components/NewChatModal';

// function Chat() {
//   const { user, logout } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Pagination state for lazy loading
//   const [messagesSkip, setMessagesSkip] = useState(0);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);

//   // Refs
//   const handlerRegistered = useRef(false);
//   const messagesContainerRef = useRef(null);

//   useEffect(() => {
//     if (user) initializeChat();

//     return () => {
//       webSocketService.disconnect();
//       handlerRegistered.current = false;
//     };
//   }, [user]);

//   // Initialize chat: fetch conversations, users, connect WS
//   const initializeChat = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([fetchConversations(), fetchUsers()]);

//       const token = localStorage.getItem('token');
//       if (token) {
//         webSocketService.connect(token);

//         if (!handlerRegistered.current) {
//           webSocketService.addMessageHandler((data) => {
//             if (data.type === 'chat_message') {
//               setMessages(prev => [...prev, data.message]);

//               setConversations(prev =>
//                 prev.map(conv =>
//                   conv.id === data.message.conversation_id
//                     ? { ...conv, last_message: data.message }
//                     : conv
//                 )
//               );
//             }
//           });
//           handlerRegistered.current = true;
//         }
//       }
//     } catch (error) {
//       console.error('Failed to initialize chat:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch conversations
//   const fetchConversations = async () => {
//     try {
//       const response = await conversationsAPI.getConversations();
//       setConversations(response.data);
//     } catch (error) {
//       console.error('Failed to fetch conversations:', error);
//     }
//   };

//   // Fetch messages with pagination
//   const fetchMessages = async (conversationId, loadOlder = false) => {
//     try {
//       const limit = 10;
//       const skip = loadOlder ? messagesSkip : 0;

//       const response = await conversationsAPI.getMessages(conversationId, limit, skip);
//       const fetchedMessages = response.data;

//       if (loadOlder) {
//         // Prepend older messages
//         setMessages(prev => [...fetchedMessages, ...prev]);
//       } else {
//         // Initial load
//         setMessages(fetchedMessages);
//       }

//       // Update pagination state
//       setMessagesSkip(skip + fetchedMessages.length);
//       setHasMoreMessages(fetchedMessages.length === limit);

//       // Scroll to bottom on initial load
//       if (!loadOlder && messagesContainerRef.current) {
//         messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//       }
//     } catch (error) {
//       console.error('Failed to fetch messages:', error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await usersAPI.getUsers();
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//     }
//   };

//   // When selecting a conversation
//   const handleSelectConversation = (conversation) => {
//     setActiveConversation(conversation);
//     setMessagesSkip(0);
//     setHasMoreMessages(true);
//     fetchMessages(conversation.id);
//   };

//   // Lazy load older messages
//   const loadOlderMessages = () => {
//     if (!activeConversation || !hasMoreMessages) return;
//     fetchMessages(activeConversation.id, true);
//   };

//   // Send a message
//   const handleSendMessage = async (messageContent) => {
//     if (!activeConversation || !webSocketService.isConnected()) return;

//     const messageData = {
//       type: 'chat_message',
//       content: messageContent,
//       conversation_id: activeConversation.id
//     };

//     webSocketService.sendMessage(messageData);
//   };

//   // Create a new conversation
//   // const handleCreateConversation = async (conversationData) => {
//   //   try {
//   //     const response = await conversationsAPI.createConversation(conversationData);
//   //     const newConversation = response.data;

//   //     setConversations(prev => [...prev, newConversation]);
//   //     setActiveConversation(newConversation);
//   //     setMessages([]);
//   //     setMessagesSkip(0);
//   //     setHasMoreMessages(true);
//   //     setShowNewChatModal(false);
//   //   } catch (error) {
//   //     console.error('Failed to create conversation:', error);
//   //   }
//   // };

//   const handleCreateConversation = async (conversationData) => {
//   try {
//     const response = await conversationsAPI.createConversation(conversationData);
//     const returnedConversation = response.data;

//     // Check if this conversation already exists in the sidebar
//     const exists = conversations.find(conv => conv.id === returnedConversation.id);

//     if (exists) {
//       // Open the existing conversation and fetch its messages
//       setActiveConversation(exists);
//       setMessages([]);        // clear previous messages before loading
//       setMessagesSkip(0);     // reset pagination
//       setHasMoreMessages(true);

//       // Fetch messages for the existing conversation
//       await fetchMessages(exists.id);
//     } else {
//       // Add new conversation to sidebar
//       setConversations(prev => [...prev, returnedConversation]);
//       setActiveConversation(returnedConversation);
//       setMessages([]);        // reset messages
//       setMessagesSkip(0);     // reset pagination
//       setHasMoreMessages(true);

//       // Fetch messages for the new conversation (likely empty)
//       await fetchMessages(returnedConversation.id);
//     }

//     setShowNewChatModal(false);
//   } catch (error) {
//     console.error('Failed to create conversation:', error);
//   }
// };


//   const getConversationDisplayName = (conversation) => {
//     if (!conversation) return '';
//     if (conversation.is_group) return conversation.name || 'Group Chat';
//     const otherUser = conversation.users.find(u => u.id !== user.id);
//     return otherUser ? otherUser.username : 'Unknown User';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
//             <button
//               onClick={logout}
//               className="cursor-pointer px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//             >
//               Logout
//             </button>
//           </div>
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span>Welcome,</span>
//             <span className="font-semibold">{user?.username}</span>
//           </div>
//           <button
//             onClick={() => setShowNewChatModal(true)}
//             className="cursor-pointer w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             New Chat
//           </button>
//         </div>

//         <ConversationList
//           conversations={conversations}
//           activeConversation={activeConversation}
//           onSelectConversation={handleSelectConversation}
//           currentUser={user}
//         />
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {activeConversation ? (
//           <>
//             <div className="p-4 border-b border-gray-200 bg-white">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {getConversationDisplayName(activeConversation)}
//               </h2>
//               {activeConversation.is_group && (
//                 <div className="text-sm text-gray-500">
//                   {activeConversation.users.length} members
//                 </div>
//               )}
//             </div>

//             <MessageList
//               messages={messages}
//               currentUser={user}
//               containerRef={messagesContainerRef}
//               onLoadOlder={loadOlderMessages}
//             />

//             <MessageInput
//               onSendMessage={handleSendMessage}
//               disabled={!webSocketService.isConnected()}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
//               <p>Select a conversation from the sidebar or start a new chat</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* New Chat Modal */}
//       <NewChatModal
//         isOpen={showNewChatModal}
//         onClose={() => setShowNewChatModal(false)}
//         onCreateConversation={handleCreateConversation}
//         users={users}
//         currentUser={user}
//       />
//     </div>
//   );
// }

// export default Chat;







import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { conversationsAPI, usersAPI } from '../services/api';
import { webSocketService } from '../utils/websocket';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import NewChatModal from '../components/NewChatModal';
import SidePanel from '../components/SidePanel';
import { HiDotsVertical, HiPhone, HiVideoCamera } from "react-icons/hi";

function Chat() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state for lazy loading
  const [messagesSkip, setMessagesSkip] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);


  const [sidePanel, setSidePanel] = useState(null); // "profile" | "media" | null
  const [showMenu, setShowMenu] = useState(false);


  // Refs
  const handlerRegistered = useRef(false);
  const messagesContainerRef = useRef(null);
  const menuRef = useRef();

  useEffect(() => {
    if (user) initializeChat();

    return () => {
      webSocketService.disconnect();
      handlerRegistered.current = false;
    };
  }, [user]);

  


  // Close side panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize chat: fetch conversations, users, connect WS
  const initializeChat = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchConversations(), fetchUsers()]);

      const token = localStorage.getItem('token');
      if (token) {
        // webSocketService.connect(token);

        // 👇 ensure WebSocket is fully ready before continuing
        await webSocketService.connect(token);
        await webSocketService.waitUntilConnected();

        if (!handlerRegistered.current) {
          webSocketService.addMessageHandler((data) => {
            if (data.type === 'chat_message') {
              // setMessages(prev => [...prev, data.message]);

              setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const messageExists = prev.some(msg => msg.id === data.message.id);
                if (messageExists) return prev;
                return [...prev, data.message];
              });


              setConversations(prev =>
                prev.map(conv =>
                  conv.id === data.message.conversation_id
                    ? { ...conv, last_message: data.message }
                    : conv
                )
              );
            }
          });
          handlerRegistered.current = true;
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await conversationsAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  // Fetch messages with pagination
  const fetchMessages = async (conversationId, loadOlder = false) => {
    try {
      const limit = 10;
      const skip = loadOlder ? messagesSkip : 0;

      const response = await conversationsAPI.getMessages(conversationId, limit, skip);
      const fetchedMessages = response.data;
      console.log("fetchedMessages", fetchedMessages)

      if (loadOlder) {
        // Prepend older messages
        setMessages(prev => [...fetchedMessages, ...prev]);
      } else {
        // Initial load
        setMessages(fetchedMessages);
      }

      // Update pagination state
      setMessagesSkip(skip + fetchedMessages.length);
      setHasMoreMessages(fetchedMessages.length === limit);

      // Scroll to bottom on initial load
      if (!loadOlder && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // When selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessagesSkip(0);
    setHasMoreMessages(true);
    fetchMessages(conversation.id);
  };

  // Lazy load older messages
  const loadOlderMessages = () => {
    if (!activeConversation || !hasMoreMessages) return;
    fetchMessages(activeConversation.id, true);
  };

  // Send a message
  // const handleSendMessage = async (messageContent) => {
  //   if (!activeConversation || !webSocketService.isConnected()) return;

  //   const messageData = {
  //     type: 'chat_message',
  //     content: messageContent,
  //     conversation_id: activeConversation.id
  //   };

  //   webSocketService.sendMessage(messageData);
  // };

  const handleSendMessage = async ({ content, attachments }) => {
    if (!activeConversation || !webSocketService.isConnected()) return;

    const messageData = {
      type: "chat_message",
      content,
      attachments, // array from MessageInput
      conversation_id: activeConversation.id,
    };

    webSocketService.sendMessage(messageData);
  };

  // Create a new conversation
  // const handleCreateConversation = async (conversationData) => {
  //   try {
  //     const response = await conversationsAPI.createConversation(conversationData);
  //     const newConversation = response.data;

  //     setConversations(prev => [...prev, newConversation]);
  //     setActiveConversation(newConversation);
  //     setMessages([]);
  //     setMessagesSkip(0);
  //     setHasMoreMessages(true);
  //     setShowNewChatModal(false);
  //   } catch (error) {
  //     console.error('Failed to create conversation:', error);
  //   }
  // };

  const handleCreateConversation = async (conversationData) => {
    try {
      const response = await conversationsAPI.createConversation(conversationData);
      const returnedConversation = response.data;

      // Check if this conversation already exists in the sidebar
      const exists = conversations.find(conv => conv.id === returnedConversation.id);

      if (exists) {
        // Open the existing conversation and fetch its messages
        setActiveConversation(exists);
        setMessages([]);        // clear previous messages before loading
        setMessagesSkip(0);     // reset pagination
        setHasMoreMessages(true);

        // Fetch messages for the existing conversation
        await fetchMessages(exists.id);
      } else {
        // Add new conversation to sidebar
        setConversations(prev => [...prev, returnedConversation]);
        setActiveConversation(returnedConversation);
        setMessages([]);        // reset messages
        setMessagesSkip(0);     // reset pagination
        setHasMoreMessages(true);

        // Fetch messages for the new conversation (likely empty)
        await fetchMessages(returnedConversation.id);
      }

      setShowNewChatModal(false);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };


  const getConversationDisplayName = (conversation) => {
    if (!conversation) return '';
    if (conversation.is_group) return conversation.name || 'Group Chat';
    const otherUser = conversation.users.find(u => u.id !== user.id);
    return otherUser ? otherUser.username : 'Unknown User';
  };


  //delete conversation
  const handleDeleteConversation = async () => {
    if (!activeConversation?.id) return;
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await conversationsAPI.deleteConversation(activeConversation.id);
      setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id));
      setActiveConversation(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete conversation");
    } finally {
      setShowMenu(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  console.log("activeconversation", activeConversation)
  console.log("conversations", conversations)
  console.log("messages", messages)
  console.log("users", users)
  console.log("user", user)
  console.log("webSocketService.isConnected()", webSocketService.isConnected())

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
            <button
              onClick={logout}
              className="cursor-pointer px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Welcome,</span>
            <span className="font-semibold">{user?.username}</span>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="cursor-pointer w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            New Chat
          </button>
        </div>

        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          currentUser={user}
        />
      </div>

      {/* Chat Area */}
      {/* <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                {getConversationDisplayName(activeConversation)}
              </h2>
              {activeConversation.is_group && (
                <div className="text-sm text-gray-500">
                  {activeConversation.users.length} members
                </div>
              )}
            </div>

            <MessageList
              messages={messages}
              currentUser={user}
              containerRef={messagesContainerRef}
              onLoadOlder={loadOlderMessages}
            />

            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!webSocketService.isConnected()}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p>Select a conversation from the sidebar or start a new chat</p>
            </div>
          </div>
        )}
      </div> */}



      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {activeConversation ? (
          <div className="flex h-full">
            <div className={`flex-1 flex flex-col ${sidePanel ? "border-r" : ""}`}>
              {/* Header */}
              <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4 relative">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {getConversationDisplayName(activeConversation)}
                  </h2>
                  {activeConversation.is_group && (
                    <div className="text-sm text-gray-500">
                      {activeConversation.users.length} members
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {/* Video Button */}
                  <button
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition"
                    title="Start Video Call"
                  >
                    <HiVideoCamera size={22} />
                  </button>

                  {/* Audio Call Button */}
                  <button
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition"
                    title="Start Voice Call"
                  >
                    <HiPhone size={22} />
                  </button>

                  {/* More Options Dropdown */}
                  <div ref={menuRef} className="relative">
                    <button
                      onClick={() => setShowMenu(prev => !prev)}
                      className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition"
                      title="More Options"
                    >
                      <HiDotsVertical size={22} />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => { setSidePanel("profile"); setShowMenu(false); }}
                          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => { setSidePanel("media"); setShowMenu(false); }}
                          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Media & Files
                        </button>
                        <button
                          onClick={handleDeleteConversation}
                          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Delete Conversation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Message List */}
              <MessageList
                messages={messages}
                currentUser={user}
                containerRef={messagesContainerRef}
                onLoadOlder={loadOlderMessages}
              />

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!webSocketService?.isConnected?.()}
              />
            </div>

            {/* Side Panel */}
            <SidePanel
              type={sidePanel}
              conversation={activeConversation}
              currentUser={user}
              onClose={() => setSidePanel(null)} // Close handler
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p>Select a conversation from the sidebar or start a new chat</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateConversation={handleCreateConversation}
        users={users}
        currentUser={user}
      />
    </div>
  );
}

export default Chat;
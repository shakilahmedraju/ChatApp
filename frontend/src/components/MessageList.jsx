// import React, { useEffect, useRef } from 'react';

// function MessageList({ messages, currentUser }) {
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
//       {messages.length === 0 ? (
//         <div className="text-center text-gray-500 mt-8">
//           No messages yet. Start the conversation!
//         </div>
//       ) : (
//         messages.map(message => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.sender_id === currentUser.id
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               {message.sender_id !== currentUser.id && (
//                 <div className="text-xs font-semibold text-gray-600 mb-1">
//                   {message.sender.username}
//                 </div>
//               )}
//               <div className="break-words">{message.content}</div>
//               <div className={`text-xs mt-1 ${
//                 message.sender_id === currentUser.id ? 'text-indigo-200' : 'text-gray-500'
//               }`}>
//                 {formatTime(message.created_at)}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// }

// export default MessageList;






// import React, { useEffect, useRef } from 'react';

// function MessageList({ messages, currentUser, containerRef, onLoadOlder }) {
//   const messagesEndRef = useRef(null);
//   const isInitialLoad = useRef(true);
//   const previousScrollHeight = useRef(0);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Scroll to bottom on initial load or new messages
//   useEffect(() => {
//     if (isInitialLoad.current) {
//       scrollToBottom();
//       isInitialLoad.current = false;
//     } else if (containerRef?.current) {
//       // Keep scroll position stable when prepending older messages
//       containerRef.current.scrollTop =
//         containerRef.current.scrollHeight - previousScrollHeight.current;
//     }
//   }, [messages]);

//   // Detect scroll to top for loading older messages
//   useEffect(() => {
//     const container = containerRef?.current;
//     if (!container || !onLoadOlder) return;

//     const handleScroll = () => {
//       if (container.scrollTop === 0) {
//         previousScrollHeight.current = container.scrollHeight;
//         onLoadOlder();
//       }
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [containerRef, onLoadOlder]);

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
//     >
//       {messages.length === 0 ? (
//         <div className="text-center text-gray-500 mt-8">
//           No messages yet. Start the conversation!
//         </div>
//       ) : (
//         messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.sender_id === currentUser.id
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               {message.sender_id !== currentUser.id && (
//                 <div className="text-xs font-semibold text-gray-600 mb-1">
//                   {message.sender.username}
//                 </div>
//               )}
//               <div className="break-words">{message.content}</div>
//               <div
//                 className={`text-xs mt-1 ${
//                   message.sender_id === currentUser.id ? 'text-indigo-200' : 'text-gray-500'
//                 }`}
//               >
//                 {formatTime(message.created_at)}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// }

// export default MessageList;






// import React, { useEffect, useRef, useState } from 'react';

// function MessageList({ messages, currentUser, containerRef, onLoadOlder }) {
//   const messagesEndRef = useRef(null);
//   const isInitialLoad = useRef(true);
//   const previousScrollHeight = useRef(0);
//   const [showOlderMessageNotice, setShowOlderMessageNotice] = useState(false);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Scroll to bottom on initial load or new messages
//   useEffect(() => {
//     if (isInitialLoad.current) {
//       scrollToBottom();
//       isInitialLoad.current = false;
//     } else if (containerRef?.current) {
//       // Keep scroll position stable when prepending older messages
//       containerRef.current.scrollTop =
//         containerRef.current.scrollHeight - previousScrollHeight.current;
//     }
//   }, [messages]);

//   // Detect scroll to top for loading older messages
//   useEffect(() => {
//     const container = containerRef?.current;
//     if (!container || !onLoadOlder) return;

//     const handleScroll = () => {
//       if (container.scrollTop === 0) {
//         previousScrollHeight.current = container.scrollHeight;
//         onLoadOlder();

//         // Show notice for a few seconds
//         setShowOlderMessageNotice(true);
//         setTimeout(() => setShowOlderMessageNotice(false), 2000);
//       }
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [containerRef, onLoadOlder]);

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative"
//     >
//       {/* Notice for older messages */}
//       {showOlderMessageNotice && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-200 px-3 py-1 rounded text-sm text-gray-700 shadow">
//           You are viewing older messages
//         </div>
//       )}

//       {messages.length === 0 ? (
//         <div className="text-center text-gray-500 mt-8">
//           No messages yet. Start the conversation!
//         </div>
//       ) : (
//         messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.sender_id === currentUser.id
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               {message.sender_id !== currentUser.id && (
//                 <div className="text-xs font-semibold text-gray-600 mb-1">
//                   {message.sender.username}
//                 </div>
//               )}
//               <div className="break-words">{message.content}</div>
//               <div
//                 className={`text-xs mt-1 ${
//                   message.sender_id === currentUser.id ? 'text-indigo-200' : 'text-gray-500'
//                 }`}
//               >
//                 {formatTime(message.created_at)}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// }

// export default MessageList;



// import React, { useEffect, useRef, useState } from 'react';

// function MessageList({ messages, currentUser, containerRef, onLoadOlder }) {
//   const messagesEndRef = useRef(null);
//   const isInitialLoad = useRef(true);
//   const previousScrollHeight = useRef(0);
//   const [showOlderMessageNotice, setShowOlderMessageNotice] = useState(false);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Scroll to bottom on initial load or new messages
//   useEffect(() => {
//     if (isInitialLoad.current) {
//       scrollToBottom();
//       isInitialLoad.current = false;
//     } else if (containerRef?.current) {
//       // Keep scroll position stable when prepending older messages
//       containerRef.current.scrollTop =
//         containerRef.current.scrollHeight - previousScrollHeight.current;
//     }
//   }, [messages]);

//   // Detect scroll to top for loading older messages
//   useEffect(() => {
//     const container = containerRef?.current;
//     if (!container || !onLoadOlder) return;

//     const handleScroll = () => {
//       if (container.scrollTop === 0) {
//         previousScrollHeight.current = container.scrollHeight;
//         onLoadOlder();

//         // Show notice for a few seconds
//         setShowOlderMessageNotice(true);
//         setTimeout(() => setShowOlderMessageNotice(false), 2000);
//       }
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [containerRef, onLoadOlder]);

//   // Convert UTC timestamp to local time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp + 'Z'); // JS automatically interprets ISO string as UTC
//     return date.toLocaleString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative"
//     >
//       {/* Notice for older messages */}
//       {showOlderMessageNotice && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-200 px-3 py-1 rounded text-sm text-gray-700 shadow">
//           You are viewing older messages
//         </div>
//       )}

//       {messages.length === 0 ? (
//         <div className="text-center text-gray-500 mt-8">
//           No messages yet. Start the conversation!
//         </div>
//       ) : (
//         messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.sender_id === currentUser.id
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-white border border-gray-200'
//               }`}
//             >
//               {message.sender_id !== currentUser.id && (
//                 <div className="text-xs font-semibold text-gray-600 mb-1">
//                   {message.sender.username}
//                 </div>
//               )}
//               <div className="break-words">{message.content}</div>
//               <div
//                 className={`text-xs mt-1 ${
//                   message.sender_id === currentUser.id ? 'text-indigo-200' : 'text-gray-500'
//                 }`}
//               >
//                 {formatTime(message.created_at)}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// }

// export default MessageList;


import React, { useEffect, useRef, useState } from "react";

function MessageList({ messages, currentUser, containerRef, onLoadOlder }) {
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);
  const previousScrollHeight = useRef(0);
  const [showOlderMessageNotice, setShowOlderMessageNotice] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom on initial load or new messages
  useEffect(() => {
    if (isInitialLoad.current) {
      scrollToBottom();
      isInitialLoad.current = false;
    } else if (containerRef?.current) {
      // Keep scroll position stable when prepending older messages
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - previousScrollHeight.current;
    }
  }, [messages]);

  // Detect scroll to top for loading older messages
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || !onLoadOlder) return;

    const handleScroll = () => {
      if (container.scrollTop === 0) {
        previousScrollHeight.current = container.scrollHeight;
        onLoadOlder();

        setShowOlderMessageNotice(true);
        setTimeout(() => setShowOlderMessageNotice(false), 2000);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, onLoadOlder]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp + "Z");
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderAttachment = (attachment) => {
    const isImage = attachment.file_type?.startsWith("image/");
    const isPDF = attachment.file_type === "application/pdf";
    const isVideo = attachment.file_type?.startsWith("video/");
    const isAudio = attachment.file_type?.startsWith("audio/");

    if (isImage) {
      return (
        <a
          key={attachment.id || attachment.file_url}
          href={attachment.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={attachment.file_url}
            alt={attachment.file_name}
            className="w-32 h-32 object-cover rounded-md border mt-2"
            onError={(e) => (e.target.style.display = "none")}
          />
        </a>
      );
    }

    if (isVideo) {
      return (
        <video
          key={attachment.id || attachment.file_url}
          src={attachment.file_url}
          controls
          className="w-48 rounded-md border mt-2"
        />
      );
    }

    if (isAudio) {
      return (
        <audio
          key={attachment.id || attachment.file_url}
          src={attachment.file_url}
          controls
          className="w-full mt-2"
        />
      );
    }

    if (isPDF) {
      return (
        <a
          key={attachment.id || attachment.file_url}
          href={attachment.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-100 border mt-2 p-2 rounded text-sm text-blue-600 hover:underline"
        >
          📄 {attachment.file_name}
        </a>
      );
    }

    // Default fallback (unknown file)
    return (
      <a
        key={attachment.id || attachment.file_url}
        href={attachment.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gray-100 border mt-2 p-2 rounded text-sm text-gray-700 hover:underline"
      >
        📎 {attachment.file_name}
      </a>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative"
    >
      {/* Notice for older messages */}
      {showOlderMessageNotice && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-200 px-3 py-1 rounded text-sm text-gray-700 shadow">
          You are viewing older messages
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUser.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === currentUser.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {message.sender_id !== currentUser.id && (
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  {message.sender?.username || "Unknown"}
                </div>
              )}

              {/* Message content */}
              {message.content && (
                <div className="break-words whitespace-pre-wrap">
                  {message.content}
                </div>
              )}

              {/* Attachments */}
              {Array.isArray(message.attachments) &&
                message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.attachments.map(renderAttachment)}
                  </div>
                )}

              {/* Timestamp */}
              <div
                className={`text-xs mt-1 ${
                  message.sender_id === currentUser.id
                    ? "text-indigo-200"
                    : "text-gray-500"
                }`}
              >
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;








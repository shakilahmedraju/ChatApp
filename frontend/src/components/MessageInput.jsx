// import React, { useState } from 'react';

// function MessageInput({ onSendMessage, disabled }) {
//   const [message, setMessage] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim() && !disabled) {
//       onSendMessage(message.trim());
//       setMessage('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
//       <div className="flex space-x-2">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//           disabled={disabled}
//           className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//         />
//         <button
//           type="submit"
//           disabled={!message.trim() || disabled}
//           className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </form>
//   );
// }

// export default MessageInput;



// // import React, { useState, useRef } from 'react';
// // import { HiPaperClip, HiOutlinePhotograph, HiEmojiHappy, HiArrowSmRight } from "react-icons/hi";

// // function MessageInput({ onSendMessage, disabled }) {
// //   const [message, setMessage] = useState('');
// //   const [attachments, setAttachments] = useState([]);
// //   const fileInputRef = useRef(null);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if ((message.trim() || attachments.length) && !disabled) {
// //       onSendMessage({ text: message.trim(), attachments });
// //       setMessage('');
// //       setAttachments([]);
// //     }
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSubmit(e);
// //     }
// //   };

// //   const handleFileChange = (e) => {
// //     const files = Array.from(e.target.files);
// //     setAttachments(prev => [...prev, ...files]);
// //     e.target.value = null; // reset input
// //   };

// //   const handleRemoveAttachment = (index) => {
// //     setAttachments(prev => prev.filter((_, i) => i !== index));
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
// //       <div className="flex items-center space-x-2">
// //         {/* Attach Button */}
// //         <button
// //           type="button"
// //           onClick={() => fileInputRef.current.click()}
// //           className="text-gray-600 hover:text-indigo-600"
// //         >
// //           <HiPaperClip size={24} />
// //         </button>
// //         <input
// //           type="file"
// //           multiple
// //           ref={fileInputRef}
// //           className="hidden"
// //           onChange={handleFileChange}
// //         />

// //         {/* Emoji button (optional) */}
// //         <button type="button" className="text-gray-600 hover:text-indigo-600">
// //           <HiEmojiHappy size={24} />
// //         </button>

// //         {/* Message input */}
// //         <textarea
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //           onKeyPress={handleKeyPress}
// //           placeholder="Type a message..."
// //           disabled={disabled}
// //           className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
// //           rows={1}
// //         />

// //         {/* Send Button */}
// //         <button
// //           type="submit"
// //           disabled={(!message.trim() && attachments.length === 0) || disabled}
// //           className="cursor-pointer px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
// //         >
// //           <HiArrowSmRight size={24} />
// //         </button>
// //       </div>

// //       {/* Show attachments */}
// //       {attachments.length > 0 && (
// //         <div className="mt-2 flex space-x-2 overflow-x-auto">
// //           {attachments.map((file, index) => (
// //             <div
// //               key={index}
// //               className="relative w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-700"
// //             >
// //               {file.name.length > 10 ? file.name.slice(0, 10) + '...' : file.name}
// //               <button
// //                 type="button"
// //                 onClick={() => handleRemoveAttachment(index)}
// //                 className="absolute top-0 right-0 text-red-500 hover:text-red-700 text-sm font-bold"
// //               >
// //                 ×
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </form>
// //   );
// // }

// // export default MessageInput;





// import React, { useState, useRef } from 'react';
// import { HiPaperAirplane, HiPhotograph, HiEmojiHappy, HiCode } from 'react-icons/hi';
// import EmojiPicker from './EmojiPicker';

// const MessageInput = ({ onSendMessage, disabled, onTypingStart, onTypingStop }) => {
//   const [message, setMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);

//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!message.trim() || disabled) return;

//     onSendMessage(message.trim());
//     setMessage('');
//     setShowEmojiPicker(false);
//     textareaRef.current.style.height = 'auto';
//   };

//   const handleEmojiSelect = (emoji) => {
//     const textarea = textareaRef.current;
//     const cursor = textarea.selectionStart;
//     const newMessage =
//       message.substring(0, cursor) + emoji + message.substring(cursor);
//     setMessage(newMessage);

//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(cursor + emoji.length, cursor + emoji.length);
//     }, 0);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }

//     if (onTypingStart) {
//       onTypingStart();
//       clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         if (onTypingStop) onTypingStop();
//       }, 1000);
//     }
//   };

//   const handleTextareaChange = (e) => {
//     setMessage(e.target.value);
//     const textarea = e.target;
//     textarea.style.height = 'auto';
//     textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
//   };

//   const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       console.log('Files to upload:', files);
//       // Implement file upload to backend and send as message
//     }
//   };

//   const insertFormatting = (prefix, suffix = '') => {
//     const textarea = textareaRef.current;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = message.substring(start, end);

//     const newText =
//       message.substring(0, start) + prefix + selected + suffix + message.substring(end);
//     setMessage(newText);

//     setTimeout(() => {
//       textarea.focus();
//       if (selected) {
//         textarea.setSelectionRange(start + prefix.length, end + prefix.length);
//       } else {
//         textarea.setSelectionRange(start + prefix.length, start + prefix.length);
//       }
//     }, 0);
//   };

//   return (
//     <div className="border-t border-gray-200 bg-white p-3">
//       {/* Formatting Toolbar */}
//       {isFocused && (
//         <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
//           <button
//             type="button"
//             onClick={() => insertFormatting('**', '**')}
//             className="px-2 py-1 text-sm font-bold bg-gray-100 rounded hover:bg-gray-200"
//             title="Bold"
//           >
//             B
//           </button>
//           <button
//             type="button"
//             onClick={() => insertFormatting('*', '*')}
//             className="px-2 py-1 text-sm italic bg-gray-100 rounded hover:bg-gray-200"
//             title="Italic"
//           >
//             I
//           </button>
//           <button
//             type="button"
//             onClick={() => insertFormatting('`', '`')}
//             className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
//             title="Inline Code"
//           >
//             <HiCode size={14} />
//           </button>
//           <button
//             type="button"
//             onClick={() => insertFormatting('```\n', '\n```')}
//             className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
//             title="Code Block"
//           >
//             <HiCode size={14} className="rotate-90" />
//           </button>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="flex items-end space-x-2">
//         {/* Left Action Buttons */}
//         <div className="flex space-x-1 mb-2">
//           {/* File Upload */}
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             disabled={disabled}
//             className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
//             title="Upload file"
//           >
//             <HiPhotograph size={20} />
//           </button>

//           {/* Emoji Picker */}
//           <div className="relative">
//             <button
//               type="button"
//               onClick={toggleEmojiPicker}
//               disabled={disabled}
//               className={`p-2 rounded-lg transition-colors ${
//                 showEmojiPicker
//                   ? 'bg-indigo-100 text-indigo-600'
//                   : 'text-gray-400 hover:text-gray-600'
//               }`}
//               title="Add emoji"
//             >
//               <HiEmojiHappy size={20} />
//             </button>

//             <EmojiPicker
//               onEmojiSelect={handleEmojiSelect}
//               isOpen={showEmojiPicker}
//               onClose={() => setShowEmojiPicker(false)}
//             />
//           </div>
//         </div>

//         {/* Textarea */}
//         <div className="flex-1 relative">
//           <textarea
//             ref={textareaRef}
//             value={message}
//             onChange={handleTextareaChange}
//             onKeyDown={handleKeyDown}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             placeholder="Type a message..."
//             rows={1}
//             disabled={disabled}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             style={{ minHeight: '40px', maxHeight: '120px' }}
//           />
//         </div>

//         {/* Send Button */}
//         <button
//           type="submit"
//           disabled={!message.trim() || disabled}
//           className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           title="Send message"
//         >
//           <HiPaperAirplane size={18} className="rotate-90" />
//         </button>

//         {/* Hidden File Input */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileUpload}
//           multiple
//           className="hidden"
//           accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
//         />
//       </form>

//       {/* Helper Text */}
//       <div className="mt-2 text-xs text-gray-500">
//         Press Enter to send • Shift+Enter for new line • Upload multiple files supported
//       </div>
//     </div>
//   );
// };

// export default MessageInput;



// import React, { useState, useRef } from "react";
// import EmojiPicker from "emoji-picker-react"; // install with npm i emoji-picker-react
// import { FaSmile, FaPaperclip, FaTimes } from "react-icons/fa";

// function MessageInput({ onSendMessage, disabled }) {
//   const [message, setMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Handle sending message
//   const handleSend = () => {
//     if (!message.trim() && attachments.length === 0) return;
//     const messageData = {
//       content: message.trim() || null,
//       attachments, // array of { file_url, file_name, file_type }
//     };
//     onSendMessage(messageData);
//     setMessage("");
//     setAttachments([]);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleEmojiClick = (emojiData, event) => {
//     const emoji = emojiData.emoji;
//     const cursorPos = textareaRef.current.selectionStart;
//     const newText =
//       message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
//     setMessage(newText);
//     // Move cursor after emoji
//     setTimeout(() => {
//       textareaRef.current.selectionStart = cursorPos + emoji.length;
//       textareaRef.current.selectionEnd = cursorPos + emoji.length;
//       textareaRef.current.focus();
//     }, 0);
//   };

//   const handleFilesChange = async (e) => {
//     const files = Array.from(e.target.files);
//     const uploaded = [];

//     for (const file of files) {
//       // Use your API /upload endpoint
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         uploaded.push(data);
//       } else {
//         console.error("File upload failed:", file.name);
//       }
//     }

//     setAttachments((prev) => [...prev, ...uploaded]);
//     e.target.value = null; // reset file input
//   };

//   const removeAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="p-3 border-t border-gray-200 bg-white">
//       {/* Uploaded attachments preview */}
//       {attachments.length > 0 && (
//         <div className="mb-2 flex flex-wrap gap-2">
//           {attachments.map((file, idx) => (
//             <div
//               key={idx}
//               className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm"
//             >
//               <span className="mr-2">{file.file_name}</span>
//               <button onClick={() => removeAttachment(idx)}>
//                 <FaTimes />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex items-center gap-2">
//         {/* Emoji picker toggle */}
//         <button
//           type="button"
//           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//           className="p-2 hover:bg-gray-200 rounded"
//         >
//           <FaSmile />
//         </button>

//         {showEmojiPicker && (
//           <div className="absolute bottom-16 z-50">
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         )}

//         {/* File upload */}
//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="p-2 hover:bg-gray-200 rounded"
//         >
//           <FaPaperclip />
//         </button>
//         <input
//           type="file"
//           multiple
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleFilesChange}
//         />

//         {/* Textarea */}
//         <textarea
//           ref={textareaRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyPress}
//           placeholder="Type a message..."
//           disabled={disabled}
//           className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-12"
//         />

//         {/* Send button */}
//         <button
//           type="button"
//           onClick={handleSend}
//           disabled={disabled && !message.trim() && attachments.length === 0}
//           className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MessageInput;




// import React, { useState, useRef } from "react";
// import EmojiPicker from "emoji-picker-react";
// import {
//   FaSmile,
//   FaPaperclip,
//   FaTimes,
//   FaFileAlt,
//   FaFilePdf,
//   FaFileImage,
// } from "react-icons/fa";

// import { attachmentsAPI } from "../services/api";

// function MessageInput({ onSendMessage, disabled }) {
//   const [message, setMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);

//   // 📩 Handle send message
//   const handleSend = () => {
//     if (!message.trim() && attachments.length === 0) return;

//     const messageData = {
//       content: message.trim() || null,
//       attachments,
//     };

//     onSendMessage(messageData);
//     setMessage("");
//     setAttachments([]);
//     setShowEmojiPicker(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // 😊 Emoji picker
//   const handleEmojiClick = (emojiData) => {
//     const emoji = emojiData.emoji;
//     const cursorPos = textareaRef.current.selectionStart;
//     const newText =
//       message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
//     setMessage(newText);

//     setTimeout(() => {
//       textareaRef.current.selectionStart = cursorPos + emoji.length;
//       textareaRef.current.selectionEnd = cursorPos + emoji.length;
//       textareaRef.current.focus();
//     }, 0);
//   };

//   // 📎 Handle file upload
//   const handleFilesChange = async (e) => {
//     const files = Array.from(e.target.files);
//     const uploaded = [];

//     // for (const file of files) {
//     //   const formData = new FormData();
//     //   formData.append("file", file);

//     //   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/attachments/upload`, {
//     //     method: "POST",
//     //     body: formData,
//     //     headers: {
//     //       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //     },
//     //   });

//     //   if (res.ok) {
//     //     const data = await res.json();
//     //     uploaded.push(data);
//     //   } else {
//     //     console.error("❌ Upload failed:", file.name);
//     //   }
//     // }

//     for (const file of files) {
//       try {
//         const res = await attachmentsAPI.uploadAttachment(file);
//         console.log(" File uploaded:", res.data);
//         // Axios response: data is in res.data
//         uploaded.push(res.data);
//       } catch (err) {
//         console.error(" Upload failed:", file.name, err);
//       }
//     }

//     setAttachments((prev) => [...prev, ...uploaded]);
//     e.target.value = null; // reset input
//   };

//   // const removeAttachment = (index) => {
//   //   setAttachments((prev) => prev.filter((_, i) => i !== index));
//   // };

//   const removeAttachment = async (index) => {
//     const file = attachments[index];
//     try {
//       // Delete from backend
//       await attachmentsAPI.deleteAttachment(file.id);

//       // Remove from frontend state
//       setAttachments((prev) => prev.filter((_, i) => i !== index));
//     } catch (err) {
//       console.error("❌ Failed to delete attachment:", err);
//     }
//   };

//   // 🔍 File preview helper
//   const renderPreview = (file) => {
//     if (!file?.file_type) return <FaFileAlt className="text-gray-600" />;

//     if (file.file_type.startsWith("image/")) {
//       return (
//         <img
//           src={file.file_url}
//           alt={file.file_name}
//           className="w-14 h-14 object-cover rounded-md border"
//         />
//       );
//     }
//     if (file.file_type.includes("pdf"))
//       return <FaFilePdf className="text-red-600 text-3xl" />;
//     if (file.file_type.includes("video"))
//       return <FaFileImage className="text-blue-600 text-3xl" />;

//     return <FaFileAlt className="text-gray-600 text-3xl" />;
//   };

//   return (
//     <div className="p-2 border-t border-gray-200 bg-white relative">
//       {/* 🖼️ Attachments preview */}
//       {attachments.length > 0 && (
//         <div className="flex items-center gap-3 overflow-x-auto mb-2 p-2">
//           {attachments.map((file, idx) => (
//             <div
//               key={idx}
//               className="relative flex-shrink-0 group bg-gray-50 border rounded-md p-1"
//             >
//               <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded">
//                 {renderPreview(file)}
//               </div>
//               <button
//                 onClick={() => removeAttachment(idx)}
//                 className="cursor-pointer absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//               >
//                 <FaTimes size={10} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 💬 Message input row */}
//       <div className="flex items-center gap-2">
//         {/* Emoji picker */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setShowEmojiPicker((prev) => !prev)}
//             className="cursor-pointer p-2 hover:bg-gray-200 rounded"
//           >
//             <FaSmile size={18} />
//           </button>

//           {showEmojiPicker && (
//             <div className="absolute bottom-12 left-0 z-50 shadow-lg bg-white border rounded-lg">
//               <EmojiPicker onEmojiClick={handleEmojiClick} />
//             </div>
//           )}
//         </div>

//         {/* Attach files */}
//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="cursor-pointer p-2 hover:bg-gray-200 rounded"
//         >
//           <FaPaperclip size={18} />
//         </button>
//         <input
//           type="file"
//           multiple
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFilesChange}
//         />

//         {/* Message text area */}
//         <textarea
//           ref={textareaRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyPress}
//           placeholder="Type a message..."
//           disabled={disabled}
//           autoComplete="off"
//           autoCorrect="off"
//           autoCapitalize="off"
//           spellCheck="false"
//           className="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 h-12"
//         />

//         {/* Send button */}
//         <button
//           type="button"
//           onClick={handleSend}
//           disabled={disabled || (!message.trim() && attachments.length === 0)}
//           className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MessageInput;




// import React, { useState, useRef, useCallback } from "react";
// import {
//   FaPaperclip,
//   FaTimes,
//   FaFileAlt,
//   FaFilePdf,
//   FaFileImage,
// } from "react-icons/fa";
// import EmojiSelector from "./EmojiSelector"; //  imported new component
// import { attachmentsAPI } from "../services/api";

// function MessageInput({ onSendMessage, disabled }) {
//   const [message, setMessage] = useState("");
//   const [attachments, setAttachments] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);

//   // 📩 Handle send message
//   const handleSend = () => {
//     if (!message.trim() && attachments.length === 0) return;
//     const messageData = { content: message.trim() || null, attachments };
//     onSendMessage(messageData);
//     setMessage("");
//     setAttachments([]);
//   };

//   // 😊 Insert emoji into text
//   const handleEmojiSelect = (emoji) => {
//     const cursorPos = textareaRef.current.selectionStart;
//     const newText =
//       message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
//     setMessage(newText);
//     setTimeout(() => {
//       textareaRef.current.selectionStart = cursorPos + emoji.length;
//       textareaRef.current.selectionEnd = cursorPos + emoji.length;
//       textareaRef.current.focus();
//     }, 0);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // 📎 Upload files
//   const uploadFiles = async (files) => {
//     const uploaded = [];
//     for (const file of files) {
//       if (file.size > 20 * 1024 * 1024) {
//         alert(`❌ ${file.name} exceeds 20 MB limit.`);
//         continue;
//       }
//       try {
//         const res = await attachmentsAPI.uploadAttachment(file);
//         uploaded.push(res.data);
//       } catch (err) {
//         console.error(" Upload failed:", file.name, err);
//       }
//     }
//     if (uploaded.length) setAttachments((p) => [...p, ...uploaded]);
//   };

//   const handleFilesChange = async (e) => {
//     const files = Array.from(e.target.files);
//     await uploadFiles(files);
//     e.target.value = null;
//   };

//   const removeAttachment = async (index) => {
//     const file = attachments[index];
//     try {
//       await attachmentsAPI.deleteAttachment(file.id);
//       setAttachments((p) => p.filter((_, i) => i !== index));
//     } catch (err) {
//       console.error("❌ Failed to delete attachment:", err);
//     }
//   };

//   // 🖱️ Drag & Drop
//   const handleDrag = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//     else if (e.type === "dragleave") setDragActive(false);
//   }, []);

//   const handleDrop = useCallback(
//     async (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setDragActive(false);
//       const files = Array.from(e.dataTransfer.files);
//       if (files.length) await uploadFiles(files);
//     },
//     []
//   );

//   // 🔍 File preview helper
//   const renderPreview = (file) => {
//     if (!file?.file_type) return <FaFileAlt className="text-gray-600" />;
//     if (file.file_type.startsWith("image/")) {
//       return (
//         <img
//           src={file.file_url}
//           alt={file.file_name}
//           className="w-14 h-14 object-cover rounded-md border"
//         />
//       );
//     }
//     if (file.file_type.includes("pdf"))
//       return <FaFilePdf className="text-red-600 text-3xl" />;
//     if (file.file_type.includes("video"))
//       return <FaFileImage className="text-blue-600 text-3xl" />;
//     return <FaFileAlt className="text-gray-600 text-3xl" />;
//   };

//   return (
//     <div
//       className={`p-2 border-t border-gray-200 bg-white relative transition ${
//         dragActive ? "bg-indigo-50 border-indigo-300" : ""
//       }`}
//       onDragEnter={handleDrag}
//       onDragOver={handleDrag}
//       onDragLeave={handleDrag}
//       onDrop={handleDrop}
//     >
//       {/* 🖼️ Drag hint */}
//       {!attachments.length && !message && (
//         <div className="text-center text-xs text-gray-400 mb-1">
//           💡 You can drag & drop files here (max 20 MB)
//         </div>
//       )}

//       {/* 🖼️ Attachments preview */}
//       {attachments.length > 0 && (
//         <div className="flex items-center gap-3 overflow-x-auto mb-2 p-2 bg-gray-50 rounded-md border border-gray-100">
//           {attachments.map((file, idx) => (
//             <div
//               key={idx}
//               className="relative flex-shrink-0 group bg-white border rounded-md p-1 shadow-sm"
//             >
//               <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded">
//                 {renderPreview(file)}
//               </div>
//               <button
//                 onClick={() => removeAttachment(idx)}
//                 className="cursor-pointer absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//               >
//                 <FaTimes size={10} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 💬 Input row */}
//       <div className="flex items-center gap-2">
//         <EmojiSelector onEmojiSelect={handleEmojiSelect} />

//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="cursor-pointer p-2 hover:bg-gray-200 rounded transition"
//         >
//           <FaPaperclip size={18} />
//         </button>
//         <input
//           type="file"
//           multiple
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFilesChange}
//         />

//         <textarea
//           ref={textareaRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyPress}
//           placeholder="Type a message..."
//           disabled={disabled}
//           autoComplete="off"
//           spellCheck="false"
//           className="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 h-12 overflow-y-auto"
//         />

//         <button
//           type="button"
//           onClick={handleSend}
//           disabled={disabled || (!message.trim() && attachments.length === 0)}
//           className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
//         >
//           Send
//         </button>
//       </div>

//       {/* Drag overlay */}
//       {dragActive && (
//         <div className="absolute inset-0 bg-indigo-100 bg-opacity-70 flex items-center justify-center rounded-md border-2 border-dashed border-indigo-400 pointer-events-none">
//           <p className="text-indigo-700 font-medium text-sm">
//             Drop files to upload
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MessageInput;




import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  FaPaperclip,
  FaTimes,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";
import EmojiSelector from "./EmojiSelector"; // Reusable emoji picker
import { attachmentsAPI } from "../services/api";

function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // 📩 Send message
  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    const messageData = { content: message.trim() || null, attachments };
    onSendMessage(messageData);
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  // 😊 Insert emoji into text
  const handleEmojiSelect = (emoji) => {
    const cursorPos = textareaRef.current.selectionStart;
    const newText =
      message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
    setMessage(newText);
    setTimeout(() => {
      textareaRef.current.selectionStart = cursorPos + emoji.length;
      textareaRef.current.selectionEnd = cursorPos + emoji.length;
      textareaRef.current.focus();
    }, 0);
  };

  // Enter key sends message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 📎 Upload files
  const uploadFiles = async (files) => {
    const uploaded = [];
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        alert(`❌ ${file.name} exceeds 20 MB limit.`);
        continue;
      }
      try {
        const res = await attachmentsAPI.uploadAttachment(file);
        uploaded.push(res.data);
      } catch (err) {
        console.error(" Upload failed:", file.name, err);
      }
    }
    if (uploaded.length) setAttachments((p) => [...p, ...uploaded]);
  };

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
    e.target.value = null;
  };

  const removeAttachment = async (index) => {
    const file = attachments[index];
    try {
      await attachmentsAPI.deleteAttachment(file.id);
      setAttachments((p) => p.filter((_, i) => i !== index));
    } catch (err) {
      console.error("❌ Failed to delete attachment:", err);
    }
  };

  // 🖱️ Drag & Drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) await uploadFiles(files);
    },
    []
  );

  // 🔍 File preview helper
  const renderPreview = (file) => {
    if (!file?.file_type) return <FaFileAlt className="text-gray-600" />;
    if (file.file_type.startsWith("image/")) {
      return (
        <img
          src={file.file_url}
          alt={file.file_name}
          className="w-14 h-14 object-cover rounded-md border"
        />
      );
    }
    if (file.file_type.includes("pdf"))
      return <FaFilePdf className="text-red-600 text-3xl" />;
    if (file.file_type.includes("video"))
      return <FaFileImage className="text-blue-600 text-3xl" />;
    return <FaFileAlt className="text-gray-600 text-3xl" />;
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + "px";
    }
  }, [message]);

  return (
    <div
      className={`p-2 border-t border-gray-200 bg-white relative transition ${
        dragActive ? "bg-indigo-50 border-indigo-300" : ""
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* 💡 Drag hint */}
      {!attachments.length && !message && (
        <div className="text-center text-xs text-gray-400 mb-1">
          💡 Drag & drop files here or click the paperclip (max 20 MB)
        </div>
      )}

      {/* 🖼️ Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto mb-2 p-2 bg-gray-50 rounded-md border border-gray-100">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 group bg-white border rounded-md p-1 shadow-sm"
            >
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded">
                {renderPreview(file)}
              </div>
              <button
                onClick={() => removeAttachment(idx)}
                className="cursor-pointer absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <FaTimes size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 💬 Input row */}
      <div className="flex items-end gap-2">
        <EmojiSelector onEmojiSelect={handleEmojiSelect} />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer p-2 hover:bg-gray-200 rounded transition"
        >
          <FaPaperclip size={18} />
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFilesChange}
        />

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
          className="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[40px] max-h-[120px] overflow-y-auto"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>

      {/* Drag overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-indigo-100 bg-opacity-70 flex items-center justify-center rounded-md border-2 border-dashed border-indigo-400 pointer-events-none">
          <p className="text-indigo-700 font-medium text-sm">
            Drop files to upload
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageInput;



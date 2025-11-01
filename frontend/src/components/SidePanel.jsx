// import React from "react";

// function SidePanel({ type, conversation, currentUser, onClose }) {
//   if (!type) return null;

//   if (type === "profile") {

//     if (!conversation) return null;

//     const isGroup = conversation.is_group;
//     const otherUser = !isGroup
//       ? conversation.users?.find((u) => u.id !== currentUser.id)
//       : null;


//     return (
//       <div className="w-80 border-l border-gray-200 bg-white p-4 animate-slide-in">
//         <h3 className="text-lg font-semibold mb-4">Profile</h3>
//         {isGroup ? (
//           <div className="space-y-3">
//             <div className="text-gray-700 font-medium">{conversation.name}</div>
//             <div className="text-sm text-gray-500">
//               {conversation.users?.length || 0} members
//             </div>
//           </div>
//         ) : otherUser ? (
//           <div className="space-y-3">
//             <div className="text-gray-700 font-medium">{otherUser.username}</div>
//             <div className="text-sm text-gray-500">{otherUser.email}</div>
//             <div className="text-sm text-gray-500">User ID: {otherUser.id}</div>
//           </div>
//         ) : (
//           <p className="text-gray-500">No profile data available.</p>
//         )}
//       </div>
//     );
//   }

//   if (type === "media") {
//     return (
//       <div className="w-80 border-l border-gray-200 bg-white p-4 animate-slide-in">
//         <h3 className="text-lg font-semibold mb-4">Media & Files</h3>
//         <p className="text-gray-500 text-sm">No media or files yet.</p>
//       </div>
//     );
//   }

//   return null;
// }

// export default SidePanel;

import React, { useEffect, useState, useCallback, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFile } from "react-icons/fa";
import { attachmentsAPI } from "../services/api";

function SidePanel({ type, conversation, currentUser, onClose }) {
  const [attachments, setAttachments] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const panelRef = useRef(null); // Ref for outside click detection

  const loadAttachments = useCallback(async () => {
    if (!conversation || loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await attachmentsAPI.getAttachments(
        conversation.id,
        30,
        page * 30
      );
      const newData = res.data;

      setAttachments((prev) => [...prev, ...newData]);
      setHasMore(newData.length > 0);
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Failed to fetch attachments:", err);
    } finally {
      setLoading(false);
    }
  }, [conversation, page, hasMore, loading]);

  useEffect(() => {
    if (type === "media" && conversation) {
      setAttachments([]);
      setPage(0);
      setHasMore(true);
      loadAttachments();
    }
  }, [type, conversation]);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      loadAttachments();
    }
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!type) return null;

  // Common header with close button
  const renderHeader = (title) => (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <IoClose size={22} />
      </button>
    </div>
  );

  // Profile panel
  if (type === "profile") {
    if (!conversation) return null;

    const isGroup = conversation.is_group;
    const otherUser = !isGroup
      ? conversation.users?.find((u) => u.id !== currentUser.id)
      : null;

    return (
      <div
        ref={panelRef}
        className="w-80 border-l border-gray-200 bg-white p-4 animate-slide-in"
      >
        {renderHeader("Profile")}
        {isGroup ? (
          <div className="space-y-3">
            <div className="text-gray-700 font-medium">{conversation.name}</div>
            <div className="text-sm text-gray-500">
              {conversation.users?.length || 0} members
            </div>
          </div>
        ) : otherUser ? (
          <div className="space-y-3">
            <div className="text-gray-700 font-medium">{otherUser.username}</div>
            <div className="text-sm text-gray-500">{otherUser.email}</div>
            <div className="text-sm text-gray-500">User ID: {otherUser.id}</div>
          </div>
        ) : (
          <p className="text-gray-500">No profile data available.</p>
        )}
      </div>
    );
  }

  // Media & Files panel
  if (type === "media") {
    const renderFileIcon = (type) => {
      if (!type) return <FaFile className="text-gray-500 text-3xl" />;
      if (type.includes("pdf")) return <FaFilePdf className="text-red-600 text-3xl" />;
      if (type.includes("word") || type.includes("doc"))
        return <FaFileWord className="text-blue-600 text-3xl" />;
      if (type.includes("text")) return <FaFileAlt className="text-gray-700 text-3xl" />;
      return <FaFile className="text-gray-500 text-3xl" />;
    };

    return (
      <div
        ref={panelRef}
        onScroll={handleScroll}
        className="w-80 border-l border-gray-200 bg-white flex flex-col p-4 animate-slide-in overflow-y-auto custom-scrollbar"
      >
        {renderHeader("Media & Files")}

        {attachments.length === 0 && !loading ? (
          <p className="text-gray-500 text-sm text-center mt-8">
            No media or files yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {attachments.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition h-24 flex items-center justify-center bg-gray-100"
              >
                {file.file_type?.startsWith("image") ? (
                  <img
                    src={file.file_url}
                    alt={file.file_name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-700">
                    {renderFileIcon(file.file_type)}
                  </div>
                )}

                {/* Overlay showing file name on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs text-center px-1 font-semibold break-words">
                  {file.file_name}
                </div>
              </a>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-3 text-gray-500 text-sm">Loading more...</div>
        )}
      </div>
    );
  }

  return null;
}

export default SidePanel;

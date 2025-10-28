import React, { useState } from 'react';
import UserList from './UserList';

function NewChatModal({ 
  isOpen, 
  onClose, 
  onCreateConversation, 
  users, 
  currentUser 
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleToggleUser = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreate = () => {
    if (selectedUsers.length === 0) return;
    if (isGroupChat && !groupName.trim()) return;

    onCreateConversation({
      user_ids: selectedUsers.map(u => u.id),
      is_group: isGroupChat,
      name: isGroupChat ? groupName.trim() : null
    });

    setSelectedUsers([]);
    setIsGroupChat(false);
    setGroupName('');
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setIsGroupChat(false);
    setGroupName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">New Chat</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isGroupChat}
                onChange={(e) => setIsGroupChat(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Group Chat</span>
            </label>
          </div>

          {isGroupChat && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {isGroupChat ? 'Members' : 'User'}
            </label>
            <UserList
              users={users}
              selectedUsers={selectedUsers}
              onToggleUser={handleToggleUser}
              currentUser={currentUser}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={selectedUsers.length === 0 || (isGroupChat && !groupName.trim())}
              className="cursor-pointer px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewChatModal;
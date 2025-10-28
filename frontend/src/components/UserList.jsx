import React from 'react';

function UserList({ 
  users, 
  selectedUsers, 
  onToggleUser, 
  currentUser 
}) {
  const filteredUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <div className="max-h-60 overflow-y-auto custom-scrollbar">
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No other users found
        </div>
      ) : (
        filteredUsers.map(user => (
          <div
            key={user.id}
            className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedUsers.find(u => u.id === user.id) ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => onToggleUser(user)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              {selectedUsers.find(u => u.id === user.id) && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;
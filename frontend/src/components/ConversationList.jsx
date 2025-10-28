import React from 'react';

function ConversationList({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  currentUser 
}) {
  const getConversationName = (conversation) => {
    if (conversation.is_group) {
      return conversation.name || 'Group Chat';
    }
    const otherUser = conversation.users.find(u => u.id !== currentUser.id);
    return otherUser ? otherUser.username : 'Unknown User';
  };

  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      {conversations.map(conversation => (
        <div
          key={conversation.id}
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
            activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="font-semibold">
            {getConversationName(conversation)}
          </div>
          {conversation.is_group && (
            <div className="text-sm text-gray-500">
              {conversation.users.length} members
            </div>
          )}
          {!conversation.is_group && (
            <div className="text-sm text-gray-500">
              {conversation.users.find(u => u.id !== currentUser.id)?.email}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
import React, { useState, useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose, position = "bottom" }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !event.target.closest('button[title*="emoji" i]') &&
        !event.target.closest('.emoji-picker-react')
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      // Add a class to body to prevent scrolling when picker is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleEmojiClick = (emojiData, event) => {
    onEmojiSelect(emojiData.emoji);
    // Don't close the picker after selecting an emoji
    // onClose();
  };

  const getPositionClass = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
      default:
        return "top-full mt-2";
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className={`absolute ${getPositionClass()} left-0 z-50 shadow-xl rounded-lg overflow-hidden border border-gray-200`}
    >
      <Picker
        onEmojiClick={handleEmojiClick}
        width={350}
        height={400}
        previewConfig={{
          showPreview: false
        }}
        searchDisabled={false}
        skinTonesDisabled
        theme="light"
        reactionsDefaultOpen={false}
        allowExpandReactions={false}
        lazyLoadEmojis={true}
        suggestedEmojisMode="frequent"
      />
    </div>
  );
};

export default EmojiPicker;
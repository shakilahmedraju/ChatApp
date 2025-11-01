// components/EmojiSelector.jsx
import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

function EmojiSelector({ onEmojiSelect }) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer p-2 hover:bg-gray-200 rounded transition"
      >
        <FaSmile size={18} />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-50 shadow-lg bg-white border rounded-lg">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            emojiStyle="native"
            width="300px"
          />
        </div>
      )}
    </div>
  );
}

export default EmojiSelector;

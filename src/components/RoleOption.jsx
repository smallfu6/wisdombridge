import React from "react";
import "../styles/RoleOption.css";

export const AIAvatar = "/chat/bot.png";
export const EinsteinAvatar = "/chat/Einstein.png";
export const ConfuciusAvatar = "/chat/Confucius.png";
export const MonroeAvatar = "/chat/Monroe.png";
export const UserAvatar = "/chat/user.png";

const RoleOption = ({ onAvatarClick }) => {
  const handleAvatarClick = (path, role) => {
    // TODO: localStorage
    if (onAvatarClick) {
      onAvatarClick(path, role); 
    }
  };

  return (
    <div className="option-container">
      <h2>Select a Role</h2>
      <div className="option-avatars">
        <div
          className="avatar-container"
          title="AI Assistant"
          onClick={() => handleAvatarClick(AIAvatar, "ai")}
        >
          <img src={AIAvatar} alt="role1" className="opt-avatar" />
        </div>
        <div
          className="avatar-container"
          title="Albert Einstein"
          onClick={() => handleAvatarClick(EinsteinAvatar, "einstein")}
        >
          <img src={EinsteinAvatar} alt="role2" className="opt-avatar" />
        </div>
        <div
          className="avatar-container"
          title="Confucius"
          onClick={() => handleAvatarClick(ConfuciusAvatar, "confucius")}
        >
          <img src={ConfuciusAvatar} alt="role3" className="opt-avatar" />
        </div>
        <div
          className="avatar-container"
          title="Marilyn Monroe"
          onClick={() => handleAvatarClick(MonroeAvatar, "monroe")}
        >
          <img src={MonroeAvatar} alt="role4" className="opt-avatar" />
        </div>
      </div>
    </div>
  );
};

export default RoleOption;

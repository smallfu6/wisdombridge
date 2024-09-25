import React, { useState } from "react";
import "../styles/RoleOption.css";

export const AIAvatar = "/chat/bot.png";
export const EinsteinAvatar = "/chat/Einstein.png";
export const ConfuciusAvatar = "/chat/Confucius.png";
export const MonroeAvatar = "/chat/Monroe.png";
export const UserAvatar = "/chat/user.png";

const RoleOption = ({ onAvatarClick }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAvatarClick = (path, role) => {
    setSelectedRole(role); // 设置选中的角色

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
          className={`avatar-container ${
            selectedRole === "ai" ? "selected" : ""
          }`}
          onClick={() => handleAvatarClick(AIAvatar, "ai")}
        >
          <img src={AIAvatar} alt="role1" className="opt-avatar" />
          <span className="avatar-title">AI Assistant</span>
        </div>
        <div
          className={`avatar-container ${
            selectedRole === "einstein" ? "selected" : ""
          }`}
          onClick={() => handleAvatarClick(EinsteinAvatar, "einstein")}
        >
          <img src={EinsteinAvatar} alt="role2" className="opt-avatar" />
          <span className="avatar-title">Albert Einstein</span>
        </div>
        <div
          className={`avatar-container ${
            selectedRole === "confucius" ? "selected" : ""
          }`}
          onClick={() => handleAvatarClick(ConfuciusAvatar, "confucius")}
        >
          <img src={ConfuciusAvatar} alt="role3" className="opt-avatar" />
          <span className="avatar-title">Confucius</span>
        </div>
        <div
          className={`avatar-container ${
            selectedRole === "monroe" ? "selected" : ""
          }`}
          onClick={() => handleAvatarClick(MonroeAvatar, "monroe")}
        >
          <img src={MonroeAvatar} alt="role4" className="opt-avatar" />
          <span className="avatar-title">Marilyn Monroe</span>
        </div>
      </div>
    </div>
  );
};

export default RoleOption;

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import useWebSocket from "react-use-websocket";

import { Button } from "antd";
import { CopyOutlined, UpOutlined, StopOutlined } from "@ant-design/icons";
import { DeleteOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // 使用 oneDark 主题样式

import RoleOption, {
  AIAvatar,
  EinsteinAvatar,
  ConfuciusAvatar,
  MonroeAvatar,
  UserAvatar,
} from "./RoleOption";
import "../styles/ChatBot.css"; // 导入 CSS 文件

const EinsteinPrompt = "Please pretend to be Einstein and talk to me, ";
const MonroePrompt = "Please pretend to be Marilyn Monroe and talk to me, ";
const ConfuciusPrompt = "Please pretend to be Confucius and talk to me, ";
const AIPrompt = "You are a helpful assistant, ";

const ChatBot = () => {
  const [socketUrl, setSocketUrl] = useState("ws://127.0.0.1:8080/chat");
  // 创建 WebSocket 实例
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: (closeEvent) => true, // 启用自动重连
    }
  );

  const [role, setRole] = useState(() => {
    // 从 localStorage 读取消息
    const saveRole = localStorage.getItem("role");
    return saveRole ? saveRole : "ai";
  });

  const [botAvatar, setBotAvatar] = useState(() => {
    if (role === "einstein") {
      return EinsteinAvatar;
    } else if (role === "confucius") {
      return ConfuciusAvatar;
    } else if (role === "monroe") {
      return MonroeAvatar;
    } else {
      return AIAvatar;
    }
  });

  const [prefix, setPrefix] = useState(() => {
    if (role === "einstein") {
      return EinsteinPrompt;
    } else if (role === "confucius") {
      return ConfuciusPrompt;
    } else if (role === "monroe") {
      return MonroePrompt;
    } else {
      return AIPrompt;
    }
  });

  const [messages, setMessages] = useState(() => {
    // 从 localStorage 读取消息
    const key = role + "-chatMessages";
    const savedMessages = localStorage.getItem(key);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null); // 用于滚动到最新消息
  const [hasReceivedMessage, setHasReceivedMessage] = useState(false);

  const handleReconnect = () => {
    const socket = getWebSocket();
    if (socket) {
      socket.close(); // 主动断开连接
    }
    // 重新设置 URL 并重新连接
    setSocketUrl(socketUrl);
  };

  const saveMessagesToStorage = useCallback(
    (newMessages) => {
      const key = role + "-chatMessages";
      localStorage.setItem(key, JSON.stringify(newMessages));
    },
    [role]
  );

  const parseStreamChunk = useCallback(
    (data) => {
      try {
        if (data === "DONE") {
          setIsTyping(false);
          setHasReceivedMessage(false);
        } else {
          const message = JSON.parse(data);
          const content = message.content;

          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            let updatedMessages;
            if (lastMessage && lastMessage.role === "assistant") {
              updatedMessages = [
                ...prevMessages.slice(0, prevMessages.length - 1),
                { ...lastMessage, content: lastMessage.content + content },
              ];
            } else {
              setHasReceivedMessage(true); // 收到消息时设置为 true
              updatedMessages = [
                ...prevMessages,
                { role: "assistant", content: content },
              ];
            }
            saveMessagesToStorage(updatedMessages);
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error("Error parsing stream chunk:", error);
      }
    },
    [saveMessagesToStorage]
  );

  useEffect(() => {
    if (lastMessage !== null) {
      // console.log(`Received message: ${lastMessage.data}`);
      parseStreamChunk(lastMessage.data);
    }
  }, [parseStreamChunk, lastMessage]);

  const handleStopAI = () => {
    handleReconnect();
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);
      setInput("");
      setIsTyping(true);
      setHasReceivedMessage(false);

      sendMessage(JSON.stringify({ role: "user", content: prefix + input }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleClearMessages = () => {
    handleReconnect();
    setMessages([]); // 清空消息记录
    setInput(""); // 清空输入框
    console.log("清空记录并停止接收消息.");

    localStorage.removeItem("chatMessages"); // 清除 localStorage 中的消息
  };

  const handleScrollToBottom = () => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <div style={{ position: "relative" }}>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <Button
            icon={<CopyOutlined />}
            onClick={() => navigator.clipboard.writeText(codeString)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              borderRadius: "4px", // 圆角
              padding: "4px 8px", // 内边距
              border: "none",
            }}
          />
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const handleSwitchRole = (path, role) => {
    // TODO: message id 
    handleReconnect();

    setIsTyping(false);
    setBotAvatar(path);
    setRole(role);
    localStorage.setItem("role", role);

    const key = role + "-chatMessages";
    const savedMessages = localStorage.getItem(key);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);

    if (role === "einstein") {
      setPrefix(EinsteinPrompt);
    } else if (role === "confucius") {
      setPrefix(ConfuciusPrompt);
    } else if (role === "monroe") {
      setPrefix(MonroePrompt);
    } else {
      setPrefix(AIPrompt);
    }

    // 刷新页面
    // TODO: send STOP message
    // window.location.reload();
    if (savedMessages === null) {
      sendMessage(
        JSON.stringify({ role: "user", content: prefix + "who are you?" })
      );
    }
  };

  return (
    <div className="app-container">
      <RoleOption onAvatarClick={handleSwitchRole} />
      <div className="chat-container">
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user-message" : "bot-message"
              }`}
              style={{
                display: "flex",
                alignItems: "flex-start", // 头像与消息内容对齐
                marginBottom: "10px", // 消息间距
              }}
            >
              {msg.role === "assistant" && (
                <img src={botAvatar} alt="Avatar" className="bot-avatar" />
              )}
              <div
                className={`message-content ${
                  msg.role === "user" ? "user-content" : "bot-content"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown components={components}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <img src={UserAvatar} alt="Avatar" className="user-avatar" />
              )}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              {!hasReceivedMessage && (
                <img src={botAvatar} alt="AI Avatar" className="bot-avatar" />
              )}
              AI is typing...
            </div>
          )}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />

          <Button
            icon={isTyping ? <StopOutlined /> : <UpOutlined />}
            onClick={isTyping ? handleStopAI : handleSendMessage}
            type="primary" // 可以根据需要调整按钮类型
          />
        </div>
      </div>

      <div className="floating-buttons">
        <Button
          className="floating-button"
          icon={<DeleteOutlined />}
          onClick={handleClearMessages}
          shape="circle"
        />
        <Button
          className="floating-button"
          icon={<ArrowDownOutlined />}
          onClick={handleScrollToBottom}
          shape="circle"
        />
      </div>
    </div>
  );
};

export default ChatBot;

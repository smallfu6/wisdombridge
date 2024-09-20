import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "antd"; 
import { DeleteOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // 使用 oneDark 主题样式
import "../styles/ChatBot.css"; // 导入 CSS 文件


const userAvatar = "/chat/user.png"; // 用户头像路径
const botAvatar = "/chat/bot.png"; // AI头像路径


const ChatBot = () => {
  const [messages, setMessages] = useState([]); // 存储所有消息
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef(null); // WebSocket 引用
  const chatBodyRef = useRef(null); // 用于滚动到最新消息
  const [hasReceivedMessage, setHasReceivedMessage] = useState(false);

  const parseStreamChunk = useCallback((data) => {
    try {
      if (data === "DONE") {
        setIsTyping(false);
        setHasReceivedMessage(false);
      } else {
        const message = JSON.parse(data);
        const content = message.content;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            return [
              ...prevMessages.slice(0, prevMessages.length - 1),
              { ...lastMessage, content: lastMessage.content + content },
            ];
          } else {
            setHasReceivedMessage(true); // 收到消息时设置为 true
            return [...prevMessages, { role: "assistant", content: content }];
          }
        });
      }
    } catch (error) {
      console.error("Error parsing stream chunk:", error);
    }
  }, []);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://127.0.0.1:8080/chat");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    wsRef.current.onmessage = (event) => {
      const data = event.data;
      parseStreamChunk(data);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      wsRef.current.close();
    };
  }, [parseStreamChunk]);

  const handleStopAI = () => {
    if (wsRef.current) {
      wsRef.current.close();
      setIsTyping(false);
      console.log("Stopped receiving AI messages.");
    }
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

      wsRef.current.send(JSON.stringify({ role: "user", content: input }));
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
    if (wsRef.current) {
      wsRef.current.close(); // 停止接收消息
      setIsTyping(false); // 停止输入指示
    }
    setMessages([]); // 清空消息记录
    setInput(""); // 清空输入框
    console.log("清空记录并停止接收消息.");

    // 刷新页面
    // TODO: send STOP message
    window.location.reload();
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
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };


  return (
    <div className="app-container">
      <div className="options-panel">
        <h2>选项</h2>
        <ul>
          <li>选项 1</li>
          <li>选项 2</li>
          <li>选项 3</li>
        </ul>
      </div>
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
                <img src={userAvatar} alt="Avatar" className="user-avatar" />
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
          <button onClick={isTyping ? handleStopAI : handleSendMessage}>
            <i className={`fas ${isTyping ? "fa-stop" : "fa-paper-plane"}`}></i>
          </button>
        </div>
      </div>
      <div className="info-container">
        <p>info</p>
      </div>

      { /* 悬浮按钮 */ }
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

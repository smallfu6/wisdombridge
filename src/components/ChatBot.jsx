import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // 使用 oneDark 主题样式
import "../styles/ChatBot.css"; // 导入 CSS 文件

const ChatBot = () => {
  const [messages, setMessages] = useState([]); // 存储所有消息
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef(null); // WebSocket 引用
  const chatBodyRef = useRef(null); // 用于滚动到最新消息

  // 处理流式数据的回调函数
  const parseStreamChunk = useCallback((data) => {
    try {
      if (data === "DONE") {
        setIsTyping(false);
      } else {
        const message = JSON.parse(data); // 解析流式数据
        const content = message.content;

        // 如果上次的回复还未结束，拼接最后一条 AI 消息
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            // 更新最后一条 AI 消息
            return [
              ...prevMessages.slice(0, prevMessages.length - 1),
              { ...lastMessage, content: lastMessage.content + content },
            ];
          } else {
            return [...prevMessages, { role: "assistant", content: content }];
          }
        });
      }
    } catch (error) {
      console.error("Error parsing stream chunk:", error);
    }
  }, []);

  useEffect(() => {
    // 创建 WebSocket 连接
    wsRef.current = new WebSocket("ws://127.0.0.1:8080/chat");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    wsRef.current.onmessage = (event) => {
      const data = event.data;
      parseStreamChunk(data); // 处理流数据
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

  // 停止接收AI消息的功能
  const handleStopAI = () => {
    if (wsRef.current) {
      wsRef.current.close();
      setIsTyping(false); // 停止后关闭 typing 状态
      console.log("Stopped receiving AI messages.");
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      // 发送用户消息
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);
      setInput("");
      setIsTyping(true); // 显示“AI is typing”

      // 发送消息到 WebSocket 服务器
      wsRef.current.send(JSON.stringify({ role: "user", content: input }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // 滚动到聊天底部
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // 使用 components 属性来渲染代码块
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
    <div className="chat-container">
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.role === "user" ? "user-message" : "bot-message"
            }`}
          >
            {msg.role === "assistant" ? (
              <ReactMarkdown components={components}>{msg.content}</ReactMarkdown> // 使用 components 来渲染 AI 消息
            ) : (
              msg.content // 用户消息直接显示
            )}
          </div>
        ))}

        {isTyping && <div className="typing-indicator">AI is typing...</div>}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping} // 禁用输入框当 AI 在回复时
        />
        <button onClick={isTyping ? handleStopAI : handleSendMessage}>
          <i className={`fas ${isTyping ? "fa-stop" : "fa-paper-plane"}`}></i> {/* 图标切换 */}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;

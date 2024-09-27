import React, { useState, useEffect } from "react";
import "../styles/Home.css"; // 这里包含样式

const Home = () => {
  const [visible, setVisible] = useState(true);
  const [transitionComplete, setTransitionComplete] = useState(false);

  const logo = "/icon.png";
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // 5秒后隐藏

    return () => clearTimeout(timer); // 清理定时器
  }, []);

  const handleTransitionEnd = () => {
    if (!visible) {
      setTransitionComplete(true); // 过渡完成后更新状态
    }
  };

  return (
    <div>
      {!transitionComplete && (
        <div
          className={`home ${visible ? "fade-in" : "fade-out"}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <img className="logo" src={logo} alt="Logo" />
          <h2 className="project-name">WisdomBridge</h2>
          <p className="project-detail">
            A platform for AI digital twins of historical figures, allowing
            users to engage in cross-time conversations and discuss contemporary
            hot topics.{" "}
          </p>
          <div className="color-bar" />
        </div>
      )}
    </div>
  );
};

export default Home;

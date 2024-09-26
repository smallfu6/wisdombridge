import React, { useState, useEffect } from 'react';
import '../styles/Home.css'; // 这里包含样式

const Home = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // 5秒后隐藏

    return () => clearTimeout(timer); // 清理定时器
  }, []);

  return (
    <div>
    {visible && <div className="overlay" />} {/* 添加覆盖层 */}
    <div className={`home ${visible ? 'fade-in' : 'fade-out'}`}>
      <h2>项目名称</h2>
      <p>这是一个关于项目的信息介绍。</p>
    </div>
    </div>
  );
};

export default Home;
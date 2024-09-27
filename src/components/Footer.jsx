import React from "react";
import { GithubOutlined } from "@ant-design/icons";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <a
        href="https://github.com/smallfu6/gaiachat"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        <GithubOutlined />
      </a>
      <p className="power-info">©2024 wisdombridge.space</p>
    </div>
  );
};

export default Footer;

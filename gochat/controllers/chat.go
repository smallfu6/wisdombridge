package controllers

import (
	"encoding/json"
	"gochat/models"
	"gochat/utils"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"

	"github.com/gin-gonic/gin"
)

const apiUrl = "https://llamatool.us.gaianet.network/v1/chat/completions"
const apiKey = ""
const modelName = "llama"

type ChatReq struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func StreamChat(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer closeWebSocket(conn)

	for {
		err := ReadMessage(conn)
		if err != nil {
			log.Println("Error while reading message:", err)
			continue
			// break // 发生错误时退出循环
		}

		// err = conn.WriteMessage(messageType, msg)
		// if err != nil {
		// 	return
		// }
	}

}

// ReadMessage 从WebSocket连接中读取消息，并返回可能发生的错误
func ReadMessage(conn *websocket.Conn) error {
	// 读取消息
	messageType, msg, err := conn.ReadMessage()
	if err != nil {
		return err
	}

	// 处理不同类型的消息
	switch messageType {
	case websocket.TextMessage:
		log.Printf("Received text message: %s", msg)
		if strings.Contains(string(msg), "ping") {
			return nil
		}

		var cr ChatReq
		err := json.Unmarshal(msg, &cr)
		if err != nil {
			log.Println(err)
			return err
		}

		// 设置请求消息
		chatRequest := models.ChatRequest{
			Messages: []models.Message{
				{Role: "system", Content: "You are a helpful assistant."},
				{Role: "user", Content: cr.Content},
			},
			Model:  modelName,
			Stream: true,
		}

		// 发送 POST 请求
		resp, err := utils.SendPostRequest(apiUrl, apiKey, chatRequest)
		if err != nil {
			// c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			log.Fatalln(err)
			return err
		}

		// 读取流式数据并返回
		ReadStreamData(resp, conn)

		// 在这里处理文本消息
	case websocket.BinaryMessage:
		log.Printf("Received binary message of length %d", len(msg))
		// 在这里处理二进制消息
	default:
		log.Println("Unsupported message type")
	}

	// // 将收到的消息回写到连接中（可选）
	// err = conn.WriteMessage(messageType, msg)
	// if err != nil {
	// 	return err
	// }

	return nil
}

// 正确关闭 WebSocket 连接
func closeWebSocket(conn *websocket.Conn) {
	// 发送关闭消息
	err := conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil {
		log.Println("Error sending close message:", err)
		return
	}

	// 给 WebSocket 一些时间完成关闭握手
	time.Sleep(1 * time.Second)

	// 关闭连接
	err = conn.Close()
	if err != nil {
		log.Println("Error closing WebSocket:", err)
		return
	}

	log.Println("WebSocket connection closed gracefully.")
}

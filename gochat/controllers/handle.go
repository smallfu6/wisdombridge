package controllers

import (
	"bufio"
	"encoding/json"
	"fmt"
	"gochat/models"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

// ReadStreamData 从响应体中读取流式数据
func ReadStreamData(resp *http.Response, conn *websocket.Conn) {
	defer resp.Body.Close()

	// 逐行读取返回的流式数据
	reader := bufio.NewReader(resp.Body)
	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			// 如果结束，返回 DONE
			if err == io.EOF {
				// c.SSEvent("message", "DONE")
				conn.WriteMessage(websocket.TextMessage, []byte("DONE"))
				return
			}
			// c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read stream"})
			return
		}

		// 解析每个返回的数据块
		if len(line) > 6 && string(line[:6]) == "data: " {
			fmt.Println(string(line[6:]))

			// done := string(line[6:])
			// if strings.Contains(done, "DONE") {
			// 	c.SSEvent("message", "DONE")
			// 	return
			// }
			if strings.Contains(string(line[6:]), "DONE") {
				conn.WriteMessage(websocket.TextMessage, []byte("DONE"))
				return
			}

			chunk, err := models.ParseChatCompletionChunk(string(line[5:]))
			if err != nil {
				// c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				log.Println(err)
				return
			}

			var data models.ChatResponse
			data.Id = "xxxx"
			data.Content = chunk.Choices[0].Delta.Content
			resp, _ := json.Marshal(data)
			conn.WriteMessage(websocket.TextMessage, resp)
			time.Sleep(50 * time.Millisecond) // 模拟延迟
		}
	}
}

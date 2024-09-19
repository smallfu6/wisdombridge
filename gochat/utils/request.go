package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

// SendPostRequest 发送 POST 请求到指定的 URL，并返回响应体
func SendPostRequest(url string, apiKey string, requestBody interface{}) (*http.Response, error) {
	// 将请求体转换为 JSON
	body, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %w", err)
	}

	// 创建 POST 请求
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	// 发起请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}

	return resp, nil
}

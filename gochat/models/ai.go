package models

import (
	"encoding/json"
	"fmt"
)

// ChatCompletionChunk 结构体用于解析 chat/completion 的 chunk 数据
type ChatCompletionChunk struct {
	ID                string   `json:"id"`
	Choices           []Choice `json:"choices"`
	Created           int64    `json:"created"`
	Model             string   `json:"model"`
	SystemFingerprint string   `json:"system_fingerprint"`
	Object            string   `json:"object"`
}

// Choice 结构体用于解析 choices 部分
type AiChoice struct {
	Index        int         `json:"index"`
	Delta        Delta       `json:"delta"`
	Logprobs     interface{} `json:"logprobs"`      // 可以是 null 或其他类型
	FinishReason interface{} `json:"finish_reason"` // 可以是 null 或其他类型
}

// Delta 结构体用于解析 delta 部分
type AiDelta struct {
	Content string `json:"content"`
	Role    string `json:"role"`
}

// ParseChatCompletionChunk 解析 chat/completion 的 chunk 数据
func ParseChatCompletionChunk(data string) (*ChatCompletionChunk, error) {
	var chunk ChatCompletionChunk
	err := json.Unmarshal([]byte(data), &chunk)
	if err != nil {
		return nil, fmt.Errorf("error parsing chat completion chunk: %w", err)
	}
	return &chunk, nil
}

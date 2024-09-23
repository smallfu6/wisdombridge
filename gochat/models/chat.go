package models

// 定义 API 请求体结构
type ChatRequest struct {
	Messages    []Message `json:"messages"`
	Model       string    `json:"model"`
	Stream      bool      `json:"stream"`
	TopP        float64   `json:"top_p"`       // 0-1
	Temperature float64   `json:"temperature"` // 0-2
}

func (c *ChatRequest) Setup() {
	c.TopP = 1
	c.Temperature = 1.6
}

// 定义消息结构
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// 定义流式返回的数据结构
type StreamResponse struct {
	ID      string   `json:"id"`
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Index  int    `json:"index"`
	Delta  Delta  `json:"delta"`
	Finish string `json:"finish_reason"`
}

type Delta struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatResponse struct {
	Id      string `json:"id"`
	Content string `json:"content"`
}

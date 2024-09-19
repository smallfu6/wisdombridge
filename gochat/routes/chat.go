package routes

import (
	"gochat/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// 设置路由和处理函数
	r.GET("/chat", controllers.StreamChat)
}

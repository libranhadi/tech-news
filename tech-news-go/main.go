package main

import (
	"log"
	configs "tech-news-go/config"
	"tech-news-go/handler"
	"tech-news-go/repository"
	"tech-news-go/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-type, Accept",
	}))

	config, err := configs.New()
	if err != nil {
		log.Printf("[SERVER] ERROR %v", err)
		log.Fatal(err)
	}

	newsRepo := repository.NewNewsRepository(config)
	newsService := service.NewNewsService(newsRepo)
	handler := handler.NewNewsHandler(config, newsService)
	api := app.Group("/api")
	api.Get("/news", handler.GetNews)
	api.Get("/news/:id", handler.GetItemWithComments)

	app.Listen(":8000")
}

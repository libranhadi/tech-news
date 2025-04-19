package handler

import (
	"context"
	"fmt"
	"strconv"
	configs "tech-news-go/config"
	"tech-news-go/model"
	"tech-news-go/service"
	"time"

	"github.com/gofiber/fiber/v2"
)

type NewsHandler struct {
	interfaceNewsService service.INewsService
	config               *configs.Configs
}

const (
	defaultLogNewsHandler           = "[ENDPOINT NEWS] %v"
	defaultLogErrorNewsHandler      = "ERROR %v"
	basicDefaultLogNewsErrorHandler = defaultLogNewsHandler + " " + defaultLogErrorNewsHandler
)

func NewNewsHandler(config *configs.Configs, interfaceNewsService service.INewsService) *NewsHandler {
	return &NewsHandler{interfaceNewsService: interfaceNewsService, config: config}
}

func (h *NewsHandler) GetNews(c *fiber.Ctx) error {
	storyType := c.Query("type", "topstories")
	page, limit := c.QueryInt("page", 0), c.QueryInt("limit", 10)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	stories, err := h.interfaceNewsService.GetNews(ctx, storyType, page, limit)
	if err != nil {
		h.config.Logger.Errorf(fmt.Sprintf(basicDefaultLogNewsErrorHandler, "[GET TYPE STORIES]", err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to fetch top stories",
		})
	}

	return c.JSON(stories)
}

func (h *NewsHandler) GetItemWithComments(c *fiber.Ctx) error {
	var (
		idStr string
		id    int
		depth = 3
		data  *model.HackerNews
		err   error
	)

	idStr = c.Params("id")
	id, err = strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid id",
		})

	}
	depth = c.QueryInt("depth", 100)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	data, err = h.interfaceNewsService.GetItemWithComments(ctx, id, depth)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch data",
		})
	}

	return c.JSON(data)
}

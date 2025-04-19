package service

import (
	"context"
	"log"
	"tech-news-go/model"
	"tech-news-go/repository"
)

type INewsService interface {
	GetNews(ctx context.Context, newsType string, page, limit int) ([]*model.HackerNews, error)
	GetItemWithComments(ctx context.Context, id int, maxDepth int) (*model.HackerNews, error)
}

var validTypes = map[string]bool{
	"topstories":  true,
	"newstories":  true,
	"beststories": true,
	"askstories":  true,
	"showstories": true,
	"jobstories":  true,
}

type newsService struct {
	newsRepo repository.INewsRepository
}

func NewNewsService(newsRepo repository.INewsRepository) INewsService {
	return &newsService{newsRepo: newsRepo}
}

func (s *newsService) GetNews(ctx context.Context, newsType string, page, limit int) ([]*model.HackerNews, error) {
	if !validTypes[newsType] {
		newsType = "topstories"
	}

	stories, err := s.newsRepo.GetPaginatedItems(newsType, ctx, page, limit)
	if err != nil {
		log.Printf("Error fetching top stories: %v", err)
		return nil, err
	}
	return stories, nil
}

func (s *newsService) GetItemWithComments(ctx context.Context, id int, depth int) (*model.HackerNews, error) {
	item, err := s.newsRepo.GetItemWithComments(ctx, id, depth)
	if err != nil {
		return nil, err
	}

	return item, nil

}

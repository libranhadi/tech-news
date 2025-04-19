package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	configs "tech-news-go/config"
	"tech-news-go/constants"
	"tech-news-go/model"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
)

type INewsRepository interface {
	fetchStoryIDs(typeNews string, offset, limit int, ctx context.Context) ([]int, error)
	FetchItem(id int, ctx context.Context) (*model.HackerNews, error)
	GetPaginatedItems(storyType string, ctx context.Context, offset, limit int) ([]*model.HackerNews, error)
	GetItemWithComments(ctx context.Context, id int, depth int) (*model.HackerNews, error)
}

type newsRepository struct {
	redisClient *redis.Client
	logger      *logrus.Logger
}

func NewNewsRepository(config *configs.Configs) INewsRepository {
	return &newsRepository{redisClient: config.RedisClient, logger: config.Logger}
}

const (
	defaultLogNewsRepository           = "[REPOSITORY NEWS] %v"
	defaultLogErrorNewsRepository      = "ERROR %v"
	basicDefaultLogNewsErrorRepository = defaultLogNewsRepository + " " + defaultLogErrorNewsRepository
)

// fetchStoryIDs fetches type stories from Hacker News
func (r *newsRepository) fetchStoryIDs(typeNews string, offset, limit int, ctx context.Context) ([]int, error) {
	var (
		cacheKey, cachedData, url string
		err                       error
	)
	cacheKey = fmt.Sprintf("hacker-news-%s-page-%d-limit-%d", typeNews, offset, limit)

	cachedData, err = r.redisClient.Get(ctx, cacheKey).Result()
	if err == nil && cachedData != constants.EmptyString {
		var storyIDs []int
		if err := json.Unmarshal([]byte(cachedData), &storyIDs); err == nil {
			return storyIDs, nil
		}
	}

	url = fmt.Sprintf(constants.HackerNewsCustomURl, typeNews)
	resp, err := http.Get(url)
	if err != nil {
		r.logger.Errorf(fmt.Sprintf(basicDefaultLogNewsErrorRepository, "[FETCH TYPE STORIES]", err))
		return nil, err
	}
	defer resp.Body.Close()

	var storyIds []int
	if err := json.NewDecoder(resp.Body).Decode(&storyIds); err != nil {
		r.logger.Errorf(fmt.Sprintf(basicDefaultLogNewsErrorRepository, "[FETCH TYPE STORIES]", err))
	}

	cacheData, _ := json.Marshal(storyIds)
	r.redisClient.Set(ctx, cacheKey, cacheData, 10*time.Minute)

	return storyIds, nil
}

func (r *newsRepository) FetchItem(id int, ctx context.Context) (*model.HackerNews, error) {

	var (
		cacheKey, cachedData, url string
		err                       error
		item                      *model.HackerNews
	)
	cacheKey = fmt.Sprintf("hacker-news-item-%d", id)

	cachedData, err = r.redisClient.Get(ctx, cacheKey).Result()
	if err == nil && cachedData != constants.EmptyString {
		if err := json.Unmarshal([]byte(cachedData), &item); err == nil {
			return item, nil
		}
	}

	url = fmt.Sprintf(constants.HackerNewsCustomItemURl, id)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	err = json.Unmarshal(body, &item)

	cacheData, _ := json.Marshal(item)
	r.redisClient.Set(ctx, cacheKey, cacheData, 10*time.Minute)

	return item, err
}

func (r *newsRepository) GetPaginatedItems(storyType string, context context.Context, offset, limit int) ([]*model.HackerNews, error) {

	var (
		cacheKey, cachedData string
		err                  error
		items                []*model.HackerNews
	)

	cacheKey = fmt.Sprintf("hacker-news-%s-paginate-page-%d-limit-%d", storyType, offset, limit)

	cachedData, err = r.redisClient.Get(context, cacheKey).Result()
	if err == nil && cachedData != constants.EmptyString {
		if err := json.Unmarshal([]byte(cachedData), &items); err == nil {
			return items, nil
		}
	}

	if offset > 0 {
		offset = offset - 1
	}

	ids, err := r.fetchStoryIDs(storyType, offset, limit, context)
	if err != nil {
		return nil, err
	}

	if limit > len(ids) {
		limit = len(ids)
	}
	if offset > len(ids) {
		offset = limit - 1
	}

	selectedIDs := ids[offset:limit]

	for _, id := range selectedIDs {
		item, err := r.FetchItem(id, context)
		if err == nil {
			items = append(items, item)
		}
	}

	cacheData, _ := json.Marshal(items)
	r.redisClient.Set(context, cacheKey, cacheData, 10*time.Minute)
	return items, nil
}

func (r *newsRepository) GetItemWithComments(ctx context.Context, id int, depth int) (*model.HackerNews, error) {
	key := fmt.Sprintf("item_comments_%d_depth_%d", id, depth)

	cached, err := r.redisClient.Get(ctx, key).Result()
	if err == nil && cached != "" {
		var item model.HackerNews
		if err := json.Unmarshal([]byte(cached), &item); err == nil {
			return &item, nil
		}
	}

	item, err := r.fetchItemWithCommentsRecursive(ctx, id, depth)
	if err != nil {
		return nil, err
	}

	bytes, _ := json.Marshal(item)
	r.redisClient.Set(ctx, key, bytes, 10*time.Minute)

	return item, nil
}

func (r *newsRepository) fetchItemWithCommentsRecursive(ctx context.Context, id int, depth int) (*model.HackerNews, error) {
	if depth <= 0 {
		return nil, nil
	}

	item, err := r.FetchItem(id, ctx)
	if err != nil {
		return nil, err
	}

	if len(item.Kids) > 0 {
		comments := make([]*model.HackerNews, 0, len(item.Kids))
		var wg sync.WaitGroup
		var mu sync.Mutex
		for _, kidID := range item.Kids {
			wg.Add(1)
			go func(kid int) {
				defer wg.Done()
				comment, err := r.fetchItemWithCommentsRecursive(ctx, kid, depth-1)
				if err == nil && comment != nil {
					mu.Lock()
					comments = append(comments, comment)
					mu.Unlock()
				}
			}(kidID)
		}
		wg.Wait()
		item.Comments = comments
	}

	return item, nil
}

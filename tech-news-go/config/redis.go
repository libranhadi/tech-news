package configs

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func AppRedisNew(env map[string]string) (client *redis.Client, err error) {
	client = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", env["REDIS_HOST"], env["REDIS_PORT"]),

		DB: 0,
	})

	_, err = client.Ping(ctx).Result()
	if err != nil {
		return nil, err
	}
	return client, nil
}

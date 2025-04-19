package configs

import (
	"fmt"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

type Configs struct {
	Logger      *logrus.Logger
	RedisClient *redis.Client
}

const (
	defaultLog           = "[SETUP] %v"
	defaultLogError      = "ERROR %v"
	basicDefaultLogError = defaultLog + " " + defaultLogError
)

var (
	myEnv map[string]string
	err   error
)

func New() (*Configs, error) {
	myEnv = map[string]string{}
	myEnv, err = godotenv.Read(".env")
	if err != nil {
		return nil, err
	}
	logger := logrus.New()

	rc, err := AppRedisNew(myEnv)
	if err != nil {
		logger.Errorf(fmt.Sprintf(basicDefaultLogError, "[APP_REDIS]", err))
	}
	return &Configs{
		RedisClient: rc,
		Logger:      logger,
	}, nil
}

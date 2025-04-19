package constants

const (
	EmptyString             = ""
	HackerNewsBaseUrl       = "https://hacker-news.firebaseio.com/v0/"
	HackerNewsTypeDataJson  = ".json"
	HackerNewsCustomURl     = HackerNewsBaseUrl + "%s" + HackerNewsTypeDataJson
	HackerNewsCustomItemURl = HackerNewsBaseUrl + "item/%d" + HackerNewsTypeDataJson
	// sample =  https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty
)

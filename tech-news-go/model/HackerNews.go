package model

type HackerNews struct {
	ID          int           `json:"id"`
	By          string        `json:"by"`
	Title       string        `json:"title"`
	Descendants int           `json:"descendants,omitempty"`
	Kids        []int         `json:"kids,omitempty"`
	Score       int           `json:"score,omitempty"`
	Time        int64         `json:"time"`
	Type        string        `json:"type"`
	URL         string        `json:"url,omitempty"`
	Text        string        `json:"text,omitempty"`
	Parent      int           `json:"parent,omitempty"`
	Comments    []*HackerNews `json:"comments,omitempty"`
}

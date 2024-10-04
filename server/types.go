package main

type User struct {
	Id                  string `json:"_id"`
	Email               string `json:"email"`
	Password            string `json:"password"`
	City                string `json:"city"`
	State               string `json:"state"`
	Height              string `json:"height"`
	Weight              int    `json:"weight"`
	DesiredWeight       int    `json:"desired_weight"`
	CookingTimePerDay   int    `json:"cooking_time_per_day"`
	ExerciseDaysPerWeek int    `json:"exercise_days_per_week"`
	DietaryRestrictions string `json:"dietary_restrictions"`
}

type Recipe struct {
	Id      string `json:"_id"`
	UserId  string `json:"user_id"`
	Date    string `json:"date"`
	FileUrl string `json:"file"`
	Name    string `json:"name"`
}

type Message struct {
	Sender    string `json:"sender"`
	Text      string `json:"text"`
	Timestamp string `json:"timestamp"`
}

type DefaultUserRequestBody struct {
	Email               string `json:"email"`
	Password            string `json:"password"`
	City                string `json:"city"`
	State               string `json:"state"`
	Height              string `json:"height"`
	Weight              int    `json:"weight"`
	DesiredWeight       int    `json:"desired_weight"`
	CookingTimePerDay   int    `json:"cooking_time_per_day"`
	ExerciseDaysPerWeek int    `json:"exercise_days_per_week"`
	DietaryRestrictions string `json:"dietary_restrictions"`
}

type DefaultResponse struct {
	Message string      `json:"message"`
	Status  int         `json:"status"`
	Object  interface{} `json:"object,omitempty"`
}

type GetUserRequestBody struct {
	Email string `json:"email"`
}

type GetUserResponse struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
	User    User   `json:"user,omitempty"`
}

type DefaultRecipeRequestBody struct {
	UserId string `json:"user_id"`
	Date   string `json:"date"`
	Name   string `json:"name"`
}

type GetAllRecipesForUserResponse struct {
	Message string   `json:"message"`
	Status  int      `json:"status"`
	Recipes []Recipe `json:"recipes"`
}

type DeleteRecipeRequestBody struct {
	UserId string `json:"user_id"`
}

type NutribotRequestBody struct {
	UserId     string `json:"user_id"`
	Email      string `json:"email"`
	UserPrompt string `json:"user_prompt"`
}

type NutribotResponse struct {
	Message     string `json:"message"`
	Status      int    `json:"status"`
	GptResponse string `json:"gpt_response,omitempty"`
}

type GetUserChatsResponse struct {
	Message string    `json:"message"`
	Status  int       `json:"status"`
	Chats   []Message `json:"chats,omitempty"`
}

type LoginRequestBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
	User    User   `json:"user,omitempty"`
}

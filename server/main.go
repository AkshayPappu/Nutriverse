package main

import (
	"log"
	"net/http"
)

var (
	UsersTable   = "NutriverseUsers"
	RecipesTable = "NutriverseRecipes"
	ChatsTable   = "NutriverseChats"
	S3Bucket     = "nutriversebucket"
	RegionName   = "us-east-1"
)

func init() {
	dynamo = connectDynamo()
	s3client = connectS3()
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	router := http.NewServeMux()

	// User Routes
	router.HandleFunc("POST /api/auth/login", LoginHandler)
	router.HandleFunc("POST /users/create", CreateUserHandler)
	router.HandleFunc("GET /users/{id}", GetUserHandler)
	router.HandleFunc("POST /users/update/{id}", UpdateUserHandler)

	// Recipe Routes
	router.HandleFunc("POST /recipes/create", CreateRecipeHandler)
	router.HandleFunc("POST /recipes/{user_id}", GetAllRecipesForUserHandler)
	router.HandleFunc("POST /recipes/update/{id}", UpdateRecipeHandler)
	router.HandleFunc("DELETE /recipes/delete/{id}", DeleteRecipeHandler)

	// GPT Routes
	router.HandleFunc("POST /nutribot/ask", AskNutribotHandler)
	router.HandleFunc("GET /nutribot/chats/{user_id}", GetUserChatsHandler)

	log.Println("Starting server at :8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}

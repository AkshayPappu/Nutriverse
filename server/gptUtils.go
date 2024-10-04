package main

import (
	"encoding/json"
	"io"
	"net/http"
)

func GetUserChatsHandler(w http.ResponseWriter, r *http.Request) {
	var response GetUserChatsResponse

	// get user_id from request
	user_id := r.PathValue("user_id")

	// get all chats for a user from dynamoDB
	chats, err := GetChats(user_id)
	if err != nil {
		response = GetUserChatsResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// return all chats for a user
	response = GetUserChatsResponse{
		Message: "Chats found",
		Status:  http.StatusOK,
		Chats:   chats,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func AskNutribotHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody NutribotRequestBody
	var response NutribotResponse

	// read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		response = NutribotResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer r.Body.Close()

	// extract information from request body
	if err := json.Unmarshal(body, &requestBody); err != nil {
		response = NutribotResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// get user object from dynamoDB
	user, err := GetUser(requestBody.UserId, requestBody.Email)
	if err != nil {
		response = NutribotResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// create prompt for GPT
	prompt, err := createPrompt(user, requestBody.UserPrompt)
	if err != nil {
		response = NutribotResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// call GPT model
	responseText, err := CallGPT(prompt, user.Id)
	if err != nil {
		response = NutribotResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// return response from GPT model
	response = NutribotResponse{
		Message:     responseText,
		Status:      http.StatusOK,
		GptResponse: responseText,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody LoginRequestBody
	var response LoginResponse
	//read the request
	body, err := io.ReadAll(r.Body)
	if err != nil {
		response = LoginResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer r.Body.Close()

	//extract info from request body
	if err := json.Unmarshal(body, &requestBody); err != nil {
		response = LoginResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	//validate user
	user, err := ValidateUser(requestBody.Email, requestBody.Password)
	if err != nil {
		response = LoginResponse{
			Message: err.Error(),
			Status:  http.StatusUnauthorized,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(response)
		return
	}

	//return user object
	response = LoginResponse{
		Message: "User found",
		Status:  http.StatusOK,
		User:    user,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	var response DefaultResponse
	var requestBody DefaultUserRequestBody

	// read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		response := DefaultResponse{
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
		response := DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// create user object to pass into the PutUser function
	user = User{
		Id:                  generateRandomString(16),
		Email:               requestBody.Email,
		Password:            requestBody.Password,
		City:                requestBody.City,
		State:               requestBody.State,
		Height:              requestBody.Height,
		Weight:              requestBody.Weight,
		DesiredWeight:       requestBody.DesiredWeight,
		CookingTimePerDay:   requestBody.CookingTimePerDay,
		ExerciseDaysPerWeek: requestBody.ExerciseDaysPerWeek,
		DietaryRestrictions: requestBody.DietaryRestrictions,
	}

	// attempt to put user into dynamoDB
	err = PutUser(user)
	if err != nil {
		response := DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	//create chat object for the user
	err = CreateChat(user.Id)
	if err != nil {
		response := DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// return success message after user is created
	fmt.Print(user.Id)
	response = DefaultResponse{
		Message: "User created successfully",
		Status:  http.StatusCreated,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	var response DefaultResponse
	var requestBody DefaultUserRequestBody

	//read the request
	body, err := io.ReadAll(r.Body)
	if err != nil {
		response = DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	defer r.Body.Close()

	//extract info from request body and id from url
	_id := r.PathValue("id")

	if err := json.Unmarshal(body, &requestBody); err != nil {
		response = DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	//create a new object to replace the current one

	user = User{
		Id:                  _id,
		Email:               requestBody.Email,
		Password:            requestBody.Password,
		City:                requestBody.City,
		State:               requestBody.State,
		Height:              requestBody.Height,
		Weight:              requestBody.Weight,
		DesiredWeight:       requestBody.DesiredWeight,
		CookingTimePerDay:   requestBody.CookingTimePerDay,
		ExerciseDaysPerWeek: requestBody.ExerciseDaysPerWeek,
		DietaryRestrictions: requestBody.DietaryRestrictions,
	}
	fmt.Println(user.Id)
	fmt.Println(user.Email)
	fmt.Println(user.Password)
	fmt.Println(user.City)
	fmt.Println(user.State)
	fmt.Println(user.Height)
	fmt.Println(user.Weight)
	fmt.Println(user.DesiredWeight)
	fmt.Println(user.CookingTimePerDay)
	fmt.Println(user.ExerciseDaysPerWeek)
	fmt.Println(user.DietaryRestrictions)

	//attempt to update user in dynamo
	err = UpdateUser(user)
	if err != nil {
		response = DefaultResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	//return success message user is updated
	response = DefaultResponse{
		Message: "User updated successfully",
		Status:  http.StatusOK,
		Object:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody GetUserRequestBody
	var response GetUserResponse

	//get id and email from request
	_id := r.PathValue("id")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		response := GetUserResponse{
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
		response := GetUserResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// get the user from dynamoDB
	user, err := GetUser(_id, requestBody.Email)
	if err != nil {
		response = GetUserResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}
	// return user object
	response = GetUserResponse{
		Message: "User found",
		Status:  http.StatusOK,
		User:    user,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

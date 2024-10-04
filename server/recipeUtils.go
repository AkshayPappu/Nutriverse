package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func CreateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var recipe Recipe
	var response DefaultResponse

	// Ensure the request is using multipart/form-data
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB max memory
		response := DefaultResponse{
			Message: "request Content-Type isn't multipart/form-data",
			Status:  http.StatusBadRequest,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Get file from request
	file, fileHeader, err := r.FormFile("file")
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
	defer file.Close()

	// Extract other form fields
	name := r.FormValue("name")
	userID := r.FormValue("user_id")
	date := r.FormValue("date")
	fmt.Println("user id: ", userID)
	fmt.Println("date: ", date)
	fmt.Println("name: ", name)

	// Upload the file to S3
	fileURL, err := UploadFileToS3(file, fileHeader, userID)
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

	// Create recipe object
	recipe = Recipe{
		Id:      "", // This should be generated by the database or another method
		UserId:  userID,
		Date:    date,
		FileUrl: fileURL,
		Name:    name,
	}

	// Attempt to put recipe into DynamoDB
	newRecipe, err := PutRecipe(recipe)
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

	// Return success message after recipe is created
	response = DefaultResponse{
		Message: "Recipe created successfully",
		Status:  http.StatusCreated,
		Object:  newRecipe,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func GetAllRecipesForUserHandler(w http.ResponseWriter, r *http.Request) {
	var response GetAllRecipesForUserResponse

	// get user_id from request
	user_id := r.PathValue("user_id")

	// get all recipes for a user from dynamoDB
	recipes, err := GetAllRecipesForUser(user_id)
	if err != nil {
		response = GetAllRecipesForUserResponse{
			Message: err.Error(),
			Status:  http.StatusInternalServerError,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// return all recipes for a user
	response = GetAllRecipesForUserResponse{
		Message: "Recipes found",
		Status:  http.StatusOK,
		Recipes: recipes,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func DeleteRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var response DefaultResponse
	var requestBody DeleteRecipeRequestBody

	// get parameters from request
	_id := r.PathValue("id")

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

	// extract _id from request body
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

	// attempt to delete recipe from dynamoDB
	err = DeleteRecipe(_id, requestBody.UserId)
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

	// return success message after recipe is deleted
	response = DefaultResponse{
		Message: "Recipe deleted successfully",
		Status:  http.StatusOK,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func UpdateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	var recipe Recipe
	var response DefaultResponse

	// Ensure the request is using multipart/form-data
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB max memory
		response = DefaultResponse{
			Message: "request Content-Type isn't multipart/form-data",
			Status:  http.StatusBadRequest,
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Get file from request but if it doesn't exist, it's okay
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		if err == http.ErrMissingFile {
			// If the file is missing, just log the event and continue
			fmt.Println("No file uploaded")
		} else {
			// If there is another error, return an internal server error response
			fmt.Println("error: ", err)
			response = DefaultResponse{
				Message: err.Error(),
				Status:  http.StatusInternalServerError,
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(response)
			return
		}
	} else {
		defer file.Close()
	}

	// Extract other form fields
	_id := r.FormValue("_id")
	name := r.FormValue("name")
	userID := r.FormValue("user_id")
	date := r.FormValue("date")
	fmt.Println("_id: ", _id)
	fmt.Println("user id: ", userID)
	fmt.Println("date: ", date)
	fmt.Println("name: ", name)

	// Upload the file to S3 if file exists
	var fileURL string
	if file != nil {
		fmt.Println("Uploading file")
		fileURL, err = UploadFileToS3(file, fileHeader, userID)
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
	} else {
		fmt.Println("getting already existing file")
		// If no file is uploaded, get the current recipe to retain the existing file URL
		recipe, err = GetRecipe(_id, userID)
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
		fileURL = recipe.FileUrl
	}

	// Create a new recipe object to replace the current one
	recipe = Recipe{
		Id:      _id,
		UserId:  userID,
		Date:    date,
		FileUrl: fileURL,
		Name:    name,
	}

	// Attempt to update recipe in DynamoDB
	err = UpdateRecipe(recipe)
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

	// Return success message after recipe is updated
	response = DefaultResponse{
		Message: "Recipe updated successfully",
		Status:  http.StatusOK,
		Object:  recipe,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

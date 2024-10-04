package main

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
)

// Insert recipe to dynamoDB
func PutRecipe(recipe Recipe) (r Recipe, err error) {
	id := aws.String(generateRandomString(16))
	recipe.Id = *id

	_, err = dynamo.PutItem(&dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: id,
			},
			"user_id": {
				S: aws.String(recipe.UserId),
			},
			"date": {
				S: aws.String(recipe.Date),
			},
			"file": {
				S: aws.String(recipe.FileUrl),
			},

			"name": {
				S: aws.String(recipe.Name),
			},
		},
		TableName: &RecipesTable,
	})

	return recipe, err
}

// uploads a file to s3 and returs the object url
func UploadFileToS3(file multipart.File, fileHeader *multipart.FileHeader, userID string) (string, error) {
	// Get filename from file header
	fileName := fileHeader.Filename
	fmt.Println("Uploading file: ", fileName)

	// Generate a unique identifier
	identifier := generateRandomString(16)

	// Split the filename into name and extension
	ext := filepath.Ext(fileName)
	baseName := strings.TrimSuffix(fileName, ext)

	// Create the new filename with the identifier
	newFileName := fmt.Sprintf("%s-%s%s", baseName, identifier, ext)
	key := fmt.Sprintf("%s/%s", userID, newFileName)

	// Upload file to S3
	_, err := s3client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(S3Bucket),
		Key:    aws.String(key),
		Body:   file,
	})

	if err != nil {
		return "", err
	}

	// Return the file URL
	return fmt.Sprintf("https://%s.s3.amazonaws.com/%s", S3Bucket, key), nil
}

// get recipe from dynamoDB
func GetRecipe(_id string, user_id string) (recipe Recipe, err error) {
	result, err := dynamo.GetItem(&dynamodb.GetItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(_id),
			},
			"user_id": {
				S: aws.String(user_id),
			},
		},
		TableName: &RecipesTable,
	})

	if err != nil {
		return recipe, err
	}

	recipe = Recipe{
		Id:      *result.Item["_id"].S,
		UserId:  *result.Item["user_id"].S,
		Date:    *result.Item["date"].S,
		FileUrl: *result.Item["file"].S,
		Name:    *result.Item["name"].S,
	}

	return recipe, err
}

// get all recipes for a user from dynamoDB
func GetAllRecipesForUser(user_id string) ([]Recipe, error) {
	var recipes []Recipe

	// Define the PartiQL query
	statement := "SELECT * FROM " + RecipesTable + " WHERE user_id = ?"

	input := &dynamodb.ExecuteStatementInput{
		Statement: aws.String(statement),
		Parameters: []*dynamodb.AttributeValue{
			{
				S: aws.String(user_id),
			},
		},
	}

	result, err := dynamo.ExecuteStatement(input)
	if err != nil {
		return recipes, err
	}

	for _, i := range result.Items {
		recipe := Recipe{
			Id:      *i["_id"].S,
			UserId:  *i["user_id"].S,
			Date:    *i["date"].S,
			FileUrl: *i["file"].S,
			Name:    *i["name"].S,
		}
		recipes = append(recipes, recipe)
	}

	return recipes, nil
}

// update recipe in dynamoDB
func UpdateRecipe(recipe Recipe) error {
	_, err := dynamo.UpdateItem(&dynamodb.UpdateItemInput{
		ExpressionAttributeNames: map[string]*string{
			"#A": aws.String("date"),
			"#B": aws.String("file"),
			"#C": aws.String("name"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":date": {
				S: aws.String(recipe.Date),
			},
			":file": {
				S: aws.String(recipe.FileUrl),
			},
			":name": {
				S: aws.String(recipe.Name),
			},
		},
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(recipe.Id),
			},
			"user_id": {
				S: aws.String(recipe.UserId),
			},
		},
		TableName:        &RecipesTable,
		UpdateExpression: aws.String("SET #A = :date, #B = :file, #C = :name"),
	})

	return err
}

// delete recipe from dynamoDB
func DeleteRecipe(_id string, user_id string) error {
	_, err := dynamo.DeleteItem(&dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(_id),
			},
			"user_id": {
				S: aws.String(user_id),
			},
		},
		TableName: &RecipesTable,
	})

	return err
}

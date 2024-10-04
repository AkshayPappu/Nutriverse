package main

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// check if user exists in the database
func ValidateUser(email string, password string) (user User, err error) {
	fmt.Println("Validating User")
	input := &dynamodb.QueryInput{
		TableName:              &UsersTable,
		IndexName:              aws.String("EmailPasswordIndex"),
		KeyConditionExpression: aws.String("email = :email AND password = :password"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":email": {
				S: aws.String(email),
			},
			":password": {
				S: aws.String(password),
			},
		},
	}

	result, err := dynamo.Query(input)
	if err != nil {
		return user, err
	}
	if len(result.Items) == 0 {
		err = errors.New("User not found")
		return user, err
	}

	//create new user return object
	weight, _ := strconv.Atoi(*result.Items[0]["weight"].N)
	desired_weight, _ := strconv.Atoi(*result.Items[0]["desired_weight"].N)
	cooking_time_per_day, _ := strconv.Atoi(*result.Items[0]["cooking_time_per_day"].N)
	exercise_days_per_week, _ := strconv.Atoi(*result.Items[0]["exercise_days_per_week"].N)

	user = User{
		Id:                  *result.Items[0]["_id"].S,
		Email:               *result.Items[0]["email"].S,
		Password:            *result.Items[0]["password"].S,
		City:                *result.Items[0]["city"].S,
		State:               *result.Items[0]["state"].S,
		Height:              *result.Items[0]["height"].S,
		Weight:              weight,
		DesiredWeight:       desired_weight,
		CookingTimePerDay:   cooking_time_per_day,
		ExerciseDaysPerWeek: exercise_days_per_week,
		DietaryRestrictions: *result.Items[0]["dietary_restrictions"].S,
	}

	return user, err

}

// insert user into dynamoDB
func PutUser(user User) error {
	_, err := dynamo.PutItem(&dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(user.Id),
			},
			"email": {
				S: aws.String(user.Email),
			},
			"password": {
				S: aws.String(user.Password),
			},
			"city": {
				S: aws.String(user.City),
			},
			"state": {
				S: aws.String(user.State),
			},
			"height": {
				S: aws.String(user.Height),
			},
			"weight": {
				N: aws.String(strconv.Itoa(user.Weight)),
			},
			"desired_weight": {
				N: aws.String(strconv.Itoa(user.DesiredWeight)),
			},
			"cooking_time_per_day": {
				N: aws.String(strconv.Itoa(user.CookingTimePerDay)),
			},
			"exercise_days_per_week": {
				N: aws.String(strconv.Itoa(user.ExerciseDaysPerWeek)),
			},
			"dietary_restrictions": {
				S: aws.String(user.DietaryRestrictions),
			},
		},
		TableName: &UsersTable,
	})

	return err
}

// Get User Object from DynamoDB
func GetUser(_id string, email string) (user User, err error) {
	result, err := dynamo.GetItem(&dynamodb.GetItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(_id),
			},
			"email": {
				S: aws.String(email),
			},
		},
		TableName: &UsersTable,
	})
	if err != nil {
		return user, err
	}
	if result.Item == nil {
		err = errors.New("User not found")
		return user, err
	}

	//create new user return object
	weight, _ := strconv.Atoi(*result.Item["weight"].N)
	desired_weight, _ := strconv.Atoi(*result.Item["desired_weight"].N)
	cooking_time_per_day, _ := strconv.Atoi(*result.Item["cooking_time_per_day"].N)
	exercise_days_per_week, _ := strconv.Atoi(*result.Item["exercise_days_per_week"].N)

	user = User{
		Id:                  *result.Item["_id"].S,
		Email:               *result.Item["email"].S,
		Password:            *result.Item["password"].S,
		City:                *result.Item["city"].S,
		State:               *result.Item["state"].S,
		Height:              *result.Item["height"].S,
		Weight:              weight,
		DesiredWeight:       desired_weight,
		CookingTimePerDay:   cooking_time_per_day,
		ExerciseDaysPerWeek: exercise_days_per_week,
		DietaryRestrictions: *result.Item["dietary_restrictions"].S,
	}

	return user, err
}

// update user item in dynamoDB
func UpdateUser(user User) error {
	_, err := dynamo.UpdateItem(&dynamodb.UpdateItemInput{
		ExpressionAttributeNames: map[string]*string{
			"#A": aws.String("password"),
			"#B": aws.String("city"),
			"#C": aws.String("state"),
			"#D": aws.String("height"),
			"#E": aws.String("weight"),
			"#F": aws.String("desired_weight"),
			"#G": aws.String("cooking_time_per_day"),
			"#H": aws.String("exercise_days_per_week"),
			"#I": aws.String("dietary_restrictions"),
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":password": {
				S: aws.String(user.Password),
			},
			":city": {
				S: aws.String(user.City),
			},
			":state": {
				S: aws.String(user.State),
			},
			":height": {
				S: aws.String(user.Height),
			},
			":weight": {
				N: aws.String(strconv.Itoa(user.Weight)),
			},
			":desired_weight": {
				N: aws.String(strconv.Itoa(user.DesiredWeight)),
			},
			":cooking_time_per_day": {
				N: aws.String(strconv.Itoa(user.CookingTimePerDay)),
			},
			":exercise_days_per_week": {
				N: aws.String(strconv.Itoa(user.ExerciseDaysPerWeek)),
			},
			":dietary_restrictions": {
				S: aws.String(user.DietaryRestrictions),
			},
		},
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(user.Id),
			},
			"email": {
				S: aws.String(user.Email),
			},
		},
		TableName:        &UsersTable,
		UpdateExpression: aws.String("SET #A = :password, #B = :city, #C = :state, #D = :height, #E = :weight, #F = :desired_weight, #G = :cooking_time_per_day, #H = :exercise_days_per_week, #I = :dietary_restrictions"),
	})

	return err
}

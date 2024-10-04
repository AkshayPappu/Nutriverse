package main

import (
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	_ "github.com/joho/godotenv/autoload"
)

// read env variables
var (
	apiKey    = os.Getenv("OPENAI_API_KEY")
	modelType = os.Getenv("OPENAI_MODEL")
)

// create prompt function
func createPrompt(user User, user_prompt string) (string, error) {
	prompt := fmt.Sprintf(`You are an AI assistant that helps users find ingredients and generate effective healthy, nutritious recipe meals based on their requirements based on caloric intake, weight gain/loss, price, time available to spend on cooking, and type of food. Develop the most efficient method to utilize the user's given location for purchasing recipes in relation to the amount of time and cost they are willing to spend along with the money and initial requirements that the meal is bound by.

	Whenever you provide a recipe, make sure to include the price per serving and nutritional label information per serving including metrics such as calories, sugar, saturated fat, and protein. Make sure to start the heading with “Recipe: ” 
	
	When providing answers, consider if users are attempting to gain/lose weight and within those options, are they especially only trying to lose weight or also trying to gain muscle/stay toned? Consider the amount of calories and mainly protein that a user may have to intake while in a deficit or surplus of some sort. For example, if the user has no intention of putting lean muscle on, consider having a significantly less amount of protein for the intended user… etc. 
	
	
	This is some information about the user that you will be helping: 
	Height: %s 
	Weight:	%d pounds
	Desired weight: %d pounds
	CookingTimePerDay: %d hours
	ExerciseDaysPerWeek: %d
	DietaryRestrictions: %s

	Here is the user's request: %s
	`, user.Height, user.Weight, user.DesiredWeight, user.CookingTimePerDay, user.ExerciseDaysPerWeek, user.DietaryRestrictions, user_prompt)

	err := SaveMessage(user.Id, "User", user_prompt)
	if err != nil {
		return "", err
	}

	return prompt, err
}

// calls the GPT model with the provided prompt
func CallGPT(prompt string, userId string) (string, error) {
	// Create a new OpenAI client
	/*llm, err := openai.New()
	if err != nil {
		return "", err
	}

	// Call the GPT model with the provided prompt
	response, err := llm.Call(context.Background(), prompt)
	if err != nil {
		return "", err
	}

	// Save the response to the chat object
	err = SaveMessage(userId, "Nutribot", response)
	if err != nil {
		return "", err
	}*/
	fmt.Println("Prompt: ", prompt)
	return "gpt call was successfully hit", nil
}

// creates chat object for every user
func CreateChat(userId string) error {
	_, err := dynamo.PutItem(&dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: aws.String(generateRandomString(16)),
			},
			"user_id": {
				S: aws.String(userId),
			},
			"messages": {
				L: []*dynamodb.AttributeValue{
					{
						M: map[string]*dynamodb.AttributeValue{
							"sender": {
								S: aws.String("Nutribot"),
							},
							"message": {
								S: aws.String("Hello! I'm Nutribot, your personal nutrition assistant. How can I help you today?"),
							},
							"timestamp": {
								S: aws.String(time.Now().Format(time.RFC3339)),
							},
						},
					},
				},
			},
		},
		TableName: &ChatsTable,
	})

	return err
}

// save message to chat object
func SaveMessage(userId string, sender string, text string) error {
	// find chat object with partiql query
	chat, err := dynamo.ExecuteStatement(&dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf("SELECT * FROM NutriverseChats WHERE user_id = '%s'", userId)),
	})
	if err != nil {
		return err
	}

	// update chat object with new message
	_, err = dynamo.UpdateItem(&dynamodb.UpdateItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"_id": {
				S: chat.Items[0]["_id"].S,
			},
			"user_id": {
				S: aws.String(userId),
			},
		},
		TableName:        &ChatsTable,
		UpdateExpression: aws.String("SET messages = list_append(messages, :m)"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":m": {
				L: []*dynamodb.AttributeValue{
					{
						M: map[string]*dynamodb.AttributeValue{
							"sender": {
								S: aws.String(sender),
							},
							"message": {
								S: aws.String(text),
							},
							"timestamp": {
								S: aws.String(time.Now().Format(time.RFC3339)),
							},
						},
					},
				},
			},
		},
	})

	return err
}

// get all chats from user
func GetChats(userId string) ([]Message, error) {
	// find chat object with partiql query
	chat, err := dynamo.ExecuteStatement(&dynamodb.ExecuteStatementInput{
		Statement: aws.String(fmt.Sprintf("SELECT * FROM NutriverseChats WHERE user_id = '%s'", userId)),
	})
	if err != nil {
		return nil, err
	}

	// create array of messages
	messages := []Message{}
	for _, m := range chat.Items[0]["messages"].L {
		message := Message{
			Sender:    *m.M["sender"].S,
			Text:      *m.M["message"].S,
			Timestamp: *m.M["timestamp"].S,
		}
		messages = append(messages, message)
	}

	return messages, nil
}

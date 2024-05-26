import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import { Adapter } from "next-auth/adapters";

const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.AUTH_DYNAMODB_ID as string,
        secretAccessKey: process.env.AUTH_DYNAMODB_SECRET as string,
    },
    region: process.env.AUTH_DYNAMODB_REGION,
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})

const adapter = DynamoDBAdapter(client, {
    tableName: "NutriverseUsers",
    partitionKey: "_id",
    sortKey: "email",
})

export const authOptions = {
    adapter: adapter as Adapter,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST,
              port: process.env.EMAIL_SERVER_PORT,
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
              }
            },
            from: process.env.EMAIL_FROM
          })
    ]

} satisfies NextAuthOptions;
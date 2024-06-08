import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dotenv from 'dotenv';
dotenv.config();

interface User {
    id: string;
    email: string;
    city: string;
    cookingTimePerDay: number;
    desiredWeight: number;
    dietaryRestrictions: string;
    exerciseDaysPerWeek: number;
    height: string;
    password: string;
    state: string;
    weight: number;
}

interface AuthResponse {
    status: number;
    user: User;
}

async function authenticate(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        let data = await response.json();
        data = data.user

        if (response.status !== 200) {
            throw new Error("Either the user does not exist or the password is incorrect");
        }

        const user: User = {
            id: data._id,
            email: data.email,
            city: data.city,
            cookingTimePerDay: data.cooking_time_per_day,
            desiredWeight: data.desired_weight,
            dietaryRestrictions: data.dietary_restrictions,
            exerciseDaysPerWeek: data.exercise_days_per_week,
            height: data.height,
            password: data.password,
            state: data.state,
            weight: data.weight
        };

        const authResponse: AuthResponse = {
            status: response.status,
            user: user
        };
        return authResponse;
    } catch (error) {
        return {
            status: 400,
            user: {
                id: "",
                email: "",
                city: "",
                cookingTimePerDay: 0,
                desiredWeight: 0,
                dietaryRestrictions: "",
                exerciseDaysPerWeek: 0,
                height: "",
                password: "",
                state: "",
                weight: 0
            }
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const { email, password } = credentials;
                try {
                    
                    const response = await authenticate(email, password);

                    if (response.status !== 200) {
                        throw new Error("Either the user does not exist or the password is incorrect");
                    }

                    return response.user;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.email = user.email;
                token.password = user.password;
                token.id = user.id;
                token.city = user.city;
                token.state = user.state;
                token.weight = user.weight;
                token.height = user.height;
                token.desiredWeight = user.desiredWeight;
                token.cookingTimePerDay = user.cookingTimePerDay;
                token.dietaryRestrictions = user.dietaryRestrictions;
                token.exerciseDaysPerWeek = user.exerciseDaysPerWeek;

                return token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token?.email) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    password: token.password as string,
                    city: token.city as string,
                    state: token.state as string,
                    weight: token.weight as number,
                    height: token.height as string,
                    desiredWeight: token.desiredWeight as number,
                    cookingTimePerDay: token.cookingTimePerDay as number,
                    dietaryRestrictions: token.dietaryRestrictions as string,
                    exerciseDaysPerWeek: token.exerciseDaysPerWeek as number
                };
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

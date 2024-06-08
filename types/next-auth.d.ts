import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    email: string;
    password: string;
    city: string;
    state: string;
    weight: number;
    height: string;
    desiredWeight: number;
    cookingTimePerDay: number;
    dietaryRestrictions: string;
    exerciseDaysPerWeek: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    passwrod: string;
    city: string;
    state: string;
    weight: number;
    height: string;
    desiredWeight: number;
    cookingTimePerDay: number;
    dietaryRestrictions: string;
    exerciseDaysPerWeek: number;
  }
}

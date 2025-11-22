import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
    adapter : PrismaAdapter(db),
    providers : [
        EmailProvider({
            server : {
                host : "smtp.gmail.com",
                port : 587,
                auth : {
                    user : process.env.EMAIL_SERVER_USER,
                    pass : process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from : process.env.EMAIL_FROM,
        }),
    ],
    session : {
        strategy : "database",
    },
    callbacks : {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        }
    }
};
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    console.log("session : ",session);
    console.log("session user",session?.user);
    console.log("session user id : ",session?.user.id);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({
            msg: "Unauthorized Access"
        }, {
            status: 401
        })
    }

    const userId = session.user.id;

    const { question, options, expiresAt } = await req.json();

    console.log("Question : ", question);
    console.log("Options : ", options);

    if (!question || options.length < 2) {
        return NextResponse.json({
            msg: "Question or Options cannot be empty."
        }, {
            status: 400
        })
    }

    try {
        const poll = await db.poll.create({
            data: {
                userId: userId,
                question: question,
                expiresAt : expiresAt ? new Date(expiresAt) : null,
                pollOption: {
                    create: options.map((optionText: string) => {
                        return ({ text: optionText });
                    })
                }
            },
        })

        return NextResponse.json({
            msg : "Successfully created."
        }, {
            status : 200,
        })
    } catch (e) {
        console.log(e);
        return NextResponse.json({ msg: "Unexpected error" }, {status:500});
    }
}
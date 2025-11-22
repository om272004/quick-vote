import { db } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { pollOptionId } = await req.json();

    const option = await db.pollOption.findUnique({
        where : {
            id : pollOptionId
        },
        include : {
            poll : true
        }
    })

    if (!option) {
        return NextResponse.json({ msg: "Option not found" }, { status: 404 });
    }

    if (option.poll.expiresAt && new Date() > new Date(option.poll.expiresAt)) {
        return NextResponse.json({msg : "Poll has expires"}, {status : 403})
    }

    try {
        const vote = await db.vote.create({
            data: {
                pollOptionId,
            }
        })

        await pusherServer.trigger(
            "poll-channel",
            "new-vote",
            { pollOptionId }
        )

        return NextResponse.json({
            msg: "Vote Submitted"
        }, {
            status: 201,
        })
    } catch (e) {
        console.log(e);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 })
    }
}
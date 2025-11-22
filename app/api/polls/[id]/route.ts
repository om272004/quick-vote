import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function DELETE(req: Request,{params} : {params : Promise<{id : string}>}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
    }

    const {id} = await params;

    try {
        const poll = await db.poll.findUnique({
            where: {
                id
            }
        });

        if (!poll || !poll.userId === session.user.id) {
            return NextResponse.json({ msg: "Forbidden" }, { status: 403 });
        }

        await db.poll.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ msg: "Deleted" }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ msg: "Error" }, { status: 500 })
    }
}
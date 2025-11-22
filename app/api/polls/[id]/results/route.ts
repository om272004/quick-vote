import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET (
    req : Request,
    {params} : {
        params : Promise<{id : string}>
    }
) {
    const {id} = await params;

    try  {
        const optionsWithVoteCount = await db.pollOption.findMany({
            where : {
                pollId : id,
            },
            include : {
                _count : {
                    select : {
                        vote : true
                    }
                }
            }
        })

        return NextResponse.json(optionsWithVoteCount);
    } catch (e) {
        return NextResponse.json({
            msg : "Error occured"
        }, {
            status : 500
        })
    }
}
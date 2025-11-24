import { VoteModule } from "@/app/components/VoteModule";
import { db } from "@/lib/prisma";


interface PollPageProps {
  params: {
    id: string;
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;

  if (!id) {
    return <div>Invalid Poll ID.</div>;
  }

  const poll = await db.poll.findUnique({
    where: {
      id: id, 
    },
    include: {
      pollOption: true,
    },
  });

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-80 lg:max-w-150 bg-white/10 backdrop-blur-lg p-8 rounded-xl">
      <h1 className="text-center font-extrabold text-4xl bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent mb-4">{poll.question}</h1>
      <div className="flex flex-col gapy-y-2">
        <VoteModule poll={poll} />
      </div>
      </div>
    </div>
  );
}
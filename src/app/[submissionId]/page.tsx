import {prisma} from "@/server";
import {notFound} from "next/navigation";
import SubmissionButtons from "@/app/[submissionId]/buttons";

export default async function Page({params: { submissionId }}: {params: { submissionId: string }}) {
    const game = await prisma.game.findFirst({
        where: { id: { equals: submissionId } }
    }) ?? notFound()

    return (
        <main className={"flex min-h-screen flex-col items-center gap-6 sm:gap-12 p-6 sm:p-12"}>

            <h1 className={"text-xl"}>Submission {game.id}</h1>

            <div className={"w-full flex-grow relative"} dangerouslySetInnerHTML={{ __html: game.embedUrl }}/>

            <SubmissionButtons game={game}/>

        </main>
    )
}
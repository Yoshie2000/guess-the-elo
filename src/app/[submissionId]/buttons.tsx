"use client";

import {serverClient} from "@/app/_trpc/serverClient";
import {Button} from "@/components/ui/button";
import {trpc} from "@/app/_trpc/client";
import {useRouter} from "next/navigation";

export default function SubmissionButtons(
    {
        game
    }: {
        game: Awaited<ReturnType<(typeof serverClient)["getSubmissions"]>>[number]
    }
) {

    const completeSubmission = trpc.editSubmission.useMutation()
    const router = useRouter()

    const showOriginal = () => {
        window.open(game.url, "_blank")
    }

    const complete = (value: boolean) => {
        completeSubmission.mutate({
            complete: value,
            id: game.id
        }, {
            onSuccess: () => router.push("/")
        })
    }

    return (
        <div className={"flex gap-4"}>
            <Button onClick={showOriginal}>Show original game</Button>

            {!game.completed ?
                <Button onClick={() => complete(true)} variant={"successful"}>Mark as complete</Button>
                :
                <Button onClick={() => complete(false)} variant={"destructive"}>Reset</Button>
            }
        </div>
    )
}
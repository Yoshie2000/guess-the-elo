"use client";

import {useEffect, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {trpc} from "@/app/_trpc/client";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {serverClient} from "@/app/_trpc/serverClient";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import Link from "next/link";
import {Card} from "@/components/ui/card";
import {useRouter} from "next/navigation";

export default function Games(
    {
        games
    }: {
        games: Awaited<ReturnType<(typeof serverClient)["getSubmissions"]>>
    }
) {
    const [gameURL, setGameURL] = useState("")
    const extractedURL = gameURL.match(/https:\/\/(www\.)?chess\.com\/((game\/live)|(game\/daily)|(live\/game)|(daily\/game))\/[0-9]+/g)?.[0]

    const {toast} = useToast()

    const getSubmissions = trpc.getSubmissions.useQuery(undefined, {
        initialData: games,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    const addSubmission = trpc.addSubmission.useMutation({
        onSuccess: () => {
            getSubmissions.refetch()
            setGameURL("")
            toast({
                title: "Submission successful!",
                description: "You'll find your anonymized game below in the submission list.",
                variant: "successful"
            })
        }
    })

    const router = useRouter()
    useEffect(() => {
        router.refresh()
    }, [])
    useEffect(() => {
        getSubmissions.refetch()
    }, [games])

    return (
        <main className={"flex min-h-screen-dvh flex-col items-center gap-6 sm:gap-12 p-6 sm:p-12"}>
            <h1 className={"text-xl"}>Guess The Elo Submission</h1>

            <Card className={"flex gap-4 flex-col w-full p-4"}>

                <div className={"flex gap-4 w-auto"}>
                    <Input className={"flex-grow max-w-[24rem]"}
                           placeholder={"Paste chess.com share text (must include a game url)"} value={gameURL}
                           onChange={e => setGameURL(e.target.value)}/>

                    {!addSubmission.isLoading ?
                        <Button className={"whitespace-nowrap"}
                                disabled={!extractedURL}
                                onClick={() => extractedURL && addSubmission.mutate(extractedURL)}>
                            Submit Game
                        </Button>
                        :
                        <Button className={"whitespace-nowrap gap-2"} disabled={true}>
                            <Loader/>
                            Please wait
                        </Button>
                    }
                </div>

            </Card>

            <h1 className={"text-xl"}>Submitted Games</h1>

            <Card className={"w-full p-4 gap-4 flex"}>
                {
                    getSubmissions.data.map(game => (
                        <Link key={game.url} href={`/${game.id}`}>
                            <Image src={game.screenshotUrl} alt={"Chess Game"} width={200} height={200} className={"border"}/>
                        </Link>
                    ))
                }
                {getSubmissions.data.length === 0 && <small>There are no open submissions at the moment :/</small>}
            </Card>

        </main>
    )
}
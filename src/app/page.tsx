import {serverClient} from "@/app/_trpc/serverClient";
import Games from "@/app/games";

export default async function Home() {
    const games = await serverClient.getSubmissions()

    return <Games games={games}/>
}

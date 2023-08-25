import {router, publicProcedure} from "./trpc";
import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {embedGame, scrapePgn, screenshotGame} from "@/lib/scrape";
import {revalidatePath} from "next/cache";

export const prisma = new PrismaClient();

export const appRouter = router({
    getSubmissions: publicProcedure.query(async () => {
        const games = await prisma.game.findMany({
            where: { completed: { equals: false } }
        })
        return games.sort((a, b) => Number(a.completed) - Number(b.completed))
    }),
    addSubmission: publicProcedure.input(z.string()).mutation(async (args) => {
        const url = args.input

        const existing = await prisma.game.findFirst({
            where: { url: { equals: url } }
        })
        if (existing) throw "Game with URL already exists!"

        const pgn = await scrapePgn(url)

        const white = pgn.split('[White "')[1].split('"]')[0]
        const black = pgn.split('[Black "')[1].split('"]')[0]
        const whiteElo = Number(pgn.split('[WhiteElo "')[1].split('"]')[0])
        const blackElo = Number(pgn.split('[BlackElo "')[1].split('"]')[0])

        const newPgn =
            '[WhiteTitle "GM"]\n[BlackTitle "GM"]\n' +
            pgn.replaceAll(white, "White")
                .replaceAll(black, "Black")
                .replaceAll(String(whiteElo), '-')
                .replaceAll(String(blackElo), '-')

        const promises = [screenshotGame(newPgn), embedGame(newPgn)];
        const [screenshotUrl, embedUrl] = await Promise.allSettled(promises)
        if (screenshotUrl.status === "rejected" || embedUrl.status === "rejected") throw "Screenshot or embedding failed"

        await prisma.game.create({
            data: {
                url: url,
                pgnOriginal: pgn,
                pgnAnonymized: newPgn,
                completed: false,
                screenshotUrl: screenshotUrl.value,
                embedUrl: embedUrl.value,
            }
        })

        await revalidatePath("/")
    }),
    editSubmission: publicProcedure.input(
        z.object({
            id: z.string(),
            complete: z.boolean()
        })
    ).mutation(async (args) => {
        const {id, complete} = args.input;

        await prisma.game.update({
            where: {
                id: id
            },
            data: {
                completed: complete
            }
        })

        await revalidatePath(`/${id}`)
        await revalidatePath("/")
    })
});

export type AppRouter = typeof appRouter;
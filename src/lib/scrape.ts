import puppeteer, {Page} from "puppeteer";

export async function scrapePgn(url: string) {
    const browser = await puppeteer.launch({
        headless: "new"
    })

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" })

    const cookieBannerButton = await page.waitForSelector("button.osano-cm-dialog__close.osano-cm-close")
    await cookieBannerButton?.click()

    const shareButton = await page.waitForSelector("button[data-cy='sidebar-share-button'], button[data-cy='daily-games-share-btn']")
    await shareButton?.click()
    await shareButton?.click()

    const pgnTextarea = await page.waitForSelector("textarea.ui_v5-textarea-component.share-menu-tab-pgn-textarea")
    const pgn = await pgnTextarea?.evaluate(el => el.value)

    await browser.close()

    if (!pgn) throw "PGN Textarea not found"
    return pgn
}

async function lichessShare(pgn: string) {
    const browser = await puppeteer.launch({
        headless: "new"
    })

    const page = await browser.newPage()
    await page.goto("https://lichess.org/paste")

    await page.type("textarea#form3-pgn", pgn)

    const importButton = await page.waitForSelector("button.submit.button.text")
    await importButton?.click()

    await page.waitForNavigation({waitUntil: 'networkidle0'});

    const shareTab = await page.waitForSelector("span[data-panel='fen-pgn']")
    await shareTab?.click()

    return [browser, page] as const
}

export async function screenshotGame(pgn: string) {
    const [browser, page] = await lichessShare(pgn)

    const lastMoveButton = await page.waitForSelector("button[data-act='last']")
    await lastMoveButton?.click()

    const newPagePromise: Promise<Page> = new Promise(x => browser.once("targetcreated", target => x(target.page())))

    const screenshotButton = await page.waitForSelector("a.text.text.position-gif")
    await screenshotButton?.click()

    const newPage = await newPagePromise;
    const screenshotUrl = newPage.url();

    await browser.close()

    return screenshotUrl.replaceAll("theme=brown", "theme=green")
}

export async function embedGame(pgn: string) {
    const [browser, page] = await lichessShare(pgn)

    const embedButton = await page.waitForSelector("a.text.embed-howto")
    await embedButton?.click()

    const embedText = await page.waitForSelector("div#modal-wrap pre")
    const embedLink = await embedText?.evaluate(el => el.innerText)

    await browser.close()

    if (!embedLink) throw "Embed Link not working!"
    return embedLink.replaceAll("theme=auto", "theme=green")
}
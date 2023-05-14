import puppeteer from 'puppeteer'

const continue_login_tamu = async(page) => {
    const no_button = await page.waitForSelector('#idBtn_Back')

    await no_button.click()
    await page.waitForNavigation()

    console.log("Finished logging in!")
}

const verify_duo = async (page) => {
    console.log('Waiting for DuoMobile verification...')

    const trust_button = await page.waitForSelector('#trust-browser-button')

    console.log('DuoMobile verification finished...')

    await trust_button.click()
    await page.waitForNavigation()

    await continue_login_tamu(page)
}

const login_tamu = async (browser, username, password) => {
    console.log('Logging in...')

    const page = await browser.newPage()

    await page.goto('https://tamu.collegescheduler.com/')
    await page.waitForNavigation()

    const email_input = await page.waitForSelector('#i0116')
    await email_input.type(username)

    const next_button = await page.waitForSelector('#idSIButton9')
    await next_button.click()

    const password_input = await page.waitForSelector('#i0118') 
    await password_input.type(password)
    
    await page.waitForTimeout(2000);

    const login_button = await page.waitForSelector('#idSIButton9')
    await login_button.click()

    await page.waitForNavigation()

    await verify_duo(page)

    return page
}

const start_login = async (username, password) => {
    const browser = await puppeteer.launch({
        headless: "new",
    })

    const page = await login_tamu(browser, username, password)
   
    return [browser, page]
}

export default start_login
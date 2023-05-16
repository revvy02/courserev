import chalk from 'chalk'
import inquirer from 'inquirer'
import { program } from 'commander'

import login from './login.js'
import loop from './loop.js'
import scan from './scan.js'

import { tag, maroon_label } from './sidewalk.js'

program
    .name('courserev')
    .version('0.0.1')
    .description('CLI that notifies you when seats open in TAMU courses')

    .option('-e, --email <email>', 'Specify an email for notifications')
    .option('-r, --rate <rate>', 'Specify how often it checks in seconds')

    .action(async (options) => {
        console.log('use', tag, 'wisely')

        const { netid, password } = await inquirer.prompt([
            { type: 'input', name: 'netid', prefix: tag, message: maroon_label('enter netid:') },
            { type: 'password', name: 'password', prefix: tag, mask: true, message: maroon_label('enter password:') },
        ])

        const email = `${netid}@tamu.edu`

        const [browser, page] = await login(email, password)

        const state = {
            targets: [],
            email: options.email ? options.email : email,
            rate: options.rate ? options.rate * 1000 : 120 * 1000,
        }

        setInterval(() => { scan(state, page).catch(console.log) }, state.rate)

        await loop(state, browser, page)
    })

    .parse(process.argv)


      

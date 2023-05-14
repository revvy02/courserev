import axios from 'axios'
import chalk from 'chalk'
import inquirer from 'inquirer'

import { tag, red_label, maroon_label, grey_label } from './sidewalk.js'

import prompt_add_target from './prompt_add_target.js'
import prompt_remove_target from './prompt_remove_target.js'
import prompt_view_targets from './prompt_view_targets.js'
import prompt_set_email from './prompt_set_email.js'

const prompt_choose_action = async (state) => {
    const action_question = {
        type: 'list',
        name: 'value',
        prefix: tag,
        message: 'choose',
        choices: [
            { name: maroon_label('add target'), value: 'add target' },
            { name: maroon_label('remove target'), value: 'remove target' },
            { name: maroon_label('view targets'), value: 'view targets' },
            { name: `${ maroon_label('set email') } - ${ grey_label(state.email) }`, value: 'set email' },
            { name: red_label('exit'), value: 'exit' },
        ]
    }
    
    const answer = await inquirer.prompt([action_question])
    const action = answer.value

    return action
}

const loop = async (state, browser, page) => {
    while (true) {
        const action = await prompt_choose_action(state)

        if (action == 'add target') {
            await prompt_add_target(state, page)
        } else if (action == 'remove target') {
            await prompt_remove_target(state, page)
        } else if (action == 'view targets') {
            await prompt_view_targets(state, page)
        } else if (action == 'set email') {
            await prompt_set_email(state)
        } else if (action == 'exit') {
            process.exit(0)
        }
    }
}

export default loop
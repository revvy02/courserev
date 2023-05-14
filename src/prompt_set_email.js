import inquirer from 'inquirer'

import { grey_label, maroon_label, dark_title_label, green_label } from './sidewalk.js'

const prompt_confirm_set_email = async (state, email) => {
   const { value } = await inquirer.prompt([{
        prefix: dark_title_label('set email'),
        type: 'confirm',
        name: 'value',
        message: `confirm set email from ${ grey_label(state.email) } -> ${ green_label(`${ email }`) }`,
    }])

    return value
}

const prompt_set_email = async (state) => {
    const { email } = await inquirer.prompt([{ 
        type: 'input', name: 'email', prefix: dark_title_label('set email'), message: maroon_label('enter new email:') 
    }])

    const confirm = await prompt_confirm_set_email(state, email)
    if (!confirm) return

    state.email = email
}

export default prompt_set_email
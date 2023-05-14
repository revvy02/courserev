import inquirer from 'inquirer'
import inquirerAutocomplete from 'inquirer-autocomplete-prompt';

import { tag, red_label } from './sidewalk.js'

inquirer.registerPrompt('autocomplete', inquirerAutocomplete);

const cancel_option = {
    name: red_label.bold('return'),
    value: 'cancel'
}

const prompt_autocomplete_options = async ({ prefix, message, getOptions, filterOptions, mapOptionName, mapOptionValue }) => {
    const promise = getOptions()

    const question = { 
        type: 'autocomplete',
        prefix: prefix,
        name: 'value', 
        message: message,
        source: (_, input = '') => new Promise(resolve => {
            promise.then((options) => {
                const result = options
                    .filter(option => filterOptions(option, input))
                    .map(option => ({ name: mapOptionName ? mapOptionName(option) : option, value: mapOptionValue ? mapOptionValue(option) : option }))

                result.push(cancel_option)

                resolve(result)
            })
        })
    }

    const option = await inquirer.prompt([question])
    const value = option.value

    return option.value
}

export default prompt_autocomplete_options
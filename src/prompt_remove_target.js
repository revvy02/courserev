import inquirer from 'inquirer'

import prompt_autocomplete_options from './prompt_autocomplete_options.js'
import { tag, maroon_label, purple_label, green_label, dark_title_label } from './sidewalk.js'
import { get_term_options, get_target_options, prompt_choose_term } from './prompt_view_targets.js'

const prompt_choose_target = async (state, term) => {
    return await prompt_autocomplete_options({
        prefix: dark_title_label('remove target'),
        message: 'target:',
        getOptions: async () => get_target_options(state, term),
        mapOptionName: ({ value }) => `${ maroon_label(`${ value.subject.short } ${ value.course.number }`) } - ${ maroon_label(value.section.sectionNumber) } w/ ${ value.section.instructor[0].name }`,
        filterOptions: ({ value }, input) => (value.section.sectionNumber.indexOf(input) != -1) || (value.course.titleLong.toLowerCase().indexOf(input.toLowerCase()) != -1),
    })
}

const prompt_confirm_remove_target = async (target) => {
    const { value } = await inquirer.prompt([{
        prefix: dark_title_label('remove target'),
        type: 'confirm',
        name: 'value',
        message: `confirm remove target ${ purple_label(target.term.title) } / ${ green_label(`${ target.subject.short } ${ target.course.number }`) } - ${ green_label(target.section.sectionNumber) }`,
    }])
 
    return value
}

const prompt_remove_target = async (state, page) => {
    const term = await prompt_choose_term(state, dark_title_label('remove target'))
    if (term == 'cancel') return

    const target = await prompt_choose_target(state, term)
    if (target == 'cancel') return

    const confirm = await prompt_confirm_remove_target(target.value)
    if (!confirm) return

    state.targets.splice(target.index, 1)
}

export default prompt_remove_target
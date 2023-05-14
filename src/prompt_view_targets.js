import inquirer from 'inquirer'
import { table, getBorderCharacters } from 'table'

import prompt_autocomplete_options from './prompt_autocomplete_options.js'
import get_target_short_str from './get_target_short_str.js'
import { tag, maroon_label, purple_label, blue_label, dark_title_label } from './sidewalk.js'

export const get_term_options = (state) => {
    const term_options = []
    const there = {}

    for (const target of state.targets) {
        if (!there[target.term.id]) {
            there[target.term.id] = true
            term_options.push(target.term)
        }
    }

    return term_options
}

export const get_target_options = (state, term) => {
    return state.targets
    .map((target, index) => ({ value: target, index }))
    .filter(target => target.value.term.id == term.id)
}

export const prompt_choose_term = async (state, prefix) => {
    return await prompt_autocomplete_options({
        prefix: prefix,
        message: 'term:',
        getOptions: async () => get_term_options(state),
        mapOptionName: (option) => maroon_label(option.title),
        filterOptions: (option, input) => option.title.toLowerCase().indexOf(input.toLowerCase()) != -1,
    })
    
}

const display_targets = (state, term) => {
    const target_options = get_target_options(state, term)
    const data = [['target', 'subject', 'course', 'section', 'instructor', 'seats']]
    
    for (const { value } of target_options) {
        const {subject, course, section } = value

        data.push([
            blue_label.bold(get_target_short_str(value)),
            purple_label(subject.title),
            purple_label(course.title),
            purple_label(section.sectionNumber),
            purple_label(section.instructor[0].name),
            purple_label(section.openSeats.toString())
        ])
    }

    console.log(table(data, {
        border: getBorderCharacters('void'),
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 1
        },
        drawHorizontalLine: () => false
    }))
}

const prompt_view_targets = async (state, page) => {
    const term = await prompt_choose_term(state, dark_title_label('view targets'))
    if (term == 'cancel') return

    display_targets(state, term)
}

export default prompt_view_targets
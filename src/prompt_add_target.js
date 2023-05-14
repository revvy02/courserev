import inquirer from 'inquirer'

import prompt_autocomplete_options from './prompt_autocomplete_options.js'
import { tag, grey_label, purple_label, green_label, maroon_label, dark_title_label } from './sidewalk.js'

import { get_term_options, get_subject_options, get_course_options, get_section_options } from './api.js'

const prompt_choose_term = async (page) => {
    return await prompt_autocomplete_options({
        prefix: dark_title_label('add target'),
        message: 'term:',
        getOptions: async () => await get_term_options(page),
        mapOptionName: (option) => maroon_label(option.title),
        filterOptions: (option, input) => option.title.toLowerCase().indexOf(input.toLowerCase()) != -1,
    })
}

const prompt_choose_subject = async (page, term) => {
    return await prompt_autocomplete_options({
        prefix: dark_title_label('add target'),
        message: 'subject:',
        getOptions: async () => await get_subject_options(page, term),
        mapOptionName: (option) => maroon_label(option.title),
        filterOptions: (option, input) => option.title.toLowerCase().indexOf(input.toLowerCase()) != -1,
        
    })
}

const prompt_choose_course = async (page, term, subject) => {
    return await prompt_autocomplete_options({
        prefix: dark_title_label('add target'),
        message: 'course:',
        getOptions: async () => await get_course_options(page, term, subject),
        mapOptionName: (option) => maroon_label(option.displayTitle),
        filterOptions: (option, input) => option.displayTitle.toLowerCase().indexOf(input.toLowerCase()) != -1,
        
    })
}

const prompt_choose_section = async (state, page, term, subject, course) => {
    return await prompt_autocomplete_options({
        prefix: dark_title_label('add target'),
        message: 'section:',
        getOptions: async () => {
            const options = await get_section_options(page, term, subject, course)
            options.sort((a, b) => a.openSeats < b.openSeats ? -1 : (a.openSeats == b.openSeats ? 0 : 1))

            return options
        },
        mapOptionName: (option) => (option.openSeats == 0 ? maroon_label : grey_label)(`${ option.sectionNumber } - ${ option.instructor[0].name } - ${ option.openSeats } seats`),
        filterOptions: (option, input) => 
            ((option.sectionNumber.indexOf(input) != -1) || (option.instructor[0].name.toLowerCase().indexOf(input.toLowerCase()) != -1))
            && (state.targets.find(target => (target.term.id == term.id && target.subject.id == subject.id && target.course.id == course.id && target.section.id == option.id)) == null)
    })
}

const prompt_confirm_add_target = async (term, subject, course, section) => {
   const { value } = await inquirer.prompt([{
        prefix: dark_title_label('add target'),
        type: 'confirm',
        name: 'value',
        message: `confirm add target ${ purple_label(term.title) } / ${ green_label(`${ subject.short } ${ course.number }`) } - ${ green_label(section.sectionNumber) }`,
    }])

    return value
}

const prompt_add_target = async (state, page) => {
    const term = await prompt_choose_term(page)
    if (term == 'cancel') return

    const subject = await prompt_choose_subject(page, term)
    if (subject == 'cancel') return

    const course = await prompt_choose_course(page, term, subject)
    if (course == 'cancel') return

    const section = await prompt_choose_section(state, page, term, subject, course)
    if (section == 'cancel') return

    const confirm = await prompt_confirm_add_target(term, subject, course, section)
    if (!confirm) return

    state.targets.push({ term, subject, course, section })
}

export default prompt_add_target
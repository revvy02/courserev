import axios from 'axios'

const get_cookie_header = async (page) => {
    const cookies = await page.cookies()
    const cookie_header = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

    return cookie_header
}  

export const get = async (url, page) => {
    const response = await axios.get(url, {
        headers: {
            Cookie: await get_cookie_header(page)
        }
    })

    return response.data
}

export const format_term = (term) => term.id.replace(/ /g, '%20')

export const get_term_options = async (page) => {
    const result = await get('https://tamu.collegescheduler.com/api/app-data', page)
    const term_options = result.terms

    return term_options
}

export const get_subject_options = async (page, term) => {
    const result = await get(`https://tamu.collegescheduler.com/api/terms/${ format_term(term) }/subjects`, page)

    return result
}

export const get_course_options = async (page, term, subject) => {
    const result = await get(`https://tamu.collegescheduler.com/api/terms/${ format_term(term) }/subjects/${ subject.id }/courses`, page)

    return result
}

export const get_section_options = async (page, term, subject, course) => {
    const result = await get(`https://tamu.collegescheduler.com/api/terms/${ format_term(term) }/subjects/${ subject.id }/courses/${ course.number }/regblocks`, page)
    const section_options = result.sections

    return section_options
}
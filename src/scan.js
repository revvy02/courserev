import { get_section_options } from './api.js'
import { createTransport } from 'nodemailer'
import { table, getBorderCharacters } from 'table'

import get_target_short_str from './get_target_short_str.js'

const transporter = createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const email_changes = async (state, body) => {
    const options = {
        from: 'courserev@outlook.com',
        to: state.email,
        subject: 'courserev seat changes',
        text: body,
    }

    transporter.sendMail(options, (err, info) => {
        if (err) { 
            console.log(err)
        }
    })
}

const scan = async (state, page) => {
    const targets = [...state.targets]
    const cache = {}
    const lines = []

    while (targets.length > 0) {
        const target = targets[targets.length - 1]

        if (cache[target.course.id]) {
            const section = cache[target.course.id].find(section => section.sectionNumber == target.section.sectionNumber)

            const oldSeats = target.section.openSeats
            const newSeats = section.openSeats
            
            if (newSeats != oldSeats) {
                lines.push([get_target_short_str(target), `| ${ oldSeats } seats --> ${ newSeats } seats`])
            }

            target.section = section
            targets.pop()
        } else {
            cache[target.course.id] = await get_section_options(page, target.term, target.subject, target.course)
        }
    }

    if (lines.length > 0) {
        email_changes(state, table(lines, {
            border: getBorderCharacters('void'),
            columnDefault: {
                paddingLeft: 0,
                paddingRight: 4
            },
            columns: [
                { alignment: 'right' },
            ],
            drawHorizontalLine: () => false,
        }))
    }
}

export default scan
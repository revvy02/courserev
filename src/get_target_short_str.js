import { blue_label } from './sidewalk.js'

const get_target_short_str = ({ subject, course, section }) => {
    return `${ subject.short } ${ course.number } - ${ section.sectionNumber }`
}

export default get_target_short_str
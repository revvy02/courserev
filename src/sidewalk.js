import chalk from 'chalk'

export const maroon = '#712F2F'
export const dark_maroon = '#572b2b'

export const blue = '#7BACD3'
export const purple = '#9C6DA6'
export const green = '#80C890'
export const red = '#E34C4C'
export const grey = '#808080'


export const maroon_label = chalk.hex(maroon)
export const blue_label = chalk.hex(blue)
export const purple_label = chalk.hex(purple)
export const green_label = chalk.hex(green)
export const red_label = chalk.hex(red)
export const grey_label = chalk.hex(grey)

export const title_label = str => chalk.bgHex(maroon).white.bold(` ${ str } `)
export const dark_title_label = str => chalk.bgHex(dark_maroon).white.bold(` ${ str } `)

export const tag = title_label('courserev')


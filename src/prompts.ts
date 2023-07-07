/*
 *  Asks questions for required configuration if not existing.
 *  Created On 07 July 2023
 */

import chalk from 'chalk'
import { config } from './config'

export function question(question: string, clear = false) {
    const before = `${chalk.cyanBright('?')} ${question} ${chalk.gray('›')}`
    const after = (answer: string) => `${chalk.greenBright('✔')} ${question} ${chalk.gray('·')} ${chalk.greenBright(answer)}`

    const answer = prompt(before)
    if (clear) {
        process.stdout.write(`\x1b[A${' '.repeat(after(answer || '').length)}\r`)
    } else {
        process.stdout.write(`\x1b[A${after(answer || '')}\n`)
    }

    return answer || ''
}

function askAndSave(key: string, ques: string) {
    if (!config.has(key)) {
        config.set(key, question(ques))
    }
}

export async function populateConfig() {
    askAndSave('keys.openai', 'What is your OpenAI key?')
    askAndSave('keys.todoist', 'What is your Todoist key?')
    askAndSave('todoist.projectId', 'What is the Todoist project ID?')
}

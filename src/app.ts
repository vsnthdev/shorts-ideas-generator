/*
 *  Adds more content to Todoist.
 *  Created On 23 April 2023
 */

import { config } from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import { TodoistApi } from '@doist/todoist-api-typescript'

const PROJECT_ID = '2310990769'
const TASKS_TO_ADD = 10

config()

const todoist = new TodoistApi(process.env.TODOIST_TOKEN as string)
const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_KEY
})
const openAi = new OpenAIApi(openAIConfig)

const tasks = await todoist.getTasks({
    projectId: PROJECT_ID
})

const prompt = `Create a list of ${TASKS_TO_ADD} similar topics from the list below, which are not already in the list:\n\n${tasks.map((task, i) => `${i + 1}. ${task.content.trim()}`).join('\n')}\n\nAnd only with the list, without numbers in the beginning, with each task in each line.`

const res = await openAi.createChatCompletion({
    model: 'gpt-4',
    messages: [
        { role: 'user', content: prompt }
    ]
})

const lines = res.data.choices[0].message?.content.split('\n')

const promises: Promise<any>[] = []

if (lines) {
    for (const line of lines) {
        promises.push(
            todoist.addTask({
                content: line.trim(),
                projectId: PROJECT_ID,
            })
        )
    }
}

await Promise.all(promises)
console.log('Added ✅')
console.log(lines?.join('\n'))

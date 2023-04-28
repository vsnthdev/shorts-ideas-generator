/*
 *  Adds more content to Todoist.
 *  Created On 23 April 2023
 */

// Run the following command 👇
// pnpm exec tsx ./src/app.ts

import { config } from 'dotenv'
import { randomUUID } from 'crypto'
import { Configuration, OpenAIApi } from 'openai'

const PROJECT_ID = '2310990769'
const TASKS_TO_ADD = 10

config()

const allCompletedTasks = await fetch(`https://api.todoist.com/sync/v9/completed/get_all`, {
    headers: {
        Authorization: `Bearer ${process.env.TODOIST_TOKEN}`
    }
}).then(res => res.json())

const completedTasks = allCompletedTasks.items.filter(task => task.project_id == PROJECT_ID)

const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_KEY
})
const openAi = new OpenAIApi(openAIConfig)

const prompt = `Create a list of ${TASKS_TO_ADD} different topics in the same domain from the list below, which are not already in the list:\n\n${completedTasks.map((task, i) => `${i + 1}. ${task.content.trim()}`).join('\n')}\n\nAnd only with the list, without numbers in the beginning, with each task in each line.`

const res = await openAi.createChatCompletion({
    model: 'gpt-4',
    messages: [
        { role: 'user', content: prompt }
    ]
})

const lines = res.data.choices[0].message?.content.split('\n').map(line => line.trim()).filter(line => Boolean(line))

const promises: Promise<any>[] = []

if (lines) {
    for (const line of lines) {
        promises.push(
            fetch('https://api.todoist.com/rest/v2/tasks', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.TODOIST_TOKEN}`,
                    'Content-Type': 'application/json',
                    'X-Request-Id': randomUUID().toString(),
                },
                body: JSON.stringify({
                    content: line.trim(),
                    project_id: PROJECT_ID
                })
            })
        )
    }
}

await Promise.all(promises)
console.log('Added ✅')
console.log('')
console.log(lines?.join('\n'))

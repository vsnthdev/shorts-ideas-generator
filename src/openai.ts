/*
 *  Functions related to OpenAi.
 *  Created On 07 July 2023
 */

import { config } from './config'
import { Configuration, OpenAIApi } from 'openai'

const TASKS_TO_ADD = 10

export async function getAiSuggestions(completed: string[], newTopics: string[]) {
    const openAiConfig = new Configuration({
        apiKey: config.get('keys.openai')
    })

    const openAi = new OpenAIApi(openAiConfig)

    const moreStr = newTopics.length == 0 ? '' : `mainly from "${newTopics.join(', ')}" `
    const prompt = `Create a list of ${TASKS_TO_ADD} different topics from a related domain ${moreStr}by taking inspiration from the list below:\n\n${completed.join('\n')}\n\nOnly respond with the list, without numbers in the beginning, with each task in each line.`

    const res = await openAi.createChatCompletion({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: `You're a content suggestion assistant that creatively thinks and responds only with a single content idea title in each line and nothing else.`
            },
            {
                role: 'user',
                content: prompt,
            }
        ]
    })

    const resStr = res.data.choices[0].message?.content || ''

    return resStr.split('\n').map(topic => topic.trim()).filter(topic => Boolean(topic))
}

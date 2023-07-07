#!/usr/bin/env bun
/*
 *  A CLI app for generating short form content ideas.
 *  Created On 07 July 2023
 */

import ora from 'ora'
import chalk from 'chalk'
import { newTopics } from './newTopics'
import { populateConfig } from './prompts'
import { getAiSuggestions } from './openai'
import { getCompletedTasks, addToTodoist } from './todoist'

await populateConfig()
const moreTopics = newTopics()

const spinner = ora({
    text: 'Fetching your previous topics',
    color: 'yellow'
}).start()

const completed = await getCompletedTasks()

spinner.text = `Thinking of topics ${chalk.gray('(may take some time)')}`
const topics = await getAiSuggestions(completed, moreTopics)

spinner.text = `Adding generated topics to your Todoist`
await addToTodoist(topics)

spinner.stop()

console.log(`Here are the topics generated 👇\n\n${topics.join('\n')}\n\nThese have been added to your Todoist ✅ You can modify\nor remove them there 👌 thank you 👋`)
process.exit(0)
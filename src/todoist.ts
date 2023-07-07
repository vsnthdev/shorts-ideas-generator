/*
 *  Functions related to Todoist.
 *  Created On 07 July 2023
 */

import { config } from './config'
import crypto from 'crypto'

export async function getCompletedTasks() {
    const allCompletedReq = await fetch(`https://api.todoist.com/sync/v9/completed/get_all`, {
        headers: {
            Authorization: `Bearer ${config.get('keys.todoist')}`
        }
    })

    const allCompleted = await allCompletedReq.json()
    const projectTasks = allCompleted.items.filter(task => task.project_id == config.get('todoist.projectId'))

    return projectTasks.map(task => task.content) as string[]
}

export async function addToTodoist(topics: string[]) {
    const promises = topics.map(topic => fetch('https://api.todoist.com/rest/v2/tasks', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.get('keys.todoist')}`,
            'Content-Type': 'application/json',
            'X-Request-Id': crypto.randomUUID().toString(),
        },
        body: JSON.stringify({
            content: topic.trim(),
            project_id: config.get('todoist.projectId')
        })
    }))

    await Promise.all(promises)
}

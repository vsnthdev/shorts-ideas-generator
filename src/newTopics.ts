/*
 *  Asks for keywords for new topics.
 *  Created On 07 July 2023
 */

import { question } from './prompts'

export function newTopics() {
    return question('Any new topics to be included?', true).split(/,| /gi).map(topics => topics.trim()).filter(topic => Boolean(topic))
}

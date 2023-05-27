import fetch from 'node-fetch'
import cron from 'node-cron'
import { SimplifiedJourney, simplifiedJourneys } from 'sncf-api-wrapper'
import moment from "moment-timezone";
import * as dotenv from 'dotenv'
dotenv.config()

type Notification = {
  title: string
  Priority: 'urgent' | 'high' | 'default' | 'low' | 'min'
  tags: string[]
  body: string
}

const URL = `http://ntfy.sh/${process.env.NTFY_TOPIC}`

export function dateToReadableDate(date: Date): string {
  return moment(date).tz("Europe/Paris").format("DD/MM/YYYY HH:mm");
}

async function sendNotification(notification: Notification): Promise<void> {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Title': notification.title,
      'Priority': notification.Priority,
      'Tags': notification.tags.join(',')
    },
    body: notification.body
  })
}

function transformJourney(journey: SimplifiedJourney): Notification {
  const isDelayed = journey?.status === 'SIGNIFICANT_DELAYS'
  const reason = journey?.sections[0]?.disruptions?.map(d => d.messages).join(', ')

  const title = `Train du ${dateToReadableDate(journey.departureTime)} `
  const body = isDelayed ? `Retard de ${journey.sections[0].delay} : ${reason}` : 'A l\'heure'
  const tags = [isDelayed ? 'exclamation' : 'white_check_mark']
  const Priority = 'high'
  return { title, body, tags, Priority }
}

cron.schedule(process.env.CRON_SCHEDULE, () => {
  simplifiedJourneys(process.env.SNCF_API_KEY, {
    from: process.env.SNCF_FROM,
    to: process.env.SNCF_TO,
    count: 1,
    data_freshness: 'realtime',
    datetime: `${moment().tz("Europe/Paris").format("YYYYMMDD")}T${process.env.SNCF_TIME}`
  }).then(journeys => {
    const notification = transformJourney(journeys[0])
    sendNotification(notification).then(() => console.log('✉️ Notification sent'))
  })
})
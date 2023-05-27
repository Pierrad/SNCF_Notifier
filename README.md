# SNCF Notifier

A simple script to notify you about the status of your SNCF trains using the SNCF API and NTFY.sh

## Requirements

- NodeJS
- NPM
- NTFY.sh topic (https://ntfy.sh/)
- SNCF API key (https://www.digital.sncf.com/startup/api)


## Usage

- Clone the repository
- Install dependencies with `npm install`
- Create a `.env` file with a copy of `.env.example` and fill it with your own values
  - `NTFY_TOPIC` is the topic you want to use with NTFY.sh
  - `SNCF_API_KEY` is your SNCF API key
  - `SNCF_FROM` is the station you want to leave from
  - `SNCF_TO` is the station you want to go to
  - `SNCF_DATE` is the time when you know the next train is the one you want to take
  - `CRON_SCHEDULE` is the cron schedule you want to use to run the script
- `npm run build`
- `npm run start`


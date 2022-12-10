# VTater
## Overview
This app is still early in development! Below is some information about what is planned.
### Vision & Use Case
The VTuber community is filled with talented individuals who are constantly sharing useful and creative assets to each other, primarily via Twitter. Assets include stream overlays, video & image props, and VTube Studio-related utilities.

Although Twitter is extremely popular as a social network, it is not designed to support the ease of asset sharing & browsing - if you happen to miss someone's post on your timeline, you might never see it. If you didn't save someone's post, you might have a hard time finding it again. This has lead to users creating Google spreadsheets and webpages to aggregate useful assets.

The goal of VTater is to create a web application where users can share, upload, browse, and provide feedback on assets in order to foster the creativity of VTubers/streamers.

### Proposed Roadmap
This plan is extremely subject to change! It's more of a loose guideline for me to plan out development goals - please do not assume this roadmap is set in stone.

#### Initial development
Goal: Get the core functionality up and running
- User authentication and account creation
- Basic user profile
- Support for sharing basic content - assets will not be hosted on the app but rather will direct to whitelisted URLs (e.g. Twitter, Imgur) in order to prevent malicious link sharing
- Content posts will allow for image/YouTube previews

## Development
### Environment
Environment variables can be loaded from a `.env` or `.env.local` file.

### NextJS Application
First, run the development server on [http://localhost:3000](http://localhost:3000).
```bash
npm run dev
# or
yarn dev
```
### Firebase Emulator
The Firebase emulator allows you to test database, authentication, and storage functionality locally without needing to connect to the production database.
```bash
yarn emulators
```

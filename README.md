# PostApi-App

## Project Setup

### Prerequisites

- Node.js and npm installed on your machine
- TypeScript
- Prettier
- ESLint
- PM2
- Husky
- Prisma (for database management)
- Cypress (for end-to-end testing)
- Mocha (for unit testing)

### Installation

1. Clone this repository.
   ```bash
   git clone https://github.com/AndrewInnow/PostApi-App.git
   cd PostApi-App
   ```
2. Run `npm install` to install project dependencies.

### Configuration

- Configure ESLint by modifying `eslint.config.mjs`.
- Configure Prisma by editing `prisma/schema.prisma`.
- Configure PM2 by adjusting `ecosystem.config.js`.

## Available Commands

- `npm run lint`: Runs ESLint to check for code style issues.
- `npm run lint:fix`: Runs ESLint and automatically fixes code style issues.
- `npm run format`: Formats code using Prettier.
- `npm run start:prod`: Starts the production server with PM2, running ESLint and Prettier beforehand.
- `npm run stop:prod`: Stops the production server.
- `npm run db-clear`: Clears the database.
- `npm run migrate:down`: Creates SQL script for reversing migrations.
- `npm run start:dev`: Starts the development server with nodemon, running ESLint and Prettier beforehand.
- `npm run migrate:create-only`: Creates new migrations.
- `npm run test:e2e`: Runs end-to-end tests with Cypress.
- `npm run test:unit`: Runs unit tests with Mocha.

Make sure to install and configure necessary dependencies before running these commands. Don't forget to create and configure your env file according to .env.example before proceeding.

### Docker link

- `docker.io/andrewhm001/postapi-app-node_app:0.8`

### Swagger

- Use `/api-docs`

### Site 

You can access the API and its documentation at the following links:

- [API Endpoint](https://postapi-app-node-app-0-1.onrender.com)
- [API Documentation](https://postapi-app-node-app-0-1.onrender.com/api-docs)

**Note:** The service might take a few minutes to start up on the first request because the hosting provider puts the application to sleep after a period of inactivity.
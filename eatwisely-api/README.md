# EatWisely Express API

## Overview

EatWisely Express API is a Node.js-based backend service for the EatWisely mobile application. This API provides various functionalities to support recipe generation, user management, payment processing, and more. It's built using Express.js and is designed to be deployed on AWS using Serverless Framework.

## Features

- Recipe generation using AI (OpenAI GPT models)
- User authentication and management (using Clerk)
- Payment processing and In-App Purchase validation
- User settings and preferences management
- Feedback collection
- Health check endpoints
- Token counting for AI requests
- Sandbox environments for testing
- SNS integration for push notifications
- DynamoDB integration for data storage

## Project Structure

The project follows a modular structure with the following main components:

- `index.js`: The main entry point of the application
- `routes/`: Contains all the route handlers for different API endpoints
- `utils/`: Utility functions and configurations
- `lib/`: Additional libraries and services

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in a `.env` file (see Configuration section)

## Configuration

Сonfiguration can be found in `serverless.yml` and `utils/config.js`.

## Running the Project

### Local Development

To run the project locally:

```
npm run dev
```

This will start the server using nodemon for auto-reloading during development.

### Serverless Offline

To run the project using Serverless Offline:

```
npm run start-offline
```

### Deployment

To deploy to the development environment:

```
npm run deploy
```

To deploy to the production environment:

```
npm run deploy:prod
```

## API Endpoints

The API provides various endpoints under the `/v1` prefix. Some of the main endpoints include:

- `/v1/recipes`: Recipe-related operations
- `/v1/users`: User management
- `/v1/auth`: Authentication endpoints
- `/v1/ai`: AI-powered recipe generation
- `/v1/settings`: User settings management
- `/v1/payments`: Payment processing
- `/v1/iap`: In-App Purchase validation

For a complete list of endpoints, refer to the route definitions in the `routes/` directory.

## Database

The project uses Amazon DynamoDB for data storage. The main tables used are:

- UserSettings
- UserRecipes
- UserFeedbacks
- Payments

Table names are configurable through environment variables.

## Error Handling and Logging

The project uses Sentry for error tracking and logging. Error handling middleware is implemented to catch and report errors consistently across the application.

## Testing

Currently, the project doesn't have automated tests. Adding unit and integration tests is recommended, for future development.

## Linting

The project uses ESLint for code linting. To run the linter:

```
npm run lint
```

To automatically fix linting issues:

```
npm run lint:fix
```


## Contact

For support or queries, please contact support@eatwisely.app.

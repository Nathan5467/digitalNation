### Ethical Digital Nation Collaborative Web Application

This repository contains the demo code for the Ethical Digital Nation Collaborative Web Application project. The project aims to address the digital divide through the development of a centralized web application for collaboration and knowledge exchange, aligned with Scotland's vision of an 'Ethical Digital Nation'.

### Getting Started

To get started with the project, follow these steps:

Clone the repository:


```bash
git clone https://github.com/Codefreyy/Ethical-Digital-Nation
```

Navigate to the project directory:

```bash

npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

### Handling Clerk Webhooks and User Creation in Convex
#### Overview
This project integrates Clerk's webhook system with Convex to handle user-related events such as user creation. The flow involves receiving a webhook event from Clerk, verifying the payload, and then performing necessary actions like creating a user in the Convex database. Below is a detailed explanation of the files involved and their responsibilities.

#### File Structure
File Structure

- convex/clerk.ts: Contains logic to verify webhook payloads from Clerk.
- http.ts: Defines the HTTP route for receiving webhook events and handles processing.
- users.ts: Contains the mutation to create a user in the Convex database.


### Demo Link

A live demo of the project can be accessed at: https://ethical-digital-nation.vercel.app/
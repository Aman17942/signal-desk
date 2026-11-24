# Signal Desk – Incident Management Dashboard

Signal Desk is an Angular-based Incident Management Dashboard designed to help users monitor, manage, and track incidents through a clean, responsive interface.

## Project Overview

The application provides an organized view of incidents, including their severity, status, assigned team member, affected service, environment, creation date, and duration.

## Features

- **Incident Management:** Display incidents in a structured data table.
- **Search:** Search incidents using relevant information.
- **Filtering:** Filter incidents by severity, status, service, and environment.
- **Sorting:** Sort incident records by supported columns.
- **Pagination:** Navigate through incident records.
- **Selection:** Select individual or multiple incidents.
- **Status Indicators:** Visual indicators for incident severity and status.
- **Responsive UI:** Clean dashboard layout with responsive styling.
- **API Integration:** Retrieve incident data and filter options through REST API endpoints.

## Technology Stack

- Angular
- TypeScript
- HTML5
- SCSS
- Angular Material
- RxJS
- REST API
- Git and GitHub

## Project Structure

```text
signaldesk/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── layout/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   └── sidebar/
│   │   ├── pages/
│   │   │   ├── access-denied/
│   │   │   ├── command_center/
│   │   │   ├── incidents/
│   │   │   ├── login/
│   │   │   ├── page-header-strip/
│   │   │   └── service_observability/
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── shared/
│   │   │   ├── alert/
│   │   │   └── reusable-chart/
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   ├── images/
│   │   └── scss/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── .editorconfig
├── angular.json
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

*Note: The folder structure above is illustrative. Refer to the actual `src/` directory for the complete application structure.*

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Angular CLI
- Visual Studio Code (recommended)

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/Aman17942/signal-desk.git
```

**2. Navigate to the project directory**

```bash
cd signal-desk
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
ng serve
```

**5. Open the application**

Navigate to:

```text
http://localhost:4200/
```

## Build

To create a production build, run:

```bash
ng build
```

The generated build files will be available in the `dist/` directory.

## API Integration

The dashboard retrieves incident records and filter options using REST API endpoints.

The application uses API integration to populate incident information and support filtering functionality.

## Repository

GitHub: https://github.com/Aman17942/signal-desk

## Author

Developed as an Angular frontend development project.
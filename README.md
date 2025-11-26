# FloodGuard - Real-Time Flood Alert System

A modern React application built with TypeScript, Material-UI, and OpenLayers for real-time flood monitoring and alerting.

## Features

- **Real-time Map Interface**: Interactive map powered by OpenLayers with satellite imagery
- **Flood Risk Monitoring**: Visual indicators for high, moderate, and low risk areas
- **Weather Station Integration**: Real-time data from rain gauges and weather stations
- **Responsive Design**: Modern UI built with Material-UI components
- **Timeline Controls**: Playback controls for historical data visualization
- **Search Functionality**: Location and address search capabilities

## Tech Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for UI components and theming
- **OpenLayers** for interactive mapping
- **Prettier** for code formatting
- **ESLint** for code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd FloodAlertDashboard
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp env.example .env.local
# edit .env.local to point at your API/GeoServer hosts
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run format` - Formats code using Prettier
- `npm run format:check` - Checks code formatting
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Left sidebar with search
│   ├── MapArea.tsx         # Main map component
│   ├── MonitorPanel.tsx    # Flood monitoring panel
│   └── Footer.tsx          # Bottom timeline controls
├── App.tsx                 # Main application component
├── App.css                 # Global styles
└── index.tsx              # Application entry point
```

## Configuration

### Environment Variables

- `REACT_APP_API_URL`: Base URL for the Flood Alert API (e.g., staging or production service)
- `REACT_APP_GEOSERVER_URL`: Base URL for your GeoServer instance

Create a `.env.local` (or use `.env`) to provide these values; the React components read them directly via `process.env`. For production builds, copy `.env.production` (included in the repo) and update it with your deployment URLs before running `npm run build`.

### Prettier

Code formatting is configured in `.prettierrc` with the following settings:

- Single quotes
- Semicolons
- 2-space indentation
- 80 character line width

### ESLint

Linting is configured in `.eslintrc.json` with:

- React app configuration
- Prettier integration
- TypeScript support

## Development

The application uses a component-based architecture with:

- **Header**: Logo, title, current time, and emergency button
- **Sidebar**: Reports section and search functionality
- **MapArea**: Interactive OpenLayers map with controls
- **MonitorPanel**: Flood risk and weather station monitoring
- **Footer**: Timeline controls and playback options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run format` to format code
5. Run `npm test` to ensure tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

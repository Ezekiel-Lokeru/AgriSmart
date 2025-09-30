# Samba Master

Samba Master is a Node.js web application that provides a platform for user authentication, crop management, weather queries, and integration with AI services. The project is structured using the MVC (Model-View-Controller) pattern and leverages Express.js for routing, EJS for templating, and Supabase for backend data management.

## Features

- **User Authentication**: Secure login and registration system.
- **Crop Management**: Add, view, and manage crop data.
- **Weather Queries**: Fetch weather information for crops or locations.
- **AI Integration**: Connects to OpenAI for advanced features.
- **Profile Management**: User profile viewing and editing.
- **Error Handling**: Custom error pages and middleware.

## Project Structure

```
├── app.js                  # Main application entry point
├── package.json            # Project metadata and dependencies
├── apis/                   # API integrations (OpenAI, Plant API)
│   ├── index.js
│   ├── openai.js
│   └── plant.js
├── configs/                # Configuration files
│   ├── app.js
│   ├── index.js
│   └── supabase.js
├── controllers/            # Route controllers (business logic)
│   ├── auth.js
│   ├── crops.js
│   ├── error.js
│   ├── index.js
│   ├── profile.js
│   ├── query.js
│   ├── supabase.sql
│   └── weather.js
├── middlewares/            # Express middlewares
│   ├── auth.js
│   └── index.js
├── routes/                 # Express route definitions
│   ├── auth.js
│   ├── crops.js
│   ├── errors.js
│   ├── index.js
│   ├── profile.js
│   ├── query.js
│   └── weather.js
├── views/                  # EJS templates for UI
│   ├── 404.ejs
│   ├── 500.ejs
│   ├── 502.ejs
│   ├── pages/
│   ├── partials/
│   └── ...
└── LICENSE
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd samba-master
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables and Supabase credentials in `configs/supabase.js`.

### Running the Application
```sh
node app.js
```
The server will start on the port specified in your configuration (default: 3000).

## Folder Details

### apis/
- **openai.js**: Handles integration with OpenAI APIs for AI-powered features.
- **plant.js**: Interfaces with plant-related APIs for crop data.
- **index.js**: API aggregator.

### configs/
- **app.js**: Application-level configuration.
- **supabase.js**: Supabase client and credentials setup.
- **index.js**: Configuration aggregator.

### controllers/
- **auth.js**: Handles user authentication logic.
- **crops.js**: Manages crop-related operations.
- **error.js**: Error handling logic.
- **profile.js**: User profile management.
- **query.js**: Handles search and query logic.
- **weather.js**: Weather data fetching and processing.
- **supabase.sql**: SQL scripts for Supabase setup.

### middlewares/
- **auth.js**: Authentication middleware for route protection.
- **index.js**: Middleware aggregator.

### routes/
- **auth.js**: Authentication routes.
- **crops.js**: Crop management routes.
- **errors.js**: Error handling routes.
- **profile.js**: User profile routes.
- **query.js**: Search/query routes.
- **weather.js**: Weather-related routes.
- **index.js**: Main router.

### views/
- **404.ejs, 500.ejs, 502.ejs**: Error pages.
- **pages/**: Main application pages (home, about, logon, etc.).
- **partials/**: Reusable UI components (header, footer, etc.).
- **apps/**: App-specific partials.
- **edits/**: Edit forms and pages.

## License

This project is licensed under the terms of the LICENSE file provided in the repository.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## Acknowledgements
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [EJS](https://ejs.co/)

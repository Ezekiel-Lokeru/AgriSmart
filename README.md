# 🌾 Farmer Advisory System (FAS)

The **Farmer Advisory System (FAS)** is a full-stack web application
designed to empower farmers with digital tools for managing crops,
accessing expert advice, monitoring weather conditions, and enabling
admins to oversee platform operations efficiently.

------------------------------------------------------------------------

## 🚀 Features

### 👨‍🌾 Farmer Dashboard

-   Add, edit, and manage crop records.
-   View crop health diagnosis and recommendations.
-   Access real-time weather data for better planning.
-   Personalized dashboard with insights and reports.

### 🧑‍💼 Admin Dashboard

-   Manage users and monitor platform activity.
-   Add or remove crops, manage services, and view statistics.
-   Access analytics and usage metrics.
-   Role-based access (Admin vs. Farmer).

### 🔒 Authentication & Authorization

-   Secure login and registration.
-   Token-based session handling (via Supabase/Custom API).
-   Role-based navigation: Admins see `/admin`, Farmers see
    `/dashboard`.

### 🌦️ Integrated Services

-   Weather information via API.
-   Crop health prediction integration (future feature).
-   Multi-language support via `react-i18next`.

------------------------------------------------------------------------

## 🧩 Tech Stack

  Layer              Technology
  ------------------ ----------------------------------
  Frontend           React.js (with Tailwind CSS 4.x)
  Routing            React Router v6
  Backend            Express.js (REST API)
  Database           Supabase (PostgreSQL)
  Styling            Tailwind CSS
  Auth               Supabase Auth / JWT
  State Management   React Hooks
  API Calls          Axios

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone the Repository

``` bash
git clone https://github.com/yourusername/farmer-advisory-system.git
cd farmer-advisory-system
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

``` env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the Development Server

``` bash
npm run dev
```

The app should now be running on **http://localhost:5173** 🎉

------------------------------------------------------------------------

## 🧠 Project Structure

    src/
    │
    ├── components/
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminLayout.jsx
    │   │   └── AdminUsers.jsx
    │   ├── NavbarLayout.jsx
    │   ├── SidebarLayout.jsx
    │   ├── ProtectedRoute.jsx
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── Profile.jsx
    │   ├── Settings.jsx
    │   ├── AddCrop.jsx
    │   ├── Services.jsx
    │   └── About.jsx
    │
    ├── services/
    │   └── supabaseClient.js
    │
    ├── i18n.js
    ├── App.jsx
    └── index.css

------------------------------------------------------------------------

## 🧩 Key Routing Logic

-   `/` → Home page (public)
-   `/login` → User login
-   `/register` → User registration
-   `/dashboard` → Farmer dashboard (protected)
-   `/admin` → Admin dashboard (role-restricted)
-   `/admin/users` → Manage users (admin-only)

Role-based redirects ensure admins and farmers see their respective
dashboards.

------------------------------------------------------------------------

## 🧰 Available Scripts

  Command             Description
  ------------------- --------------------------
  `npm run dev`       Start development server
  `npm run build`     Build for production
  `npm run preview`   Preview production build

------------------------------------------------------------------------

## 🧪 Future Improvements

-   AI-based crop health prediction.
-   Offline mode for farmers in low-connectivity regions.
-   SMS notifications for weather and advisory alerts.
-   Community Q&A forum.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull
request for review.

------------------------------------------------------------------------

## 🪪 License

This project is licensed under the **MIT License** --- feel free to use
and modify it for educational or commercial purposes.

------------------------------------------------------------------------

## 👨‍💻 Author

**Ezekiel Lokeru**\
📍 Kenya\
💼 Full-stack Developer \| MERN \| Data Science Enthusiast\
🔗 [GitHub](https://github.com/yourusername) \|
[LinkedIn](https://linkedin.com/in/yourprofile)

------------------------------------------------------------------------

*"Empowering farmers through technology."*

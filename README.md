# Inventory Management App

<p align="center">
  <a href="https://inventory-app-udn0.onrender.com/">
    <img src="https://img.shields.io/badge/✓%20VISIT%20NOW-22C55E?style=for-the-badge&labelColor=14532D" alt="Visit Now" />
  </a>
</p>

## About

An Inventory Management application built as part of [The Odin Project](https://www.theodinproject.com/).

The application allows users to manage a collection of games, organize them into categories, and keep track of suppliers and stock information.

This project focuses on building a database-driven web application using Express.js and PostgreSQL, with an emphasis on relational database design, CRUD operations, server-side rendering, and form validation.

## Features

- View all games in the inventory
- Add new games to the inventory
- Edit existing game information
- Organize games into multiple categories
- Associate games with multiple suppliers
- Track game prices and stock quantities
- Search and filter inventory items
- Dynamic server-rendered pages using EJS
- Form validation and error handling
- Relational database management using PostgreSQL

## Technologies Used

- JavaScript (Node.js)
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- EJS
- express-validator
- HTML5
- CSS3
- dotenv
- Nodemon

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bibu007/inventory-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd inventory-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure your PostgreSQL connection details.

   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```

   Configure the database and create the required tables before running the application.

5. Start the application:

   ```bash
   node app.js
   ```

6. Open your browser and navigate to:

   ```text
   http://localhost:3000
   ```

## What I Learned

While building this project, I gained experience with:

- Designing relational database schemas using PostgreSQL.
- Implementing many-to-many relationships using junction tables.
- Working with SQL joins to retrieve related records.
- Using `STRING_AGG()` to combine related database records.
- Performing CRUD operations using Express.js and PostgreSQL.
- Managing database queries using node-postgres (`pg`).
- Understanding the difference between PostgreSQL connection pools and individual clients.
- Handling multiple related database insertions and updates.
- Using transactions to maintain database consistency.
- Implementing server-side form validation using express-validator.
- Preserving form values and displaying validation errors after failed submissions.
- Dynamically rendering database records using EJS.
- Working with JavaScript's Fetch API for client-server communication.
- Organizing application logic using routes and controllers.

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) for the project inspiration and learning resources.

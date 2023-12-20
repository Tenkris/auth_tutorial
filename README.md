# Authentication System

This project is an authentication system built with Node.js, Express, and MySQL. It uses JSON Web Tokens (JWT) for authentication and cookie-parser for handling cookies.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MySQL
- PNPM (You can install it globally with `npm install -g pnpm`)

### Installing

1. Clone the repository: `git clone https://github.com/yourusername/yourrepository.git`
2. Navigate into the project directory: `cd yourrepository`
3. Install the dependencies: `pnpm install`
4. Create a `.env` file in the root of your project and add the following variables:
    - `DB_HOST`: Your MySQL host
    - `DB_USER`: Your MySQL user
    - `DB_PASSWORD`: Your MySQL password
    - `DB_NAME`: Your MySQL database name
    - `JWT_SECRET`: Your JWT secret (you can generate one using a random string generator)
5. Start the server: `pnpm run start`

## Usage

The project includes the following endpoints:

- `POST /auth/register`: Register a new user. The body of the request should be a JSON object with `email` and `password` properties.
- `POST /auth/login`: Log in a user. The body of the request should be a JSON object with `email` and `password` properties.
- `GET /auth/users`: Get all users. This endpoint requires a valid JWT in the `Authorization` header.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

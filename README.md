# movies-explorer-api

REST API for a movie search application. Registered users can save films to a personal collection, remove them, and manage their own profile. Built as the final project of the Yandex Praktikum web development course.

The public deployment is no longer running, so the API is intended to be run locally.

## Stack

- **Node.js / Express** — HTTP layer and routing
- **MongoDB / Mongoose** — data storage and schema-level validation
- **JWT** (`jsonwebtoken`) — stateless authentication, tokens valid for 7 days
- **bcrypt** — password hashing, 10 salt rounds
- **celebrate / Joi** — request validation before the controller layer
- **helmet**, **cors** — security headers and origin restriction
- **winston / express-winston** — request and error logging
- **ESLint** (airbnb-base) — linting

## Running locally

Requires Node.js and a local MongoDB instance.

```bash
git clone https://github.com/KateAedon/movies-explorer-api.git
cd movies-explorer-api
npm install
npm run dev
```

The server starts on port `3001`. MongoDB is expected at `mongodb://localhost:27017/bitfilmsdb`.

### Environment variables

Create a `.env` file in the project root:

```
NODE_ENV=production
JWT_SECRET=your_secret_here
```

`.env` is gitignored and must never be committed. When `NODE_ENV` is not set to `production`, the app falls back to a hardcoded development secret, so tokens issued in development are not interchangeable with production ones.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the server |
| `npm run dev` | Run with nodemon, restarts on file change |
| `npm run lint` | Run ESLint with autofix |

## API reference

Base URL when running locally: `http://localhost:3001`

Authenticated requests require the header:

```
Authorization: Bearer <token>
```

### Public endpoints

#### `POST /signup`

Registers a new user.

| Field | Rules |
| --- | --- |
| `name` | string, min 2 characters |
| `email` | string, required, valid email, unique |
| `password` | string, required, min 8 characters |

Returns the new user's `email` and `_id`. The password hash is never returned.

#### `POST /signin`

Authenticates a user and returns a JWT valid for 7 days.

| Field | Rules |
| --- | --- |
| `email` | string, required, valid email |
| `password` | string, required, min 8 characters |

Returns `{ "token": "..." }`.

### Protected endpoints

All endpoints below require a valid token.

#### `GET /users/me`

Returns the current user's profile.

#### `PATCH /users/me`

Updates the current user's `name` and `email`. Both fields are required.

#### `GET /movies`

Returns the films saved by the current user. Other users' entries are never returned.

#### `POST /movies`

Saves a film to the current user's collection. All fields are required:

| Field | Type | Rules |
| --- | --- | --- |
| `country` | string | |
| `director` | string | |
| `duration` | number | |
| `year` | string | 4 characters |
| `description` | string | |
| `image` | string | valid URL |
| `trailer` | string | valid URL |
| `thumbnail` | string | valid URL |
| `nameRU` | string | |
| `nameEN` | string | |
| `movieId` | number | id from the external film source |

The `owner` field is taken from the token, not from the request body.

#### `DELETE /movies/:movieId`

Deletes a saved film. `movieId` here is the MongoDB `_id` — a 24-character hex string, not the external film id. Deleting an entry belonging to another user is rejected.

### Error responses

All errors are returned as `{ "message": "..." }`.

| Code | When |
| --- | --- |
| `400` | Request body or parameters fail validation |
| `401` | Token missing, malformed, or invalid; wrong email or password on sign-in |
| `403` | Attempt to delete a film owned by another user |
| `404` | Record not found, or unknown route |
| `409` | Email already registered |
| `500` | Unhandled server error; the internal message is not exposed |

## Manual API test checklist

Scenarios worth covering when testing this API, for example with Postman:

**Authentication**
- Register with valid data, then sign in and receive a token
- Register with an email that already exists → `409`
- Register with a password shorter than 8 characters → `400`
- Register with a malformed email → `400`
- Sign in with a wrong password → `401`, and confirm the message does not reveal whether the email exists
- Call a protected endpoint with no `Authorization` header → `401`
- Call a protected endpoint with a token that has been tampered with → `401`

**Films**
- Save a film with all required fields, then confirm it appears in `GET /movies`
- Save a film with a missing required field → `400`
- Save a film with a non-URL value in `image`, `trailer` or `thumbnail` → `400`
- Delete an own film → success, and confirm it disappears from `GET /movies`
- Delete with a malformed id (not 24 hex characters) → `400`
- Delete an id that does not exist → `404`
- Delete a film created by a different user → `403`
- Confirm `GET /movies` for user A never returns user B's entries

**Routing**
- Request an undefined route → `404`

## Known issues

Found while reviewing the code; documented rather than silently fixed.

- **Duplicate film save hangs the request.** `movieId` is declared `unique` globally rather than per user, so saving a film that already exists in the database triggers a MongoDB duplicate key error. The catch block in `addMovie` only converts `ValidationError` and silently swallows anything else, so no response is ever sent and the client waits until it times out. This also means two different users cannot save the same film.
- **Duplicate email on profile update returns 500.** `PATCH /users/me` with an email already taken by another account surfaces the raw database error, which reaches the error handler without a status code and is reported as a server error instead of `409`.
- **`GET /users/me` returns `200` with a null body** if the user id from a valid token no longer exists in the database, rather than `404`.
- **`POST /signup` returns `200`** where `201 Created` would be correct.
- **Validation rules disagree between layers.** Joi accepts a `year` of 2 to 4 characters while the Mongoose schema requires at least 4, so a 2-character year passes request validation and is only rejected at the database layer.
- **The MongoDB connection string is hardcoded** in `app.js` rather than read from the environment.
- **No automated tests.** `npm test` is still the default placeholder and exits with an error.

# HireQuotient Challenge

## Overview

This documentation provides step-by-step instructions for setting up and using the
backend of your Social Media App. The backend is built using Node.js and MongoDB.


## Prerequisites

Before you begin, ensure you have the following:
- Node.js installed on your machine.
- MongoDB installed and running.
- Git installed (for cloning the repository).

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ashu-161120/Ashu-Social-Media-Backend.git
```
2. Change into the project directory:
```bash
cd your-social-media-app-backend
```
3. Install dependencies:
```bash
npm install
```
### Starting the Server
Run the following command to start the server:
```bash
npm start
```
The server will be running on http://localhost:3000 by default.

## Authentication

Authentication is done using JSON Web Tokens (JWT).
Include the generated JWT token in the Authorization header for authenticated
requests.

## Database Schema

### Users Collection
```JSON
{
"_id": "ObjectId",
"email": "string",
"password": "string (hashed)",
"name": "string",
}
```

### Posts Collection
```JSON
{
"title": "string",
"message": "string",
"name": "string",
"creator": "string",
"tags": ["string"],
"selectedFile": "string",
"likes": ["string"],
"comments": ["string"],
"createdAt": "Date"
}
```

## API Endpoints

### User Authentication
1. **Sign Up:**
    - **Endpoint**: POST /api/auth/signup
    - **Description**: Register a new user.
    - **Request**:
        - **Body**:
            - *email* (string, required): User's email address.
            - *password* (string, required): User's password.
            - *firstName* (string, required): User's first name.
            - *lastName* (string, required): User's last name.
    - **Response**:
        - **Status**: 201 Created
        - **Body**:
            - *result* : User object.
            - *token* : JWT token for authentication.
2. **Sign In:**
    - **Endpoint**: POST /api/auth/signin
    - **Description**: Authenticate an existing user.
    - **Request**:
    - **Body**:
        - *email* (string, required): User's email address.
        - *password* (string, required): User's password.
    - **Response**:
        - **Status**: 200 OK
        - **Body**:
            - *result* : User object.
            - *token* : JWT token for authentication.

### Post Management
1. **Create a Post**:
    - **Endpoint**: POST /api/posts
    - **Description**: Create a new post.
    - **Request**:
        - **Headers**:
                - *Authorization* (string, required): JWT token.
        - **Body**:

            -    *caption* (string, required): Post caption.
            -   *image* (file, optional): Post image file.

    - **Response:**
        - **Status**: 201 Created
       - **Body**:

            -    *result* : Created post object.
2. **Get Posts**:
    - **Endpoint**: GET /api/posts
    - **Description**: Get a paginated list of posts.
    - **Query Parameters:**
        -   page (number, optional): Page number for pagination.
    - **Response:**
        -   *Status:* 200 OK
        -   *Body:*
            - data : Array of post objects.
            - currentPage : Current page number.
            - numberOfPages : Total number of pages.
3. **Like a Post**:
    - **Endpoint**: *PATCH /api/posts/:id/like*
    - **Description**: Like or unlike a post.
    - **Request**:
        - **Headers**:
            - *Authorization* (string, required): JWT token.
    - **Response:**
        - *Status:* 200 OK
        - *Body*
            - result : Updated post object.
4. **Comment on a Post**:
    - **Endpoint**: POST /api/posts/:id/comment
    - **Description**: Add a comment to a post.
    - **Request**:
        - **Headers**:
            - *Authorization* (string, required): JWT token.
        - **Body**:
            - *value*(string, required): Comment text.
    - **Response:**

        - **Status:** 200 OK
        -  **Body:**
            - *result* : Updated post object.

### User Profile
1. **View Profile:**
    - **Endpoint**: GET /api/users/profile
    - **Description**: Get the profile of the authenticated user.
    - **Request**:
        - **Headers**:
            - *Authorization* (string, required): JWT token.
    - **Response:**
        - Status: 200 OK
        - Body:
            - result : User object.
2. **Update Profile**:
    - **Endpoint**: PATCH /api/users/profile
    - **Description**: Update the profile of the authenticated user.
    - **Request**:
        - **Headers**:
            - *Authorization* (string, required): JWT token.
        - **Body:**
            - *firstName* (string, optional): Updated first name.
            - *lastName* (string, optional): Updated last name.
    - **Response:**
        - **Status**: 200 OK
        - **Body**:
            - *result* : Updated user object.
            - *message* : Success message.
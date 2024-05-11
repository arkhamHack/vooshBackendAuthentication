const swaggerDocument = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "My API",
    description: "API documentation for authentication and profile endpoints",
  },
  basePath: "/",
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "User details",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                role: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "201": {
            description: "User registered successfully",
          },
          "400": {
            description: "User already exists",
          },
          "500": {
            description: "Failed to register user",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login user",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "User credentials",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "User logged in successfully",
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
          },
          "404": {
            description: "User not found",
          },
          "500": {
            description: "Failed to login",
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Logout user",
        responses: {
          "200": {
            description: "Logged out successfully",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/profile/user-profile": {
      get: {
        summary: "Get user profile",
        parameters: [
          {
            name: "userId",
            in: "query",
            description: "User Id",
            required: true,
            type: "string",
          },
          {
            name: "profileId",
            in: "query",
            description: "Profile Id",
            required: false,
            type: "string",
          },
        ],
        responses: {
          "200": {
            description: "User profile retrieved successfully",
          },
          "404": {
            description: "User profile not found",
          },
          "403": {
            description: "Unauthorized to view profile",
          },
          "500": {
            description: "Failed to fetch user profile",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
      put: {
        summary: "Update or Create user profile",
        parameters: [
          {
            name: "userId",
            in: "query",
            description: "User Id",
            required: true,
            type: "string",
          },
          {
            name: "profileId",
            in: "query",
            description: "Profile Id",
            required: false,
            type: "string",
          },
          {
            name: "body",
            in: "body",
            description: "Updated user profile details",
            required: true,
            schema: {
              type: "object",
              properties: {
                photo: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                bio: {
                  type: "string",
                },
                phone: {
                  type: "string",
                },
                visibility: {
                  type: "string",
                },
              },
              security: [
                {
                  JWTToken: [],
                },
              ],
            },
          },
        ],
        responses: {
          "200": {
            description: "User profile updated successfully",
          },
          "400": {
            description: "Invalid data",
          },
          "404": {
            description: "User profile not found",
          },
          "403": {
            description: "Unauthorized to update profile",
          },
          "500": {
            description: "Failed to update user profile",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/auth/update-email": {
      put: {
        summary: "Update user email",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "Updated email",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                newEmail: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "User email updated successfully",
          },
          "400": {
            description: "Invalid data",
          },
          "401": {
            description: "Unauthorized to update email",
          },
          "404": {
            description: "User not found",
          },
          "500": {
            description: "Failed to update user email",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/auth/update-password": {
      put: {
        summary: "Update user password",
        parameters: [
          {
            name: "body",
            in: "body",
            description: "Updated password",
            required: true,
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                newPassword: {
                  type: "string",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "User password updated successfully",
          },
          "400": {
            description: "Invalid data",
          },
          "401": {
            description: "Unauthorized to update password",
          },
          "404": {
            description: "User not found",
          },
          "500": {
            description: "Failed to update user password",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/profile/all-user-profiles": {
      get: {
        summary: "Get all user profiles",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: false,
            type: "integer",
          },
          {
            name: "limit",
            in: "query",
            description: "Number of profiles per page",
            required: false,
            type: "integer",
          },
          {
            name: "userId",
            in: "query",
            description: "User ID",
            required: true,
            type: "string",
          },
          {
            name: "email",
            in: "query",
            description: "User email",
            required: false,
            type: "string",
          },
          {
            name: "username",
            in: "query",
            description: "User username",
            required: false,
            type: "string",
          },
        ],
        responses: {
          "200": {
            description: "User profiles retrieved successfully",
          },
          "400": {
            description: "Invalid data",
          },
          "404": {
            description: "User not found",
          },
          "500": {
            description: "Failed to fetch profiles",
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/auth/google": {
      get: {
        summary:
          "Authenticate with GitHub. Do Note: Authentication is working, Swagger will show failed, kindly use the google oauth link from the network tab to continue the process",
        responses: {
          "302": {
            description: "Redirect to Google authentication page",
          },
          "200": {
            description: "User logged in successfully",
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                },
              },
            },
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
    "/auth/github": {
      get: {
        summary:
          "Authenticate with GitHub. Do Note: Authentication is working, Swagger will show failed, kindly use the github oauth link from the network tab to continue the process",
        responses: {
          "302": {
            description: "Redirect to GitHub authentication page",
          },
          "200": {
            description: "User logged in successfully",
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                },
              },
            },
          },
        },
        security: [
          {
            JWTToken: [],
          },
        ],
      },
    },
  },
  securityDefinitions: {
    JWTToken: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  persistAuthorization: true,
  security: [
    {
      JWTToken: [],
    },
  ],
};

export default swaggerDocument;

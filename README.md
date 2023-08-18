# RENT IT

This is a full-stack SSR (Server-Side Rendered) application that provides an API for managing properties and their endpoints.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Install the dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

# API
## Properties endpoints
- The properties endpoints expect the ID of the user as the `userId` parameter. The user must be logged in with a JWT token.
- The format of the GET endpoints is as follows:

  `http://localhost:3000/api/property?userId=user-id`

- GET endpoints return all properties if the user's role is `admin`.
- GET endpoints return only properties owned by that user if their role isn't `admin`.

## Server-Side Rendering (SSR)

This application utilizes server-side rendering to generate HTML on the server and send it to the client. SSR provides benefits such as improved performance, SEO-friendliness, and better user experience.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# API
## Properties endpoints
- the properties enpoints expects the id of user as `userId` param. The user must be loggedin(with a jwt token)
- the format of the get enpoints are as follows;

`http://localhost:3000/api/property?userId=user-id`

- get endpoints return all properties if user role is `admin` and return only properties owned by that user if their role `isnt admin`.


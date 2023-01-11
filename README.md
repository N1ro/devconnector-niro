# Packages

- express - which is our main web framework for the backend.
- expressValidator - for data validation. So when we make our POST request to our API if there's fields that need to be there that aren't,It'll raise an error.So we'll use that for validation.
- bcrypts - We're going to be encrypting JS. which is used for password encryption.You never want to store plain text passwords in your database.
- config - for global variables.We're going to use grab a start profile avatars how that works is if a user signs up they can use an email that's associated with a graviton account and it will automatically show their profile image.
- JsonWebtoken - because we're using JWT to pass along a token for validation.
- Mongoose - which is a layer that sits on top of the database so we can interact with it.
- request - which is just a small module that will allow us to make recall HTTP requests to another API and the reason we're installing this is for get hub repositories.We want our profiles to be able to have GitHub repositories listed on them.So we're going to make that request from our backend so that we can hide our API key and stuff like that and we can just return the repositories.

# DevDependencies:

- nodemon - which will constantly watch our server so that we don't have to refresh it every time
- concurrently - which is going to allow us to run our back end express server and our front end react dev server at the same time with one single command

# Users:

- users:
- techguyinfo@gmail.com/123456

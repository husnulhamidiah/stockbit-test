# Dropsuite Assessment

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

## Prerequisites

1. Node.js v8.0.0 or higher installed
2. MySQL v5.6 or higher installed

## Usage

1. Install all the required modules

    ```
      npm install
    ```

2. Copy env configuration sample and make some changes:

    ```
      cp env.sample .env
    ```

3. Edit database configuration file `config/config.js` to match your database settings. 

4. Setup the database and start the server by issuing these commands:

    ```
      npm run db:setup
      npm start
    ```

5. Now you should have access to api via localhost:3000

## Test

```
NODE_ENV=test npm run db:create
NODE_ENV=test npm test
NODE_ENV=test npm run db:drop
```

You can inspect coverage for this test by opening `index.html` inside `converage/lcov-report` directory.

## Documentations

1. Search movies

    ![Selection_027](https://user-images.githubusercontent.com/7609801/66936518-07d25280-f068-11e9-97f3-f27fe6fe28b5.png)

    ```
    curl -X GET \
      'http://localhost:3000/api/movies?apikey=faf7e5bb&s=batman' \
      -H 'Accept: */*' \
      -H 'Host: localhost:3000' \
    ```

2. Get movie detail by Id

    ![Selection_026](https://user-images.githubusercontent.com/7609801/66936275-9f837100-f067-11e9-9e09-04eaa41d9fab.png)

    ```
    curl -X GET \
      'http://localhost:3000/api/movies/tt0372784/?apikey=faf7e5bb' \
      -H 'Accept: */*' \
      -H 'Host: localhost:3000' \
    ```
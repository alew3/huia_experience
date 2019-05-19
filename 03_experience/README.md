# Huia Interactive - Making it work.


## Build Setup

You will need [NodeJS](https://nodejs.org/) >= 8.9 and [Yarn](https://yarnpkg.com/) >=1.15 installed.

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8181
yarn dev

# build for production with minification into dist folder
yarn build

# build for production and view the bundle analyzer report
yarn build --report
```

# Docker
If you prefer, we provide a This will spin up a Docker and build the project. The ngingx server will be up serving files on port 8181.

``` bash
# build the docker
$ docker-compose build

# build project & start server on http://localhost:8181
$ docker-compose up -d 
```

To test the project go to [http://localhost:8181/](http://localhost:8181/)

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).




![These are the poses the Huia responds to](../assets/poses.png)

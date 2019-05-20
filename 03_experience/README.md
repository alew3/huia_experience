# Huia Interactive - 03 Experience

# Learn more about this project

Read my [medium article](https://medium.com/@alessandrocauduro/creating-an-interactive-artificial-intelligence-experience-on-the-browser-with-tensorflow-ea205ee08c02) about this project to learn about all the details necessary to build an artificial intelligence experience on the browser from end-to-end.

# Setup

You will need [NodeJS](https://nodejs.org/) >= 8.9 and [Yarn](https://yarnpkg.com/) >=1.15 installed.

``` bash
# change directory
$ cd 03_experience

# install dependencies
$ yarn

# serve with hot reload at localhost:8181
$ yarn dev

# build for production with minification into dist folder
$ yarn build

# build for production and view the bundle analyzer report
$ yarn build --report
```

# Have Fun

Try the [live demo](https://experience.huia.haus/?utm_source=github&utm_medium=link)


These are the poses the Huia responds to:

![](../assets/poses.png)


# Docker
We also provide a Dockerfile to build the project and run an ngingx server serving the files on [http://localhost:8181/](http://localhost:8181/).

``` bash
# build the docker
$ docker-compose build

# build project & start server on http://localhost:8181
$ docker-compose up -d 
```
# Netgen Layouts user interface

This repository contains the user interface for Netgen Layouts.

## Requirements

* PHP
* NodeJS
* Composer
* Yarn
* Grunt CLI (`yarn global add grunt-cli`)

## First time build configuration

Before building the project for the first time, you need to fill some configuration
used by BrowserSync, namely domain and path under which the project will be available.

Copy `grunt.json.dist` file to `grunt.json` and change `domain` and `start_path` to
correct values. Usually, you will need to update only the domain, since the path is
preconfigured with a correct value.

## Development build

Building the project requires you to have [Composer](https://getcomposer.org/download/)
installed. Since this package and its dependencies are not usable standalone,
they are not published on NPM registry. Instead, Composer is used to manage
version dependencies. When you use Yarn to install JavaScript dependencies, they
are symlinked from the Composer `vendor` folder to `node_modules`.

To build development assets and start watching files for changes, just run
Grunt without any arguments:

```
$ composer install
$ yarn install
$ grunt
```

This will place all generated assets into `bundle/Resources/public/dev` folder.

## Production build

To build the production assets, run Grunt with the following:

```
$ composer install
$ yarn install
$ grunt build
```

This will place all generated assets into `bundle/Resources/public` folder.

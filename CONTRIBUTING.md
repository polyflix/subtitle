# Contributing to your application

To contribute to this project, you should be aware of the project folder architecture and some other rules that are in place.

## Folder architecture

**The source code of the project is located in the `src/` folder.**

```
src
├── main
└── resources
```


### Configuration loader files
`src/main/configuration` will contain config and module loaders.

### Application configuration files 
`src/resources` contains configuration files for each environment (don't put any
secret there)

## File naming convention

Each file must be suffixed by the name of what it contains.

For example, if you want to create a custom decorator, you'll put the file into the `decorators` folder of your module with the following name `mydecorator.decorator.ts`.

It is important because we can identify more easily files during debugging phases.

## Conventional commits

As a base, take [conventional commits by Angular](https://www.conventionalcommits.org/en/v1.0.0-beta.4/), and then
customize to fit your needs.
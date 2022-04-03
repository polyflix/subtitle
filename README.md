# NestJS Microservice boilerplate

TODO

## Configuration

The service configuration is handled over YAML and environment variables.

In `src/resources`, you'll find a file, `application.yml` which contains the service configuration in YAML format. This file is the **first file loaded by the service.**.

For example, by default the `src/resources/application.yml` contains :

```yaml
server:
  port: 8080
```

You can add all the configuration required by your service here. Every key/values will be loaded into your application context.

To access a configuration value in your code, you can simply do the following :

```ts
const config = app.get<ConfigService>(ConfigService);
const port = config.get<number>('server.port', 3000);

console.log(port); // 8080
```

If you need to define environment specific variables, you can simply create another file, in the following format : `application.${ENVIRONMENT}.yml`. For example, for a `production` environment, you'll create the file `src/resources/application.production.yml` :

> By default, the service will assume that your configuration files are located into `resources`. If you're in a Docker container for example, and that your configuration files were copied into `/etc/app/config`, you can simply use the special environment variable `NEST_ADDITIONAL_CONFIG_LOCATION=/etc/app/config` to specify the service to check for configurations into the directory specified.

```yaml
# src/resources/application.production.yml
server:
  tls: true
```

```ts
const config = app.get<ConfigService>(ConfigService);
const port = config.get<number>('server.port', 3000);
const useTls = config.get<boolean>('server.tls', false);

console.log(port); // 8080
console.log(useTls); // true
```

The configuration keys from different sources will be merged at the runtime. So you can define some common configurations into the `application.yml`, and add more environment specific variables into `application.${ENVIRONMENT}.yml`.

The last thing about configuration is that everything is overridable by environment. If you wish to override the `server.port` for example, you can simply export the variable `NEST_SERVER_PORT`.

**Be careful, environment variables take precedence over each other configuration method. You'll find below how the service will load it's configuration :**

- `application.yml`
- `application.${ENVIRONMENT}.yml`
- Environment variables

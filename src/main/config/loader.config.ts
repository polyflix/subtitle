import { LoggerService } from "@nestjs/common";
import { existsSync, readFileSync } from "fs";
import * as yaml from "js-yaml";
import * as set from "lodash.set";
import { join } from "path";

const LOGGER_CTX = "ConfigurationLoader";

// Some constants useful for the ConfigurationLoader
const CONFIG_ENV_PREFIX = "NEST_";
const CONFIG_DEFAULT_PATH = join(__dirname, "..", "resources");
const CONFIG_COMMON_FILE_NAME = "application";
const CONFIG_FILE_EXTENSION = "yml";

// Reserved env vars
const RESERVED_ENV_VARS = [
  `${CONFIG_ENV_PREFIX}ADDITIONAL_CONFIG_LOCATION`,
  `${CONFIG_ENV_PREFIX}PROFILE`
];

function envToKey(key: string): string {
  return key.replace(CONFIG_ENV_PREFIX, "").toLowerCase().replace(/_/g, ".");
}

function keyToEnv(key: string): string {
  return `${CONFIG_ENV_PREFIX}${key.toUpperCase().replace(/\./g, "_")}`;
}

function loadConfig(
  location: string,
  file: string,
  logger: LoggerService
): Record<string, any> {
  const path = join(location, file);
  // If the path doesn't exists, we skip to the next property source
  if (!existsSync(path)) return {};
  logger.log(`Adding new PropertySource from file=${file}`, LOGGER_CTX);
  return yaml.load(readFileSync(path, "utf-8"));
}

export const ISLOCAL =
  process.env.NEST_PROFILE == "local" || !process.env.NEST_PROFILE;

export const loadConfiguration = (logger: LoggerService) => {
  let config = {};

  const activeProfile = process.env.NEST_PROFILE || "local";
  const defaultConfigurationFiles = [
    `${CONFIG_COMMON_FILE_NAME}.${CONFIG_FILE_EXTENSION}`,
    `${CONFIG_COMMON_FILE_NAME}.${activeProfile}.${CONFIG_FILE_EXTENSION}`
  ];

  logger.log(
    `Bootstrapping application with profile=${activeProfile}`,
    LOGGER_CTX
  );
  logger.log(
    `Loading configuration from default location=${CONFIG_DEFAULT_PATH}`,
    LOGGER_CTX
  );

  // Load configuration from default sources.
  // Default sources are :
  // application.yml
  // application.${ENVIRONMENT}.yml
  defaultConfigurationFiles.forEach((file) => {
    config = { ...config, ...loadConfig(CONFIG_DEFAULT_PATH, file, logger) };
  });

  // If NEST_ADDITIONAL_CONFIG_LOCATION is found in environment
  // Try to load files from
  const additionalLocation = process.env[RESERVED_ENV_VARS[0]];
  if (additionalLocation) {
    logger.log(
      `Loading configuration from additional configuration location=${additionalLocation}`,
      LOGGER_CTX
    );
    defaultConfigurationFiles.forEach((file) => {
      config = { ...config, ...loadConfig(additionalLocation, file, logger) };
    });
  }

  // Overrides from environment
  Object.entries(process.env)
    .filter(
      ([key]) =>
        key.startsWith(CONFIG_ENV_PREFIX) && !RESERVED_ENV_VARS.includes(key)
    )
    .map(([key, value]) => ({
      key: envToKey(key),
      value
    }))
    .forEach((env) => {
      logger.log(
        `Setting ${env.key} value from environment variable=${keyToEnv(
          env.key
        )}`,
        LOGGER_CTX
      );
      set(config, env.key, env.value);
    });

  return config;
};

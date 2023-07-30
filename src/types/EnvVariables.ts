/**
 * The server environment variables required for a TypeScript project.
 *
 */
export type ServerEnvVariables = {
  /**
   * The environment in which the server is running. It can be `development`,
   * `production`, `test`, or `staging`.
   *
   */
  NODE_ENV?: 'development' | 'production' | 'test' | 'staging';

  /**
   * The HOSTNAME property is a string that represents the hostname or IP
   * address of the server.
   *
   */
  HOSTNAME?: string;

  /**
   * The `PORT` property is a string that represents the port number on which
   * the server will listen for incoming requests.
   *
   */
  PORT?: string;
};

/**
 * The structure of environment variables required for an application.
 *
 */
export type AppEnvVariables = {
  /**
   * The URL of the application. It's used when generating public links for
   * resources like images & files.
   *
   */
  APP_URL?: string;

  /**
   * The APP_KEY is a string that represents the key or token used to generate
   * token securely. for example, it's used to generate sessions, cookies and
   * CSRF tokens. Every Data you encrypt in your application is using APP_KEY
   * behind the scene.
   *
   */
  APP_KEY?: string;

  /**
   * The APP_NAME property is a string that represents the name of the
   * application. This is used as default fallback in pages titles.
   *
   */
  APP_NAME?: string;

  /**
   * The APP_VERSION property is a string that represents the version number of
   * the application.
   *
   */
  APP_VERSION?: string;
};

/**
 * The environment variables required for a database connection in a TypeScript
 * application.
 *
 */
export type DatabaseEnvVariables = {
  /**
   * The type of database connection to be used (e.g. "mysql", "postgres",
   * "mongodb").
   *
   */
  DB_CONNECTION?: string;

  /**
   * The `DB_HOST` property represents the hostname or IP address of the
   * database server.
   *
   */
  DB_HOST?: string;

  /**
   * The port number for the database connection.
   *
   */
  DB_PORT?: string;

  /**
   * The username for connecting to the database.
   *
   */
  DB_USERNAME?: string;

  /**
   * The password used to authenticate the database connection.
   *
   */
  DB_PASSWORD?: string;

  /**
   * The name of the database that you want to connect to.
   *
   */
  DB_DATABASE?: string;

  /**
   * DB_LOGGING is a boolean value that determines whether database logging is
   * enabled or disabled. Logging the state of database connection and the
   * executed queries and its results.
   *
   */
  DB_LOGGING?: 'true' | 'false';

  /**
   * The directory path where database migration files are located. Database
   * migration files are used to manage changes to the database schema over
   * time.
   *
   */
  DB_MIGRATIONS_DIR?: string;
};

/**
 * The environment variables related to logging configuration.
 *
 */
export type LogEnvVariables = {
  /**
   * Determines the level of logging that will be displayed. The available
   * options are: `trace`, `debug`, `info`, `warn`, `error`, and `fatal`.
   *
   */
  LOG_LEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  /**
   * The `LOG_FORMAT` property specifies the format in which log messages should
   * be outputted. It can be: `text`, `csv`, `json`, or `syslog`
   *
   */
  LOG_FORMAT?: 'text' | 'csv' | 'json' | 'syslog';

  /**
   * The `LOG_PRETTY` property determines whether the log output should be
   * formatted in a human-readable way. If set to `'true'`, the log output will
   * be formatted with indentation and line breaks for better readability. If
   * set to `'false'`, the log output will be in a more compact format which is
   * helpful in production because its smaller file size.
   *
   */
  LOG_PRETTY?: 'true' | 'false';

  /**
   * The `LOG_COLORIZE` property determines whether the log messages should be
   * displayed with colors or not. If set to `'true'`, the log messages will be
   * colorized. If set to `'false'`, the log messages will not have any colors.
   * This works only when logging the messages to the console.
   *
   */
  LOG_COLORIZE?: 'true' | 'false';

  /**
   * A boolean value indicating whether to include timestamps in the log
   * messages.
   *
   */
  LOG_TIMESTAMP?: 'true' | 'false';

  /**
   * The `LOG_FILE` property is a string that represents the file name where the
   * log files will be stored.
   *
   * @see {@link https://en.wikipedia.org/wiki/Log_rotation | Wikipedia Log Rotation}
   *
   */
  LOG_FILE?: string;

  /**
   * The `LOG_DIR` property specifies the directory where log files will be
   * stored.
   *
   */
  LOG_DIR?: string;

  /**
   * The maximum size of a log file before it is rotated. It is a string value
   * that represents the size in bytes. For example, "1048576" represents 1MB.
   *
   */
  LOG_MAX_SIZE?: string;

  /**
   * The `LOG_MAX_FILES` property specifies the maximum number of log files to
   * keep before rotating them.
   */
  LOG_MAX_FILES?: string;

  /**
   * The number of backup log files to keep. When the log file reaches its
   * maximum size, a new log file is created and the oldest log file is moved to
   * a backup file. The `LOG_BACKUPS` property determines how many backup files
   * are kept before they are deleted.
   *
   */
  LOG_BACKUPS?: string;

  /**
   * The channel or destination where the logs should be sent. It can be a
   * string representing the name of a channel or a URL where the logs should be
   * sent.
   *
   */
  LOG_CHANNEL?: string;

  /**
   * The `LOG_DEPRECATIONS_CHANNEL` property is a string that represents the
   * channel or destination where deprecation logs should be sent. Deprecation
   * logs are used to track and notify developers about deprecated features or
   * functionalities in a software system.
   *
   */
  LOG_DEPRECATIONS_CHANNEL?: string;
};

/**
 * The environment variables required for connecting to a Redis server.
 *
 */
export type RedisEnvVariables = {
  /**
   * The host or IP address of the Redis server.
   *
   */
  REDIS_HOST?: string;

  /**
   * The port number on which the Redis server is running.
   *
   */
  REDIS_PORT?: string;

  /**
   * That represents the password used to authenticate with the Redis server.
   *
   */
  REDIS_PASSWORD?: string;
};

/**
 * The environment variables required for configuring a mail server.
 *
 */
export type MailEnvVariables = {
  /**
   * The protocol to be used for sending emails. Common values for this property
   * are `smtp` or `smtps`.
   *
   */
  MAIL_PROTOCOL?: string;

  /**
   * The `MAIL_HOST` property represents the hostname or IP address of the mail
   * server that you want to connect to.
   *
   */
  MAIL_HOST?: string;

  /**
   * The port number for the mail server. This is the port that the application
   * will use to establish a connection with the mail server.
   *
   */
  MAIL_PORT?: string;

  /**
   * The `MAIL_USERNAME` property is used to store the username or email address
   * that is used to authenticate with the mail server. This is typically the
   * email address associated with the account that will be used to send emails.
   *
   */
  MAIL_USERNAME?: string;

  /**
   * The password for the email account that will be used to send emails.
   *
   */
  MAIL_PASSWORD?: string;

  /**
   * The encryption method to be used when connecting to the mail server. This
   * property accepts values such as `ssl` or `tls` to indicate the desired
   * encryption protocol.
   *
   *
   */
  MAIL_ENCRYPTION?: string;

  /**
   * The email address that will be used as the `From` address when sending
   * emails.
   *
   */
  MAIL_FROM_ADDRESS?: string;

  /**
   * The `MAIL_FROM_NAME` property represents the name that will be displayed as
   * the sender of the email.
   *
   */
  MAIL_FROM_NAME?: string;
};

/**
 * The environment variables required for authentication in a TypeScript
 * application.
 *
 */
export type AuthEnvVariables = {
  /**
   * The secret key used to sign and verify JSON Web Tokens (JWTs) for
   * authentication.
   *
   */
  JWT_SECRET?: string;

  /**
   * The expiration time for JSON Web Tokens (JWTs). It is a string value that
   * represents the duration of time in seconds after which the JWT will expire.
   * For example, `3600` represents 1 hour
   *
   */
  JWT_EXPIRES_IN?: string;

  /**
   * The JWT_REFRESH_SECRET is a secret key used for generating and verifying
   * refresh tokens in JSON Web Tokens (JWT) authentication. It is used to
   * securely identify and authenticate users when they request a new access
   * token after their previous one has expired.
   *
   */
  JWT_REFRESH_SECRET?: string;

  /**
   * The number of rounds to use when generating a salt for password hashing.
   *
   */
  PASSWORD_SALT_ROUNDS?: string;

  /**
   * The Google client ID is a unique identifier for your application when using
   * Google OAuth for authentication. It is obtained by creating a project in
   * the Google Cloud Console and enabling the Google Sign-In API.
   *
   */
  GOOGLE_CLIENT_ID?: string;

  /**
   * The `GOOGLE_CLIENT_SECRET` is a secret key provided by Google when you
   * create a project in the Google Developer Console. It is used for
   * authenticating your application with Google's OAuth service.
   *
   */
  GOOGLE_CLIENT_SECRET?: string;

  /**
   * The callback URL that Google will redirect to after the user authorizes the
   * application.
   *
   */
  GOOGLE_CALLBACK_URL?: string;

  /**
   * The `FACEBOOK_CLIENT_ID` is the client ID provided by Facebook for your
   * application. It is used to authenticate your application with Facebook's
   * API.
   *
   */
  FACEBOOK_CLIENT_ID?: string;

  /**
   * The `FACEBOOK_CLIENT_SECRET` is a secret key provided by Facebook for
   * authentication purposes. It is used to verify the authenticity of requests
   * made to Facebook's API.
   *
   */
  FACEBOOK_CLIENT_SECRET?: string;

  /**
   * The `FACEBOOK_CALLBACK_URL` is the URL that Facebook will redirect to after
   * the user has authenticated and authorized your application. This URL should
   * be handled by your server to complete the authentication process and
   * retrieve the necessary access tokens from Facebook.
   *
   */
  FACEBOOK_CALLBACK_URL?: string;

  /**
   * The `TWITTER_CLIENT_ID` is the client ID provided by Twitter for your
   * application. It is a unique identifier that is used to authenticate your
   * application with the Twitter API.
   *
   */
  TWITTER_CLIENT_ID?: string;

  /**
   * The `TWITTER_CLIENT_SECRET` is a secret key provided by Twitter for
   * authentication purposes. It is used to verify the identity of the
   * application making requests to the Twitter API.
   *
   */
  TWITTER_CLIENT_SECRET?: string;

  /**
   * The `TWITTER_CALLBACK_URL` is the URL that Twitter will redirect the user
   * to after they have authenticated your application. This URL should be
   * handled by your server to complete the authentication process and retrieve
   * the necessary access tokens.
   *
   */
  TWITTER_CALLBACK_URL?: string;

  /**
   * The `GITHUB_CLIENT_ID` property is used to store the client ID for GitHub
   * authentication. This is typically obtained when you register your
   * application with GitHub and obtain the client ID and client secret.
   *
   */
  GITHUB_CLIENT_ID?: string;

  /**
   * The `GITHUB_CLIENT_SECRET` is a secret key provided by GitHub when you
   * register your application. It is used to authenticate your application when
   * making requests to the GitHub API. It should be kept confidential and not
   * shared publicly.
   *
   */
  GITHUB_CLIENT_SECRET?: string;

  /**
   * The GITHUB_CALLBACK_URL is the URL that GitHub will redirect to after the
   * user has authenticated with their GitHub account. This URL is typically set
   * up in your application's authentication settings on the GitHub developer
   * platform.
   *
   */
  GITHUB_CALLBACK_URL?: string;

  /**
   * The `LINKEDIN_CLIENT_ID` is a unique identifier provided by LinkedIn for
   * your application. It is used to authenticate and authorize your application
   * to access LinkedIn's API on behalf of users.
   *
   */
  LINKEDIN_CLIENT_ID?: string;

  /**
   * The `LINKEDIN_CLIENT_SECRET` is a secret key provided by LinkedIn for
   * authentication purposes. It is used to verify the identity of your
   * application when making API requests to LinkedIn's servers.
   *
   */
  LINKEDIN_CLIENT_SECRET?: string;

  /**
   * The LINKEDIN_CALLBACK_URL is the URL that LinkedIn will redirect to after
   * the user has authenticated and authorized the application. This URL is
   * typically used to handle the callback and retrieve the access token and
   * other necessary information from LinkedIn.
   *
   */
  LINKEDIN_CALLBACK_URL?: string;

  /**
   * The `MICROSOFT_CLIENT_ID` is a unique identifier provided by Microsoft for
   * your application. It is used to authenticate your application with
   * Microsoft services.
   *
   */
  MICROSOFT_CLIENT_ID?: string;

  /**
   * The `MICROSOFT_CLIENT_SECRET` is a secret key that is used for
   * authenticating your application with the Microsoft authentication service.
   * It is a unique identifier that ensures only your application can access the
   * Microsoft APIs on behalf of your users.
   *
   */
  MICROSOFT_CLIENT_SECRET?: string;

  /**
   * The `MICROSOFT_CALLBACK_URL` is the URL where Microsoft will redirect the
   * user after they have authenticated and authorized the application. This URL
   * is typically provided during the registration of the application with
   * Microsoft.
   *
   */
  MICROSOFT_CALLBACK_URL?: string;

  /**
   * The client ID for Apple authentication.
   *
   */
  APPLE_CLIENT_ID?: string;

  /**
   * The `APPLE_CLIENT_SECRET` is a secret key provided by Apple for
   * authenticating with their services. It is used in conjunction with the
   * `APPLE_CLIENT_ID` and `APPLE_CALLBACK_URL` to authenticate users using
   * Apple's Sign In with Apple feature.
   *
   */
  APPLE_CLIENT_SECRET?: string;

  /**
   * The `APPLE_CALLBACK_URL` is the URL where the Apple authentication provider
   * will redirect the user after they have successfully authenticated with
   * their Apple ID. This URL should be handled by your application to complete
   * the authentication process and retrieve the necessary user information from
   * Apple.
   *
   */
  APPLE_CALLBACK_URL?: string;
};

/**
 * The structure of AWS environment variables required for accessing AWS
 * services.
 *
 */
export type AwsEnvVariables = {
  /**
   * The AWS_ACCESS_KEY_ID is a unique identifier that is used to authenticate
   * your access to AWS services. It is associated with your AWS account and is
   * required to make API calls to AWS services.
   *
   */
  AWS_ACCESS_KEY_ID?: string;

  /**
   * The `AWS_SECRET_ACCESS_KEY` is a secret key that is used to authenticate
   * your AWS account when making API requests. It is a sensitive piece of
   * information and should be kept confidential.
   *
   */
  AWS_SECRET_ACCESS_KEY?: string;

  /**
   * The region where your AWS resources are located. This is important because
   * different regions may have different availability zones and services
   * available.
   *
   */
  AWS_REGION?: string;

  /**
   * That represents the name of the Amazon S3 bucket that you want to interact
   * with.
   *
   */
  AWS_S3_BUCKET?: string;
};

/**
 * The environment variables required for sending SMS using Twilio.
 *
 */
export type SmsEnvVariables = {
  /**
   * The TWILIO_ACCOUNT_SID is the unique identifier for your Twilio account. It
   * is used to authenticate and authorize API requests made on behalf of your
   * account.
   *
   */
  TWILIO_ACCOUNT_SID?: string;

  /**
   * The `TWILIO_AUTH_TOKEN` is the authentication token for your Twilio
   * account. It is used to authenticate your requests when sending SMS messages
   * using the Twilio API.
   *
   */
  TWILIO_AUTH_TOKEN?: string;

  /**
   * The `TWILIO_PHONE_NUMBER` property is the phone number associated with your
   * Twilio account. This is the phone number that will be used as the sender
   * when sending SMS messages.
   *
   */
  TWILIO_PHONE_NUMBER?: string;

  /**
   * The `TWILIO_SENDER_PHONE_NUMBER` property is the phone number that will be
   * used as the sender when sending SMS messages using Twilio. This phone
   * number should be a valid phone number that is associated with your Twilio
   * account.
   *
   */
  TWILIO_SENDER_PHONE_NUMBER?: string;

  /**
   * The `TWILIO_SMS_SERVICE_SID` is the unique identifier for the Twilio SMS
   * service that you have set up. It is used to send and receive SMS messages
   * using the Twilio API.
   *
   */
  TWILIO_SMS_SERVICE_SID?: string;
};

export type EnvVariables = ServerEnvVariables &
  AppEnvVariables &
  DatabaseEnvVariables &
  LogEnvVariables &
  RedisEnvVariables &
  MailEnvVariables &
  AuthEnvVariables &
  AwsEnvVariables &
  SmsEnvVariables;

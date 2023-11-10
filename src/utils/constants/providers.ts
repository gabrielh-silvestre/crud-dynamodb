export const ProviderEnum = {
  dynamo: {
    CLIENT: 'DYNAMO_CLIENT',
    OPTIONS: 'DYNAMO_OPTIONS',
    SCHEMA: 'DYNAMO_SCHEMA',
  },

  sqs: {
    OPTIONS: 'SQS_OPTIONS',
  },

  env: {
    AWS_REGION: 'AWS_REGION',
    AWS_ACCESS_KEY: 'AWS_ACCESS_KEY',
    AWS_SECRET_KEY: 'AWS_SECRET_KEY',
    AWS_ENDPOINT: 'AWS_ENDPOINT',

    SQS_REGION: 'SQS_REGION',
    SQS_ACCESS_KEY_ID: 'SQS_ACCESS_KEY_ID',
    SQS_SECRET_KEY: 'SQS_SECRET_ACCESS_KEY',
    SQS_ENDPOINT: 'SQS_ENDPOINT',
    SQS_VISIBILITY_TIMEOUT: 'SQS_VISIBILITY_TIMEOUT',
  },
};

import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'AKIA3FLDXBU6Z2DQ7Q4Z',
  secretAccessKey: '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',
});

export const sns = new AWS.SNS();

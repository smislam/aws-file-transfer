#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsFileTransferStack } from '../lib/aws-file-transfer-stack';

const app = new cdk.App();
new AwsFileTransferStack(app, 'AwsFileTransferStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});
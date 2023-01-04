import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import { join } from 'path';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new Function(this,'Hello-lambda', {
      runtime: Runtime.NODEJS_14_X,
      memorySize:256,
      handler: 'app.handler',
      code: Code.fromAsset(join(__dirname,'../lambdas'))
    })

  }
}

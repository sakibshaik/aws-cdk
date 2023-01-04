import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import { join } from 'path';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class CdkQuotesApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const getQuotes = new Function(this, 'getQuotesLambda', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, '../lambdas')),
      handler: "getQuotes.handler",
    })

    const api = new RestApi(this, 'quotes-api', {
      description: "Quotes API",

    })

    const mainPath = api.root.addResource('quotes');
    mainPath.addMethod("GET", new LambdaIntegration(getQuotes));


  }
}

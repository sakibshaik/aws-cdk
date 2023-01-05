import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from 'path';
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';

export class CdkQuotesApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'Quotes', {
        partitionKey: {name: 'id', type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const handlerFunction = new Function(this, 'quotesHandler', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, '../lambdas')),
      handler: "app.handler",
      environment:{
        MY_TABLE: table.tableName
      }
    })

    //grant permissions to the lambda function to access the dynamodb table
    table.grantReadWriteData(handlerFunction)

    const api = new RestApi(this, 'quotes-api', {
      description: "Quotes API",

    })

    const handleIntegration = new LambdaIntegration(handlerFunction)

    const mainPath = api.root.addResource('quotes');

    mainPath.addMethod("GET", handleIntegration);
    mainPath.addMethod("POST", handleIntegration);


  }
}

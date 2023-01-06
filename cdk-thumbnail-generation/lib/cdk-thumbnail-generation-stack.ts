import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Code, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from 'path';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkThumbnailGenerationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'handler-function-resizeImg',  {
      runtime: Runtime.PYTHON_3_8,
      timeout: cdk.Duration.seconds(30),
      handler: 'app.s3_thumbnail_generator',
      code: Code.fromAsset(join(__dirname, '../lambdas')),
      environment:{
        REGION_NAME: 'us-east-1',
        THUMBNAIL_SIZE: '128'
      }
    });

    const s3Bucket = new s3.Bucket(this, 'photo-bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    s3Bucket.grantReadWrite(handler);

    s3Bucket.addEventNotification(s3.EventType.OBJECT_CREATED,
        new s3n.LambdaDestination(handler));

    handler.addToRolePolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:*'],
          resources:['*'] // s3:putObject or s3:getObject
        })
    )

  }
}

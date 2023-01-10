import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Pipeline, Artifact} from "aws-cdk-lib/aws-codepipeline";
import {GitHubSourceAction} from "aws-cdk-lib/aws-codepipeline-actions";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  const pipeline = new Pipeline(this, 'Pipeline', {
    pipelineName: 'Pipeline',
    crossAccountKeys: false,
  })

    const sourceOutput = new Artifact('SourceOutput');
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new GitHubSourceAction({
          owner: 'sakibshaik',
          repo: 'aws-cdk',
          branch: 'main',
          actionName: 'Pipeline Source',
          oauthToken: cdk.SecretValue.secretsManager('github-token'),
          output: sourceOutput,
        })
      ]

    })

  }
}

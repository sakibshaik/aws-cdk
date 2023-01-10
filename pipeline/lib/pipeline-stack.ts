import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Pipeline, Artifact} from "aws-cdk-lib/aws-codepipeline";
import {
  CloudFormationCreateUpdateStackAction,
  CodeBuildAction,
  GitHubSourceAction
} from "aws-cdk-lib/aws-codepipeline-actions";
import {PipelineProject, BuildSpec, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";

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
          actionName: 'PipelineSource',
          oauthToken: cdk.SecretValue.secretsManager('github-token'),
          output: sourceOutput,
        })
      ]

    })

    const cdkBuildOutpout = new Artifact('CdkBuildOutput');

    pipeline.addStage(
        {
          stageName: "Build",
          actions:[new CodeBuildAction({
            actionName: "CdkBuild",
            input: sourceOutput,
            outputs: [cdkBuildOutpout],
            project: new PipelineProject(this, 'CdkBuild', {
              environment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
              },
              buildSpec: BuildSpec.fromSourceFilename('pipeline/build-spec/cdk-build-spec.yml'),
            })
          })]
        }
    )

    pipeline.addStage({
      stageName: "PipelineUpdate",
      actions:[
          new CloudFormationCreateUpdateStackAction({
            actionName: "PipelineUpdate",
            stackName: "PipelineStack",
            templatePath: cdkBuildOutpout.atPath('PipelineStack.template.json'),
            adminPermissions: true,
          })
      ]
    })

  }
}

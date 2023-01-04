# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

setting up aws:
- Install aws cli from https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configure aws cli with your credentials
  - aws configure
  - enter your access key id
  - enter your secret access key
  - enter your region
  - enter your output format
  - check if your credentials are correct by running `aws sts get-caller-identity`
- Install aws cdk with npm install -g aws-cdk
- 

Steps to create this project:

- initialize the project with `cdk init app --language typescript`
- create a lambda in lambdas directory app.js
- provision a lambda with props in lib/hello-cdk-stack.ts
    - ```typescript
          const handler = new Function(this,'Hello-lambda', {
          runtime: Runtime.NODEJS_14_X,
          memorySize:256,
          handler: 'app.handler',
          code: Code.fromAsset(join(__dirname,'../lambdas'))
      })
      ```
- run `cdk bootstrap` to create the cdk toolkit stack
- run `cdk synth` to see the cloudformation template
- run `cdk deploy` to deploy the stack

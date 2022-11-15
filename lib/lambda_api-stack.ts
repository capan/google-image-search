import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LambdaApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "ImageHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "image.main",
    });

    const api = new apigateway.RestApi(this, "image-url-api", {
      restApiName: "Image Url Service",
      description: "This service serves images.",
      defaultCorsPreflightOptions: {
        allowOrigins: ["https://kicky.club"],
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    const getImagesIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    api.root.addMethod("GET", getImagesIntegration);
  }
}

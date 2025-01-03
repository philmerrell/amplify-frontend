import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as dotenv from 'dotenv';
dotenv.config();

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sslCertArn = process.env.SSL_CERT_ARN || '';
    const subdomain: string = process.env.SUBDOMAIN || '';
    const domainName: string = process.env.DOMAIN_NAME || '';

    const zone = route53.HostedZone.fromLookup(this, 'GetHostedZone', {
      domainName,
    });

    new cdk.CfnOutput(this, 'Site', {
      value: `https://${subdomain}.${domainName}`
    });

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${subdomain}.${domainName}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    const cert = Certificate.fromCertificateArn(this, 'GetCert', sslCertArn);

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      domainNames: [`${subdomain}.${domainName}`],
      certificate: cert,
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: `${subdomain}.${domainName}`,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    new s3Deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Deploy.Source.asset('../client/www')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}

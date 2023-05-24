import * as cdk from 'aws-cdk-lib';
import { Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CfnServer, CfnUser } from 'aws-cdk-lib/aws-transfer';
import { Construct } from 'constructs';

export class AwsFileTransferStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const servicePrincipal = 'transfer.amazonaws.com';
    const vpc = new Vpc(this, 'file-vpc', {});

    const fileBucket = new Bucket(this, 'file-drop-bucket', {
      bucketName: 'file-drop-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY      
    });

    const userRole = new Role(this, 'fileUser', {
      assumedBy: new ServicePrincipal(servicePrincipal)
    });

    //Giving full access to the bucket for simplicity and for this POC.  Restrict to a folder for operational usages
    fileBucket.grantReadWrite(userRole);

    const logRole = new Role(this, 'logRole', {
      assumedBy: new ServicePrincipal(servicePrincipal),
    });    
    logRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSTransferLoggingAccess'));

    const sFtpSG = new SecurityGroup(this, 'sftp-sg', { vpc });

    const sftpServer = new CfnServer(this, 'sftp-server', {
      // certificate - required for FTPS 
      domain: 'S3',     
      protocols: ['SFTP'],
      loggingRole: logRole.roleArn,
      endpointType: 'PUBLIC'
    });

    // The user cration should be in its own stack.
    const publicKey = StringParameter.valueForStringParameter(this, 'sftpUserPublicKey');

    const serviceUser = new CfnUser(this, 'sftp-user', {
      userName: 'sftpuser',
      role: userRole.roleArn,
      serverId: sftpServer.attrServerId,
      homeDirectoryType: 'PATH',
      homeDirectory: `/${fileBucket.bucketName}/sftpuser/`,
      sshPublicKeys: [publicKey]
    });
  }
}

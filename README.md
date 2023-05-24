# An Example of AWS Transfer Family using AWS CDK

This example creates an AWS Transfer Family Server and an User.  Only supports SFTP.  It is deployed using AWS CDK.

## Steps to run
* Run the pipeline. Wait for the pipeline to finish.  The server will be created.
* Run the following command on your command window to create a Public and Private Certs: `sftpuser` and `sftpuser.pub`
  * `ssh-keygen -t rsa -b 4096 -f sftpuser`
* Once you have the certs, get the content of the `sftpuser.pub` and we will have to add it to the user...
* Log into AWS Console.  Go to AWS Transfer Family, Find your server and click on it.  Click on the `sftpuser` under Users.  Then in the SSH Public Keys section, click on `Add SSH Public Key` and then paste your public key.
  * ![image](sftp-user-public-key.PNG "Add SSH Public Key")
* We need a SFTP client.  Download WinSCP from their website.
* Once installed, lets setup the connection and user information.
* First get the Server endpoint and username from AWS.  Go to AWS Transfer Family, Find your server and click on it.
  * ![image](sftp-server-endpoint.PNG "WinSCP Login")
* Add the information to WinSCP
  * ![image](sftp-winscp-login.PNG "WinSCP Login")
* Click on the Advanced button.  We are going to setup Private key file for SSH connection.
  * ![image](sftp-winscp-private-key.PNG "Add private Key")
* WinSCP will convert the private key file to .ppk extension.  Convert the fileusing the prompts and click ok.
  * ![image](sftp-winscp-ppk.PNG "WinSCP convert private key file to .ppk")
* Now click on the Login Button and you should be logged in.
  * ![image](sftp-winscp-login-complete.PNG "WinSCP Logs on to AWS Transfer Server")
* Now find a local file to your left and drag it to right.  You should see that is mapped to the S3 Bucket where we need to store the file.
  * ![image](sftp-winscp-send-file.PNG "WinSCP Sends a file to AWS Transfer Server managed S3 bucket")
* Now go to AWS S3 Bucket and see your file.
  * ![image](sftp-s3-file.PNG "File in S3 bucket")

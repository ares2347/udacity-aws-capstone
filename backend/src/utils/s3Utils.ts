import * as AWS from 'aws-sdk'

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export function getS3PutSignedUrl(attachmentId : string): string {
    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: parseInt(urlExpiration)
    })
    
    return uploadUrl
  }

export function getS3PublicUrl (attachmentId : string): string {
    return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;
}
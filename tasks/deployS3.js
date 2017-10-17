'use strict';

module.exports = (grunt) => {
  grunt.registerTask('deployS3', 'Deploy to s3.', function(destination) {
    var done = this.async();

    const s3 = require('s3');
    const awsAccess = process.env.AWS_ACCESS_KEY_ID;
    const awsSecret = process.env.AWS_SECRET_ACCESS_KEY;

    const config = require("../project.config");

    const s3_bucket = destination === "prod" ? "apps.statesman.com" : "dev.apps.statesman.com";

    // check for AWS environmental variables
    if (awsAccess && awsSecret) {
      // set up an S3 client
      const client = s3.createClient({
        maxAsyncS3: 20,
        s3RetryCount: 3,
        s3RetryDelay: 1000,
        multipartUploadThreshold: 20971520,
        multipartUploadSize: 15728640,
        s3Options: {
          accessKeyId: awsAccess,
          secretAccessKey: awsSecret,
          region: 'us-west-2'
        }
      });

      // set the upload params
      const params = {
        localDir: "./public",
        deleteRemoved: false,
        s3Params: {
          Bucket: s3_bucket,
          Prefix: config.sitePath,
          ACL: 'public-read',
          CacheControl: 'max-age=60'
        }
      };

      // upload!
      const uploader = client.uploadDir(params);

      uploader.on('error', function(err) {
        grunt.log.error("unable to sync:", err.stack);
        done(Error);
      });
      uploader.on('progress', function() {
        grunt.verbose.write(s3_bucket, "upload progress", uploader.progressAmount, uploader.progressTotal, "\n");
      });
      uploader.on('end', function() {
        grunt.log.ok("🐿  🐿  🐿  you deployed to " + s3_bucket);
        done();
      });
    } else {
      grunt.fatal('You\'re missing one or both AWS credential environmental variables.');
      done(Error);
    }
  });
};

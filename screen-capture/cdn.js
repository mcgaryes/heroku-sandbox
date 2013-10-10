var cloudinary = require('cloudinary'),
    fs = require('fs'),
    request = require('request');

/**
 * connect to cloudinary
 *
 * @method connect
 * @param {Object} delegate
 * @param {Function} callback(err)
 * @private
 */
var connect = function(delegate, callback){

    if (delegate.connection === undefined){

        var config = process.env.CLOUDINARYURI || process.env.CLOUDINARY_URL; 

        if (config !== undefined){

            delegate.connection = {
                cloud_name  : config.replace(/^.*@(.*)$/, '$1'),
                api_key     : config.replace(/^cloudinary:\/\/([^:]+).*$/, '$1'),
                api_secret  : config.replace(/^cloudinary:[^:]+:([^@]+).*$/, '$1')
            };

            cloudinary.config(delegate.connection);

            callback(undefined);

        } else {

            callback('config was not found');

        }

    } else {
        
        // already connected
        callback(undefined);

    }

};

/**
 * cdn wrapper for cloudinary
 *
 * @class cdn
 */
module.exports = {

    /**
     * cloudinary connection
     */
    connection: undefined,

    /**
     * upload image to cloudinary
     *
     * @method upload
     * @param {String} image may be path, url, or raw data
     * @param {Function} callback(err, result)
     */
    upload: function(image, callback){

        connect(this, function(err){

            // connection failed
            if (err){
                callback(err, undefined);
                return;
            }

            // determine image "type"
            var type = 'data';
            if (typeof image === 'string'){
                if (/^https*:/.test(image)){
                    type = 'url';
                //} else if (/(PNG|GIF|JPG|JPEG|BMP)/.test(image)){
                    //type = 'data';
                } else if (fs.existsSync(image)){
                    type = 'path';
                }
            }

            switch(type){

                // urls and paths
                case 'url':
                case 'path':
                    cloudinary.uploader.upload(image, function(result){
                        if (result.error){
                            callback(result.error.message, undefined);
                        } else {
                            callback(undefined, result);
                        }
                    });
                break;

                // raw data
                case 'data':
                    var uploadStream = cloudinary.uploader.upload_stream(function(result){
                        if (result.error){
                            callback(result.error.message, undefined);
                        } else {
                            callback(undefined, result);
                        }
                    });
                    uploadStream.write(image);
                    uploadStream.end();
                break;

                // undefined
                default:
                    callback('Image to be uploaded must be a url, file path, or data string', undefined);
                break;
            }

        });

    }

};


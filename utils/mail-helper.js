/**
* Wrapper functionality for sendmail
*/
var path = require('path')
, nodemailer = require('nodemailer')
, smtpPool = require('nodemailer-smtp-pool')
, fs = require("fs")
, _ = require("underscore");

// create reusable transports
var transport = null;
var transportErrorLog = null; // this uses preview to save failed emails to a directory

// setup e-mail data with unicode symbols
var mailOptions = {
  from: "", // sender address
  to: "", // list of receivers
  subject: "", // Subject line
  text: "", // plaintext body
  html: "", // html body
  host: null,
  port: null,
  service: null,
  auth: {},
  sendEmailFlag: false,
  secureConnection: false,
  previewDir: '../mailLog/testPreview',
  errDir: '../mailLog/error'
};

/**
 * Helper method available to the MailHelper module
 *
 * @param {String} recipient
 * @param {String} subject
 * @param {String} body
 * @param {Boolean} htmlFlag
 */
 function sendMailHelper(recipient, subject, body, htmlFlag) {
  if (null === transport) {
    createTransport();
  }

  var sendOptions = {};

  sendOptions = mailOptions;
  sendOptions.from = mailOptions.from;
  sendOptions.to = recipient;
  sendOptions.subject = subject;
  if (true === htmlFlag) {
    sendOptions.html = body;
  } else {
    sendOptions.text = body;
  }

  transport.sendMail(sendOptions, function(error, response) {
    if (error) {
      console.log('sendMail ' + error);
      // email failed, send to the error log directory
      transportErrorLog.sendMail(error);
    } else {
      if (response) { console.log("Message sent: " + JSON.stringify(response)); }
    }
  });
}

/**
 * Create the transports
 * There are 2 transports, the primary, and the secondary which saves failed emails
 */
 function createTransport() {
  if (null !== transport) {
    closeConnection();
  }
  require('mail-preview');
  if (true === mailOptions.sendEmailFlag) {
    transport = nodemailer.createTransport("SMTP",{
      service: mailOptions.service,
      host: mailOptions.host,
      port: mailOptions.port,
      auth: mailOptions.auth,
      from: mailOptions.from,

      secureConnection: mailOptions.secureConnection
    });
  } else {
    // For email previews
    var tmpdir = path.join(__dirname, mailOptions.previewDir, 'nodemailer');

    transport = nodemailer.createTransport('MailPreview', {
      dir: tmpdir,  // defaults to ./tmp/nodemailer
      browser: mailOptions.browserPreview // open sent email in browser
    });
  }
  // For email error logging
  var tmpErr = path.join(__dirname, mailOptions.errDir, 'nodemailer');
  transportErrorLog = nodemailer.createTransport('MailPreview', {
    dir: tmpErr,  // defaults to ./tmp/nodemailer
    browser: mailOptions.browserPreview // open sent email in browser
  });
}

/**
 * Close the connections
 */
 function closeConnection() {
  if (null !== transport) {
    transport.close(); // shut down the connection pool, no more messages
  }
  transport = null;

  if (null !== transportErrorLog) {
    transportErrorLog.close(); // shut down the connection pool, no more messages
  }
  transportErrorLog = null;
}

/**
 * Generates a MailHelper object which is the main 'hub' for managing the
 * send process
 *
 * @constructor
 * @param {Object} options Message options object, see README for the complete list of possible options
 */
 var MailHelper = function(config) {
  this.initialize(config);
};

/**
 * Initializes properties
 *
 * @constructor
 * @param {Object} options Message options object, see README for the complete list of possible options
 */
 MailHelper.prototype.initialize = function(appConfig){
  if (!appConfig.mailSettings) { throw "no options provided, some are required"; }
  if (!appConfig.mailSettings.from) { throw "cannot send email without send address"; }
  if (!appConfig.mailSettings.mailService && !appConfig.mailSettings.host && !appConfig.mailSettings.port) {
    throw "mailService or host and port are required";
  }
  if (!appConfig.mailSettings.mailAuth) { throw "Authorization required"; }

  mailOptions.from = appConfig.mailSettings.from;

  if (appConfig.mailSettings.mailService) { mailOptions.service = appConfig.mailSettings.service; }
  if (appConfig.mailSettings.host) {
    mailOptions.host = appConfig.mailSettings.host;
    mailOptions.port = appConfig.mailSettings.port;
  }

  mailOptions.auth = appConfig.mailSettings.mailAuth;
  mailOptions.sendEmailFlag = appConfig.mailSettings.sendEmailFlag;
  mailOptions.secureConnection = appConfig.mailSettings.secureConnection;
  mailOptions.browserPreview = appConfig.mailSettings.browserPreview;

  if (appConfig.mailSettings.previewDir) {
    mailOptions.previewDir = appConfig.mailSettings.previewDir;
  }
  if (appConfig.mailSettings.errDir) {
    mailOptions.errDir = appConfig.mailSettings.errDir;
  }
};



/**
 * Helper method to perform basic email validation
 *
 * @param {String} email
 */
 MailHelper.prototype.validateEmail = function(email) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return filter.test(email);
};


/**
 * Send mail with defined transport object
 *
 * @param recipient email address
 * @param subject
 * @param body
 * @param htmlFlag if true, body is html
 */
 MailHelper.prototype.sendMail = function(recipient, subject, body, htmlFlag) {
  sendMailHelper(recipient, subject, body, htmlFlag);
};



// Export MailHelper constructor
module.exports.MailHelper = MailHelper;







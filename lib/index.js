const SplunkLogger = require('splunk-logging').Logger;

let _splunkConfig; // Define _splunkConfig variable
let _index; // Define _index variable
let Logger; // Define Logger variable

/**
 *
 * @method init
 * @description initiate the configuration for splunk
 * @param {*} splunkConfig
 * @returns
 */
function init (splunkConfig) {
  if (!splunkConfig) {
    throw new Error('No Splunk Token and URL specified');
  }
  _splunkConfig = splunkConfig;
  _index = splunkConfig.index ? splunkConfig.index : 'main';
  Logger = new SplunkLogger(_splunkConfig);

  return context => {
    return context;
  };
}

/**
 *
 * @method initateSplunkMetaData
 * @param {*} splunkMetadata
 * @param {*} context
 * @returns
 */
function initateSplunkMetaData (splunkMetadata, context) {
  if (Object.keys(splunkMetadata).length === 0) {
    splunkMetadata = {
      source: context.path,
      sourcetype: context.params.provider,
      index: _index,
      host: context.app.settings.host,
      port: context.app.settings.port
    };
  }
  return splunkMetadata;
}

/**
 *
 * @method initiatePayload
 * @param {*} context
 * @param {*} splunkMetadata
 * @returns
 */
function initiatePayload (context, splunkMetadata) {
  let _messageForPayload = getPayloadItems(context);
  let _severity = 'info';
  if (context.type === 'error') {
    const _err = context.error;
    _messageForPayload = {
      message: _err.message,
      name: _err.name,
      code: _err.code,
      className: _err.className,
      info: _err.info,
      data: _err.dat
    };
    _severity = 'error';
  }

  const payload = {
    message: _messageForPayload,
    metadata: splunkMetadata,
    severity: _severity
  };

  return payload;
}

/**
 *
 * @method getPayloadItems
 * @param {*} context
 * @returns
 */
function getPayloadItems (context) {
  const _messageForPayload = (context.type === 'before') ? context.data : context.result;
  return _messageForPayload && context.method === 'find'
    ? _messageForPayload.data || _messageForPayload
    : _messageForPayload;
}

/**
 *
 * @method splunkHooks
 * @param {*} [splunkMetadata={}]
 * @returns
 */
function splunkHooks (splunkMetadata = {}) {
  return context => {
    splunkMetadata = initateSplunkMetaData(splunkMetadata, context);

    const payload = initiatePayload(context, splunkMetadata);

    sendLogToSplunk(payload);
    return context;
  };
}

/**
 *
 * @method sendLogToSplunk
 * @param {*} payload
 */
function sendLogToSplunk (payload) {
  Logger.send(payload, function (err, resp, body) {
    if (!err) {
      console.log('Successfully sent the message to splunk', body);
    }
  });
}

module.exports.splunkHooks = splunkHooks;
module.exports.splunk = init;

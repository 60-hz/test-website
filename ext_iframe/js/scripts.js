var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 877:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const ConsumableStream = __webpack_require__(319);

class AGChannel extends ConsumableStream {
  constructor(name, client, eventDemux, dataDemux) {
    super();
    this.PENDING = AGChannel.PENDING;
    this.SUBSCRIBED = AGChannel.SUBSCRIBED;
    this.UNSUBSCRIBED = AGChannel.UNSUBSCRIBED;

    this.name = name;
    this.client = client;

    this._eventDemux = eventDemux;
    this._dataStream = dataDemux.stream(this.name);
  }

  createConsumer(timeout) {
    return this._dataStream.createConsumer(timeout);
  }

  listener(eventName) {
    return this._eventDemux.stream(`${this.name}/${eventName}`);
  }

  close() {
    this.client.closeChannel(this.name);
  }

  kill() {
    this.client.killChannel(this.name);
  }

  killOutputConsumer(consumerId) {
    if (this.hasOutputConsumer(consumerId)) {
      this.client.killChannelOutputConsumer(consumerId);
    }
  }

  killListenerConsumer(consumerId) {
    if (this.hasAnyListenerConsumer(consumerId)) {
      this.client.killChannelListenerConsumer(consumerId);
    }
  }

  getOutputConsumerStats(consumerId) {
    if (this.hasOutputConsumer(consumerId)) {
      return this.client.getChannelOutputConsumerStats(consumerId);
    }
    return undefined;
  }

  getListenerConsumerStats(consumerId) {
    if (this.hasAnyListenerConsumer(consumerId)) {
      return this.client.getChannelListenerConsumerStats(consumerId);
    }
    return undefined;
  }

  getBackpressure() {
    return this.client.getChannelBackpressure(this.name);
  }

  getListenerConsumerBackpressure(consumerId) {
    if (this.hasAnyListenerConsumer(consumerId)) {
      return this.client.getChannelListenerConsumerBackpressure(consumerId);
    }
    return 0;
  }

  getOutputConsumerBackpressure(consumerId) {
    if (this.hasOutputConsumer(consumerId)) {
      return this.client.getChannelOutputConsumerBackpressure(consumerId);
    }
    return 0;
  }

  closeOutput() {
    this.client.channelCloseOutput(this.name);
  }

  closeListener(eventName) {
    this.client.channelCloseListener(this.name, eventName);
  }

  closeAllListeners() {
    this.client.channelCloseAllListeners(this.name);
  }

  killOutput() {
    this.client.channelKillOutput(this.name);
  }

  killListener(eventName) {
    this.client.channelKillListener(this.name, eventName);
  }

  killAllListeners() {
    this.client.channelKillAllListeners(this.name);
  }

  getOutputConsumerStatsList() {
    return this.client.channelGetOutputConsumerStatsList(this.name);
  }

  getListenerConsumerStatsList(eventName) {
    return this.client.channelGetListenerConsumerStatsList(this.name, eventName);
  }

  getAllListenersConsumerStatsList() {
    return this.client.channelGetAllListenersConsumerStatsList(this.name);
  }

  getOutputBackpressure() {
    return this.client.channelGetOutputBackpressure(this.name);
  }

  getListenerBackpressure(eventName) {
    return this.client.channelGetListenerBackpressure(this.name, eventName);
  }

  getAllListenersBackpressure() {
    return this.client.channelGetAllListenersBackpressure(this.name);
  }

  hasOutputConsumer(consumerId) {
    return this.client.channelHasOutputConsumer(this.name, consumerId);
  }

  hasListenerConsumer(eventName, consumerId) {
    return this.client.channelHasListenerConsumer(this.name, eventName, consumerId);
  }

  hasAnyListenerConsumer(consumerId) {
    return this.client.channelHasAnyListenerConsumer(this.name, consumerId);
  }

  get state() {
    return this.client.getChannelState(this.name);
  }

  set state(value) {
    throw new Error('Cannot directly set channel state');
  }

  get options() {
    return this.client.getChannelOptions(this.name);
  }

  set options(value) {
    throw new Error('Cannot directly set channel options');
  }

  subscribe(options) {
    this.client.subscribe(this.name, options);
  }

  unsubscribe() {
    this.client.unsubscribe(this.name);
  }

  isSubscribed(includePending) {
    return this.client.isSubscribed(this.name, includePending);
  }

  transmitPublish(data) {
    return this.client.transmitPublish(this.name, data);
  }

  invokePublish(data) {
    return this.client.invokePublish(this.name, data);
  }
}

AGChannel.PENDING = 'pending';
AGChannel.SUBSCRIBED = 'subscribed';
AGChannel.UNSUBSCRIBED = 'unsubscribed';

module.exports = AGChannel;


/***/ }),

/***/ 811:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const scErrors = __webpack_require__(407);
const InvalidActionError = scErrors.InvalidActionError;

function AGRequest(socket, id, procedureName, data) {
  this.socket = socket;
  this.id = id;
  this.procedure = procedureName;
  this.data = data;
  this.sent = false;

  this._respond = (responseData, options) => {
    if (this.sent) {
      throw new InvalidActionError(`Response to request ${this.id} has already been sent`);
    }
    this.sent = true;
    this.socket.sendObject(responseData, options);
  };

  this.end = (data, options) => {
    let responseData = {
      rid: this.id
    };
    if (data !== undefined) {
      responseData.data = data;
    }
    this._respond(responseData, options);
  };

  this.error = (error, options) => {
    let responseData = {
      rid: this.id,
      error: scErrors.dehydrateError(error)
    };
    this._respond(responseData, options);
  };
}

module.exports = AGRequest;


/***/ }),

/***/ 307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const StreamDemux = __webpack_require__(157);

function AsyncStreamEmitter(options) {
  this._listenerDemux = new StreamDemux();
}

AsyncStreamEmitter.prototype.emit = function (eventName, data) {
  this._listenerDemux.write(eventName, data);
};

AsyncStreamEmitter.prototype.listener = function (eventName) {
  return this._listenerDemux.stream(eventName);
};

AsyncStreamEmitter.prototype.closeListener = function (eventName) {
  this._listenerDemux.close(eventName);
};

AsyncStreamEmitter.prototype.closeAllListeners = function () {
  this._listenerDemux.closeAll();
};

AsyncStreamEmitter.prototype.removeListener = function (eventName) {
  this._listenerDemux.unstream(eventName);
};

AsyncStreamEmitter.prototype.getListenerConsumerStats = function (consumerId) {
  return this._listenerDemux.getConsumerStats(consumerId);
};

AsyncStreamEmitter.prototype.getListenerConsumerStatsList = function (eventName) {
  return this._listenerDemux.getConsumerStatsList(eventName);
};

AsyncStreamEmitter.prototype.getAllListenersConsumerStatsList = function () {
  return this._listenerDemux.getConsumerStatsListAll();
};

AsyncStreamEmitter.prototype.getListenerConsumerCount = function (eventName) {
  return this._listenerDemux.getConsumerCount(eventName);
};

AsyncStreamEmitter.prototype.getAllListenersConsumerCount = function () {
  return this._listenerDemux.getConsumerCountAll();
};

AsyncStreamEmitter.prototype.killListener = function (eventName) {
  this._listenerDemux.kill(eventName);
};

AsyncStreamEmitter.prototype.killAllListeners = function () {
  this._listenerDemux.killAll();
};

AsyncStreamEmitter.prototype.killListenerConsumer = function (consumerId) {
  this._listenerDemux.killConsumer(consumerId);
};

AsyncStreamEmitter.prototype.getListenerBackpressure = function (eventName) {
  return this._listenerDemux.getBackpressure(eventName);
};

AsyncStreamEmitter.prototype.getAllListenersBackpressure = function () {
  return this._listenerDemux.getBackpressureAll();
};

AsyncStreamEmitter.prototype.getListenerConsumerBackpressure = function (consumerId) {
  return this._listenerDemux.getConsumerBackpressure(consumerId);
};

AsyncStreamEmitter.prototype.hasListenerConsumer = function (eventName, consumerId) {
  return this._listenerDemux.hasConsumer(eventName, consumerId);
};

AsyncStreamEmitter.prototype.hasAnyListenerConsumer = function (consumerId) {
  return this._listenerDemux.hasConsumerAll(consumerId);
};

module.exports = AsyncStreamEmitter;


/***/ }),

/***/ 248:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 521:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(248)
var ieee754 = __webpack_require__(789)
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.hp = Buffer
__webpack_unused_export__ = SlowBuffer
exports.IS = 50

var K_MAX_LENGTH = 0x7fffffff
__webpack_unused_export__ = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.IS
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()


/***/ }),

/***/ 617:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/**
 * Module dependenices
 */

const clone = __webpack_require__(273);
const typeOf = __webpack_require__(965);
const isPlainObject = __webpack_require__(633);

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default: {
      return clone(val);
    }
  }
}

function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone);
    }
    return res;
  }
  return val;
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;


/***/ }),

/***/ 319:
/***/ (function(module) {

class ConsumableStream {
  async next(timeout) {
    let asyncIterator = this.createConsumer(timeout);
    let result = await asyncIterator.next();
    asyncIterator.return();
    return result;
  }

  async once(timeout) {
    let result = await this.next(timeout);
    if (result.done) {
      // If stream was ended, this function should never resolve.
      await new Promise(() => {});
    }
    return result.value;
  }

  createConsumer() {
    throw new TypeError('Method must be overriden by subclass');
  }

  [Symbol.asyncIterator]() {
    return this.createConsumer();
  }
}

module.exports = ConsumableStream;


/***/ }),

/***/ 789:
/***/ (function(__unused_webpack_module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 633:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



var isObject = __webpack_require__(20);

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};


/***/ }),

/***/ 20:
/***/ (function(module) {

"use strict";
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};


/***/ }),

/***/ 300:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const CryptoJS = __webpack_require__(31);

/**
 * Default options for JWT signature
 */
const defaultHeader = { alg: 'HS256', typ: 'JWT' };

/**
 * Return a base64 URL
 *
 * @param {string} data - some data to be base64 encoded
 * @return {string} A base64url encoded string
 */
function base64url (data) {
  return CryptoJS.enc.Base64
    .stringify(data)
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Create a very basic JWT signature
 *
 * @param {Object} data - the data object you want to have signed
 * @param {string} secret - secret to use to sign token with
 * @param {Object} options - JWT header options
 * @return {string} JSON Web Token that has been signed
 */
function sign (data, secret, options = {}) {
  const header = Object.assign(defaultHeader, options);
  if (header.alg !== 'HS256' && header.typ !== 'JWT') {
    throw new Error('jwt-encode only support the HS256 algorithm and the JWT type of hash');
  }

  const encodedHeader = encode(header);
  const encodedData = encode(data);

  let signature = `${encodedHeader}.${encodedData}`;
  signature = CryptoJS.HmacSHA256(signature, secret);
  signature = base64url(signature);
  return `${encodedHeader}.${encodedData}.${signature}`;
}

/**
 *  Safely base64url encode a JS Object in a way that is UTF-8 safe
 *
 *  @param {Object} Javascript object payload to be encoded
 *  @return {string} utf-8 safe base64url encoded payload
 */
function encode (data) {
  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  return base64url(stringifiedData);
}

module.exports = sign;


/***/ }),

/***/ 965:
/***/ (function(module) {

var toString = Object.prototype.toString;

module.exports = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}


/***/ }),

/***/ 917:
/***/ (function(module) {

"use strict";


// Expose.
module.exports = List

List.Item = ListItem

var ListPrototype = List.prototype
var ListItemPrototype = ListItem.prototype
var IterPrototype = Iter.prototype

/* istanbul ignore next */
var $iterator = typeof Symbol === 'undefined' ? undefined : Symbol.iterator

ListPrototype.tail = ListPrototype.head = null

List.of = of
List.from = from

ListPrototype.toArray = toArray
ListPrototype.prepend = prepend
ListPrototype.append = append

/* istanbul ignore else */
if ($iterator !== undefined) {
  ListPrototype[$iterator] = iterator
}

ListItemPrototype.next = ListItemPrototype.prev = ListItemPrototype.list = null

ListItemPrototype.prepend = prependItem
ListItemPrototype.append = appendItem
ListItemPrototype.detach = detach

IterPrototype.next = next

// Constants.
var errorMessage =
  'An argument without append, prepend, or detach methods was given to `List'

// Creates a new List: A linked list is a bit like an Array, but knows nothing
// about how many items are in it, and knows only about its first (`head`) and
// last (`tail`) items.
// Each item (e.g. `head`, `tail`, &c.) knows which item comes before or after
// it (its more like the implementation of the DOM in JavaScript).
function List(/* items... */) {
  this.size = 0

  if (arguments.length !== 0) {
    appendAll(this, arguments)
  }
}

// Creates a new list from the arguments (each a list item) passed in.
function appendAll(list, items) {
  var length
  var index
  var item
  var iter

  if (!items) {
    return list
  }

  if ($iterator !== undefined && items[$iterator]) {
    iter = items[$iterator]()
    item = {}

    while (!item.done) {
      item = iter.next()
      list.append(item && item.value)
    }
  } else {
    length = items.length
    index = -1

    while (++index < length) {
      list.append(items[index])
    }
  }

  return list
}

// Creates a new list from the arguments (each a list item) passed in.
function of(/* items... */) {
  return appendAll(new this(), arguments)
}

// Creates a new list from the given array-like object (each a list item) passed
// in.
function from(items) {
  return appendAll(new this(), items)
}

// Returns the list’s items as an array.
// This does *not* detach the items.
function toArray() {
  var item = this.head
  var result = []

  while (item) {
    result.push(item)
    item = item.next
  }

  return result
}

// Prepends the given item to the list.
// `item` will be the new first item (`head`).
function prepend(item) {
  var self = this
  var head = self.head

  if (!item) {
    return false
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + '#prepend`.')
  }

  if (head) {
    return head.prepend(item)
  }

  item.detach()

  item.list = self
  self.head = item
  self.size++

  return item
}

// Appends the given item to the list.
// `item` will be the new last item (`tail`) if the list had a first item, and
// its first item (`head`) otherwise.
function append(item) {
  if (!item) {
    return false
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + '#append`.')
  }

  var self = this
  var head = self.head
  var tail = self.tail

  // If self has a last item, defer appending to the last items append method,
  // and return the result.
  if (tail) {
    return tail.append(item)
  }

  // If self has a first item, defer appending to the first items append method,
  // and return the result.
  if (head) {
    return head.append(item)
  }

  // …otherwise, there is no `tail` or `head` item yet.

  item.detach()

  item.list = self
  self.head = item
  self.size++

  return item
}

// Creates an iterator from the list.
function iterator() {
  return new Iter(this.head)
}

// Creates a new ListItem:
// An item is a bit like DOM node: It knows only about its "parent" (`list`),
// the item before it (`prev`), and the item after it (`next`).
function ListItem() {}

// Detaches the item operated on from its parent list.
function detach() {
  var self = this
  var list = self.list
  var prev = self.prev
  var next = self.next

  if (!list) {
    return self
  }

  // If self is the last item in the parent list, link the lists last item to
  // the previous item.
  if (list.tail === self) {
    list.tail = prev
  }

  // If self is the first item in the parent list, link the lists first item to
  // the next item.
  if (list.head === self) {
    list.head = next
  }

  // If both the last and first items in the parent list are the same, remove
  // the link to the last item.
  if (list.tail === list.head) {
    list.tail = null
  }

  // If a previous item exists, link its next item to selfs next item.
  if (prev) {
    prev.next = next
  }

  // If a next item exists, link its previous item to selfs previous item.
  if (next) {
    next.prev = prev
  }

  // Remove links from self to both the next and previous items, and to the
  // parent list.
  self.prev = self.next = self.list = null

  list.size--

  return self
}

// Prepends the given item *before* the item operated on.
function prependItem(item) {
  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + 'Item#prepend`.')
  }

  var self = this
  var list = self.list
  var prev = self.prev

  // If self is detached, return false.
  if (!list) {
    return false
  }

  // Detach the prependee.
  item.detach()

  // If self has a previous item...
  if (prev) {
    item.prev = prev
    prev.next = item
  }

  // Connect the prependee.
  item.next = self
  item.list = list

  // Set the previous item of self to the prependee.
  self.prev = item

  // If self is the first item in the parent list, link the lists first item to
  // the prependee.
  if (self === list.head) {
    list.head = item
  }

  // If the the parent list has no last item, link the lists last item to self.
  if (!list.tail) {
    list.tail = self
  }

  list.size++

  return item
}

// Appends the given item *after* the item operated on.
function appendItem(item) {
  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + 'Item#append`.')
  }

  var self = this
  var list = self.list
  var next = self.next

  if (!list) {
    return false
  }

  // Detach the appendee.
  item.detach()

  // If self has a next item…
  if (next) {
    item.next = next
    next.prev = item
  }

  // Connect the appendee.
  item.prev = self
  item.list = list

  // Set the next item of self to the appendee.
  self.next = item

  // If the the parent list has no last item or if self is the parent lists last
  // item, link the lists last item to the appendee.
  if (self === list.tail || !list.tail) {
    list.tail = item
  }

  list.size++

  return item
}

// Creates a new `Iter` for looping over the `LinkedList`.
function Iter(item) {
  this.item = item
}

// Move the `Iter` to the next item.
function next() {
  var current = this.item
  this.value = current
  this.done = !current
  this.item = current ? current.next : undefined
  return this
}


/***/ }),

/***/ 100:
/***/ (function(module) {

// Based on https://github.com/dscape/cycle/blob/master/cycle.js

module.exports = function decycle(object) {
// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form
//      {$ref: PATH}
// where the PATH is a JSONPath string that locates the first occurance.
// So,
//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));
// produces the string '[{"$ref":"$"}]'.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child member or
// property.

    var objects = [],   // Keep a reference to each unique object or array
        paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {

// The derez recurses through the object, producing the deep copy.

        var i,          // The loop counter
            name,       // Property name
            nu;         // The new object or array

// typeof null === 'object', so go on if this value is really an object but not
// one of the weird builtin objects.

        if (typeof value === 'object' && value !== null &&
                !(value instanceof Boolean) &&
                !(value instanceof Date)    &&
                !(value instanceof Number)  &&
                !(value instanceof RegExp)  &&
                !(value instanceof String)) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a $ref/path object. This is a hard way,
// linear search that will get slower as the number of unique objects grows.

            for (i = 0; i < objects.length; i += 1) {
                if (objects[i] === value) {
                    return {$ref: paths[i]};
                }
            }

// Otherwise, accumulate the unique value and its path.

            objects.push(value);
            paths.push(path);

// If it is an array, replicate the array.

            if (Object.prototype.toString.apply(value) === '[object Array]') {
                nu = [];
                for (i = 0; i < value.length; i += 1) {
                    nu[i] = derez(value[i], path + '[' + i + ']');
                }
            } else {

// If it is an object, replicate the object.

                nu = {};
                for (name in value) {
                    if (Object.prototype.hasOwnProperty.call(value, name)) {
                        nu[name] = derez(value[name],
                            path + '[' + JSON.stringify(name) + ']');
                    }
                }
            }
            return nu;
        }
        return value;
    }(object, '$'));
};


/***/ }),

/***/ 407:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const decycle = __webpack_require__(100);

const isStrict = (function () { return !this; })();

function AuthTokenExpiredError(message, expiry) {
  this.name = 'AuthTokenExpiredError';
  this.message = message;
  this.expiry = expiry;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenExpiredError.prototype = Object.create(Error.prototype);


function AuthTokenInvalidError(message) {
  this.name = 'AuthTokenInvalidError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenInvalidError.prototype = Object.create(Error.prototype);


function AuthTokenNotBeforeError(message, date) {
  this.name = 'AuthTokenNotBeforeError';
  this.message = message;
  this.date = date;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenNotBeforeError.prototype = Object.create(Error.prototype);


// For any other auth token error.
function AuthTokenError(message) {
  this.name = 'AuthTokenError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenError.prototype = Object.create(Error.prototype);

// For any other auth error; not specifically related to the auth token itself.
function AuthError(message) {
  this.name = 'AuthError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthError.prototype = Object.create(Error.prototype);


function SilentMiddlewareBlockedError(message, type) {
  this.name = 'SilentMiddlewareBlockedError';
  this.message = message;
  this.type = type;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
SilentMiddlewareBlockedError.prototype = Object.create(Error.prototype);


function InvalidActionError(message) {
  this.name = 'InvalidActionError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidActionError.prototype = Object.create(Error.prototype);

function InvalidArgumentsError(message) {
  this.name = 'InvalidArgumentsError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidArgumentsError.prototype = Object.create(Error.prototype);

function InvalidOptionsError(message) {
  this.name = 'InvalidOptionsError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidOptionsError.prototype = Object.create(Error.prototype);


function InvalidMessageError(message) {
  this.name = 'InvalidMessageError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidMessageError.prototype = Object.create(Error.prototype);


function SocketProtocolError(message, code) {
  this.name = 'SocketProtocolError';
  this.message = message;
  this.code = code;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
SocketProtocolError.prototype = Object.create(Error.prototype);


function ServerProtocolError(message) {
  this.name = 'ServerProtocolError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ServerProtocolError.prototype = Object.create(Error.prototype);

function HTTPServerError(message) {
  this.name = 'HTTPServerError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
HTTPServerError.prototype = Object.create(Error.prototype);


function ResourceLimitError(message) {
  this.name = 'ResourceLimitError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ResourceLimitError.prototype = Object.create(Error.prototype);


function TimeoutError(message) {
  this.name = 'TimeoutError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
TimeoutError.prototype = Object.create(Error.prototype);


function BadConnectionError(message, type, code, reason) {
  this.name = 'BadConnectionError';
  this.message = message;
  this.type = type;
  this.code = code || 1001;
  this.reason = reason || socketProtocolIgnoreStatuses[this.code] || '';
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
BadConnectionError.prototype = Object.create(Error.prototype);


function BrokerError(message) {
  this.name = 'BrokerError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
BrokerError.prototype = Object.create(Error.prototype);


function ProcessExitError(message, code) {
  this.name = 'ProcessExitError';
  this.message = message;
  this.code = code;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ProcessExitError.prototype = Object.create(Error.prototype);


function UnknownError(message) {
  this.name = 'UnknownError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
UnknownError.prototype = Object.create(Error.prototype);


// Expose all error types.

module.exports = {
  AuthTokenExpiredError: AuthTokenExpiredError,
  AuthTokenInvalidError: AuthTokenInvalidError,
  AuthTokenNotBeforeError: AuthTokenNotBeforeError,
  AuthTokenError: AuthTokenError,
  AuthError: AuthError,
  SilentMiddlewareBlockedError: SilentMiddlewareBlockedError,
  InvalidActionError: InvalidActionError,
  InvalidArgumentsError: InvalidArgumentsError,
  InvalidOptionsError: InvalidOptionsError,
  InvalidMessageError: InvalidMessageError,
  SocketProtocolError: SocketProtocolError,
  ServerProtocolError: ServerProtocolError,
  HTTPServerError: HTTPServerError,
  ResourceLimitError: ResourceLimitError,
  TimeoutError: TimeoutError,
  BadConnectionError: BadConnectionError,
  BrokerError: BrokerError,
  ProcessExitError: ProcessExitError,
  UnknownError: UnknownError
};

const socketProtocolErrorStatuses = {
  1001: 'Socket was disconnected',
  1002: 'A WebSocket protocol error was encountered',
  1003: 'Server terminated socket because it received invalid data',
  1005: 'Socket closed without status code',
  1006: 'Socket hung up',
  1007: 'Message format was incorrect',
  1008: 'Encountered a policy violation',
  1009: 'Message was too big to process',
  1010: 'Client ended the connection because the server did not comply with extension requirements',
  1011: 'Server encountered an unexpected fatal condition',
  4000: 'Server ping timed out',
  4001: 'Client pong timed out',
  4002: 'Server failed to sign auth token',
  4003: 'Failed to complete handshake',
  4004: 'Client failed to save auth token',
  4005: 'Did not receive #handshake from client before timeout',
  4006: 'Failed to bind socket to message broker',
  4007: 'Client connection establishment timed out',
  4008: 'Server rejected handshake from client',
  4009: 'Server received a message before the client handshake'
};

const socketProtocolIgnoreStatuses = {
  1000: 'Socket closed normally',
  1001: socketProtocolErrorStatuses[1001]
};

module.exports.socketProtocolErrorStatuses = socketProtocolErrorStatuses;
module.exports.socketProtocolIgnoreStatuses = socketProtocolIgnoreStatuses;

// Convert an error into a JSON-compatible type which can later be hydrated
// back to its *original* form.
module.exports.dehydrateError = function dehydrateError(error) {
  let dehydratedError;

  if (error && typeof error === 'object') {
    dehydratedError = {
      message: error.message
    };
    for (let i of Object.keys(error)) {
      dehydratedError[i] = error[i];
    }
  } else if (typeof error === 'function') {
    dehydratedError = '[function ' + (typeof error.name === 'string' ? error.name : 'anonymous') + ']';
  } else {
    dehydratedError = error;
  }

  return decycle(dehydratedError);
};

// Convert a dehydrated error back to its *original* form.
module.exports.hydrateError = function hydrateError(error) {
  let hydratedError = null;
  if (error != null) {
    if (typeof error === 'object') {
      hydratedError = new Error(
        typeof error.message === 'string' ? error.message : 'Invalid error message format'
      );
      if (typeof error.name === 'string') {
        hydratedError.name = error.name;
      }
      for (let i of Object.keys(error)) {
        if (hydratedError[i] === undefined) {
          hydratedError[i] = error[i];
        }
      }
    } else {
      hydratedError = error;
    }
  }
  return hydratedError;
};

module.exports.decycle = decycle;


/***/ }),

/***/ 262:
/***/ (function(module) {

const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const validJSONStartRegex = /^[ \n\r\t]*[{\[]/;

let arrayBufferToBase64 = function (arraybuffer) {
  let bytes = new Uint8Array(arraybuffer);
  let len = bytes.length;
  let base64 = '';

  for (let i = 0; i < len; i += 3) {
    base64 += base64Chars[bytes[i] >> 2];
    base64 += base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += base64Chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += base64Chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }

  return base64;
};

let binaryToBase64Replacer = function (key, value) {
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return {
      base64: true,
      data: arrayBufferToBase64(value)
    };
  } else if (typeof Buffer !== 'undefined') {
    if (value instanceof Buffer){
      return {
        base64: true,
        data: value.toString('base64')
      };
    }
    // Some versions of Node.js convert Buffers to Objects before they are passed to
    // the replacer function - Because of this, we need to rehydrate Buffers
    // before we can convert them to base64 strings.
    if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
      let rehydratedBuffer;
      if (Buffer.from) {
        rehydratedBuffer = Buffer.from(value.data);
      } else {
        rehydratedBuffer = new Buffer(value.data);
      }
      return {
        base64: true,
        data: rehydratedBuffer.toString('base64')
      };
    }
  }
  return value;
};

// Decode the data which was transmitted over the wire to a JavaScript Object in a format which SC understands.
// See encode function below for more details.
module.exports.decode = function (encodedMessage) {
  if (encodedMessage == null) {
   return null;
  }
  // Leave ping or pong message as is
  if (encodedMessage === '#1' || encodedMessage === '#2') {
    return encodedMessage;
  }
  let message = encodedMessage.toString();

  // Performance optimization to detect invalid JSON packet sooner.
  if (!validJSONStartRegex.test(message)) {
    return message;
  }

  try {
    return JSON.parse(message);
  } catch (err) {}
  return message;
};

// Encode raw data (which is in the SC protocol format) into a format for
// transfering it over the wire. In this case, we just convert it into a simple JSON string.
// If you want to create your own custom codec, you can encode the object into any format
// (e.g. binary ArrayBuffer or string with any kind of compression) so long as your decode
// function is able to rehydrate that object back into its original JavaScript Object format
// (which adheres to the SC protocol).
// See https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md
// for details about the SC protocol.
module.exports.encode = function (rawData) {
  // Leave ping or pong message as is
  if (rawData === '#1' || rawData === '#2') {
    return rawData;
  }
  return JSON.stringify(rawData, binaryToBase64Replacer);
};


/***/ }),

/***/ 273:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/*!
 * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const valueOf = Symbol.prototype.valueOf;
const typeOf = __webpack_require__(965);

function clone(val, deep) {
  switch (typeOf(val)) {
    case 'array':
      return val.slice();
    case 'object':
      return Object.assign({}, val);
    case 'date':
      return new val.constructor(Number(val));
    case 'map':
      return new Map(val);
    case 'set':
      return new Set(val);
    case 'buffer':
      return cloneBuffer(val);
    case 'symbol':
      return cloneSymbol(val);
    case 'arraybuffer':
      return cloneArrayBuffer(val);
    case 'float32array':
    case 'float64array':
    case 'int16array':
    case 'int32array':
    case 'int8array':
    case 'uint16array':
    case 'uint32array':
    case 'uint8clampedarray':
    case 'uint8array':
      return cloneTypedArray(val);
    case 'regexp':
      return cloneRegExp(val);
    case 'error':
      return Object.create(val);
    default: {
      return val;
    }
  }
}

function cloneRegExp(val) {
  const flags = val.flags !== void 0 ? val.flags : (/\w+$/.exec(val) || void 0);
  const re = new val.constructor(val.source, flags);
  re.lastIndex = val.lastIndex;
  return re;
}

function cloneArrayBuffer(val) {
  const res = new val.constructor(val.byteLength);
  new Uint8Array(res).set(new Uint8Array(val));
  return res;
}

function cloneTypedArray(val, deep) {
  return new val.constructor(val.buffer, val.byteOffset, val.length);
}

function cloneBuffer(val) {
  const len = val.length;
  const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
  val.copy(buf);
  return buf;
}

function cloneSymbol(val) {
  return valueOf ? Object(valueOf.call(val)) : {};
}

/**
 * Expose `clone`
 */

module.exports = clone;


/***/ }),

/***/ 996:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var __webpack_unused_export__;
const AGClientSocket = __webpack_require__(412);
const factory = __webpack_require__(86);
const version = '19.1.2';

__webpack_unused_export__ = factory;
__webpack_unused_export__ = AGClientSocket;

__webpack_unused_export__ = function (options) {
  return factory.create({...options, version});
};

__webpack_unused_export__ = version;


/***/ }),

/***/ 324:
/***/ (function(module) {

function AuthEngine() {
  this._internalStorage = {};
  this.isLocalStorageEnabled = this._checkLocalStorageEnabled();
}

AuthEngine.prototype._checkLocalStorageEnabled = function () {
  let err;
  try {
    // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and avoid hard to debug edge cases.
    localStorage.setItem('__scLocalStorageTest', 1);
    localStorage.removeItem('__scLocalStorageTest');
  } catch (e) {
    err = e;
  }
  return !err;
};

AuthEngine.prototype.saveToken = function (name, token, options) {
  if (this.isLocalStorageEnabled) {
    localStorage.setItem(name, token);
  } else {
    this._internalStorage[name] = token;
  }
  return Promise.resolve(token);
};

AuthEngine.prototype.removeToken = function (name) {
  let loadPromise = this.loadToken(name);

  if (this.isLocalStorageEnabled) {
    localStorage.removeItem(name);
  } else {
    delete this._internalStorage[name];
  }

  return loadPromise;
};

AuthEngine.prototype.loadToken = function (name) {
  let token;

  if (this.isLocalStorageEnabled) {
    token = localStorage.getItem(name);
  } else {
    token = this._internalStorage[name] || null;
  }

  return Promise.resolve(token);
};

module.exports = AuthEngine;


/***/ }),

/***/ 412:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const StreamDemux = __webpack_require__(157);
const AsyncStreamEmitter = __webpack_require__(307);
const AGChannel = __webpack_require__(877);
const AuthEngine = __webpack_require__(324);
const formatter = __webpack_require__(262);
const AGTransport = __webpack_require__(29);
const LinkedList = __webpack_require__(917);
const cloneDeep = __webpack_require__(617);
const Buffer = (__webpack_require__(521)/* .Buffer */ .hp);
const wait = __webpack_require__(15);

const scErrors = __webpack_require__(407);
const InvalidArgumentsError = scErrors.InvalidArgumentsError;
const InvalidMessageError = scErrors.InvalidMessageError;
const SocketProtocolError = scErrors.SocketProtocolError;
const TimeoutError = scErrors.TimeoutError;
const BadConnectionError = scErrors.BadConnectionError;

function AGClientSocket(socketOptions) {
  AsyncStreamEmitter.call(this);

  let defaultOptions = {
    path: '/socketcluster/',
    secure: false,
    protocolScheme: null,
    socketPath: null,
    autoConnect: true,
    autoReconnect: true,
    autoSubscribeOnConnect: true,
    connectTimeout: 20000,
    ackTimeout: 10000,
    timestampRequests: false,
    timestampParam: 't',
    binaryType: 'arraybuffer',
    batchOnHandshake: false,
    batchOnHandshakeDuration: 100,
    batchInterval: 50,
    protocolVersion: 2,
    wsOptions: {},
    cloneData: false
  };
  let opts = Object.assign(defaultOptions, socketOptions);

  if (opts.authTokenName == null) {
    opts.authTokenName = this._generateAuthTokenNameFromURI(opts);
  }

  this.id = null;
  this.version = opts.version || null;
  this.protocolVersion = opts.protocolVersion;
  this.state = this.CLOSED;
  this.authState = this.UNAUTHENTICATED;
  this.signedAuthToken = null;
  this.authToken = null;
  this.pendingReconnect = false;
  this.pendingReconnectTimeout = null;
  this.preparingPendingSubscriptions = false;
  this.clientId = opts.clientId;
  this.wsOptions = opts.wsOptions;

  this.connectTimeout = opts.connectTimeout;
  this.ackTimeout = opts.ackTimeout;
  this.channelPrefix = opts.channelPrefix || null;
  this.authTokenName = opts.authTokenName;

  // pingTimeout will be connectTimeout at the start, but it will
  // be updated with values provided by the 'connect' event
  opts.pingTimeout = opts.connectTimeout;
  this.pingTimeout = opts.pingTimeout;
  this.pingTimeoutDisabled = !!opts.pingTimeoutDisabled;

  let maxTimeout = Math.pow(2, 31) - 1;

  let verifyDuration = (propertyName) => {
    if (this[propertyName] > maxTimeout) {
      throw new InvalidArgumentsError(
        `The ${propertyName} value provided exceeded the maximum amount allowed`
      );
    }
  };

  verifyDuration('connectTimeout');
  verifyDuration('ackTimeout');
  verifyDuration('pingTimeout');

  this.connectAttempts = 0;

  this.isBatching = false;
  this.batchOnHandshake = opts.batchOnHandshake;
  this.batchOnHandshakeDuration = opts.batchOnHandshakeDuration;

  this._batchingIntervalId = null;
  this._outboundBuffer = new LinkedList();
  this._channelMap = {};

  this._channelEventDemux = new StreamDemux();
  this._channelDataDemux = new StreamDemux();

  this._receiverDemux = new StreamDemux();
  this._procedureDemux = new StreamDemux();

  this.options = opts;

  this._cid = 1;

  this.options.callIdGenerator = () => {
    return this._cid++;
  };

  if (this.options.autoReconnect) {
    if (this.options.autoReconnectOptions == null) {
      this.options.autoReconnectOptions = {};
    }

    // Add properties to the this.options.autoReconnectOptions object.
    // We assign the reference to a reconnectOptions variable to avoid repetition.
    let reconnectOptions = this.options.autoReconnectOptions;
    if (reconnectOptions.initialDelay == null) {
      reconnectOptions.initialDelay = 10000;
    }
    if (reconnectOptions.randomness == null) {
      reconnectOptions.randomness = 10000;
    }
    if (reconnectOptions.multiplier == null) {
      reconnectOptions.multiplier = 1.5;
    }
    if (reconnectOptions.maxDelay == null) {
      reconnectOptions.maxDelay = 60000;
    }
  }

  if (this.options.subscriptionRetryOptions == null) {
    this.options.subscriptionRetryOptions = {};
  }

  if (this.options.authEngine) {
    this.auth = this.options.authEngine;
  } else {
    this.auth = new AuthEngine();
  }

  if (this.options.codecEngine) {
    this.codec = this.options.codecEngine;
  } else {
    // Default codec engine
    this.codec = formatter;
  }

  if (this.options.protocol) {
    let protocolOptionError = new InvalidArgumentsError(
      'The protocol option does not affect socketcluster-client - ' +
      'If you want to utilize SSL/TLS, use the secure option instead'
    );
    this._onError(protocolOptionError);
  }

  this.options.query = opts.query || {};
  if (typeof this.options.query === 'string') {
    let searchParams = new URLSearchParams(this.options.query);
    let queryObject = {};
    for (let [key, value] of searchParams.entries()) {
      let currentValue = queryObject[key];
      if (currentValue == null) {
        queryObject[key] = value;
      } else {
        if (!Array.isArray(currentValue)) {
          queryObject[key] = [currentValue];
        }
        queryObject[key].push(value);
      }
    }
    this.options.query = queryObject;
  }

  if (this.options.autoConnect) {
    this.connect();
  }
}

AGClientSocket.prototype = Object.create(AsyncStreamEmitter.prototype);

AGClientSocket.CONNECTING = AGClientSocket.prototype.CONNECTING = AGTransport.prototype.CONNECTING;
AGClientSocket.OPEN = AGClientSocket.prototype.OPEN = AGTransport.prototype.OPEN;
AGClientSocket.CLOSED = AGClientSocket.prototype.CLOSED = AGTransport.prototype.CLOSED;

AGClientSocket.AUTHENTICATED = AGClientSocket.prototype.AUTHENTICATED = 'authenticated';
AGClientSocket.UNAUTHENTICATED = AGClientSocket.prototype.UNAUTHENTICATED = 'unauthenticated';

AGClientSocket.SUBSCRIBED = AGClientSocket.prototype.SUBSCRIBED = AGChannel.SUBSCRIBED;
AGClientSocket.PENDING = AGClientSocket.prototype.PENDING = AGChannel.PENDING;
AGClientSocket.UNSUBSCRIBED = AGClientSocket.prototype.UNSUBSCRIBED = AGChannel.UNSUBSCRIBED;

AGClientSocket.ignoreStatuses = scErrors.socketProtocolIgnoreStatuses;
AGClientSocket.errorStatuses = scErrors.socketProtocolErrorStatuses;

Object.defineProperty(AGClientSocket.prototype, 'isBufferingBatch', {
  get: function () {
    return this.transport.isBufferingBatch;
  }
});

AGClientSocket.prototype.uri = function () {
  return AGTransport.computeURI(this.options);
};

AGClientSocket.prototype.getBackpressure = function () {
  return Math.max(
    this.getAllListenersBackpressure(),
    this.getAllReceiversBackpressure(),
    this.getAllProceduresBackpressure(),
    this.getAllChannelsBackpressure()
  );
};

AGClientSocket.prototype._generateAuthTokenNameFromURI = function (options) {
  let authHostString = options.host ? `.${options.host}` : `.${options.hostname || 'localhost'}${options.port ? `:${options.port}` : ''}`;
  return `socketcluster.authToken${authHostString}`;
}

AGClientSocket.prototype._setAuthToken = function (data) {
  this._changeToAuthenticatedState(data.token);

  (async () => {
    try {
      await this.auth.saveToken(this.authTokenName, data.token, {});
    } catch (err) {
      this._onError(err);
    }
  })();
};

AGClientSocket.prototype._removeAuthToken = function (data) {
  (async () => {
    let oldAuthToken;
    try {
      oldAuthToken = await this.auth.removeToken(this.authTokenName);
    } catch (err) {
      // Non-fatal error - Do not close the connection
      this._onError(err);
      return;
    }
    this.emit('removeAuthToken', {oldAuthToken});
  })();

  this._changeToUnauthenticatedStateAndClearTokens();
};

AGClientSocket.prototype._privateDataHandlerMap = {
  '#publish': function (data) {
    if (typeof data.channel !== 'string') return;
    let undecoratedChannelName = this._undecorateChannelName(data.channel);
    let isSubscribed = this.isSubscribed(undecoratedChannelName, true);

    if (isSubscribed) {
      this._channelDataDemux.write(undecoratedChannelName, data.data);
    }
  },
  '#kickOut': function (data) {
    if (typeof data.channel !== 'string') return;
    let undecoratedChannelName = this._undecorateChannelName(data.channel);
    let channel = this._channelMap[undecoratedChannelName];
    if (channel) {
      this.emit('kickOut', {
        channel: undecoratedChannelName,
        message: data.message
      });
      this._channelEventDemux.write(`${undecoratedChannelName}/kickOut`, {message: data.message});
      this._triggerChannelUnsubscribe(channel);
    }
  },
  '#setAuthToken': function (data) {
    if (data) {
      this._setAuthToken(data);
    }
  },
  '#removeAuthToken': function (data) {
    this._removeAuthToken(data);
  }
};

AGClientSocket.prototype._privateRPCHandlerMap = {
  '#setAuthToken': function (data, request) {
    if (data) {
      this._setAuthToken(data);

      request.end();
    } else {
      let error = new InvalidMessageError('No token data provided by #setAuthToken event');
      delete error.stack;
      request.error(error);
    }
  },
  '#removeAuthToken': function (data, request) {
    this._removeAuthToken(data);
    request.end();
  }
};

AGClientSocket.prototype.getState = function () {
  return this.state;
};

AGClientSocket.prototype.getBytesReceived = function () {
  return this.transport.getBytesReceived();
};

AGClientSocket.prototype.deauthenticate = async function () {
  (async () => {
    let oldAuthToken;
    try {
      oldAuthToken = await this.auth.removeToken(this.authTokenName);
    } catch (err) {
      this._onError(err);
      return;
    }
    this.emit('removeAuthToken', {oldAuthToken});
  })();

  if (this.state !== this.CLOSED) {
    this.transmit('#removeAuthToken');
  }
  this._changeToUnauthenticatedStateAndClearTokens();
  await wait(0);
};

AGClientSocket.prototype.connect = function (socketOptions) {
  if (socketOptions) {
    if (this.state !== this.CLOSED) {
      this.disconnect(
        1000,
        'Socket was disconnected by the client to initiate a new connection'
      );
    }
    this.options = {
      ...this.options,
      ...socketOptions
    };
    if (this.options.authTokenName == null) {
      this.options.authTokenName = this._generateAuthTokenNameFromURI(this.options);
    }
  }
  if (this.state === this.CLOSED) {
    this.pendingReconnect = false;
    this.pendingReconnectTimeout = null;
    clearTimeout(this._reconnectTimeoutRef);

    this.state = this.CONNECTING;
    this.emit('connecting', {});

    if (this.transport) {
      this.transport.clearAllListeners();
    }

    let transportHandlers = {
      onOpen: (value) => {
        this.state = this.OPEN;
        this._onOpen(value);
      },
      onOpenAbort: (value) => {
        if (this.state !== this.CLOSED) {
          this.state = this.CLOSED;
          this._destroy(value.code, value.reason, true);
        }
      },
      onClose: (value) => {
        if (this.state !== this.CLOSED) {
          this.state = this.CLOSED;
          this._destroy(value.code, value.reason);
        }
      },
      onEvent: (value) => {
        this.emit(value.event, value.data);
      },
      onError: (value) => {
        this._onError(value.error);
      },
      onInboundInvoke: (value) => {
        this._onInboundInvoke(value);
      },
      onInboundTransmit: (value) => {
        this._onInboundTransmit(value.event, value.data);
      }
    };

    this.transport = new AGTransport(this.auth, this.codec, this.options, this.wsOptions, transportHandlers);
  }
};

AGClientSocket.prototype.reconnect = function (code, reason) {
  this.disconnect(code, reason);
  this.connect();
};

AGClientSocket.prototype.disconnect = function (code, reason) {
  code = code || 1000;

  if (typeof code !== 'number') {
    throw new InvalidArgumentsError('If specified, the code argument must be a number');
  }

  let isConnecting = this.state === this.CONNECTING;
  if (isConnecting || this.state === this.OPEN) {
    this.state = this.CLOSED;
    this._destroy(code, reason, isConnecting);
    this.transport.close(code, reason);
  } else {
    this.pendingReconnect = false;
    this.pendingReconnectTimeout = null;
    clearTimeout(this._reconnectTimeoutRef);
  }
};

AGClientSocket.prototype._changeToUnauthenticatedStateAndClearTokens = function () {
  if (this.authState !== this.UNAUTHENTICATED) {
    let oldAuthState = this.authState;
    let oldAuthToken = this.authToken;
    let oldSignedAuthToken = this.signedAuthToken;
    this.authState = this.UNAUTHENTICATED;
    this.signedAuthToken = null;
    this.authToken = null;

    let stateChangeData = {
      oldAuthState,
      newAuthState: this.authState
    };
    this.emit('authStateChange', stateChangeData);
    this.emit('deauthenticate', {oldSignedAuthToken, oldAuthToken});
  }
};

AGClientSocket.prototype._changeToAuthenticatedState = function (signedAuthToken) {
  this.signedAuthToken = signedAuthToken;
  this.authToken = this._extractAuthTokenData(signedAuthToken);

  if (this.authState !== this.AUTHENTICATED) {
    let oldAuthState = this.authState;
    this.authState = this.AUTHENTICATED;
    let stateChangeData = {
      oldAuthState,
      newAuthState: this.authState,
      signedAuthToken: signedAuthToken,
      authToken: this.authToken
    };
    if (!this.preparingPendingSubscriptions) {
      this.processPendingSubscriptions();
    }

    this.emit('authStateChange', stateChangeData);
  }
  this.emit('authenticate', {signedAuthToken, authToken: this.authToken});
};

AGClientSocket.prototype.decodeBase64 = function (encodedString) {
  return Buffer.from(encodedString, 'base64').toString('utf8');
};

AGClientSocket.prototype.encodeBase64 = function (decodedString) {
  return Buffer.from(decodedString, 'utf8').toString('base64');
};

AGClientSocket.prototype._extractAuthTokenData = function (signedAuthToken) {
  if (typeof signedAuthToken !== 'string') return null;
  let tokenParts = signedAuthToken.split('.');
  let encodedTokenData = tokenParts[1];
  if (encodedTokenData != null) {
    let tokenData = encodedTokenData;
    try {
      tokenData = this.decodeBase64(tokenData);
      return JSON.parse(tokenData);
    } catch (e) {
      return tokenData;
    }
  }
  return null;
};

AGClientSocket.prototype.getAuthToken = function () {
  return this.authToken;
};

AGClientSocket.prototype.getSignedAuthToken = function () {
  return this.signedAuthToken;
};

// Perform client-initiated authentication by providing an encrypted token string.
AGClientSocket.prototype.authenticate = async function (signedAuthToken) {
  let authStatus;

  try {
    authStatus = await this.invoke('#authenticate', signedAuthToken);
  } catch (err) {
    if (err.name !== 'BadConnectionError' && err.name !== 'TimeoutError') {
      // In case of a bad/closed connection or a timeout, we maintain the last
      // known auth state since those errors don't mean that the token is invalid.
      this._changeToUnauthenticatedStateAndClearTokens();
    }
    await wait(0);
    throw err;
  }

  if (authStatus && authStatus.isAuthenticated != null) {
    // If authStatus is correctly formatted (has an isAuthenticated property),
    // then we will rehydrate the authError.
    if (authStatus.authError) {
      authStatus.authError = scErrors.hydrateError(authStatus.authError);
    }
  } else {
    // Some errors like BadConnectionError and TimeoutError will not pass a valid
    // authStatus object to the current function, so we need to create it ourselves.
    authStatus = {
      isAuthenticated: this.authState,
      authError: null
    };
  }

  if (authStatus.isAuthenticated) {
    this._changeToAuthenticatedState(signedAuthToken);
  } else {
    this._changeToUnauthenticatedStateAndClearTokens();
  }

  (async () => {
    try {
      await this.auth.saveToken(this.authTokenName, signedAuthToken, {});
    } catch (err) {
      this._onError(err);
    }
  })();

  await wait(0);
  return authStatus;
};

AGClientSocket.prototype._tryReconnect = function (initialDelay) {
  let exponent = this.connectAttempts++;
  let reconnectOptions = this.options.autoReconnectOptions;
  let timeout;

  if (initialDelay == null || exponent > 0) {
    let initialTimeout = Math.round(reconnectOptions.initialDelay + (reconnectOptions.randomness || 0) * Math.random());

    timeout = Math.round(initialTimeout * Math.pow(reconnectOptions.multiplier, exponent));
  } else {
    timeout = initialDelay;
  }

  if (timeout > reconnectOptions.maxDelay) {
    timeout = reconnectOptions.maxDelay;
  }

  clearTimeout(this._reconnectTimeoutRef);

  this.pendingReconnect = true;
  this.pendingReconnectTimeout = timeout;
  this._reconnectTimeoutRef = setTimeout(() => {
    this.connect();
  }, timeout);
};

AGClientSocket.prototype._onOpen = function (status) {
  if (this.isBatching) {
    this._startBatching();
  } else if (this.batchOnHandshake) {
    this._startBatching();
    setTimeout(() => {
      if (!this.isBatching) {
        this._stopBatching();
      }
    }, this.batchOnHandshakeDuration);
  }
  this.preparingPendingSubscriptions = true;

  if (status) {
    this.id = status.id;
    this.pingTimeout = status.pingTimeout;
    if (status.isAuthenticated) {
      this._changeToAuthenticatedState(status.authToken);
    } else {
      this._changeToUnauthenticatedStateAndClearTokens();
    }
  } else {
    // This can happen if auth.loadToken (in transport.js) fails with
    // an error - This means that the signedAuthToken cannot be loaded by
    // the auth engine and therefore, we need to unauthenticate the client.
    this._changeToUnauthenticatedStateAndClearTokens();
  }

  this.connectAttempts = 0;

  if (this.options.autoSubscribeOnConnect) {
    this.processPendingSubscriptions();
  }

  // If the user invokes the callback while in autoSubscribeOnConnect mode, it
  // won't break anything.
  this.emit('connect', {
    ...status,
    processPendingSubscriptions: () => {
      this.processPendingSubscriptions();
    }
  });

  if (this.state === this.OPEN) {
    this._flushOutboundBuffer();
  }
};

AGClientSocket.prototype._onError = function (error) {
  this.emit('error', {error});
};

AGClientSocket.prototype._suspendSubscriptions = function () {
  Object.keys(this._channelMap).forEach((channelName) => {
    let channel = this._channelMap[channelName];
    this._triggerChannelUnsubscribe(channel, true);
  });
};

AGClientSocket.prototype._abortAllPendingEventsDueToBadConnection = function (failureType, code, reason) {
  let currentNode = this._outboundBuffer.head;
  let nextNode;

  while (currentNode) {
    nextNode = currentNode.next;
    let eventObject = currentNode.data;
    clearTimeout(eventObject.timeout);
    delete eventObject.timeout;
    currentNode.detach();
    currentNode = nextNode;

    let callback = eventObject.callback;

    if (callback) {
      delete eventObject.callback;
      let errorMessage = `Event ${eventObject.event} was aborted due to a bad connection`;
      let error = new BadConnectionError(errorMessage, failureType, code, reason);

      callback.call(eventObject, error, eventObject);
    }
    // Cleanup any pending response callback in the transport layer too.
    if (eventObject.cid) {
      this.transport.cancelPendingResponse(eventObject.cid);
    }
  }
};

AGClientSocket.prototype._destroy = function (code, reason, openAbort) {
  this.id = null;
  this._cancelBatching();

  if (this.transport) {
    this.transport.clearAllListeners();
  }

  this.pendingReconnect = false;
  this.pendingReconnectTimeout = null;
  clearTimeout(this._reconnectTimeoutRef);

  this._suspendSubscriptions();

  if (openAbort) {
    this.emit('connectAbort', {code, reason});
  } else {
    this.emit('disconnect', {code, reason});
  }
  this.emit('close', {code, reason});

  if (!AGClientSocket.ignoreStatuses[code]) {
    let closeMessage;
    if (typeof reason === 'string') {
      closeMessage = 'Socket connection closed with status code ' + code + ' and reason: ' + reason;
    } else {
      closeMessage = 'Socket connection closed with status code ' + code;
    }
    let err = new SocketProtocolError(AGClientSocket.errorStatuses[code] || closeMessage, code);
    this._onError(err);
  }

  this._abortAllPendingEventsDueToBadConnection(openAbort ? 'connectAbort' : 'disconnect', code, reason);

  // Try to reconnect
  // on server ping timeout (4000)
  // or on client pong timeout (4001)
  // or on close without status (1005)
  // or on handshake failure (4003)
  // or on handshake rejection (4008)
  // or on socket hung up (1006)
  if (this.options.autoReconnect) {
    if (code === 4000 || code === 4001 || code === 1005) {
      // If there is a ping or pong timeout or socket closes without
      // status, don't wait before trying to reconnect - These could happen
      // if the client wakes up after a period of inactivity and in this case we
      // want to re-establish the connection as soon as possible.
      this._tryReconnect(0);

      // Codes 4500 and above will be treated as permanent disconnects.
      // Socket will not try to auto-reconnect.
    } else if (code !== 1000 && code < 4500) {
      this._tryReconnect();
    }
  }
};

AGClientSocket.prototype._onInboundTransmit = function (event, data) {
  let handler = this._privateDataHandlerMap[event];
  if (handler) {
    handler.call(this, data || {});
  } else {
    this._receiverDemux.write(event, data);
  }
};

AGClientSocket.prototype._onInboundInvoke = function (request) {
  let {procedure, data} = request;
  let handler = this._privateRPCHandlerMap[procedure];
  if (handler) {
    handler.call(this, data, request);
  } else {
    this._procedureDemux.write(procedure, request);
  }
};

AGClientSocket.prototype.decode = function (message) {
  return this.transport.decode(message);
};

AGClientSocket.prototype.encode = function (object) {
  return this.transport.encode(object);
};

AGClientSocket.prototype._flushOutboundBuffer = function () {
  let currentNode = this._outboundBuffer.head;
  let nextNode;

  while (currentNode) {
    nextNode = currentNode.next;
    let eventObject = currentNode.data;
    currentNode.detach();
    this.transport.transmitObject(eventObject);
    currentNode = nextNode;
  }
};

AGClientSocket.prototype._handleEventAckTimeout = function (eventObject, eventNode) {
  if (eventNode) {
    eventNode.detach();
  }
  delete eventObject.timeout;

  let callback = eventObject.callback;
  if (callback) {
    delete eventObject.callback;
    let error = new TimeoutError(`Event response for ${eventObject.event} event timed out`);
    callback.call(eventObject, error, eventObject);
  }
  // Cleanup any pending response callback in the transport layer too.
  if (eventObject.cid) {
    this.transport.cancelPendingResponse(eventObject.cid);
  }
};

AGClientSocket.prototype._processOutboundEvent = function (event, data, options, expectResponse) {
  options = options || {};

  if (this.state === this.CLOSED) {
    this.connect();
  }
  let eventObject = {
    event
  };

  let promise;

  if (expectResponse) {
    promise = new Promise((resolve, reject) => {
      eventObject.callback = (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      };
    });
  } else {
    promise = Promise.resolve();
  }

  let eventNode = new LinkedList.Item();

  if (this.options.cloneData) {
    eventObject.data = cloneDeep(data);
  } else {
    eventObject.data = data;
  }
  eventNode.data = eventObject;

  let ackTimeout = options.ackTimeout == null ? this.ackTimeout : options.ackTimeout;

  eventObject.timeout = setTimeout(() => {
    this._handleEventAckTimeout(eventObject, eventNode);
  }, ackTimeout);

  this._outboundBuffer.append(eventNode);
  if (this.state === this.OPEN) {
    this._flushOutboundBuffer();
  }
  return promise;
};

AGClientSocket.prototype.send = function (data) {
  this.transport.send(data);
};

AGClientSocket.prototype.transmit = function (event, data, options) {
  return this._processOutboundEvent(event, data, options);
};

AGClientSocket.prototype.invoke = function (event, data, options) {
  return this._processOutboundEvent(event, data, options, true);
};

AGClientSocket.prototype.transmitPublish = function (channelName, data) {
  let pubData = {
    channel: this._decorateChannelName(channelName),
    data
  };
  return this.transmit('#publish', pubData);
};

AGClientSocket.prototype.invokePublish = function (channelName, data) {
  let pubData = {
    channel: this._decorateChannelName(channelName),
    data
  };
  return this.invoke('#publish', pubData);
};

AGClientSocket.prototype._triggerChannelSubscribe = function (channel, subscriptionOptions) {
  let channelName = channel.name;

  if (channel.state !== AGChannel.SUBSCRIBED) {
    let oldChannelState = channel.state;
    channel.state = AGChannel.SUBSCRIBED;

    let stateChangeData = {
      oldChannelState,
      newChannelState: channel.state,
      subscriptionOptions
    };
    this._channelEventDemux.write(`${channelName}/subscribeStateChange`, stateChangeData);
    this._channelEventDemux.write(`${channelName}/subscribe`, {
      subscriptionOptions
    });
    this.emit('subscribeStateChange', {
      channel: channelName,
      ...stateChangeData
    });
    this.emit('subscribe', {
      channel: channelName,
      subscriptionOptions
    });
  }
};

AGClientSocket.prototype._triggerChannelSubscribeFail = function (err, channel, subscriptionOptions) {
  let channelName = channel.name;
  let meetsAuthRequirements = !channel.options.waitForAuth || this.authState === this.AUTHENTICATED;
  let hasChannel = !!this._channelMap[channelName];

  if (hasChannel && meetsAuthRequirements) {
    delete this._channelMap[channelName];

    this._channelEventDemux.write(`${channelName}/subscribeFail`, {
      error: err,
      subscriptionOptions
    });
    this.emit('subscribeFail', {
      error: err,
      channel: channelName,
      subscriptionOptions: subscriptionOptions
    });
  }
};

// Cancel any pending subscribe callback
AGClientSocket.prototype._cancelPendingSubscribeCallback = function (channel) {
  if (channel._pendingSubscriptionCid != null) {
    this.transport.cancelPendingResponse(channel._pendingSubscriptionCid);
    delete channel._pendingSubscriptionCid;
  }
};

AGClientSocket.prototype._decorateChannelName = function (channelName) {
  if (this.channelPrefix) {
    channelName = this.channelPrefix + channelName;
  }
  return channelName;
};

AGClientSocket.prototype._undecorateChannelName = function (decoratedChannelName) {
  if (this.channelPrefix && decoratedChannelName.indexOf(this.channelPrefix) === 0) {
    return decoratedChannelName.replace(this.channelPrefix, '');
  }
  return decoratedChannelName;
};

AGClientSocket.prototype.startBatch = function () {
  this.transport.startBatch();
};

AGClientSocket.prototype.flushBatch = function () {
  this.transport.flushBatch();
};

AGClientSocket.prototype.cancelBatch = function () {
  this.transport.cancelBatch();
};

AGClientSocket.prototype._startBatching = function () {
  if (this._batchingIntervalId != null) {
    return;
  }
  this.startBatch();
  this._batchingIntervalId = setInterval(() => {
    this.flushBatch();
    this.startBatch();
  }, this.options.batchInterval);
};

AGClientSocket.prototype.startBatching = function () {
  this.isBatching = true;
  this._startBatching();
};

AGClientSocket.prototype._stopBatching = function () {
  if (this._batchingIntervalId != null) {
    clearInterval(this._batchingIntervalId);
  }
  this._batchingIntervalId = null;
  this.flushBatch();
};

AGClientSocket.prototype.stopBatching = function () {
  this.isBatching = false;
  this._stopBatching();
};

AGClientSocket.prototype._cancelBatching = function () {
  if (this._batchingIntervalId != null) {
    clearInterval(this._batchingIntervalId);
  }
  this._batchingIntervalId = null;
  this.cancelBatch();
};

AGClientSocket.prototype.cancelBatching = function () {
  this.isBatching = false;
  this._cancelBatching();
};

AGClientSocket.prototype._trySubscribe = function (channel) {
  let meetsAuthRequirements = !channel.options.waitForAuth || this.authState === this.AUTHENTICATED;

  // We can only ever have one pending subscribe action at any given time on a channel
  if (
    this.state === this.OPEN &&
    !this.preparingPendingSubscriptions &&
    channel._pendingSubscriptionCid == null &&
    meetsAuthRequirements
  ) {

    let options = {
      noTimeout: true
    };

    let subscriptionOptions = {};
    if (channel.options.waitForAuth) {
      options.waitForAuth = true;
      subscriptionOptions.waitForAuth = options.waitForAuth;
    }
    if (channel.options.data) {
      subscriptionOptions.data = channel.options.data;
    }

    channel._pendingSubscriptionCid = this.transport.invokeRaw(
      '#subscribe',
      {
        channel: this._decorateChannelName(channel.name),
        ...subscriptionOptions
      },
      options,
      (err) => {
        if (err) {
          if (err.name === 'BadConnectionError') {
            // In case of a failed connection, keep the subscription
            // as pending; it will try again on reconnect.
            return;
          }
          delete channel._pendingSubscriptionCid;
          this._triggerChannelSubscribeFail(err, channel, subscriptionOptions);
        } else {
          delete channel._pendingSubscriptionCid;
          this._triggerChannelSubscribe(channel, subscriptionOptions);
        }
      }
    );
    this.emit('subscribeRequest', {
      channel: channel.name,
      subscriptionOptions
    });
  }
};

AGClientSocket.prototype.subscribe = function (channelName, options) {
  options = options || {};
  let channel = this._channelMap[channelName];

  let sanitizedOptions = {
    waitForAuth: !!options.waitForAuth
  };

  if (options.priority != null) {
    sanitizedOptions.priority = options.priority;
  }
  if (options.data !== undefined) {
    sanitizedOptions.data = options.data;
  }

  if (!channel) {
    channel = {
      name: channelName,
      state: AGChannel.PENDING,
      options: sanitizedOptions
    };
    this._channelMap[channelName] = channel;
    this._trySubscribe(channel);
  } else if (options) {
    channel.options = sanitizedOptions;
  }

  let channelIterable = new AGChannel(
    channelName,
    this,
    this._channelEventDemux,
    this._channelDataDemux
  );

  return channelIterable;
};

AGClientSocket.prototype._triggerChannelUnsubscribe = function (channel, setAsPending) {
  let channelName = channel.name;

  this._cancelPendingSubscribeCallback(channel);

  if (channel.state === AGChannel.SUBSCRIBED) {
    let stateChangeData = {
      oldChannelState: channel.state,
      newChannelState: setAsPending ? AGChannel.PENDING : AGChannel.UNSUBSCRIBED
    };
    this._channelEventDemux.write(`${channelName}/subscribeStateChange`, stateChangeData);
    this._channelEventDemux.write(`${channelName}/unsubscribe`, {});
    this.emit('subscribeStateChange', {
      channel: channelName,
      ...stateChangeData
    });
    this.emit('unsubscribe', {channel: channelName});
  }

  if (setAsPending) {
    channel.state = AGChannel.PENDING;
  } else {
    delete this._channelMap[channelName];
  }
};

AGClientSocket.prototype._tryUnsubscribe = function (channel) {
  if (this.state === this.OPEN) {
    let options = {
      noTimeout: true
    };
    // If there is a pending subscribe action, cancel the callback
    this._cancelPendingSubscribeCallback(channel);

    // This operation cannot fail because the TCP protocol guarantees delivery
    // so long as the connection remains open. If the connection closes,
    // the server will automatically unsubscribe the client and thus complete
    // the operation on the server side.
    let decoratedChannelName = this._decorateChannelName(channel.name);
    this.transport.transmit('#unsubscribe', decoratedChannelName, options);
  }
};

AGClientSocket.prototype.unsubscribe = function (channelName) {
  let channel = this._channelMap[channelName];

  if (channel) {
    this._triggerChannelUnsubscribe(channel);
    this._tryUnsubscribe(channel);
  }
};

// ---- Receiver logic ----

AGClientSocket.prototype.receiver = function (receiverName) {
  return this._receiverDemux.stream(receiverName);
};

AGClientSocket.prototype.closeReceiver = function (receiverName) {
  this._receiverDemux.close(receiverName);
};

AGClientSocket.prototype.closeAllReceivers = function () {
  this._receiverDemux.closeAll();
};

AGClientSocket.prototype.killReceiver = function (receiverName) {
  this._receiverDemux.kill(receiverName);
};

AGClientSocket.prototype.killAllReceivers = function () {
  this._receiverDemux.killAll();
};

AGClientSocket.prototype.killReceiverConsumer = function (consumerId) {
  this._receiverDemux.killConsumer(consumerId);
};

AGClientSocket.prototype.getReceiverConsumerStats = function (consumerId) {
  return this._receiverDemux.getConsumerStats(consumerId);
};

AGClientSocket.prototype.getReceiverConsumerStatsList = function (receiverName) {
  return this._receiverDemux.getConsumerStatsList(receiverName);
};

AGClientSocket.prototype.getAllReceiversConsumerStatsList = function () {
  return this._receiverDemux.getConsumerStatsListAll();
};

AGClientSocket.prototype.getReceiverBackpressure = function (receiverName) {
  return this._receiverDemux.getBackpressure(receiverName);
};

AGClientSocket.prototype.getAllReceiversBackpressure = function () {
  return this._receiverDemux.getBackpressureAll();
};

AGClientSocket.prototype.getReceiverConsumerBackpressure = function (consumerId) {
  return this._receiverDemux.getConsumerBackpressure(consumerId);
};

AGClientSocket.prototype.hasReceiverConsumer = function (receiverName, consumerId) {
  return this._receiverDemux.hasConsumer(receiverName, consumerId);
};

AGClientSocket.prototype.hasAnyReceiverConsumer = function (consumerId) {
  return this._receiverDemux.hasConsumerAll(consumerId);
};

// ---- Procedure logic ----

AGClientSocket.prototype.procedure = function (procedureName) {
  return this._procedureDemux.stream(procedureName);
};

AGClientSocket.prototype.closeProcedure = function (procedureName) {
  this._procedureDemux.close(procedureName);
};

AGClientSocket.prototype.closeAllProcedures = function () {
  this._procedureDemux.closeAll();
};

AGClientSocket.prototype.killProcedure = function (procedureName) {
  this._procedureDemux.kill(procedureName);
};

AGClientSocket.prototype.killAllProcedures = function () {
  this._procedureDemux.killAll();
};

AGClientSocket.prototype.killProcedureConsumer = function (consumerId) {
  this._procedureDemux.killConsumer(consumerId);
};

AGClientSocket.prototype.getProcedureConsumerStats = function (consumerId) {
  return this._procedureDemux.getConsumerStats(consumerId);
};

AGClientSocket.prototype.getProcedureConsumerStatsList = function (procedureName) {
  return this._procedureDemux.getConsumerStatsList(procedureName);
};

AGClientSocket.prototype.getAllProceduresConsumerStatsList = function () {
  return this._procedureDemux.getConsumerStatsListAll();
};

AGClientSocket.prototype.getProcedureBackpressure = function (procedureName) {
  return this._procedureDemux.getBackpressure(procedureName);
};

AGClientSocket.prototype.getAllProceduresBackpressure = function () {
  return this._procedureDemux.getBackpressureAll();
};

AGClientSocket.prototype.getProcedureConsumerBackpressure = function (consumerId) {
  return this._procedureDemux.getConsumerBackpressure(consumerId);
};

AGClientSocket.prototype.hasProcedureConsumer = function (procedureName, consumerId) {
  return this._procedureDemux.hasConsumer(procedureName, consumerId);
};

AGClientSocket.prototype.hasAnyProcedureConsumer = function (consumerId) {
  return this._procedureDemux.hasConsumerAll(consumerId);
};

// ---- Channel logic ----

AGClientSocket.prototype.channel = function (channelName) {
  let currentChannel = this._channelMap[channelName];

  let channelIterable = new AGChannel(
    channelName,
    this,
    this._channelEventDemux,
    this._channelDataDemux
  );

  return channelIterable;
};

AGClientSocket.prototype.closeChannel = function (channelName) {
  this.channelCloseOutput(channelName);
  this.channelCloseAllListeners(channelName);
};

AGClientSocket.prototype.closeAllChannelOutputs = function () {
  this._channelDataDemux.closeAll();
};

AGClientSocket.prototype.closeAllChannelListeners = function () {
  this._channelEventDemux.closeAll();
};

AGClientSocket.prototype.closeAllChannels = function () {
  this.closeAllChannelOutputs();
  this.closeAllChannelListeners();
};

AGClientSocket.prototype.killChannel = function (channelName) {
  this.channelKillOutput(channelName);
  this.channelKillAllListeners(channelName);
};

AGClientSocket.prototype.killAllChannelOutputs = function () {
  this._channelDataDemux.killAll();
};

AGClientSocket.prototype.killAllChannelListeners = function () {
  this._channelEventDemux.killAll();
};

AGClientSocket.prototype.killAllChannels = function () {
  this.killAllChannelOutputs();
  this.killAllChannelListeners();
};

AGClientSocket.prototype.killChannelOutputConsumer = function (consumerId) {
  this._channelDataDemux.killConsumer(consumerId);
};

AGClientSocket.prototype.killChannelListenerConsumer = function (consumerId) {
  this._channelEventDemux.killConsumer(consumerId);
};

AGClientSocket.prototype.getChannelOutputConsumerStats = function (consumerId) {
  return this._channelDataDemux.getConsumerStats(consumerId);
};

AGClientSocket.prototype.getChannelListenerConsumerStats = function (consumerId) {
  return this._channelEventDemux.getConsumerStats(consumerId);
};

AGClientSocket.prototype.getAllChannelOutputsConsumerStatsList = function () {
  return this._channelDataDemux.getConsumerStatsListAll();
};

AGClientSocket.prototype.getAllChannelListenersConsumerStatsList = function () {
  return this._channelEventDemux.getConsumerStatsListAll();
};

AGClientSocket.prototype.getChannelBackpressure = function (channelName) {
  return Math.max(
    this.channelGetOutputBackpressure(channelName),
    this.channelGetAllListenersBackpressure(channelName)
  );
};

AGClientSocket.prototype.getAllChannelOutputsBackpressure = function () {
  return this._channelDataDemux.getBackpressureAll();
};

AGClientSocket.prototype.getAllChannelListenersBackpressure = function () {
  return this._channelEventDemux.getBackpressureAll();
};

AGClientSocket.prototype.getAllChannelsBackpressure = function () {
  return Math.max(
    this.getAllChannelOutputsBackpressure(),
    this.getAllChannelListenersBackpressure()
  );
};

AGClientSocket.prototype.getChannelListenerConsumerBackpressure = function (consumerId) {
  return this._channelEventDemux.getConsumerBackpressure(consumerId);
};

AGClientSocket.prototype.getChannelOutputConsumerBackpressure = function (consumerId) {
  return this._channelDataDemux.getConsumerBackpressure(consumerId);
};

AGClientSocket.prototype.hasAnyChannelOutputConsumer = function (consumerId) {
  return this._channelDataDemux.hasConsumerAll(consumerId);
};

AGClientSocket.prototype.hasAnyChannelListenerConsumer = function (consumerId) {
  return this._channelEventDemux.hasConsumerAll(consumerId);
};

AGClientSocket.prototype.getChannelState = function (channelName) {
  let channel = this._channelMap[channelName];
  if (channel) {
    return channel.state;
  }
  return AGChannel.UNSUBSCRIBED;
};

AGClientSocket.prototype.getChannelOptions = function (channelName) {
  let channel = this._channelMap[channelName];
  if (channel) {
    return {...channel.options};
  }
  return {};
};

AGClientSocket.prototype._getAllChannelStreamNames = function (channelName) {
  let streamNamesLookup = this._channelEventDemux.getConsumerStatsListAll()
  .filter((stats) => {
    return stats.stream.indexOf(`${channelName}/`) === 0;
  })
  .reduce((accumulator, stats) => {
    accumulator[stats.stream] = true;
    return accumulator;
  }, {});
  return Object.keys(streamNamesLookup);
};

AGClientSocket.prototype.channelCloseOutput = function (channelName) {
  this._channelDataDemux.close(channelName);
};

AGClientSocket.prototype.channelCloseListener = function (channelName, eventName) {
  this._channelEventDemux.close(`${channelName}/${eventName}`);
};

AGClientSocket.prototype.channelCloseAllListeners = function (channelName) {
  let listenerStreams = this._getAllChannelStreamNames(channelName)
  .forEach((streamName) => {
    this._channelEventDemux.close(streamName);
  });
};

AGClientSocket.prototype.channelKillOutput = function (channelName) {
  this._channelDataDemux.kill(channelName);
};

AGClientSocket.prototype.channelKillListener = function (channelName, eventName) {
  this._channelEventDemux.kill(`${channelName}/${eventName}`);
};

AGClientSocket.prototype.channelKillAllListeners = function (channelName) {
  let listenerStreams = this._getAllChannelStreamNames(channelName)
  .forEach((streamName) => {
    this._channelEventDemux.kill(streamName);
  });
};

AGClientSocket.prototype.channelGetOutputConsumerStatsList = function (channelName) {
  return this._channelDataDemux.getConsumerStatsList(channelName);
};

AGClientSocket.prototype.channelGetListenerConsumerStatsList = function (channelName, eventName) {
  return this._channelEventDemux.getConsumerStatsList(`${channelName}/${eventName}`);
};

AGClientSocket.prototype.channelGetAllListenersConsumerStatsList = function (channelName) {
  return this._getAllChannelStreamNames(channelName)
  .map((streamName) => {
    return this._channelEventDemux.getConsumerStatsList(streamName);
  })
  .reduce((accumulator, statsList) => {
    statsList.forEach((stats) => {
      accumulator.push(stats);
    });
    return accumulator;
  }, []);
};

AGClientSocket.prototype.channelGetOutputBackpressure = function (channelName) {
  return this._channelDataDemux.getBackpressure(channelName);
};

AGClientSocket.prototype.channelGetListenerBackpressure = function (channelName, eventName) {
  return this._channelEventDemux.getBackpressure(`${channelName}/${eventName}`);
};

AGClientSocket.prototype.channelGetAllListenersBackpressure = function (channelName) {
  let listenerStreamBackpressures = this._getAllChannelStreamNames(channelName)
  .map((streamName) => {
    return this._channelEventDemux.getBackpressure(streamName);
  });
  return Math.max(...listenerStreamBackpressures.concat(0));
};

AGClientSocket.prototype.channelHasOutputConsumer = function (channelName, consumerId) {
  return this._channelDataDemux.hasConsumer(channelName, consumerId);
};

AGClientSocket.prototype.channelHasListenerConsumer = function (channelName, eventName, consumerId) {
  return this._channelEventDemux.hasConsumer(`${channelName}/${eventName}`, consumerId);
};

AGClientSocket.prototype.channelHasAnyListenerConsumer = function (channelName, consumerId) {
  return this._getAllChannelStreamNames(channelName)
  .some((streamName) => {
    return this._channelEventDemux.hasConsumer(streamName, consumerId);
  });
};

AGClientSocket.prototype.subscriptions = function (includePending) {
  let subs = [];
  Object.keys(this._channelMap).forEach((channelName) => {
    if (includePending || this._channelMap[channelName].state === AGChannel.SUBSCRIBED) {
      subs.push(channelName);
    }
  });
  return subs;
};

AGClientSocket.prototype.isSubscribed = function (channelName, includePending) {
  let channel = this._channelMap[channelName];
  if (includePending) {
    return !!channel;
  }
  return !!channel && channel.state === AGChannel.SUBSCRIBED;
};

AGClientSocket.prototype.processPendingSubscriptions = function () {
  this.preparingPendingSubscriptions = false;
  let pendingChannels = [];

  Object.keys(this._channelMap).forEach((channelName) => {
    let channel = this._channelMap[channelName];
    if (channel.state === AGChannel.PENDING) {
      pendingChannels.push(channel);
    }
  });

  pendingChannels.sort((a, b) => {
    let ap = a.options.priority || 0;
    let bp = b.options.priority || 0;
    if (ap > bp) {
      return -1;
    }
    if (ap < bp) {
      return 1;
    }
    return 0;
  });

  pendingChannels.forEach((channel) => {
    this._trySubscribe(channel);
  });
};

module.exports = AGClientSocket;


/***/ }),

/***/ 86:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const AGClientSocket = __webpack_require__(412);
const uuid = __webpack_require__(245);
const scErrors = __webpack_require__(407);
const InvalidArgumentsError = scErrors.InvalidArgumentsError;

function isUrlSecure() {
  return typeof location !== 'undefined' && location.protocol === 'https:';
}

function getPort(options, isSecureDefault) {
  let isSecure = options.secure == null ? isSecureDefault : options.secure;
  return options.port || (typeof location !== 'undefined' && location.port ? location.port : isSecure ? 443 : 80);
}

function create(options) {
  options = options || {};

  if (options.host && !options.host.match(/[^:]+:\d{2,5}/)) {
    throw new InvalidArgumentsError(
      'The host option should include both' +
      ' the hostname and the port number in the hostname:port format'
    );
  }

  if (options.host && options.hostname) {
    throw new InvalidArgumentsError(
      'The host option should already include' +
      ' the hostname and the port number in the hostname:port format' +
      ' - Because of this, you should never use host and hostname options together'
    );
  }

  if (options.host && options.port) {
    throw new InvalidArgumentsError(
      'The host option should already include' +
      ' the hostname and the port number in the hostname:port format' +
      ' - Because of this, you should never use host and port options together'
    );
  }

  let isSecureDefault = isUrlSecure();

  let opts = {
    clientId: uuid.v4(),
    port: getPort(options, isSecureDefault),
    hostname: typeof location !== 'undefined' && location.hostname || 'localhost',
    secure: isSecureDefault
  };

  Object.assign(opts, options);

  return new AGClientSocket(opts);
}

module.exports = {
  create
};


/***/ }),

/***/ 29:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const AGRequest = __webpack_require__(811);

let createWebSocket;

if (typeof WebSocket !== 'undefined') {
  createWebSocket = function (uri, options) {
    return new WebSocket(uri);
  };
} else {
  let WebSocket = __webpack_require__(549);
  createWebSocket = function (uri, options) {
    return new WebSocket(uri, [], options);
  };
}

const scErrors = __webpack_require__(407);
const TimeoutError = scErrors.TimeoutError;
const BadConnectionError = scErrors.BadConnectionError;

function AGTransport(authEngine, codecEngine, options, wsOptions, handlers) {
  this.state = this.CLOSED;
  this.auth = authEngine;
  this.codec = codecEngine;
  this.options = options;
  this.wsOptions = wsOptions;
  this.protocolVersion = options.protocolVersion;
  this.connectTimeout = options.connectTimeout;
  this.pingTimeout = options.pingTimeout;
  this.pingTimeoutDisabled = !!options.pingTimeoutDisabled;
  this.callIdGenerator = options.callIdGenerator;
  this.authTokenName = options.authTokenName;
  this.isBufferingBatch = false;

  this._pingTimeoutTicker = null;
  this._callbackMap = {};
  this._batchBuffer = [];

  if (!handlers) {
    handlers = {};
  }

  this._onOpenHandler = handlers.onOpen || function () {};
  this._onOpenAbortHandler = handlers.onOpenAbort || function () {};
  this._onCloseHandler = handlers.onClose || function () {};
  this._onEventHandler = handlers.onEvent || function () {};
  this._onErrorHandler = handlers.onError || function () {};
  this._onInboundInvokeHandler  = handlers.onInboundInvoke || function () {};
  this._onInboundTransmitHandler = handlers.onInboundTransmit || function () {};

  // Open the connection.

  this.state = this.CONNECTING;
  let uri = this.uri();

  let wsSocket = createWebSocket(uri, wsOptions);
  wsSocket.binaryType = this.options.binaryType;

  this.socket = wsSocket;

  wsSocket.onopen = () => {
    this._onOpen();
  };

  wsSocket.onclose = async (event) => {
    let code;
    if (event.code == null) {
      // This is to handle an edge case in React Native whereby
      // event.code is undefined when the mobile device is locked.
      // Note that this condition may also apply to an abnormal close
      // (no close control frame) which would normally be a 1006.
      code = 1005;
    } else {
      code = event.code;
    }
    this._destroy(code, event.reason);
  };

  wsSocket.onmessage = (message, flags) => {
    this._onMessage(message.data);
  };

  wsSocket.onerror = (error) => {
    // The onclose event will be called automatically after the onerror event
    // if the socket is connected - Otherwise, if it's in the middle of
    // connecting, we want to close it manually with a 1006 - This is necessary
    // to prevent inconsistent behavior when running the client in Node.js
    // vs in a browser.
    if (this.state === this.CONNECTING) {
      this._destroy(1006);
    }
  };

  this._connectTimeoutRef = setTimeout(() => {
    this._destroy(4007);
    this.socket.close(4007);
  }, this.connectTimeout);

  if (this.protocolVersion === 1) {
    this._handlePing = (message) => {
      if (message === '#1') {
        this._resetPingTimeout();
        if (this.socket.readyState === this.socket.OPEN) {
          this.send('#2');
        }
        return true;
      }
      return false;
    };
  } else {
    this._handlePing = (message) => {
      if (message === '') {
        this._resetPingTimeout();
        if (this.socket.readyState === this.socket.OPEN) {
          this.send('');
        }
        return true;
      }
      return false;
    };
  }
}

AGTransport.CONNECTING = AGTransport.prototype.CONNECTING = 'connecting';
AGTransport.OPEN = AGTransport.prototype.OPEN = 'open';
AGTransport.CLOSED = AGTransport.prototype.CLOSED = 'closed';

AGTransport.computeURI = function (options) {
  let query = options.query || {};
  let scheme;
  if (options.protocolScheme == null) {
    scheme = options.secure ? 'wss' : 'ws';
  } else {
    scheme = options.protocolScheme;
  }

  if (options.timestampRequests) {
    query[options.timestampParam] = (new Date()).getTime();
  }

  let searchParams = new URLSearchParams();
  for (let [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (let item of value) {
        searchParams.append(key, item);
      }
    } else {
      searchParams.set(key, value);
    }
  }

  query = searchParams.toString();

  if (query.length) {
    query = '?' + query;
  }

  let host;
  let path;
  if (options.socketPath == null) {
    if (options.host) {
      host = options.host;
    } else {
      let port = '';

      if (options.port && ((scheme === 'wss' && options.port !== 443)
        || (scheme === 'ws' && options.port !== 80))) {
        port = ':' + options.port;
      }
      host = options.hostname + port;
    }
    path = options.path;
  } else {
    host = options.socketPath;
    path = `:${options.path}`;
  }
  return scheme + '://' + host + path + query;
};

AGTransport.prototype.uri = function () {
  return AGTransport.computeURI(this.options);
};

AGTransport.prototype._onOpen = async function () {
  clearTimeout(this._connectTimeoutRef);
  this._resetPingTimeout();

  let status;

  try {
    status = await this._handshake();
  } catch (err) {
    if (err.statusCode == null) {
      err.statusCode = 4003;
    }
    this._onError(err);
    this._destroy(err.statusCode, err.toString());
    this.socket.close(err.statusCode);
    return;
  }

  this.state = this.OPEN;
  if (status) {
    this.pingTimeout = status.pingTimeout;
  }
  this._resetPingTimeout();
  this._onOpenHandler(status);
};

AGTransport.prototype._handshake = async function () {
  let token = await this.auth.loadToken(this.authTokenName);
  // Don't wait for this.state to be 'open'.
  // The underlying WebSocket (this.socket) is already open.
  let options = {
    force: true
  };
  let status = await this.invoke('#handshake', {authToken: token}, options);
  if (status) {
    // Add the token which was used as part of authentication attempt
    // to the status object.
    status.authToken = token;
    if (status.authError) {
      status.authError = scErrors.hydrateError(status.authError);
    }
  }
  return status;
};

AGTransport.prototype._abortAllPendingEventsDueToBadConnection = function (failureType, code, reason) {
  Object.keys(this._callbackMap || {}).forEach((i) => {
    let eventObject = this._callbackMap[i];
    delete this._callbackMap[i];

    clearTimeout(eventObject.timeout);
    delete eventObject.timeout;

    let errorMessage = `Event ${eventObject.event} was aborted due to a bad connection`;
    let badConnectionError = new BadConnectionError(errorMessage, failureType, code, reason);

    let callback = eventObject.callback;
    if (callback) {
      delete eventObject.callback;

      callback.call(eventObject, badConnectionError, eventObject);
    }
  });
};

AGTransport.prototype._destroy = function (code, reason) {
  let protocolReason = scErrors.socketProtocolErrorStatuses[code];
  if (!reason && scErrors.socketProtocolErrorStatuses[code]) {
    reason = scErrors.socketProtocolErrorStatuses[code];
  }
  delete this.socket.onopen;
  delete this.socket.onclose;
  delete this.socket.onmessage;
  delete this.socket.onerror;

  clearTimeout(this._connectTimeoutRef);
  clearTimeout(this._pingTimeoutTicker);

  if (this.state === this.OPEN) {
    this.state = this.CLOSED;
    this._abortAllPendingEventsDueToBadConnection('disconnect', code, reason);
    this._onCloseHandler({code, reason});
  } else if (this.state === this.CONNECTING) {
    this.state = this.CLOSED;
    this._abortAllPendingEventsDueToBadConnection('connectAbort', code, reason);
    this._onOpenAbortHandler({code, reason});
  } else if (this.state === this.CLOSED) {
    this._abortAllPendingEventsDueToBadConnection('connectAbort', code, reason);
  }
};

AGTransport.prototype._processInboundPacket = function (packet, message) {
  if (packet && typeof packet.event === 'string') {
    if (typeof packet.cid === 'number') {
      let request = new AGRequest(this, packet.cid, packet.event, packet.data);
      this._onInboundInvokeHandler(request);
    } else {
      this._onInboundTransmitHandler({...packet});
    }
  } else if (packet && typeof packet.rid === 'number') {
    let eventObject = this._callbackMap[packet.rid];
    if (eventObject) {
      clearTimeout(eventObject.timeout);
      delete eventObject.timeout;
      delete this._callbackMap[packet.rid];

      if (eventObject.callback) {
        let rehydratedError = scErrors.hydrateError(packet.error);
        eventObject.callback(rehydratedError, packet.data);
      }
    }
  } else {
    this._onEventHandler({event: 'raw', data: {message}});
  }
};

AGTransport.prototype._onMessage = function (message) {
  this._onEventHandler({event: 'message', data: {message}});

  if (this._handlePing(message)) {
    return;
  }

  let packet = this.decode(message);

  if (Array.isArray(packet)) {
    let len = packet.length;
    for (let i = 0; i < len; i++) {
      this._processInboundPacket(packet[i], message);
    }
  } else {
    this._processInboundPacket(packet, message);
  }
};

AGTransport.prototype._onError = function (error) {
  this._onErrorHandler({error});
};

AGTransport.prototype._resetPingTimeout = function () {
  if (this.pingTimeoutDisabled) {
    return;
  }

  let now = (new Date()).getTime();
  clearTimeout(this._pingTimeoutTicker);
  this._pingTimeoutTicker = setTimeout(() => {
    this._destroy(4000);
    this.socket.close(4000);
  }, this.pingTimeout);
};

AGTransport.prototype.clearAllListeners = function () {
  this._onOpenHandler = function () {};
  this._onOpenAbortHandler = function () {};
  this._onCloseHandler = function () {};
  this._onEventHandler = function () {};
  this._onErrorHandler = function () {};
  this._onInboundInvokeHandler  = function () {};
  this._onInboundTransmitHandler = function () {};
};

AGTransport.prototype.startBatch = function () {
  this.isBufferingBatch = true;
  this._batchBuffer = [];
};

AGTransport.prototype.flushBatch = function () {
  this.isBufferingBatch = false;
  if (!this._batchBuffer.length) {
    return;
  }
  let serializedBatch = this.serializeObject(this._batchBuffer);
  this._batchBuffer = [];
  this.send(serializedBatch);
};

AGTransport.prototype.cancelBatch = function () {
  this.isBufferingBatch = false;
  this._batchBuffer = [];
};

AGTransport.prototype.getBytesReceived = function () {
  return this.socket.bytesReceived;
};

AGTransport.prototype.close = function (code, reason) {
  if (this.state === this.OPEN || this.state === this.CONNECTING) {
    code = code || 1000;
    this._destroy(code, reason);
    this.socket.close(code, reason);
  }
};

AGTransport.prototype.transmitObject = function (eventObject) {
  let simpleEventObject = {
    event: eventObject.event,
    data: eventObject.data
  };

  if (eventObject.callback) {
    simpleEventObject.cid = eventObject.cid = this.callIdGenerator();
    this._callbackMap[eventObject.cid] = eventObject;
  }

  this.sendObject(simpleEventObject);

  return eventObject.cid || null;
};

AGTransport.prototype._handleEventAckTimeout = function (eventObject) {
  if (eventObject.cid) {
    delete this._callbackMap[eventObject.cid];
  }
  delete eventObject.timeout;

  let callback = eventObject.callback;
  if (callback) {
    delete eventObject.callback;
    let error = new TimeoutError(`Event response for ${eventObject.event} event timed out`);
    callback.call(eventObject, error, eventObject);
  }
};

AGTransport.prototype.transmit = function (event, data, options) {
  let eventObject = {
    event,
    data
  };

  if (this.state === this.OPEN || options.force) {
    this.transmitObject(eventObject);
  }
  return Promise.resolve();
};

AGTransport.prototype.invokeRaw = function (event, data, options, callback) {
  let eventObject = {
    event,
    data,
    callback
  };

  if (!options.noTimeout) {
    eventObject.timeout = setTimeout(() => {
      this._handleEventAckTimeout(eventObject);
    }, this.options.ackTimeout);
  }
  let cid = null;
  if (this.state === this.OPEN || options.force) {
    cid = this.transmitObject(eventObject);
  }
  return cid;
};

AGTransport.prototype.invoke = function (event, data, options) {
  return new Promise((resolve, reject) => {
    this.invokeRaw(event, data, options, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

AGTransport.prototype.cancelPendingResponse = function (cid) {
  delete this._callbackMap[cid];
};

AGTransport.prototype.decode = function (message) {
  return this.codec.decode(message);
};

AGTransport.prototype.encode = function (object) {
  return this.codec.encode(object);
};

AGTransport.prototype.send = function (data) {
  if (this.socket.readyState !== this.socket.OPEN) {
    this._destroy(1005);
  } else {
    this.socket.send(data);
  }
};

AGTransport.prototype.serializeObject = function (object) {
  let str;
  try {
    str = this.encode(object);
  } catch (error) {
    this._onError(error);
    return null;
  }
  return str;
};

AGTransport.prototype.sendObject = function (object) {
  if (this.isBufferingBatch) {
    this._batchBuffer.push(object);
    return;
  }
  let str = this.serializeObject(object);
  if (str != null) {
    this.send(str);
  }
};

module.exports = AGTransport;


/***/ }),

/***/ 15:
/***/ (function(module) {

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

module.exports = wait;


/***/ }),

/***/ 549:
/***/ (function(module) {

let globalScope;
if (typeof WorkerGlobalScope !== 'undefined') {
  globalScope = self;
} else {
  globalScope = typeof window !== 'undefined' && window || (function() { return this; })();
}

const WebSocket = globalScope.WebSocket || globalScope.MozWebSocket;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object} opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  let instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

module.exports = WebSocket ? ws : null;


/***/ }),

/***/ 276:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const ConsumableStream = __webpack_require__(685);

class DemuxedConsumableStream extends ConsumableStream {
  constructor(streamDemux, name) {
    super();
    this._streamDemux = streamDemux;
    this.name = name;
  }

  createConsumer(timeout) {
    return this._streamDemux.createConsumer(this.name, timeout);
  }
}

module.exports = DemuxedConsumableStream;


/***/ }),

/***/ 157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const WritableConsumableStream = __webpack_require__(796);
const DemuxedConsumableStream = __webpack_require__(276);

class StreamDemux {
  constructor() {
    this.streams = {};
    this._nextConsumerId = 1;
    this.generateConsumerId = () => {
      return this._nextConsumerId++;
    };
  }

  write(streamName, value) {
    if (this.streams[streamName]) {
      this.streams[streamName].write(value);
    }
  }

  close(streamName, value) {
    if (this.streams[streamName]) {
      this.streams[streamName].close(value);
    }
  }

  closeAll(value) {
    for (let stream of Object.values(this.streams)) {
      stream.close(value);
    }
  }

  writeToConsumer(consumerId, value) {
    for (let stream of Object.values(this.streams)) {
      if (stream.hasConsumer(consumerId)) {
        return stream.writeToConsumer(consumerId, value);
      }
    }
  }

  closeConsumer(consumerId, value) {
    for (let stream of Object.values(this.streams)) {
      if (stream.hasConsumer(consumerId)) {
        return stream.closeConsumer(consumerId, value);
      }
    }
  }

  getConsumerStats(consumerId) {
    for (let [streamName, stream] of Object.entries(this.streams)) {
      if (stream.hasConsumer(consumerId)) {
        return {
          ...stream.getConsumerStats(consumerId),
          stream: streamName
        };
      }
    }
    return undefined;
  }

  getConsumerStatsList(streamName) {
    if (this.streams[streamName]) {
      return this.streams[streamName]
        .getConsumerStatsList()
        .map(
          (stats) => {
            return {
              ...stats,
              stream: streamName
            };
          }
        );
    }
    return [];
  }

  getConsumerStatsListAll() {
    let allStatsList = [];
    for (let streamName of Object.keys(this.streams)) {
      let statsList = this.getConsumerStatsList(streamName);
      for (let stats of statsList) {
        allStatsList.push(stats);
      }
    }
    return allStatsList;
  }

  kill(streamName, value) {
    if (this.streams[streamName]) {
      this.streams[streamName].kill(value);
    }
  }

  killAll(value) {
    for (let stream of Object.values(this.streams)) {
      stream.kill(value);
    }
  }

  killConsumer(consumerId, value) {
    for (let stream of Object.values(this.streams)) {
      if (stream.hasConsumer(consumerId)) {
        return stream.killConsumer(consumerId, value);
      }
    }
  }

  getBackpressure(streamName) {
    if (this.streams[streamName]) {
      return this.streams[streamName].getBackpressure();
    }
    return 0;
  }

  getBackpressureAll() {
    return Object.values(this.streams).reduce(
      (max, stream) => Math.max(max, stream.getBackpressure()),
      0
    );
  }

  getConsumerBackpressure(consumerId) {
    for (let stream of Object.values(this.streams)) {
      if (stream.hasConsumer(consumerId)) {
        return stream.getConsumerBackpressure(consumerId);
      }
    }
    return 0;
  }

  hasConsumer(streamName, consumerId) {
    if (this.streams[streamName]) {
      return this.streams[streamName].hasConsumer(consumerId);
    }
    return false;
  }

  hasConsumerAll(consumerId) {
    return Object.values(this.streams).some(stream => stream.hasConsumer(consumerId));
  }

  getConsumerCount(streamName) {
    if (this.streams[streamName]) {
      return this.streams[streamName].getConsumerCount();
    }
    return 0;
  }

  getConsumerCountAll() {
    return Object.values(this.streams).reduce(
      (sum, stream) => sum + stream.getConsumerCount(),
      0
    );
  }

  createConsumer(streamName, timeout) {
    if (!this.streams[streamName]) {
      this.streams[streamName] = new WritableConsumableStream({
        generateConsumerId: this.generateConsumerId,
        removeConsumerCallback: () => {
          if (!this.getConsumerCount(streamName)) {
            delete this.streams[streamName];
          }
        }
      });
    }
    return this.streams[streamName].createConsumer(timeout);
  }

  // Unlike individual consumers, consumable streams support being iterated
  // over by multiple for-await-of loops in parallel.
  stream(streamName) {
    return new DemuxedConsumableStream(this, streamName);
  }

  unstream(streamName) {
    delete this.streams[streamName];
  }
}

module.exports = StreamDemux;


/***/ }),

/***/ 685:
/***/ (function(module) {

class ConsumableStream {
  async next(timeout) {
    let asyncIterator = this.createConsumer(timeout);
    let result = await asyncIterator.next();
    asyncIterator.return();
    return result;
  }

  async once(timeout) {
    let result = await this.next(timeout);
    if (result.done) {
      // If stream was ended, this function should never resolve unless
      // there is a timeout; in that case, it should reject early.
      if (timeout == null) {
        await new Promise(() => {});
      } else {
        let error = new Error(
          'Stream consumer operation timed out early because stream ended'
        );
        error.name = 'TimeoutError';
        throw error;
      }
    }
    return result.value;
  }

  createConsumer() {
    throw new TypeError('Method must be overriden by subclass');
  }

  [Symbol.asyncIterator]() {
    return this.createConsumer();
  }
}

module.exports = ConsumableStream;



/***/ }),

/***/ 31:
/***/ (function(__unused_webpack_module, exports) {

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,d)).finalize(c)}}});var t=f.algo={};return f}(Math);

(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);

(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);


/* ---------------- PUBLIC INTERFACE ---------------- */
exports.enc = { 
    Base64: CryptoJS.enc.Base64,
    Utf8: CryptoJS.enc.Utf8,
    Latin1: CryptoJS.enc.Latin1
};
exports.SHA256 = CryptoJS.SHA256;
exports.HmacSHA256 = CryptoJS.HmacSHA256;


/***/ }),

/***/ 245:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NIL: function() { return /* reexport */ nil; },
  parse: function() { return /* reexport */ esm_browser_parse; },
  stringify: function() { return /* reexport */ esm_browser_stringify; },
  v1: function() { return /* reexport */ esm_browser_v1; },
  v3: function() { return /* reexport */ esm_browser_v3; },
  v4: function() { return /* reexport */ esm_browser_v4; },
  v5: function() { return /* reexport */ esm_browser_v5; },
  validate: function() { return /* reexport */ esm_browser_validate; },
  version: function() { return /* reexport */ esm_browser_version; }
});

;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ var regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ var esm_browser_validate = (validate);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ var esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || esm_browser_stringify(b);
}

/* harmony default export */ var esm_browser_v1 = (v1);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/parse.js


function parse(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ var esm_browser_parse = (parse);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/v35.js



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = esm_browser_parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return esm_browser_stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/md5.js
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ var esm_browser_md5 = (md5);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/v3.js


var v3 = v35('v3', 0x30, esm_browser_md5);
/* harmony default export */ var esm_browser_v3 = (v3);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ var esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/sha1.js
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ var esm_browser_sha1 = (sha1);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/v5.js


var v5 = v35('v5', 0x50, esm_browser_sha1);
/* harmony default export */ var esm_browser_v5 = (v5);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/nil.js
/* harmony default export */ var nil = ('00000000-0000-0000-0000-000000000000');
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/version.js


function version(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ var esm_browser_version = (version);
;// CONCATENATED MODULE: ../shared/node_modules/uuid/dist/esm-browser/index.js










/***/ }),

/***/ 14:
/***/ (function(module) {

class Consumer {
  constructor(stream, id, startNode, timeout) {
    this.id = id;
    this._backpressure = 0;
    this.currentNode = startNode;
    this.timeout = timeout;
    this.isAlive = true;
    this.stream = stream;
    this.stream.setConsumer(this.id, this);
  }

  getStats() {
    let stats = {
      id: this.id,
      backpressure: this._backpressure
    };
    if (this.timeout != null) {
      stats.timeout = this.timeout;
    }
    return stats;
  }

  _resetBackpressure() {
    this._backpressure = 0;
  }

  applyBackpressure(packet) {
    this._backpressure++;
  }

  releaseBackpressure(packet) {
    this._backpressure--;
  }

  getBackpressure() {
    return this._backpressure;
  }

  clearActiveTimeout() {
    clearTimeout(this._timeoutId);
    delete this._timeoutId;
  }

  write(packet) {
    if (this._timeoutId !== undefined) {
      this.clearActiveTimeout(packet);
    }
    this.applyBackpressure(packet);
    if (this._resolve) {
      this._resolve();
      delete this._resolve;
    }
  }

  kill(value) {
    this._killPacket = {value, done: true};
    if (this._timeoutId !== undefined) {
      this.clearActiveTimeout(this._killPacket);
    }
    this._destroy();

    if (this._resolve) {
      this._resolve();
      delete this._resolve;
    }
  }

  _destroy() {
    this.isAlive = false;
    this._resetBackpressure();
    this.stream.removeConsumer(this.id);
  }

  async _waitForNextItem(timeout) {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      let timeoutId;
      if (timeout !== undefined) {
        // Create the error object in the outer scope in order
        // to get the full stack trace.
        let error = new Error('Stream consumer iteration timed out');
        (async () => {
          let delay = wait(timeout);
          timeoutId = delay.timeoutId;
          await delay.promise;
          error.name = 'TimeoutError';
          delete this._resolve;
          reject(error);
        })();
      }
      this._timeoutId = timeoutId;
    });
  }

  async next() {
    this.stream.setConsumer(this.id, this);

    while (true) {
      if (!this.currentNode.next) {
        try {
          await this._waitForNextItem(this.timeout);
        } catch (error) {
          this._destroy();
          throw error;
        }
      }
      if (this._killPacket) {
        this._destroy();
        let killPacket = this._killPacket;
        delete this._killPacket;

        return killPacket;
      }

      this.currentNode = this.currentNode.next;
      this.releaseBackpressure(this.currentNode.data);

      if (this.currentNode.consumerId && this.currentNode.consumerId !== this.id) {
        continue;
      }

      if (this.currentNode.data.done) {
        this._destroy();
      }

      return this.currentNode.data;
    }
  }

  return() {
    delete this.currentNode;
    this._destroy();
    return {};
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

function wait(timeout) {
  let timeoutId;
  let promise = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, timeout);
  });
  return {timeoutId, promise};
}

module.exports = Consumer;


/***/ }),

/***/ 796:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const ConsumableStream = __webpack_require__(462);
const Consumer = __webpack_require__(14);

class WritableConsumableStream extends ConsumableStream {
  constructor(options) {
    super();
    options = options || {};
    this._nextConsumerId = 1;
    this.generateConsumerId = options.generateConsumerId;
    if (!this.generateConsumerId) {
      this.generateConsumerId = () => this._nextConsumerId++;
    }
    this.removeConsumerCallback = options.removeConsumerCallback;
    this._consumers = new Map();

    // Tail node of a singly linked list.
    this.tailNode = {
      next: null,
      data: {
        value: undefined,
        done: false
      }
    };
  }

  _write(value, done, consumerId) {
    let dataNode = {
      data: {value, done},
      next: null
    };
    if (consumerId) {
      dataNode.consumerId = consumerId;
    }
    this.tailNode.next = dataNode;
    this.tailNode = dataNode;

    for (let consumer of this._consumers.values()) {
      consumer.write(dataNode.data);
    }
  }

  write(value) {
    this._write(value, false);
  }

  close(value) {
    this._write(value, true);
  }

  writeToConsumer(consumerId, value) {
    this._write(value, false, consumerId);
  }

  closeConsumer(consumerId, value) {
    this._write(value, true, consumerId);
  }

  kill(value) {
    for (let consumerId of this._consumers.keys()) {
      this.killConsumer(consumerId, value);
    }
  }

  killConsumer(consumerId, value) {
    let consumer = this._consumers.get(consumerId);
    if (!consumer) {
      return;
    }
    consumer.kill(value);
  }

  getBackpressure() {
    let maxBackpressure = 0;
    for (let consumer of this._consumers.values()) {
      let backpressure = consumer.getBackpressure();
      if (backpressure > maxBackpressure) {
        maxBackpressure = backpressure;
      }
    }
    return maxBackpressure;
  }

  getConsumerBackpressure(consumerId) {
    let consumer = this._consumers.get(consumerId);
    if (consumer) {
      return consumer.getBackpressure();
    }
    return 0;
  }

  hasConsumer(consumerId) {
    return this._consumers.has(consumerId);
  }

  setConsumer(consumerId, consumer) {
    this._consumers.set(consumerId, consumer);
    if (!consumer.currentNode) {
      consumer.currentNode = this.tailNode;
    }
  }

  removeConsumer(consumerId) {
    let result = this._consumers.delete(consumerId);
    if (this.removeConsumerCallback) this.removeConsumerCallback(consumerId);
    return result;
  }

  getConsumerStats(consumerId) {
    let consumer = this._consumers.get(consumerId);
    if (consumer) {
      return consumer.getStats();
    }
    return undefined;
  }

  getConsumerStatsList() {
    let consumerStats = [];
    for (let consumer of this._consumers.values()) {
      consumerStats.push(consumer.getStats());
    }
    return consumerStats;
  }

  createConsumer(timeout) {
    return new Consumer(this, this.generateConsumerId(), this.tailNode, timeout);
  }

  getConsumerList() {
    return [...this._consumers.values()];
  }

  getConsumerCount() {
    return this._consumers.size;
  }
}

module.exports = WritableConsumableStream;


/***/ }),

/***/ 462:
/***/ (function(module) {

class ConsumableStream {
  async next(timeout) {
    let asyncIterator = this.createConsumer(timeout);
    let result = await asyncIterator.next();
    asyncIterator.return();
    return result;
  }

  async once(timeout) {
    let result = await this.next(timeout);
    if (result.done) {
      // If stream was ended, this function should never resolve unless
      // there is a timeout; in that case, it should reject early.
      if (timeout == null) {
        await new Promise(() => {});
      } else {
        let error = new Error(
          'Stream consumer operation timed out early because stream ended'
        );
        error.name = 'TimeoutError';
        throw error;
      }
    }
    return result.value;
  }

  createConsumer() {
    throw new TypeError('Method must be overriden by subclass');
  }

  [Symbol.asyncIterator]() {
    return this.createConsumer();
  }
}

module.exports = ConsumableStream;



/***/ }),

/***/ 551:
/***/ (function(module) {

module.exports = (function (t)
{
    let e = {}; function n(r) { if (e[r]) return e[r].exports; let o = e[r] = { "i": r, "l": !1, "exports": {} }; return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports; }

    return n.m = t, n.c = e, n.d = function (t, e, r) { n.o(t, e) || Object.defineProperty(t, e, { "enumerable": !0, "get": r }); }, n.r = function (t) { typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { "value": "Module" }), Object.defineProperty(t, "__esModule", { "value": !0 }); }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && typeof t == "object" && t && t.__esModule) return t; let r = Object.create(null); if (n.r(r), Object.defineProperty(r, "default", { "enumerable": !0, "value": t }), 2 & e && typeof t != "string") for (let o in t)n.d(r, o, function (e) { return t[e]; }.bind(null, o)); return r; }, n.n = function (t) { let e = t && t.__esModule ? function () { return t.default; } : function () { return t; }; return n.d(e, "a", e), e; }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e); }, n.p = "", n(n.s = 3);
}([function (t, e, n)
{
    (function (e, n)
    {
        let r; r = function ()
        {
            function t(t) { return typeof t == "function"; }

            let r = Array.isArray ? Array.isArray : function (t) { return Object.prototype.toString.call(t) === "[object Array]"; }, o = 0, i = void 0, s = void 0, u = function (t, e) { p[o] = t, p[o + 1] = e, (o += 2) === 2 && (s ? s(v) : w()); }, a = typeof window != "undefined" ? window : void 0, c = a || {}, h = c.MutationObserver || c.WebKitMutationObserver, f = typeof self == "undefined" && void 0 !== e && {}.toString.call(e) === "[object process]", l = typeof Uint8ClampedArray != "undefined" && typeof importScripts != "undefined" && typeof MessageChannel != "undefined"; function d() { let t = setTimeout; return function () { return t(v, 1); }; }

            var p = new Array(1e3); function v() { for (let t = 0; t < o; t += 2) { (0, p[t])(p[t + 1]), p[t] = void 0, p[t + 1] = void 0; }o = 0; }

            var _, y, m, g, w = void 0; function b(t, e)
            {
                let n = this, r = new this.constructor(M); void 0 === r[k] && N(r); let o = n._state; if (o) { let i = arguments[o - 1]; u(function () { return H(o, r, i, n._result); }); }
                else W(n, r, t, e); return r;
            }

            function T(t) { if (t && typeof t == "object" && t.constructor === this) return t; let e = new this(M); return P(e, t), e; }

            f ? w = function () { return e.nextTick(v); } : h ? (y = 0, m = new h(v), g = document.createTextNode(""), m.observe(g, { "characterData": !0 }), w = function () { g.data = y = ++y % 2; }) : l ? ((_ = new MessageChannel()).port1.onmessage = v, w = function () { return _.port2.postMessage(0); }) : w = void 0 === a ? (function ()
            {
                try { let t = Function("return this")().require("vertx"); return void 0 !== (i = t.runOnLoop || t.runOnContext) ? function () { i(v); } : d(); }
                catch (t) { return d(); }
            }()) : d(); var k = Math.random().toString(36).substring(2); function M() {}

            let j = void 0, O = 1, A = 2, S = { "error": null }; function x(t)
            {
                try { return t.then; }
                catch (t) { return S.error = t, S; }
            }

            function E(e, n, r)
            {
                n.constructor === e.constructor && r === b && n.constructor.resolve === T ? (function (t, e) { e._state === O ? C(t, e._result) : e._state === A ? L(t, e._result) : W(e, void 0, function (e) { return P(t, e); }, function (e) { return L(t, e); }); }(e, n)) : r === S ? (L(e, S.error), S.error = null) : void 0 === r ? C(e, n) : t(r) ? (function (t, e, n)
                {
                    u(function (t)
                    {
                        let r = !1, o = (function (t, e, n, r)
                        {
                            try { t.call(e, n, r); }
                            catch (t) { return t; }
                        }(n, e, function (n) { r || (r = !0, e !== n ? P(t, n) : C(t, n)); }, function (e) { r || (r = !0, L(t, e)); }, t._label)); !r && o && (r = !0, L(t, o));
                    }, t);
                }(e, n, r)) : C(e, n);
            }

            function P(t, e) { let n, r; t === e ? L(t, new TypeError("You cannot resolve a promise with itself")) : (r = typeof (n = e), n === null || r !== "object" && r !== "function" ? C(t, e) : E(t, e, x(e))); }

            function I(t) { t._onerror && t._onerror(t._result), q(t); }

            function C(t, e) { t._state === j && (t._result = e, t._state = O, t._subscribers.length !== 0 && u(q, t)); }

            function L(t, e) { t._state === j && (t._state = A, t._result = e, u(I, t)); }

            function W(t, e, n, r) { let o = t._subscribers, i = o.length; t._onerror = null, o[i] = e, o[i + O] = n, o[i + A] = r, i === 0 && t._state && u(q, t); }

            function q(t) { let e = t._subscribers, n = t._state; if (e.length !== 0) { for (let r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3)r = e[s], o = e[s + n], r ? H(n, r, o, i) : o(i); t._subscribers.length = 0; } }

            function H(e, n, r, o)
            {
                let i = t(r), s = void 0, u = void 0, a = void 0, c = void 0; if (i)
                {
                    if ((s = (function (t, e)
                    {
                        try { return t(e); }
                        catch (t) { return S.error = t, S; }
                    }(r, o))) === S ? (c = !0, u = s.error, s.error = null) : a = !0, n === s) return void L(n, new TypeError("A promises callback cannot return that same promise."));
                }
                else s = o, a = !0; n._state !== j || (i && a ? P(n, s) : c ? L(n, u) : e === O ? C(n, s) : e === A && L(n, s));
            }

            let F = 0; function N(t) { t[k] = F++, t._state = void 0, t._result = void 0, t._subscribers = []; }

            var J = (function ()
                {
                    function t(t, e) { this._instanceConstructor = t, this.promise = new t(M), this.promise[k] || N(this.promise), r(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), this.length === 0 ? C(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(e), this._remaining === 0 && C(this.promise, this._result))) : L(this.promise, new Error("Array Methods must be provided an Array")); }

                    return t.prototype._enumerate = function (t) { for (let e = 0; this._state === j && e < t.length; e++) this._eachEntry(t[e], e); }, t.prototype._eachEntry = function (t, e)
                    {
                        let n = this._instanceConstructor, r = n.resolve; if (r === T)
                        {
                            let o = x(t); if (o === b && t._state !== j) this._settledAt(t._state, e, t._result); else if (typeof o != "function") this._remaining--, this._result[e] = t; else if (n === Q) { let i = new n(M); E(i, t, o), this._willSettleAt(i, e); }
                            else this._willSettleAt(new n(function (e) { return e(t); }), e);
                        }
                        else this._willSettleAt(r(t), e);
                    }, t.prototype._settledAt = function (t, e, n) { let r = this.promise; r._state === j && (this._remaining--, t === A ? L(r, n) : this._result[e] = n), this._remaining === 0 && C(r, this._result); }, t.prototype._willSettleAt = function (t, e) { let n = this; W(t, void 0, function (t) { return n._settledAt(O, e, t); }, function (t) { return n._settledAt(A, e, t); }); }, t;
                }()), Q = (function ()
                {
                    function t(e)
                    {
                        this[k] = F++, this._result = this._state = void 0, this._subscribers = [], M !== e && (typeof e != "function" && (function () { throw new TypeError("You must pass a resolver function as the first argument to the promise constructor"); }()), this instanceof t ? (function (t, e)
                        {
                            try { e(function (e) { P(t, e); }, function (e) { L(t, e); }); }
                            catch (e) { L(t, e); }
                        }(this, e)) : (function () { throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); }()));
                    }

                    return t.prototype.catch = function (t) { return this.then(null, t); }, t.prototype.finally = function (t) { let e = this.constructor; return this.then(function (n) { return e.resolve(t()).then(function () { return n; }); }, function (n) { return e.resolve(t()).then(function () { throw n; }); }); }, t;
                }()); return Q.prototype.then = b, Q.all = function (t) { return new J(this, t).promise; }, Q.race = function (t) { let e = this; return r(t) ? new e(function (n, r) { for (let o = t.length, i = 0; i < o; i++)e.resolve(t[i]).then(n, r); }) : new e(function (t, e) { return e(new TypeError("You must pass an array to race.")); }); }, Q.resolve = T, Q.reject = function (t) { let e = new this(M); return L(e, t), e; }, Q._setScheduler = function (t) { s = t; }, Q._setAsap = function (t) { u = t; }, Q._asap = u, Q.polyfill = function ()
            {
                let t = void 0; if (void 0 !== n)t = n; else if (typeof self != "undefined")t = self; else try { t = Function("return this")(); }
                catch (t) { throw new Error("polyfill failed because global object is unavailable in this environment"); } let e = t.Promise; if (e)
                {
                    let r = null; try { r = Object.prototype.toString.call(e.resolve()); }
                    catch (t) {} if (r === "[object Promise]" && !e.cast) return;
                }t.Promise = Q;
            }, Q.Promise = Q, Q;
        }, t.exports = r();
    }).call(this, n(1), n(2));
}, function (t, e)
{
    let n, r, o = t.exports = {}; function i() { throw new Error("setTimeout has not been defined"); }

    function s() { throw new Error("clearTimeout has not been defined"); }

    function u(t)
    {
        if (n === setTimeout) return setTimeout(t, 0); if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(t, 0); try { return n(t, 0); }
        catch (e)
        {
            try { return n.call(null, t, 0); }
            catch (e) { return n.call(this, t, 0); }
        }
    }

    !(function ()
    {
        try { n = typeof setTimeout == "function" ? setTimeout : i; }
        catch (t) { n = i; } try { r = typeof clearTimeout == "function" ? clearTimeout : s; }
        catch (t) { r = s; }
    }()); let a, c = [], h = !1, f = -1; function l() { h && a && (h = !1, a.length ? c = a.concat(c) : f = -1, c.length && d()); }

    function d()
    {
        if (!h)
        {
            let t = u(l); h = !0; for (let e = c.length; e;) { for (a = c, c = []; ++f < e;)a && a[f].run(); f = -1, e = c.length; }a = null, h = !1, (function (t)
            {
                if (r === clearTimeout) return clearTimeout(t); if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(t); try { r(t); }
                catch (e)
                {
                    try { return r.call(null, t); }
                    catch (e) { return r.call(this, t); }
                }
            }(t));
        }
    }

    function p(t, e) { this.fun = t, this.array = e; }

    function v() {}

    o.nextTick = function (t) { let e = new Array(arguments.length - 1); if (arguments.length > 1) for (let n = 1; n < arguments.length; n++)e[n - 1] = arguments[n]; c.push(new p(t, e)), c.length !== 1 || h || u(d); }, p.prototype.run = function () { this.fun.apply(null, this.array); }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = v, o.addListener = v, o.once = v, o.off = v, o.removeListener = v, o.removeAllListeners = v, o.emit = v, o.prependListener = v, o.prependOnceListener = v, o.listeners = function (t) { return []; }, o.binding = function (t) { throw new Error("process.binding is not supported"); }, o.cwd = function () { return "/"; }, o.chdir = function (t) { throw new Error("process.chdir is not supported"); }, o.umask = function () { return 0; };
}, function (t, e)
{
    let n; n = (function () { return this; }()); try { n = n || new Function("return this")(); }
    catch (t) { typeof window == "object" && (n = window); }t.exports = n;
}, function (t, e, n)
{
    n.r(e); let r, o = n(0), i = function (t, e, n) { return delete t.__resolve__, delete t.__reject__, e(n), t; }, s = function () { let t, e, n = new o.Promise(function (n, r) { t = n, e = r; }); return n.__resolve__ = function (e) { return i(n, t, e); }, n.__reject__ = function (t) { return i(n, e, t); }, n; }, u = "application/x-talkerjs-v1+json", a = (r = function (t, e) { return (r = Object.setPrototypeOf || { "__proto__": [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (let n in e)e.hasOwnProperty(n) && (t[n] = e[n]); })(t, e); }, function (t, e)
        {
            function n() { this.constructor = t; }

            r(t, e), t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
        }), c = (function () { return function (t, e, n, r) { void 0 === r && (r = null), this.talker = t, this.namespace = e, this.data = n, this.responseToId = r, this.type = u; }; }()), h = (function (t)
        {
            function e(e, n, r, o) { void 0 === o && (o = null); let i = t.call(this, e, n, r, o) || this; return i.talker = e, i.namespace = n, i.data = r, i.responseToId = o, i.id = i.talker.nextId(), i; }

            return a(e, t), e.prototype.toJSON = function () { let t = this; return { "id": t.id, "responseToId": t.responseToId || void 0, "namespace": t.namespace, "data": t.data, "type": t.type }; }, e;
        }(c)), f = (function (t)
        {
            function e(e, n, r, o) { void 0 === n && (n = ""), void 0 === r && (r = {}), void 0 === o && (o = 0); let i = t.call(this, e, n, r) || this; return i.talker = e, i.namespace = n, i.data = r, i.id = o, i; }

            return a(e, t), e.prototype.respond = function (t) { return this.talker.send(this.namespace, t, this.id); }, e;
        }(c)); n.d(e, "IncomingMessage", function () { return f; }), n.d(e, "OutgoingMessage", function () { return h; }); let l = (function ()
    {
        function t(t, e, n) { void 0 === n && (n = window); let r = this; return this.remoteWindow = t, this.remoteOrigin = e, this.localWindow = n, this.timeout = 3e3, this.latestId = 0, this.queue = [], this.sent = {}, this.handshaken = !1, this.handshake = s(), this.localWindow.addEventListener("message", function (t) { return r.receiveMessage(t); }, !1), this.sendHandshake(), this; }

        return t.prototype.send = function (t, e, n) { void 0 === n && (n = null); let r = new h(this, t, e, n), o = s(); return this.sent[r.id] = o, this.queue.push(r), this.flushQueue(), setTimeout(function () { return o.__reject__ && o.__reject__(new Error("Talker.js message timed out waiting for a response.")); }, this.timeout), o; }, t.prototype.nextId = function () { return this.latestId += 1; }, t.prototype.receiveMessage = function (t)
        {
            let e; try { e = JSON.parse(t.data); }
            catch (t) { e = { "namespace": "", "data": {}, "id": this.nextId(), "type": u }; } if (this.isSafeMessage(t.source, t.origin, e.type)) return e.handshake || e.handshakeConfirmation ? this.handleHandshake(e) : this.handleMessage(e);
        }, t.prototype.isSafeMessage = function (t, e, n) { let r = t === this.remoteWindow, o = this.remoteOrigin === "*" || e === this.remoteOrigin; return r && o && n === u; }, t.prototype.handleHandshake = function (t) { t.handshake && this.sendHandshake(this.handshaken), this.handshaken || (this.handshaken = !0, this.handshake.__resolve__ && this.handshake.__resolve__(this.handshaken), this.flushQueue()); }, t.prototype.handleMessage = function (t) { let e = new f(this, t.namespace, t.data, t.id), n = t.responseToId; return n ? this.respondToMessage(n, e) : this.broadcastMessage(e); }, t.prototype.respondToMessage = function (t, e) { let n = this.sent[t]; n && n.__resolve__ && (n.__resolve__(e), delete this.sent[t]); }, t.prototype.broadcastMessage = function (t) { this.onMessage && this.onMessage.call(this, t); }, t.prototype.sendHandshake = function (t) { let e; return void 0 === t && (t = !1), this.postMessage(((e = { "type": u })[t ? "handshakeConfirmation" : "handshake"] = !0, e)); }, t.prototype.postMessage = function (t)
        {
            let e = JSON.stringify(t); if (this.remoteWindow && this.remoteOrigin) try { this.remoteWindow.postMessage(e, this.remoteOrigin); }
            catch (t) {}
        }, t.prototype.flushQueue = function () { if (this.handshaken) for (;this.queue.length > 0;) { let t = this.queue.shift(); t && this.postMessage(t); } }, t;
    }()); e.default = l;
}]));
// # sourceMappingURL=talker.min.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ src_client; }
});

;// CONCATENATED MODULE: ../shared/client/src/ele.js
/**
 * @callback whatever
 * @param {...any} param
 */

/**
  * @typedef myElement
  * @type {HTMLElement}
  * @extends {HTMLInputElement}
  */

/**
 * Ele - minimalistic html dom helper
 *
 * @class
 */
class Ele
{

    /**
     * shortcut for document.getElementById(id)
     *
     * @param {String} id
     * @returns {HTMLElement&any} DOM element
     */
    byId(id)
    {
        if (id && id[0] === "#") console.warn("ele.byId should not contain #");
        return document.getElementById(id);
    }

    /**
     * shortcut for document.querySelector(id)
     *
     * @param {String} q
     * @returns {any} DOM element
     */
    byQuery(q)
    {
        return document.querySelector(q);
    }

    /**
     * shortcut for document.querySelectorAll(id)
     *
     * @param {String} q
     * @returns {NodeListOf<HTMLElement>} DOM elements
     */
    byQueryAll(q)
    {
        return document.querySelectorAll(q);
    }

    /**
     * returns the first element with class
     *
     * @param {String} name
     * @returns {HTMLElement|null|Element} DOM element
     */
    byClass(name)
    {
        if (name && name[0] === ".") console.warn("ele.byClass should not contain .");
        const els = document.getElementsByClassName(name);
        if (els.length > 0) return els[0];
        return null;
    }

    /**
     * returns the all elements with class
     *
     * @param {String} name
     * @returns {HTMLCollectionOf<Element|HTMLElement>|Array} DOM elements
     */
    byClassAll(name)
    {
        if (name && name[0] === ".") console.warn("ele.byClassAll should not contain .");
        const els = document.getElementsByClassName(name);
        if (!els) return [];
        return els;
    }

    /**
     * runs the callback with all elements that have the given class as first argument
     *
     * @param {String} name
     */
    forEachClass(name, cb)
    {
        if (name && name[0] === ".") console.warn("ele.forEachClass should not contain .");

        const eles = document.getElementsByClassName(name);
        for (let i = 0; i < eles.length; i++) cb(eles[i]);
    }

    /**
     * returns the currently selected value for a <select>-element, or the text, if no value is set
     *
     * @param {HTMLElement|Element} el
     * @return {any}
     */
    getSelectValue(el)
    {
        if (!el.options) return;
        const selectedIndex = el.selectedIndex || 0;
        return el.options[selectedIndex].value || el.options[selectedIndex].text;
    }

    /**
     * makes an element clickable and executes the callback, also add keyboard support, when hitting enter on the element is same as clicking
     *
     * @param {Object} el
     * @param {whatever} cb
     */
    asButton(el, cb)
    {
        this.clickable(el, cb);
    }

    /**
     * makes an element clickable and executes the callback, also add keyboard support, when hitting enter on the element is same as clicking
     *
     * @param {Object} el
     * @param {whatever|function} cb
     */
    clickable(el, cb)
    {
        if (!el) return;

        if (el.getAttribute("tabindex") == null) el.setAttribute("tabindex", 0);
        el.classList.add("eleAsButton");
        if (cb)
        {
            el.addEventListener("click", (e) => { cb(e); });
            el.addEventListener("keydown", (e) => { if (e.keyCode === 13 || e.keyCode === 32)cb(e); });
        }
        else { console.warn("ele.clickable no callback given", el); }
    }

    /**
     * makes elements matching the query clickable and runs the callback on them when clicked
     *
     * @param {HTMLElement|Element} parent
     * @param {String} query
     * @param {Function} cb
     */
    clickables(parent, query, cb)
    {
        const clickEles = parent.querySelectorAll(query);
        for (let i = 0; i < clickEles.length; i++)
        {
            this.clickable(clickEles[i], (e) =>
            {
                cb(e, e.currentTarget.dataset);
            });
        }
    }

    /**
     * can be used for making element keyboard usable and continue using inline onclick e.g. onkeypress="ele.keyClick(event,this)"
     *
     * @param {KeyboardEvent} event
     * @param  {HTMLElement} el
     */
    keyClick(event, el)
    {
        if ((event.keyCode === 13 || event.keyCode === 32) && el.onclick) el.click();
    }

    /**
     * remove class "hidden" from element
     *
     * @param {HTMLElement|Element} el
     */
    show(el)
    {
        if (el) el.classList.remove("hidden");
    }

    /**
     * add class "hidden" to element
     *
     * @param {HTMLElement|Element} el
     */
    hide(el)
    {
        if (el) el.classList.add("hidden");
    }

    /**
     * remove or add class "hidden" from element
     *
     * @param {HTMLElement|Element} el
     */
    toggle(el)
    {
        if (el.classList.contains("hidden"))
        {
            if (el)el.classList.remove("hidden");
        }
        else
        {
            if (el)el.classList.add("hidden");
        }
    }

    /**
     * create element with given tagname
     *
     * @param {String} n
     * @return {HTMLElement}
     */
    create(n)
    {
        return document.createElement(n);
    }

    /**
     * checks if given element is "activeElement"
     *
     * @param {HTMLElement|Element} el
     * @return {boolean}
     */
    hasFocus(el)
    {
        return document.activeElement == el;
    }

}

/* harmony default export */ var ele = (new Ele());

;// CONCATENATED MODULE: ../shared/client/src/helper.js
/**
 * Shared helper methods for cables uis
 */
class Helper
{
    constructor()
    {
        this._simpleIdCounter = 0;
    }

    /**
     * generate a random v4 uuid
     *
     * @return {string}
     */
    uuid()
    {
        let d = new Date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
        {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    /**
     * checks value for !isNan and isFinite
     *
     * @param {string} n
     * @return {boolean}
     */
    isNumeric(n)
    {
        const nn = parseFloat(n);
        return !isNaN(nn) && isFinite(nn);
    }

    /**
     * generate a simple ID using an internal counter
     *
     * @return {Number} new id
     * @static
     */
    simpleId()
    {
        this._simpleIdCounter++;
        return this._simpleIdCounter;
    }

    pathLookup(obj, path)
    {
        const parts = path.split(".");
        if (parts.length == 1)
        {
            return obj[parts[0]];
        }
        return this.pathLookup(obj[parts[0]], parts.slice(1).join("."));
    }

}
/* harmony default export */ var helper = (new Helper());

;// CONCATENATED MODULE: ../shared/client/src/eventlistener.js
class EventListener
{

    /**
     * @param {Object} emitter
     * @param {string} id
     * @param {string} eventName
     * @param {Function} cb
     */
    constructor(emitter, id, eventName, cb)
    {
        this.targetObj = emitter;
        this.id = id;
        this.eventName = eventName;
        this.cb = cb;
    }

    remove()
    {
        this.targetObj.off(this.id);
    }
}

;// CONCATENATED MODULE: ../shared/client/src/logger.js
/* eslint-disable no-console */
class Logger
{

    /**
     * @param {any} initiator
     * @param {Object} options
     */
    constructor(initiator, options)
    {
        this.initiator = initiator;
        this._options = options;
        if (!this.initiator)
        {
            console.error("no log initator given");
            CABLES.logStack();
        }
    }

    /**
     * @param {string} t
     */
    stack(t)
    {
        console.info("[" + this.initiator + "] ", t);
        console.log((new Error()).stack);
    }

    /**
     * @param {string} t
     */
    groupCollapsed(t)
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 0 }, ...arguments)) || !CABLES.logSilent) console.log("[" + this.initiator + "]", ...arguments);

        console.groupCollapsed("[" + this.initiator + "] " + t);
    }

    /**
     * @param {any[][]} t
     */
    table(t)
    {
        console.table(t);
    }

    groupEnd()
    {
        console.groupEnd();
    }

    error()
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 2 }, ...arguments)) || !CABLES.UI)
        {
            console.error("[" + this.initiator + "]", ...arguments);
        }

        if (this._options && this._options.onError)
        {
            this._options.onError(this.initiator, ...arguments);
            // console.log("emitevent onerror...");
            // CABLES.patch.emitEvent("onError", this.initiator, ...arguments);
            // CABLES.logErrorConsole("[" + this.initiator + "]", ...arguments);
        }
    }

    errorGui()
    {
        if (CABLES.UI) CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 2 }, ...arguments);
    }

    warn()
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 1 }, ...arguments)) || !CABLES.logSilent)
            console.warn("[" + this.initiator + "]", ...arguments);
    }

    verbose()
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 0 }, ...arguments)) || !CABLES.logSilent)
            console.log("[" + this.initiator + "]", ...arguments);
    }

    info()
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 0 }, ...arguments)) || !CABLES.logSilent)
            console.info("[" + this.initiator + "]", ...arguments);
    }

    log()
    {
        if ((CABLES.UI && CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 0 }, ...arguments)) || !CABLES.logSilent)
            console.log("[" + this.initiator + "]", ...arguments);
    }

    logGui()
    {
        if (CABLES.UI) CABLES.UI.logFilter.filterLog({ "initiator": this.initiator, "level": 0 }, ...arguments);
    }

    userInteraction(text)
    {
        // this.log({ "initiator": "userinteraction", "text": text });
    }
}

;// CONCATENATED MODULE: ../shared/client/src/eventtarget.js




/**
 * add eventlistener functionality to classes
 */
class Events
{
    #eventLog = new Logger("eventtarget");

    /** @type {Object<string,EventListener>} */
    #listeners = {};
    #logEvents = false;
    #logName = "";
    #eventCallbacks = {};
    #countErrorUnknowns = 0;
    eventsPaused = false;

    constructor()
    {
    }

    /**
     * @callback whatever
     * @param {...any} param
     */

    /**
     * add event listener
     * @param {string} eventName event name
     * @param {whatever} cb callback
     * @param {string} idPrefix prefix for id, default empty
     * @return {EventListener} eventlistener
     */
    on(eventName, cb, idPrefix = "")
    {
        const newId = (idPrefix || "") + helper.simpleId();

        const event = new EventListener(this, newId, eventName, cb);

        if (!this.#eventCallbacks[eventName]) this.#eventCallbacks[eventName] = [event];
        else this.#eventCallbacks[eventName].push(event);

        this.#listeners[event.id] = event;

        return event;
    }

    removeAllEventListeners()
    {
        for (const i in this.#listeners)
        {
            this.off(this.#listeners[i]);
        }
    }

    /**
     *
     * @param {string} which
     * @param {whatever} cb
     */
    addEventListener(which, cb, idPrefix = "")
    {
        return this.on(which, cb, idPrefix);
    }

    /**
     * check event listener registration
     * @param {string|EventListener} id event id
     * @param {whatever} cb callback - deprecated
     * @return {boolean}
     */
    hasEventListener(id, cb = null)
    {
        if (id && !cb)
        {
            if (typeof id == "string") // check by id
                return !!this.#listeners[id];
            else
                return !!this.#listeners[id.id];

        }
        else
        {
            this.#eventLog.warn("old eventtarget function haseventlistener!");
            if (id && cb)
            {
                if (this.#eventCallbacks[id])
                {
                    const idx = this.#eventCallbacks[id].indexOf(cb);
                    return idx !== -1;
                }
            }
        }
    }

    /**
     * check event listener by name
     * @param {string } eventName event name
     * @return {boolean}
     */
    hasListenerForEventName(eventName)
    {
        return this.#eventCallbacks[eventName] && this.#eventCallbacks[eventName].length > 0;
    }

    /** @deprecated */
    removeEventListener(id)
    {
        return this.off(id);
    }

    /**
     * remove event listener registration
     * @param {EventListener} listenerParam
     */
    off(listenerParam)
    {
        if (listenerParam === null || listenerParam === undefined)
        {
            this.#eventLog.warn("removeEventListener id null", listenerParam);
            return;
        }

        let id = listenerParam; // old off was using id strings directly, now uses eventlistener class
        // @ts-ignore
        if (listenerParam.eventName) id = listenerParam.id;

        if (typeof id != "string")
        {
            console.log("old function signature: removeEventListener! use listener id");
            return;
        }

        const event = this.#listeners[id];
        if (!event)
        {
            if (this.#countErrorUnknowns == 20) this.#eventLog.warn("stopped reporting unknown events");
            if (this.#countErrorUnknowns < 20) this.#eventLog.warn("could not find event...", id, event);
            this.#countErrorUnknowns++;
            return;
        }

        let removeCount = 0;

        let found = true;
        while (found)
        {
            found = false;
            let index = -1;
            for (let i = 0; i < this.#eventCallbacks[event.eventName].length; i++)
            {
                if (this.#eventCallbacks[event.eventName][i].id.indexOf(id) === 0) // this._eventCallbacks[event.eventName][i].id == which ||
                {
                    found = true;
                    index = i;
                }
            }

            if (index !== -1)
            {
                this.#eventCallbacks[event.eventName].splice(index, 1);
                delete this.#listeners[id];
                removeCount++;
            }
        }

        if (removeCount == 0)console.log("no events removed", event.eventName, id);

        return;
    }

    /**
     * enable/disable logging of events for the class
     *
     * @param {boolean} enabled
     * @param {string} logName
     */
    logEvents(enabled, logName)
    {
        this.#logEvents = enabled;
        this.#logName = logName;
    }

    /**
     * emit event
     *
     * @param {string} which event name
     * @param {*} param1
     * @param {*} param2
     * @param {*} param3
     * @param {*} param4
     * @param {*} param5
     * @param {*} param6
     */
    emitEvent(which, param1 = null, param2 = null, param3 = null, param4 = null, param5 = null, param6 = null, param7 = null, param8 = null)
    {
        if (this.eventsPaused) return;
        if (this.#logEvents) this.#eventLog.log("[event] ", this.#logName, which, this.#eventCallbacks);

        if (this.#eventCallbacks[which])
        {
            for (let i = 0; i < this.#eventCallbacks[which].length; i++)
            {
                if (this.#eventCallbacks[which][i])
                {
                    this.#eventCallbacks[which][i].cb(param1, param2, param3, param4, param5, param6, param7, param8);
                }
            }
        }
        else
        {
            if (this.#logEvents) this.#eventLog.log("[event] has no event callback", which, this.#eventCallbacks);
        }
    }
}

// EXTERNAL MODULE: ../shared/client/libs/talker.cjs
var talker = __webpack_require__(551);
;// CONCATENATED MODULE: ../shared/client/src/talkerapi.js



/**
 * wrapper for talkerapi to communicate ui <-> backend even in iframed setups
 *
 * @name TalkerAPI
 * @extends {Events}
 */
class TalkerAPI extends Events
{
    // events
    static EVENT_SCREENSHOT_SAVED = "screenshotSaved";
    static EVENT_PATCH = "patch";

    // common
    static CMD_GET_OP_DOCS = "getOpDocs";
    static CMD_REQUEST_PATCH_DATA = "requestPatchData";
    static CMD_GET_OP_INFO = "getOpInfo";
    static CMD_GET_CABLES_CHANGELOG = "getChangelog";
    static CMD_UPDATE_FILE = "updateFile";
    static CMD_TOGGLE_PATCH_FAVS = "toggleFav";
    static CMD_CHECK_PATCH_UPDATED = "checkProjectUpdated";
    static CMD_CREATE_PATCH_BACKUP = "patchCreateBackup";
    static CMD_RELOAD_PATCH = "reload";
    static CMD_SAVE_PATCH = "savePatch";
    static CMD_GET_PATCH = "getPatch";
    static CMD_GET_PATCH_SUMMARY = "getPatchSummary";
    static CMD_GOTO_PATCH = "gotoPatch";
    static CMD_CREATE_NEW_PATCH = "newPatch";
    static CMD_SAVE_PATCH_AS = "saveProjectAs";
    static CMD_SAVE_PATCH_SCREENSHOT = "saveScreenshot";
    static CMD_SET_PATCH_NAME = "setProjectName";
    static CMD_UPDATE_PATCH_NAME = "updatePatchName";
    static CMD_SET_ICON_SAVED = "setIconSaved";
    static CMD_SET_ICON_UNSAVED = "setIconUnsaved";
    static CMD_GET_FILE_LIST = "getFilelist";
    static CMD_CONVERT_FILE = "fileConvert";
    static CMD_GET_FILE_DETAILS = "getFileDetails";
    static CMD_GET_LIBRARYFILE_DETAILS = "getLibraryFileInfo";
    static CMD_DELETE_FILE = "deleteFile";
    static CMD_GET_ASSET_USAGE_COUNT = "checkNumAssetPatches";
    static CMD_CREATE_NEW_FILE = "createFile";
    static CMD_UPLOAD_FILE = "fileUploadStr";
    static CMD_UPLOAD_OP_DEPENDENCY = "uploadFileToOp";
    static CMD_GET_PROJECT_OPS = "getAllProjectOps";
    static CMD_GET_ALL_OPDOCS = "getOpDocsAll";
    static CMD_GET_COLLECTION_OPDOCS = "getCollectionOpDocs";
    static CMD_CREATE_OP = "opCreate";
    static CMD_SAVE_OP_CODE = "saveOpCode";
    static CMD_GET_OP_CODE = "getOpCode";
    static CMD_FORMAT_OP_CODE = "formatOpCode";
    static CMD_SAVE_OP_LAYOUT = "opSaveLayout";
    static CMD_ADD_OP_LIBRARY = "opAddLib";
    static CMD_REMOVE_OP_LIBRARY = "opRemoveLib";
    static CMD_ADD_OP_CORELIB = "opAddCoreLib";
    static CMD_REMOVE_OP_CORELIB = "opRemoveCoreLib";
    static CMD_CLONE_OP = "opClone";
    static CMD_UPDATE_OP = "opUpdate";
    static CMD_ADD_OP_ATTACHMENT = "opAttachmentAdd";
    static CMD_GET_OP_ATTACHMENT = "opAttachmentGet";
    static CMD_REMOVE_OP_ATTACHMENT = "opAttachmentDelete";
    static CMD_SAVE_OP_ATTACHMENT = "opAttachmentSave";
    static CMD_SAVE_USER_SETTINGS = "saveUserSettings";
    static CMD_TOGGLE_MULTIPLAYER_SESSION = "toggleMultiplayerSession";
    static CMD_CHECK_OP_NAME = "checkOpName";
    static CMD_GET_RECENT_PATCHES = "getRecentPatches";
    static CMD_ADD_OP_DEPENDENCY = "addOpDependency";
    static CMD_REMOVE_OP_DEPENDENCY = "removeOpDependency";
    static CMD_SEND_ERROR_REPORT = "errorReport";
    static CMD_SEND_PATCH = "sendPatch";
    static CMD_EXECUTE_OP = "executeOp";

    // notify ui
    static CMD_UI_REFRESH_FILEMANAGER = "refreshFileManager";
    static CMD_UI_JOB_START = "jobStart";
    static CMD_UI_JOB_PROGRESS = "jobProgress";
    static CMD_UI_JOB_FINISH = "jobFinish";
    static CMD_UI_NOTIFY = "notify";
    static CMD_UI_NOTIFY_ERROR = "notifyError";
    static CMD_UI_FILE_UPDATED = "fileUpdated";
    static CMD_UI_FILE_DELETED = "fileDeleted";
    static CMD_UI_LOG_ERROR = "logError";
    static CMD_UI_OPS_DELETED = "opsDeleted";
    static CMD_UI_OP_RENAMED = "opRenamed";
    static CMD_UI_CLOSE_RENAME_DIALOG = "closeRenameDialog";
    static CMD_UI_SET_SAVED_STATE = "setSavedState";
    static CMD_UI_SETTING_MANUAL_SCREENSHOT = "manualScreenshot";
    static CMD_UI_UPDATE_PATCH_NAME = "uiUpdatePatchName";

    // electron
    static CMD_ELECTRON_RENAME_OP = "opRename";
    static CMD_ELECTRON_DELETE_OP = "opDelete";
    static CMD_ELECTRON_SET_OP_SUMMARY = "opSetSummary";
    static CMD_ELECTRON_GET_PROJECT_OPDIRS = "getProjectOpDirs";
    static CMD_ELECTRON_OPEN_DIR = "openDir";
    static CMD_ELECTRON_SELECT_FILE = "selectFile";
    static CMD_ELECTRON_SELECT_DIR = "selectDir";
    static CMD_ELECTRON_COLLECT_ASSETS = "collectAssets";
    static CMD_ELECTRON_COLLECT_OPS = "collectOps";
    static CMD_ELECTRON_SAVE_PROJECT_OPDIRS_ORDER = "saveProjectOpDirOrder";
    static CMD_ELECTRON_REMOVE_PROJECT_OPDIR = "removeProjectOpDir";
    static CMD_ELECTRON_EXPORT_PATCH = "exportPatch";
    static CMD_ELECTRON_EXPORT_PATCH_BUNDLE = "exportPatchBundle";
    static CMD_ELECTRON_ADD_PROJECT_OPDIR = "addProjectOpDir";
    static CMD_ADD_OP_PACKAGE = "addOpPackage";

    constructor(target)
    {
        super();

        // eslint-disable-next-line no-undef
        this._talker = new talker["default"](target, "*");
        this._callbackCounter = 0;
        this._callbacks = {};

        this._talker.onMessage = (msg) =>
        {
            if (msg.data && msg.data.cmd) // other messages are not for talkerapi, i.e. anything that somehow is sent via .postMessage
            {
                if (msg.data.cmd === "callback")
                {
                    if (this._callbacks[msg.data.cb]) this._callbacks[msg.data.cb](msg.data.error, msg.data.response);
                }
                else
                {
                    if (!this.hasListenerForEventName(msg.data.cmd))
                    {
                        console.error("TalkerAPI has no listener for", msg.data.cmd);
                    }
                    this.emitEvent(msg.data.cmd, msg.data.data, (error, r) =>
                    {
                        this._talker.send("cables", { "cmd": "callback", "cb": msg.data.cb, "response": r, "error": error });
                    });
                }
            }
        };
    }

    /**
     * send message via cables-talkerapi
     * @param {string} cmd name of the event
     * @param {object} data payload
     * @param {function} [callback]
     */
    send(cmd, data, callback)
    {
        const payload = { "cmd": cmd, "data": data };
        if (callback)
        {
            this._callbackCounter++;
            this._callbacks[this._callbackCounter] = callback;
            payload.cb = this._callbackCounter;
        }

        this._talker.send("cables", payload);
    }
}

;// CONCATENATED MODULE: ../shared/client/src/modalbg.js



class ModalBackground extends Events
{
    constructor(options = {})
    {
        super();
        this._eleBg = ele.byId("modalbg");
        this.showing = false;

        this._eleBg.addEventListener("pointerdown", () =>
        {
            this.hide();
        });
        this._eleBg.addEventListener("click", () =>
        {
            this.hide();
        });

        if (options.listenToEsc)
            document.body.addEventListener("keydown",
                (event) =>
                {
                    if (this.showing && event.key === "Escape") this.hide();
                });
    }

    /**
     * @param {boolean} [transparent]
     */
    show(transparent = false)
    {
        if (!this.showing)
        {
            this.showing = true;
            this.emitEvent("show");
        }
        this._eleBg.style.display = "block";

        if (transparent) this._eleBg.classList.add("modalbgtransparent");
        else this._eleBg.classList.remove("modalbgtransparent");
    }

    hide()
    {
        if (this.showing)
        {
            this.showing = false;
            this.emitEvent("hide");
        }
        this._eleBg.style.display = "none";
    }
}

;// CONCATENATED MODULE: ../shared/client/src/handlebars.js



class HandlebarsHelper
{
    initHandleBarsHelper()
    {
        if (window.Handlebars)
        {
            Handlebars.registerHelper("urlencode", (str) =>
            {
                return new Handlebars.SafeString(encodeURIComponent(str));
            });

            Handlebars.registerHelper("md", (str, setOpLinks = false, linkTarget = "") =>
            {
                if (!str) return "";
                let escaped = Handlebars.escapeExpression(str);
                if (marked) escaped = marked.parse(escaped);
                if (setOpLinks) escaped = this._setOpLinks(escaped, linkTarget);
                return new Handlebars.SafeString(escaped);
            });

            Handlebars.registerHelper("round", (str) =>
            {
                if (helper.isNumeric(str))
                {
                    str = String(Math.round(parseFloat(str)));
                }
                return str;
            });

            Handlebars.registerHelper("twoDigits", (str) =>
            {
                if (!str) return "0.00";
                let parsed = parseFloat(str);
                if (!parsed) return "0.00";
                return parsed.toFixed(2);
            });

            Handlebars.registerHelper("toInt", (str) =>
            {
                if (!str) return "0";
                let parsed = parseInt(str);
                if (!parsed) return "0";
                return parsed;
            });

            Handlebars.registerHelper("json", (context) =>
            {
                let str = "";
                try
                {
                    str = JSON.stringify(context, true, 4);
                }
                catch (e)
                {
                    console.error(e);
                }

                return str;
            });

            Handlebars.registerHelper("console", (context) =>
            {
                return console.log(context);
            });

            Handlebars.registerHelper("opLayout", (opName) =>
            {

                return new Handlebars.SafeString(gui.opDocs.getLayoutSvg(opName));
            });

            // don't change to arrow-function to keep the right `arguments` for context
            Handlebars.registerHelper("compare", function (left_value, operator, right_value, options)
            {
                let operators, result;

                if (arguments.length < 4)
                {
                    throw new Error("Handlerbars Helper 'compare' needs 3 parameters, left value, operator and right value");
                }

                operators = {
                    "==": function (l, r) { return l == r; },
                    "===": function (l, r) { return l === r; },
                    "!=": function (l, r) { return l != r; },
                    "<": function (l, r) { return l < r; },
                    ">": function (l, r) { return l > r; },
                    "<=": function (l, r) { return l <= r; },
                    ">=": function (l, r) { return l >= r; },
                    "typeof": function (l, r) { return typeof l == r; }
                };

                if (!operators[operator])
                {
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
                }

                result = operators[operator](left_value, right_value);

                if (result === true)
                {
                    return options.fn(this);
                }
                else
                {
                    return options.inverse(this);
                }
            });

            Handlebars.registerHelper("toUpperCase", (str) =>
            {
                if (str && typeof str === "string")
                {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                return "";
            });

            // don't change to arrow-function to keep the right `this` for context
            Handlebars.registerHelper("paginationLoop", function (block)
            {
                let currentPage = Number(this.currentPage) || 0;
                let to = currentPage + 19;
                if (to > this.pages)
                {
                    to = this.pages;
                }

                let from = currentPage - 10;
                if (from < 1) from = 1;

                const numTabs = 19;

                if ((currentPage + numTabs) > this.pages)
                {
                    from = this.pages - numTabs;
                }

                if (from < 1) from = 1;

                let accum = "";
                let count = 0;
                for (let i = from; i <= to; i++)
                {
                    if (count > numTabs) break;
                    let last = (i === to);
                    if (count === numTabs) last = true;
                    accum += block.fn({ "page": i, "last": last, "first": i == from });
                    count++;
                }

                return accum;
            });

            Handlebars.registerHelper("logdate", (str) =>
            {
                if (helper.isNumeric(str) && String(str).length < 11) str *= 1000;
                let date;
                if (str && moment)
                {
                    date = moment(str).format(client_contstants.DATE_FORMAT_LOGDATE);
                }
                else
                {
                    date = "";
                }
                return new Handlebars.SafeString("<span title=\"" + date + "\">" + date + "</span>");
            });

            Handlebars.registerHelper("displaydate", (str) =>
            {
                if (helper.isNumeric(str) && String(str).length < 11) str *= 1000;
                let date = str;
                let displayDate;
                if (str && moment)
                {
                    const m = moment(str);
                    date = m.format(client_contstants.DATE_FORMAT_DISPLAYDATE_DATE);
                    displayDate = m.format(client_contstants.DATE_FORMAT_DISPLAYDATE_DISPLAY);
                }
                else
                {
                    displayDate = "";
                }
                return new Handlebars.SafeString("<span title=\"" + date + "\">" + displayDate + "</span>");
            });

            Handlebars.registerHelper("tooltipdate", (str) =>
            {
                if (helper.isNumeric(str) && String(str).length < 11) str *= 1000;
                let displayDate;
                if (str && moment)
                {
                    const m = moment(str);
                    displayDate = m.format(client_contstants.DATE_FORMAT_TOOLTIPDATE);
                }
                else
                {
                    displayDate = "";
                }
                return new Handlebars.SafeString(displayDate);
            });

            Handlebars.registerHelper("displaydateNoTime", (str) =>
            {
                if (helper.isNumeric(str) && String(str).length < 11) str *= 1000;
                let date = str;
                let displayDate = str;
                if (moment)
                {
                    const m = moment(str);
                    date = m.format(client_contstants.DATE_FORMAT_DISPLAYDATE_NO_TIME_DATE);
                    displayDate = m.format(client_contstants.DATE_FORMAT_DISPLAYDATE_NO_TIME_DISPLAY);
                }
                return new Handlebars.SafeString("<span title=\"" + date + "\">" + displayDate + "</span>");
            });

            Handlebars.registerHelper("relativedate", (str) =>
            {
                if (helper.isNumeric(str) && String(str).length < 11) str *= 1000;
                let date = str;
                let displayDate;
                if (str && moment)
                {
                    const m = moment(str);
                    displayDate = m.fromNow();
                    if (m.isBefore(moment().subtract(7, "days"))) displayDate = moment(date).format(client_contstants.DATE_FORMAT_RELATIVEDATE_FULL);
                    date = m.format(client_contstants.DATE_FORMAT_RELATIVEDATE_FULL);
                }
                else
                {
                    date = "";
                    displayDate = "";
                }
                return new Handlebars.SafeString("<span title=\"" + date + "\">" + displayDate + "</span>");
            });

            Handlebars.registerHelper("textconstant", (str) =>
            {
                const locale = "en";
                return client_contstants.text[locale][str];
            });

            Handlebars.registerHelper("constants", (path) =>
            {
                if (!path) return "";
                const constant = helper.pathLookup(client_contstants, path);
                if (constant) return constant;
                return path;
            });
        }
    }

    _setOpLinks(html, linkTarget = "")
    {
        html = html || "";
        let link = "/op/";
        if (CABLES && CABLES.platform) link = CABLES.platform.getCablesUrl() + link;
        // eslint-disable-next-line no-useless-escape
        const urlPattern = /\b(?:Ops\.)[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        let replaceValue = "<a href=\"" + link + "$&\">$&</a>";
        if (linkTarget) replaceValue = "<a href=\"" + link + "$&\" target=\"" + linkTarget + "\">$&</a>";
        html = html.replace(urlPattern, replaceValue);
        return html;
    }

}
/* harmony default export */ var handlebars = (new HandlebarsHelper());

;// CONCATENATED MODULE: ../shared/shared_constants.json
var shared_constants_namespaceObject = /*#__PURE__*/JSON.parse('{"DATE_FORMAT_LOGDATE":"YYYY-MM-DD HH:mm","DATE_FORMAT_DISPLAYDATE_DATE":"YYYY-MM-DD HH:mm","DATE_FORMAT_DISPLAYDATE_DISPLAY":"MMM D, YYYY [at] HH:mm","DATE_FORMAT_TOOLTIPDATE":"MMM D, YYYY [at] HH:mm","DATE_FORMAT_DISPLAYDATE_NO_TIME_DATE":"YYYY-MM-DD","DATE_FORMAT_DISPLAYDATE_NO_TIME_DISPLAY":"MMM D, YYYY ","DATE_FORMAT_RELATIVEDATE_CUTOFF_DAYS":7,"DATE_FORMAT_RELATIVEDATE_FULL":"MMM D, YYYY [at] HH:mm","IFRAME_OPTIONS_ALLOW":"clipboard-read;clipboard-write;gyroscope;accelerometer;geolocation;camera;microphone;midi;usb;serial;xr-spatial-tracking;web-share;ambient-light-sensor;window-management;bluetooth","IFRAME_OPTIONS_SANDBOX":"allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-downloads allow-popups allow-popups-to-escape-sandbox","FILETYPES":{"image":[".jpg",".jpeg",".png",".gif",".webp",".avif",".jxl"],"binary":[".bin"],"audio":[".mp3",".wav",".ogg",".aac",".mid",".flac"],"video":[".m4a",".mp4",".mpg",".webm",".mkv"],"gltf":[".glb"],"3d raw":[".obj",".fbx",".3ds",".ply",".dae",".blend",".md2",".md3",".ase"],"JSON":[".json"],"CSS":[".css",".scss"],"textfile":[".txt",".md"],"pointcloud":[".pc.txt"],"shader":[".frag",".vert"],"SVG":[".svg"],"CSV":[".csv"],"XML":[".xml"],"font":[".otf",".ttf",".woff",".woff2"],"mesh sequence":[".seq.zip"],"pointcloud json":[".pc.txt"],"3d json":[".3d.json"],"javascript":[".js",".cjs",".mjs"],"ar markers":[".iset",".fset",".fset3"]},"EDITABLE_FILETYPES":["textfile","CSS","javascript","XML","JSON","shader"],"text":{"en":{"leave_patch":"Leave Patch"}}}');
;// CONCATENATED MODULE: ../shared/client/client_contstants.js


/* harmony default export */ var client_contstants = ({
    ...shared_constants_namespaceObject
});

// EXTERNAL MODULE: ../shared/node_modules/socketcluster-client/index.js
var socketcluster_client = __webpack_require__(996);
// EXTERNAL MODULE: ../shared/node_modules/jwt-encode/src/index.js
var src = __webpack_require__(300);
;// CONCATENATED MODULE: ../shared/buildwatcher.js



class BuildWatcher
{

    constructor(gulp, cablesConfig, module)
    {
        this._gulp = gulp;
        this._module = module;
        this._config = cablesConfig.socketclusterClient || {};
        const serverConfig = cablesConfig.socketclusterServer || {};
        this._socketCluster = {
            "active": this._config.enabled && cablesConfig.watchBuildWhenLocal,
            "config": serverConfig,
            "connected": false,
            "socket": null,
            "secret": serverConfig.secret
        };

        this._log = {
            "info": (...args) =>
            {
                const date = new Date();
                let hours = ("0" + date.getHours()).slice(-2);
                let minutes = ("0" + date.getMinutes()).slice(-2);
                let seconds = ("0" + date.getMinutes()).slice(-2);
                console.log("[" + hours + ":" + minutes + ":" + seconds + "]", "[buildwatcher]", ...args);
            }
        };

    }

    watch(glob, watchOptions, task)
    {
        if (this._socketCluster.active)
        {
            if (!this._socketCluster.connected) this._connect();
            const _build_watcher = (done) =>
            {
                this._sendBroadcast({ "build": "started", "time": Date.now(), "module": this._module });
                task(() =>
                {
                    this._sendBroadcast({ "build": "ended", "time": Date.now(), "module": this._module });
                    done();
                });
            };
            this._gulp.watch(glob, watchOptions, _build_watcher);
        }
        else
        {
            this._gulp.watch(glob, watchOptions, task);
        }

    }

    notify(glob, watchOptions, eventName)
    {
        if (this._socketCluster.active)
        {
            if (!this._socketCluster.connected) this._connect();
            const _build_notify = (fileName) =>
            {
                const data = { "build": eventName, "time": Date.now(), "module": this._module };
                let send = true;
                const dirSeperator = process && process.platform === "win32" ? "\\" : "/";
                switch (eventName)
                {
                case "opchange":
                    if (fileName)
                    {
                        data.opName = fileName.split(dirSeperator).reverse().find((pathPart) => { return pathPart && pathPart.startsWith("Ops.") && !pathPart.endsWith(".js"); });
                    }
                    break;
                case "attachmentchange":
                    if (fileName)
                    {
                        data.opName = fileName.split(dirSeperator).reverse().find((pathPart) => { return pathPart && pathPart.startsWith("Ops.") && !pathPart.endsWith(".js"); });
                        data.attachmentName = fileName.split(dirSeperator).reverse()[0];
                    }
                    break;
                }
                if (send) this._sendBroadcast(data);
            };
            const watcher = this._gulp.watch(glob, watchOptions);
            watcher.on("change", _build_notify);
        }
    }

    _connect()
    {
        if (this._socketCluster.active && !this._socketCluster.connected)
        {
            this._socketCluster.socket = socketClusterClient.create({
                "hostname": this._socketCluster.config.interface,
                "port": this._socketCluster.config.port,
                "secure": false
            });
            this._log.info(this._module, "- connected to socketcluster server at", this._socketCluster.config.interface + ":" + this._socketCluster.config.port);
            this._socketCluster.connected = true;
        }
    }

    _sendBroadcast(data)
    {
        if (!this._socketCluster.active) return;
        if (!this._socketCluster.connected) this._connect();
        const channelName = "broadcast";
        if (!this._socketCluster.connected)
        {
            this._log.info("not broadcasting serverside message - not connected");
            return;
        }

        const socketclusterToken = sign({
            "channels": [channelName],
        }, this._socketCluster.secret);

        const payload = {
            "token": socketclusterToken,
            "topic": "notify",
            "data": data
        };
        this._socketCluster.socket.transmitPublish(channelName, payload);

    }

}

;// CONCATENATED MODULE: ../shared/client/index.js












;// CONCATENATED MODULE: ./src_client/api.js


/**
 * holds functions to make requests to cables_api endpoints,
 * can be given a TalkerAPI with setTalkerApi, will then relay errors to the "logError" cmd
 *
 */
class Api
{

    /**
     *
     * @param {TalkerAPI} talkerApi
     */
    setTalkerApi(talkerApi)
    {
        this._talker = talkerApi;
    }

    /**
     *
     * @param {String} sessionId
     */
    setEditorSessionId(sessionId)
    {
        this._editorSessionId = sessionId;
    }

    request(method, url, data, cbSuccess, cbError)
    {
        if (url.startsWith("/")) url = url.slice(1);

        // use global without import here, because we don't want to load all the code in sandbox_editor
        if (window.web && window.web.nav && window.web.nav.resetInfoBar) window.web.nav.resetInfoBar();
        const options = { "method": method };

        const headers = {};
        if (this._editorSessionId) headers["X-Cables-Editor-Session"] = this._editorSessionId;

        if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE")
        {
            headers.Accept = "application/json";
            headers["Content-Type"] = "application/json";
            if (data) options.body = JSON.stringify(data);
        }
        options.headers = headers;

        fetch("/api/" + url, options)
            .then((response) =>
            {
                let keys = response.headers.get("server-timing");
                if (keys)
                {
                    keys = keys.split(",");
                    const parts = keys[keys.length - 1].split(";");
                    if (parts.length >= 1)
                    {
                        const minTimeWarning = 350;
                        let totaltime = 0;
                        if (parts[0].trim() === "total") totaltime = parts[1].split("=")[1];
                        let time = parseFloat(totaltime);

                        const infobar = document.getElementById("info-timings");
                        if (infobar)
                        {
                            const size = ((response.headers.get("Content-Length") || 0) / 1000);

                            if (size > 750)
                            {
                                infobar.classList.remove("hidden");
                                const div = document.createElement("div");
                                div.classList.add("cute-12-tablet");

                                div.innerText = "- big request: api/" + url + ": " + Math.round(size) + "kb";
                                infobar.append(div);
                            }

                            if (time > minTimeWarning)
                            {
                                infobar.classList.remove("hidden");
                                const div = document.createElement("div");
                                div.classList.add("cute-12-tablet");

                                div.innerText = "- slow request: " + method + " /api/" + url + ": " + Math.round(time) + "ms";
                                infobar.append(div);
                            }
                        }
                        else
                        if (time > minTimeWarning)
                        {
                            this._logError({ "level": "warn", "message": "slow request: " + method + " /api/" + url + ": " + Math.round(time) + "ms" });
                        }
                    }
                }

                if (response.ok)
                {
                    // response is in 200 range, parse json, if this fails we will go
                    // into the catch block
                    if (response.headers && response.headers.get("content-type").includes("application/javascript"))
                    {
                        return response.text();
                    }
                    else
                    {
                        return response.json();
                    }
                }
                else
                {
                    // response not in 200 range, throw response as error, to be handled in catch below
                    throw response;
                }
            })
            .then((response) =>
            {
                // 200-range and valid json, call callback
                if (cbSuccess) cbSuccess(response);
            })
            .catch((e) =>
            {
                // we got here either by "not 200 range" or json parse error, so we
                // need to try the json parsing again...

                // use global without import here, because we don't want to load all the code in sandbox_editor
                if (window.web && window.web.env && window.web.env.isDev() && e.status === 502)
                {
                    this._logError({ "level": "log", "message": "BAD GATEWAY.... trying again soon....", "type": "network" });
                    setTimeout(
                        () =>
                        {
                            this.request(method, url, data, cbSuccess, cbError);
                        }, 5000
                    );
                    return;
                }

                // use global without import here, because we don't want to load all the code in sandbox_editor
                const showInInfoBar = window.web && window.web.nav && window.web.nav.showInfoBar && e.status >= 500;
                const infoBarText = "Something went wrong, please try again!";

                if (e.json)
                {
                    e.json().then((json) =>
                    {
                        if (showInInfoBar && json && json.msg && json.msg !== "UNKNOWN_ERROR")
                        {
                            window.web.nav.showInfoBar(infoBarText + "<br/>" + json.msg, "error", false);
                        }
                        // error response was not 200-range but valid json, give to callback
                        const errorMessage = " " + method + " " + (json.url || url) + " " + (json.msg || "") + " (" + (e.code || json.code) + ")";
                        this._logError({ "level": "warn", "message": errorMessage });
                        if (cbError)cbError(json);
                    }).catch((e2) =>
                    {
                        // failed to parse json of error response, give error to callback and log error to console...
                        const errorMessage = "api fetch err 1: " + method + " " + url + " " + e.message + " (" + e.code + ")";
                        this._logError({ "level": "warn", "message": errorMessage });
                        if (cbError)cbError(errorMessage);
                    });
                }
                else
                {
                    if (showInInfoBar) window.web.nav.showInfoBar(infoBarText, "error", false);
                    const errorMessage = "api fetch err 2: " + method + " " + url + " " + e.message + " (" + e.code + ")";
                    this._logError({ "level": "warn", "message": errorMessage, "type": "network" });
                    if (cbError)cbError(errorMessage);
                }
            });
    }

    get(url, cb, cbErr)
    {
        this.request("GET", url, {}, cb, cbErr);
    }

    post(url, data, cb, cbErr)
    {
        this.request("POST", url, data, cb, cbErr);
    }

    delete(url, data, cb, cbErr)
    {
        this.request("DELETE", url, data, cb, cbErr);
    }

    put(url, data, cb, cbErr)
    {
        this.request("PUT", url, data, cb, cbErr);
    }

    patch(url, data, cb, cbErr)
    {
        this.request("PATCH", url, data, cb, cbErr);
    }

    _logError(errorData)
    {
        if (!this._talker)
        {
            const errorMessage = errorData.message || "unknown error";
            switch (errorData.level)
            {
            case "error":
                console.error(errorMessage);
                break;
            case "warn":
                console.warn(errorMessage);
                break;
            case "verbose":
                console.verbose(errorMessage);
                break;
            case "info":
                console.info(errorMessage);
                break;
            default:
                console.log(errorMessage);
                break;
            }
        }
        else
        {
            this._talker.send(TalkerAPI.CMD_UI_LOG_ERROR, errorData);
        }
    }
}
/* harmony default export */ var api = (new Api());

;// CONCATENATED MODULE: ./src_client/patchlists.js





class PatchLists
{
    displayPatchList(targetEl, fromUserInteraction = false, listId = null, cb = null)
    {
        const listTarget = targetEl || ele.byId("patchlist");
        const id = listId || listTarget.dataset.listId;
        const editMode = listTarget && listTarget.dataset.editMode ? listTarget.dataset.editMode : false;
        const isStaff = listTarget && listTarget.dataset.editStaff ? listTarget.dataset.editStaff : false;

        api.get("patchlists/" + id, (result) =>
        {
            const list = result.data;
            let template = "patchlist_info";
            if (editMode)
            {
                template = "patchlist_edit";
            }
            list.allProjectIds = "";
            if (list.allowExport)
            {
                list.projects.forEach((project, i) =>
                {
                    if (i > 0) list.allProjectIds += ",";
                    list.allProjectIds += project.shortId;
                });
            }
            const projects = list.projects;
            let listHtml = "";
            if (projects.length > 0)
            {
                for (let i = 0; i < projects.length; i++)
                {
                    const project = projects[i];
                    const projectInfo = src_client.getHandleBarHtml("project_info", {
                        "project": project,
                        "user": {
                            "_id": project.userId,
                            "username": project.cachedUsername
                        }
                    });
                    const vars = {
                        "project": project,
                        "list": list,
                        "first": i === 0,
                        "last": i === (projects.length - 1),
                        "editMode": editMode,
                        "projectInfo": projectInfo
                    };
                    listHtml += src_client.getHandleBarHtml("patchlist_item", vars);
                }
            }
            else
            {
                const vars = {
                    "list": list,
                    "last": true,
                    "editMode": editMode
                };
                listHtml += src_client.getHandleBarHtml("patchlist_item", vars);
            }
            if (list.allowEdit) listHtml += src_client.getHandleBarHtml("patchlist_add_patch", { "list": list });

            if (listTarget)
            {
                const container = document.createElement("div");
                container.classList.add("row");
                const infoContainer = document.createElement("div");
                infoContainer.classList.add("cute-4-tablet", "left");
                src_client.setHandleBarHtml(template, {
                    "list": list,
                    "editMode": editMode,
                    "hasEditRights": list.allowEdit,
                    "hasExportRights": list.allowExport,
                    "isStaff": isStaff
                }, infoContainer);
                container.appendChild(infoContainer);

                const listContainer = document.createElement("div");
                listContainer.classList.add("patchlisttable", "cute-8-tablet", "right");
                listContainer.dataset.listId = list._id;
                listContainer.innerHTML = listHtml;

                container.appendChild(listContainer);
                listTarget.innerHTML = container.outerHTML;
                src_client.tabs.initPagination(listTarget, result.pagination);

                ele.clickables(listTarget, ".clickable", (event, dataset) =>
                {
                    if (dataset.click === "export")
                    {
                        const fileURL = "/api/projects/" + list.allProjectIds + "/export_code" + "?fileName=" + list.exportName;
                        window.open(fileURL);
                    }
                });
                if (cb) cb();
            }
        });
    }

    create()
    {
        api.post("patchlists/create", {}, (res) =>
        {
            document.location.href = "/patchlist/" + res.data.shortId + "/edit#settings";
        });
    }

    delete(listId)
    {
        if (confirm("Really delete ?"))
        {
            api.delete("patchlists/" + listId, {}, (res) =>
            {
                window.location.reload();
            });
        }
    }

    addItem(listId, id, type, cb)
    {
        const errorEle = ele.byId("addpatch-error");
        if (id)
        {
            let url = "patchlists/" + listId + "/projects/" + id;
            if (type === "op") url = "patchlists/" + listId + "/ops/" + id;
            api.post(url, {}, () =>
            {
                if (errorEle) ele.hide(errorEle);
                if (cb) cb();
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton(false, false);
                if (errorEle)
                {
                    errorEle.innerText = "Adding not possible: \"" + e.msg + "\"";
                    ele.show(errorEle);
                }
            });
        }
        else
        {
            src_client.buttons.stopSavingAnimButton(false, false);
            if (errorEle)
            {
                errorEle.innerText = "- Unknown list or insufficient permissions";
                ele.show(errorEle);
            }
        }
    }

    removeItem(listId, id, type, showConfirm, cb)
    {
        let r = true;
        if (showConfirm) r = confirm("are you sure? remove " + type + "?");
        if (r)
        {
            let url = "patchlists/" + listId + "/projects/" + id;
            if (type === "op") url = "patchlists/" + listId + "/ops/" + id;
            api.delete(url, {}, (response) =>
            {
                if (cb) cb();
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton(false, false);
                const errorEle = ele.byId("patch-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- removal not possible: \"" + e.msg + "\"";
                    ele.show(errorEle);
                }
            });
        }
    }

    getAll(targetEl, fromUserInteraction)
    {
        const filter = targetEl.dataset.contentFilter;
        const template = targetEl.dataset.contentTemplate || "patchlist";
        const type = targetEl.dataset.contentType || "default";

        let apiUrl = "patchlists/all?type=" + type;
        if (filter) apiUrl += "&filter=" + filter;

        const limit = template === "patchlist_row" ? 20 : 48;
        apiUrl = src_client.tabs.addPagination(apiUrl, limit);
        api.get(apiUrl, (res) =>
        {
            let html = "";
            if (res.data.length > 0)
            {
                html = "<table>";
                res.data.forEach((list) =>
                {
                    const projectInfo = src_client.getHandleBarHtml("project_info", {
                        "project": list,
                        "user": list.owner,
                        "isPatchlist": true
                    });
                    html += src_client.getHandleBarHtml(template, {
                        "list": list,
                        "projectInfo": projectInfo
                    });
                });
                html += "</table>";
            }
            else
            {
                html = src_client.getHandleBarHtml("patchlist_empty");
            }
            targetEl.innerHTML = html;
            src_client.tabs.initPagination(targetEl, res.pagination, res.pagination.limit, res.pagination.offset);
        }, () => {});
    }

    getLists(targetEl, fromUserInteraction)
    {
        let filter = targetEl.dataset.contentFilter;
        let listUserId = targetEl.dataset.listUser;

        if (!filter) filter = "all";
        let apiUrl = src_client.tabs.addPagination("patchlists/mylists/" + filter, 48);
        if (listUserId) apiUrl += "&userId=" + listUserId;

        let displayedDate = "updated";
        if (filter === "profile") displayedDate = "published";

        api.get(apiUrl, (res) =>
        {
            let html = "";
            if (res.data.length > 0)
            {
                html = "<table>";
                res.data.forEach((list) =>
                {
                    const projectInfo = src_client.getHandleBarHtml("project_info", {
                        "project": list,
                        "user": {
                            "_id": list.owner._id,
                            "username": list.owner.username
                        },
                        "displayedDate": displayedDate,
                        "isPatchlist": true
                    });
                    html += src_client.getHandleBarHtml("patchlist", {
                        "list": list,
                        "projectInfo": projectInfo
                    });
                });
                html += "</table>";
            }
            else
            {
                html = src_client.getHandleBarHtml("patchlist_empty");
            }
            targetEl.innerHTML = html;
            src_client.tabs.initPagination(targetEl, res.pagination);
        }, () => {});
    }

    updateList(button, isStaff)
    {
        src_client.buttons.startSavingAnimButton(button);

        const id = ele.byId("list-id").value;
        const name = ele.byId("list-name").value;
        const description = ele.byId("list-description").value;
        const visibility = ele.byId("list-visibility").value;
        let sortPosition = ele.byId("list-position") ? ele.byId("list-position").value : 0;
        if (sortPosition && !helper.isNumeric(sortPosition)) sortPosition = 0;
        sortPosition = Number(sortPosition);
        if (sortPosition < 0) sortPosition = 0;

        let type = "default";
        const typeEle = ele.byId("list-type");
        if (typeEle) type = typeEle.value;

        let key = "";
        const keyEle = ele.byId("list-key");
        if (keyEle) key = keyEle.value;

        const newSettings = {
            "name": name,
            "description": description,
            "visibility": visibility,
            "sortPosition": sortPosition || 0
        };

        if (isStaff)
        {
            newSettings.type = type;
            newSettings.key = key;
        }

        api.patch(
            "patchlists/" + id, newSettings, (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                if (res.data && res.data.key)
                {
                    window.location.href = "/patchlist/" + res.data.key + "/edit";
                }
                else
                {
                    window.location.href = "/patchlist/" + res.data._id + "/edit";
                }
            }, (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
                this.showError(res.data.errors);
            });
    }

    showError(errors)
    {
        let msg = "";
        for (let i = 0; i < errors.length; i++)
        {
            msg += "<li>" + errors[i] + "</li>";
        }
        let html = "<ul>" + msg + "</ul>";

        const errorEle = ele.byId("errors");
        if (errorEle)
        {
            errorEle.innerHTML = html;
            ele.show(errorEle);
        }
    }

    moveUp(buttonEl)
    {
        const listItem = buttonEl.closest(".patchlistitem");
        if (!listItem) return;
        const list = listItem.closest(".patchlisttable");
        if (!list) return;
        const sortables = Array.from(list.querySelectorAll(".patchlistitem"));
        const itemIndex = sortables.findIndex((s) => { return s.dataset.patchId === listItem.dataset.patchId; });
        const newIndex = Math.max(0, itemIndex - 1);
        listItem.classList.remove("last");

        if (newIndex === 0)
        {
            listItem.classList.add("first");
            if (sortables[newIndex]) sortables[newIndex].classList.remove("first");
        }
        if (newIndex === sortables.length - 2)
        {
            if (sortables[newIndex]) sortables[newIndex].classList.add("last");
        }
        list.insertBefore(listItem, sortables[newIndex]);

        const patchIds = Array.from(list.querySelectorAll(".patchlistitem")).map((item) => { return item.dataset.patchId; });
        api.post("patchlists/" + list.dataset.listId + "/reorder", { "projectIds": patchIds });
    }

    moveDown(buttonEl)
    {
        const listItem = buttonEl.closest(".patchlistitem");
        if (!listItem) return;
        const list = listItem.closest(".patchlisttable");
        if (!list) return;
        const sortables = Array.from(list.querySelectorAll(".patchlistitem"));
        const itemIndex = sortables.findIndex((s) => { return s.dataset.patchId === listItem.dataset.patchId; });
        const newIndex = Math.min(sortables.length, itemIndex + 1);
        listItem.classList.remove("first");

        if (newIndex === sortables.length - 1)
        {
            listItem.classList.add("last");
            if (sortables[newIndex]) sortables[newIndex].classList.remove("last");
        }
        if (newIndex === 1)
        {
            if (sortables[newIndex]) sortables[newIndex].classList.add("first");
        }
        list.insertBefore(listItem, sortables[newIndex].nextSibling);

        const patchIds = Array.from(list.querySelectorAll(".patchlistitem")).map((item) => { return item.dataset.patchId; });
        api.post("patchlists/" + list.dataset.listId + "/reorder", { "projectIds": patchIds });
    }

    setThumbnail(listId, patchId)
    {
        if (patchId)
        {
            api.post("patchlists/" + listId + "/thumbnail/" + patchId, {}, () =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            });
        }
    }

    removeThumbnail(listId)
    {
        if (listId)
        {
            api.delete("patchlists/" + listId + "/thumbnail", {}, () =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/modaldialog_confirm.js






class ConfirmModalDialog extends ModalBackground
{
    constructor(options)
    {
        super({ "listenToEsc": true, ...options });
        this.hideCb = null;
    }

    show(text, confirmedCb = null, deniedCb = null)
    {
        this.hideCb = deniedCb;
        let dialogTab = ele.byId("confirm-dialog-container");

        this.on("show", () =>
        {
            ele.show(dialogTab);
        });

        this.on("hide", () =>
        {
            ele.hide(dialogTab);
            if (this.hideCb) this.hideCb();
        });

        document.body.addEventListener("keydown", (event) =>
        {
            if (this.showing && event.key === "Enter")
            {
                if (confirmedCb) this.hideCb = confirmedCb;
                ele.hide(dialogTab);
                super.hide();
            }
        });

        if (!dialogTab)
        {
            dialogTab = document.createElement("div");
            dialogTab.id = "confirm-dialog-container";
            ele.hide(dialogTab);
            document.body.appendChild(dialogTab);
        }

        const content = text;
        let footer = "";
        footer += "<br/><br/>";
        footer += "<a data-confirmed=\"true\" class=\"clickable button button-primary\" id=\"choice_ok\">&nbsp;&nbsp;&nbsp;Ok&nbsp;&nbsp;&nbsp;</a>";
        footer += "&nbsp;&nbsp;<a data-confirmed=\"false\" class=\"clickable button\" id=\"choice_cancel\">&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;&nbsp;</a>";

        if (dialogTab.classList.contains("hidden"))
        {
            const vars = {
                "id": "confirm-dialog",
                "fixed": true,
                "title": "Please confirm",
                "content": content,
                "footer": footer
            };
            src_client.setHandleBarHtml("modalcontainer", vars, dialogTab);
            ele.clickables(dialogTab, ".clickable", (e, dataset) =>
            {
                if (dataset && dataset.confirmed === "true")
                {
                    if (confirmedCb) this.hideCb = confirmedCb;
                }
                else
                {
                    if (deniedCb) this.hideCb = deniedCb;
                }
                super.hide();
            });
            super.show();
        }
        else
        {
            super.hide();
        }
    }
}

;// CONCATENATED MODULE: ./src_client/modaldialog_patchlists.js






class PatchListModalDialog
{
    constructor()
    {
        this._patchlists = new PatchLists();
    }

    togglePatchListDialog(id, type = "project")
    {
        const bg = new ModalBackground({ "listenToEsc": true });
        bg.show();
        bg.on("hide", () =>
        {
            ele.hide(dialogTab);
        });

        let dialogTab = ele.byId("patchlist-dialog");

        if (!dialogTab)
        {
            dialogTab = document.createElement("div");
            dialogTab.id = "patchlist-dialog";
            ele.hide(dialogTab);
            document.body.appendChild(dialogTab);
        }
        dialogTab.innerHTML = "<div id=\"patchlist-suggest\" class=\"modalcontainer\"><div class=\"modalinner\"><span class=\"loading\"></span></div></div>";

        if (dialogTab.classList.contains("hidden"))
        {
            ele.show(dialogTab);
            let url = "suggest/patchlists?p=" + id;
            let title = "Add patch to patchlists";
            if (type === "op")
            {
                title = "<i class=\"icon icon-lock\"></i> Add op to patchlists";
                url = "suggest/patchlists?op=" + id;
            }
            api.get(url,
                (res) =>
                {
                    const hasNonPublicLists = res.data.find((list) => { return list.visibility !== "public"; });
                    const hasNonDefaultLists = res.data.find((list) => { return list.type !== "default"; });

                    res.data.sort((a, b) => { return a.name.localeCompare(b.name); });

                    src_client.setHandleBarHtml("patchlist_suggest", {
                        "title": title,
                        "id": id,
                        "type": type,
                        "url": url,
                        "lists": res.data,
                        "hasNonDefaultLists": hasNonDefaultLists,
                        "hasNonPublicLists": hasNonPublicLists
                    }, dialogTab);
                    ele.byId("patchlistsearch").focus();
                },
                () => {});

            const autoSuggests = dialogTab.querySelectorAll("[data-autosuggest]");
            src_client.initializeAutosuggestsFromApi(autoSuggests, { "focusElement": dialogTab.querySelector("input") });
        }
        else
        {
            ele.hide(dialogTab);
            bg.hide();
        }
    }

    handleModalSelection(listId, id, type, listName, listLink)
    {
        const listItem = ele.byId("listRow" + listId);
        const checkBox = ele.byId("listCheckbox" + listId);
        const eleLoading = ele.byId("patchListDialogLoading");
        const onList = listItem.dataset.onList === "true";
        const listsContainer = ele.byId("patch-lists");

        ele.show(eleLoading);

        if (onList)
        {
            this._patchlists.removeItem(listId, id, type, false, () =>
            {
                listItem.dataset.onList = "false";
                if (checkBox) checkBox.checked = false;
                if (listsContainer)
                {
                    const list = listsContainer.querySelector("li[data-list-id='" + listId + "']");
                    if (list)
                    {
                        list.remove();
                        const lists = listsContainer.querySelectorAll(".lists li");
                        let numLists = 0;
                        if (lists && lists.length) numLists = lists.length;
                        if (!numLists)
                        {
                            ele.hide(listsContainer);
                        }
                        else
                        {
                            const s = listsContainer.querySelector(".plural");
                            if (s)
                            {
                                if (numLists > 1) ele.show(s);
                                else ele.hide(s);
                            }
                        }
                    }
                }
                ele.hide(eleLoading);
            });
        }
        else
        {
            this._patchlists.addItem(listId, id, type, () =>
            {
                listItem.dataset.onList = "true";
                if (checkBox) checkBox.checked = true;
                if (listsContainer)
                {
                    const lists = listsContainer.querySelector(".lists");
                    const hasList = lists.innerHTML.length > 0;
                    let html = "<li data-list-id=\"" + listId + "\"><a class=\"list\" href=\"" + listLink + "\">" + listName + "</a></li>";
                    lists.innerHTML += html;
                    if (hasList)
                    {
                        const s = listsContainer.querySelector(".plural");
                        if (s) ele.show(s);
                    }
                    ele.show(listsContainer);
                }
                ele.hide(eleLoading);
            });
        }
    }

    handleModalSearch(searchEle)
    {
        let search = searchEle.value;
        if (search) search = search.toLowerCase();
        const modal = ele.byId("patchlist-suggest");
        if (search && modal)
        {
            const listItems = Array.from(modal.querySelectorAll(".modalcontent tr"));
            listItems.forEach((listItem) =>
            {
                let content = listItem.innerText;
                if (content) content = content.toLowerCase();
                if (content && content.includes(search))
                {
                    ele.show(listItem);
                }
                else
                {
                    ele.hide(listItem);
                }
            });
        }
        else if (modal)
        {
            const listItems = Array.from(modal.querySelectorAll(".modalcontent tr"));
            listItems.forEach((listItem) =>
            {
                ele.show(listItem);
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/ops/page_op.js







class PageOp
{
    constructor(targetElement)
    {
        // targetEl, opName, opId, isCoreOp, userIsStaff, isUserOp, userIsCreator, exampleId, sandboxUrl
        this.opName = targetElement.dataset.opName;
        let opId = targetElement.dataset.opId;
        let isUserOp = targetElement.dataset.isUserOp;
        let userIsCreator = targetElement.dataset.userIsCreator;
        let exampleId = targetElement.dataset.exampleId;
        let sandboxUrl = targetElement.dataset.sandboxUrl;

        this.patchLists = new PatchLists();
        this._settings = {
            "lastFilter": "",
            "defaultTab": "opexamples",
            "userIsCreator": userIsCreator === "true",
            "isDev": src_client.env.isDev(),
            "isCoreOp": targetElement.dataset.isCoreOp === "true",
            "editAuthor": targetElement.dataset.userIsStaff,
            "userName": targetElement.dataset.userName
        };

        if (isUserOp) this._settings.defaultTab = "mine";
        if (!userIsCreator) this._settings.defaultTab = "public";
        this._settings.opName = this.opName;

        if (exampleId)
        {
            src_client.embedPatch({
                "projectId": exampleId,
                "elementId": "opexamplecontainer",
                "sandboxUrl": sandboxUrl,
                "focusPatch": false
            });
        }

        if (src_client.env.isDev())
        {
            api.get("op/" + this.opName + "/find", (r) =>
            {
                if (r.data && r.data.environments && !r.data.environments.includes("cables.gl"))
                {
                    ele.byId("opLiveVersion").innerHTML = "<span style=\"color:var(--info)\">this exact op does not exist on cables.gl!</span>";
                }
            });
        }

        this._loadChangelog(opId);

        api.get("op/" + this.opName + "/count", (result) =>
        {
            if (result && result.data)
            {
                const tabs = ele.byQueryAll("#patchtabs li");
                let firstActive = !!ele.byQuery(".examplepatchlist");

                for (let r in result.data)
                {
                    const numElement = ele.byId("num_" + r);
                    if (numElement)
                    {
                        const count = result.data[r];
                        numElement.innerText += " (" + count + ")";
                        const tabElement = numElement.closest("li");
                        tabElement.dataset.count = count;
                        if (tabElement)
                        {
                            if (count > 0 || count === "100+")
                            {
                                ele.show(tabElement);
                                if (!src_client.tabs.requestedTabExists(tabs) && !firstActive)
                                {
                                    src_client.tabs.activateTab(tabs, tabElement, false);
                                    firstActive = true;
                                }
                            }
                            else
                            {
                                if (src_client.tabs.isRequestedTab(tabs, tabElement))
                                {
                                    ele.show(tabElement);
                                }
                                else
                                {
                                    ele.hide(tabElement);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    getPatches(targetEl)
    {
        const opName = this._settings.opName;
        let which = targetEl.dataset.tabName;
        const headerLink = targetEl.dataset.headerLink;

        let url = new URL(window.location.href);
        let w = url.searchParams.get("w") || this._settings.defaultTab;
        let limit = url.searchParams.get("l") || 12;
        let offset = url.searchParams.get("o") || 0;
        this._settings.lastFilter = w;

        const numPrivate = ele.byId("num_private");
        if (numPrivate) ele.hide(numPrivate);

        let patchesUrl = "op/" + opName + "/examples";
        let id = "opexamples";
        let containerId = "results_container";
        let emptyText = "No Patches found";

        switch (which)
        {
        case "teampatches":
            patchesUrl = "op/" + opName + "/teampatches";
            id = "teampatches";
            break;
        case "private":
            patchesUrl = "op/" + opName + "/privatepatches";
            id = "private";
            if (numPrivate) numPrivate.classList.remove("hidden");
            break;
        case "public":
            patchesUrl = "op/" + opName + "/patches";
            id = "public";
            break;
        case "mine":
            patchesUrl = "op/" + opName + "/mypatches";
            id = "mine";
            break;
        }

        limit = Number(limit);
        offset = Number(offset);
        if (limit || limit === 0)
        {
            patchesUrl += "?l=" + limit;
        }
        if (offset)
        {
            patchesUrl += "&o=" + offset;
        }

        api.get(patchesUrl, (result) =>
        {
            let html = "";
            if (headerLink)
            {
                html = src_client.getHandleBarHtml("project_list_headline_teampatches", { "link": headerLink });
            }
            src_client.projectPagePatchList(result.projects, id, emptyText, result.pagination, "project", html);
            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId(containerId), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "?w=" + which;
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "&l=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&o=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + "#" + which;
                });
            }
        });
    }

    getSubPatches(targetEl, fromUserInteraction = false)
    {
        const opName = this._settings.opName;
        let which = targetEl.dataset.tabName;

        let url = new URL(window.location.href);
        let w = url.searchParams.get("w") || this._settings.defaultTab;
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o") || 0;
        this._settings.lastFilter = w;

        const numPrivate = ele.byId("num_private");
        if (numPrivate) ele.hide(numPrivate);

        let patchesUrl = "op/" + opName + "/subpatchops";
        let containerId = "results_container";

        limit = Number(limit);
        offset = Number(offset);
        if (limit || limit === 0)
        {
            patchesUrl += "?l=" + limit;
        }
        if (offset)
        {
            patchesUrl += "&o=" + offset;
        }

        api.get(patchesUrl, (result) =>
        {
            let html = "";
            result.data.forEach((op) =>
            {
                html += src_client.getHandleBarHtml("op", op);
            });
            ele.byId("ops").innerHTML = html;
            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId(containerId), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "?w=" + which;
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "&l=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&o=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + "#ops";
                });
            }
        });
    }

    addChangelog(button, opId)
    {
        src_client.buttons.startSavingAnimButton(button);
        const message = ele.byId("newchangelog").value;
        const type = ele.byId("newchangelogtype").value;
        const update = ele.byId("updatechangelog").value === "true";
        const date = ele.byId("changelogdate").value;
        const newDate = ele.byId("newchangelogdate");
        const author = ele.byId("newauthor").value;
        const data = {
            "message": message,
            "type": type,
            "date": date
        };
        if (update)
        {
            data.update = true;
            if (newDate && newDate.value !== date) data.newDate = newDate.value;
        }
        if (this._settings.editAuthor)
        {
            data.author = author;
        }
        api.put(
            "op/changelog/" + opId,
            data,
            (_res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                const changelogContainer = ele.byId("changelogContainer");
                if (changelogContainer)
                {
                    this._loadChangelog(opId);
                }
                else
                {
                    document.location.hash = "#changelog";
                    document.location.reload();
                }
            }
        );
    }

    save(name)
    {
        let data =
            {
                "op": name,
                "summary": ele.byQuery("#edit_summary input").value,
                "youtubeids": ele.byQuery("#edit_youtubeid input").value,
                "exampleProjectId": ele.byQuery("#edit_exampleprojectid input").value,
                "caniusequery": ele.byQuery("#edit_caniusequery input").value,
                "license": ele.byQuery("#edit_license input").value,
                "doc": ele.byQuery("#edit_doc textarea").value,
                "issues": ele.byQuery("#edit_issues textarea").value,
                "ports": []
            };

        const authorField = ele.byQuery("#edit_author input");
        if (authorField) data.authorName = authorField.value;

        ele.byQueryAll(".edit-port input").forEach((el) =>
        {
            if (el.value && el.dataset.name)
            {
                data.ports.push(
                    {
                        "name": el.dataset.name,
                        "text": el.value
                    });
            }
        });

        api.put(
            "op/" + name,
            data,
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            }
        );
    }

    showDocsEditor()
    {
        ele.hide(ele.byId("op-edit-button"));
        ele.hide(ele.byId("opfacts"));

        ele.show(ele.byId("op-documentation-save"));
        ele.show(ele.byId("edit_summary"));
        ele.hide(ele.byId("display_summary"));
        ele.show(ele.byId("edit_youtubeid"));
        ele.show(ele.byId("edit_exampleprojectid"));
        ele.show(ele.byId("edit_caniusequery"));
        ele.show(ele.byId("edit_author"));
        ele.show(ele.byId("edit_examplepatchlist"));
        ele.hide(ele.byId("display_doc"));
        ele.hide(ele.byId("display_issues"));
        ele.show(ele.byId("edit_doc"));
        ele.show(ele.byId("edit_issues"));
        ele.hide(ele.byId("display-port"));
        ele.show(ele.byId("edit_license"));

        ele.byQueryAll(".display-port").forEach((e) =>
        {
            ele.hide(e);
        });
        ele.byQueryAll(".edit-port").forEach((e) =>
        {
            ele.show(e);
        });
    }

    hideDocEditor()
    {
        ele.show(ele.byId("op-edit-button"));
        ele.show(ele.byId("op-documentation-save"));
        ele.show(ele.byId("display_relatedops"));
        ele.hide(ele.byId("edit_summary"));
        ele.show(ele.byId("display_summary"));
        ele.show(ele.byId("display_doc"));
        ele.show(ele.byId("display_issues"));
        ele.hide(ele.byId("edit_doc"));
        ele.hide(ele.byId("edit_youtubeid"));
        ele.hide(ele.byId("edit_exampleprojectid"));
        ele.hide(ele.byId("edit_caniusequery"));
        ele.hide(ele.byId("edit_relatedops"));
        ele.show(ele.byId("edit_author"));
        ele.hide(ele.byId("edit_examplepatchlist"));
        ele.hide(ele.byId("edit_issues"));
        ele.hide(ele.byId("edit_license"));
        ele.byQueryAll(".display-port").forEach((e) =>
        {
            e.classList.remove("hidden");
        });
        ele.byQueryAll(".edit-port").forEach((e) =>
        {
            e.classList.add("hidden");
        });
    }

    getPatchLists(targetEl)
    {
        const listTarget = targetEl || ele.byId("patchlist");
        const listId = targetEl.dataset.listId;
        const headerLink = targetEl.dataset.headerLink;

        const apiUrl = src_client.tabs.addPagination("patchlists/patches/" + listId, 10);
        api.get(apiUrl, (result) =>
        {
            const projects = result.data;
            let html = "";
            if (headerLink)
            {
                html = src_client.getHandleBarHtml("project_list_headline_patchlist", { "link": headerLink });
            }
            for (let i = 0; i < projects.length; i++)
            {
                const project = projects[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", {
                    "project": project,
                    "user": {
                        "_id": project.userId,
                        "username": project.cachedUsername
                    }
                });
                html += src_client.getHandleBarHtml("patchlist_project", {
                    "project": project,
                    "projectInfo": projectInfo
                });
            }

            if (listTarget)
            {
                listTarget.innerHTML = html;
                if (!projects || projects.length === 0) listTarget.innerHTML = "<div class=\"cute-12-phone\">No patches in this list (yet).</div>";
            }

            src_client.tabs.initPagination(listTarget, result.pagination);
        });
    }

    toggleChangelogEntry()
    {
        const form = ele.byId("changelogform");
        if (form)
        {
            if (form.classList.contains("hidden"))
            {
                const newchangelog = ele.byId("newchangelog");
                const newauthor = ele.byId("newauthor");
                const newchangelogtype = ele.byId("newchangelogtype");
                const updatechangelog = ele.byId("updatechangelog");
                const changelogdate = ele.byId("changelogdate");
                const newchangelogdatelabel = ele.byId("newchangelogdatelabel");
                const newchangelogdate = ele.byId("newchangelogdate");

                if (newchangelog) newchangelog.value = "";
                if (newchangelogtype) newchangelogtype.value = "feature";
                if (changelogdate) changelogdate.value = "";
                if (updatechangelog) updatechangelog.value = "false";
                if (newchangelogdatelabel) ele.hide(newchangelogdatelabel);
                if (newchangelogdate) newchangelogdate.value = "";
                if (newauthor) newauthor.value = this._settings.userName;
            }
            form.querySelector(".button-delete").classList.add("hidden");
            ele.toggle(form);
        }
    }

    editChangelogEntry(opId, message, type, date, author)
    {
        const form = ele.byId("changelogform");
        ele.hide(form);
        if (form)
        {
            const newchangelog = ele.byId("newchangelog");
            const newauthor = ele.byId("newauthor");
            const newchangelogtype = ele.byId("newchangelogtype");
            const updatechangelog = ele.byId("updatechangelog");
            const changelogdate = ele.byId("changelogdate");
            const newchangelogdate = ele.byId("newchangelogdate");

            if (newauthor)
            {
                newauthor.value = author;
            }

            if (message && newchangelog) newchangelog.value = message;
            if (newchangelogtype)
            {
                newchangelogtype.value = type;
                this.setChangeLogType(type);
            }
            if (date && changelogdate)
            {
                changelogdate.value = date;
            }
            if (updatechangelog) updatechangelog.value = "true";
            if (newchangelogdate)
            {
                const newchangelogdatelabel = ele.byId("newchangelogdatelabel");
                if (newchangelogdatelabel) ele.show(newchangelogdatelabel);
                newchangelogdate.value = date;
            }
            form.querySelector(".button-delete").classList.remove("hidden");
            ele.toggle(form);
        }
    }

    deleteChangelogEntry(button, opId, date)
    {
        const confirmedCb = () =>
        {
            src_client.buttons.startSavingAnimButton(button);
            const data = {
                "date": date
            };
            api.delete(
                "op/changelog/" + opId,
                data,
                () =>
                {
                    src_client.buttons.stopSavingAnimButton(button);
                    const changelogContainer = ele.byId("changelogContainer");
                    if (changelogContainer)
                    {
                        this._loadChangelog(opId);
                    }
                    else
                    {
                        document.location.hash = "#changelog";
                        document.location.reload();
                    }
                },
                (err) =>
                {
                    console.error(err);
                    src_client.buttons.stopSavingAnimButton(button, true, true);
                }
            );
        };

        const confirmModal = new ConfirmModalDialog();
        confirmModal.show("Really delete changelog entry for " + this.opName, confirmedCb);

    }

    toggleChangelogType(type)
    {
        const featureInput = ele.byId("newchangelogtype");
        if (featureInput)
        {
            let newValue = "";
            if (featureInput.value !== type)
            {
                newValue = type;
            }
            else
            {
                featureInput.value = "";
            }
            this.setChangeLogType(newValue);
        }
    }

    setChangeLogType(type)
    {
        const featureInput = ele.byId("newchangelogtype");
        if (featureInput) featureInput.value = type;
        const typeButtons = ele.byQueryAll("#changelogform .button");
        typeButtons.forEach((button) =>
        {
            button.classList.remove("active");
        });
        if (type)
        {
            const typeButton = ele.byQuery("#changelogform ." + type.replaceAll(" ", "_"));
            if (typeButton) typeButton.classList.add("active");
        }
    }

    adminSetPatchManualScreenshot(targetEle)
    {
        src_client.buttons.startSavingAnimButton(targetEle);
        const patchId = targetEle.dataset.patchid;
        if (!patchId)
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("no patchid given!");
            return;
        }

        api.post("admin/project/" + patchId + "/screenshot/manual", {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true);
            setTimeout(() =>
            {
                const nonpublicWarning = ele.byId("op_example_warning_manualscreenshotexample");
                if (nonpublicWarning) ele.hide(nonpublicWarning);
                ele.hide(targetEle);
            }, 400);
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("error setting patch screenshot to manual", e);
        });
    }

    adminSetPatchVisibility(targetEle, visibility)
    {
        src_client.buttons.startSavingAnimButton(targetEle);
        const patchId = targetEle.dataset.patchid;
        if (!patchId)
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("no patchid given!");
            return;
        }

        api.post("admin/project/" + patchId + "/visibility/" + visibility, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true);
            setTimeout(() =>
            {
                const nonpublicWarning = ele.byId("op_example_warning_nonpublicexample");
                if (visibility === "public")
                {
                    if (nonpublicWarning) ele.hide(nonpublicWarning);
                    ele.hide(targetEle);
                }
                else
                {
                    const visibilityText = nonpublicWarning.querySelector(".visibility");
                    visibilityText.innerText = visibility;
                }
            }, 400);
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("error setting patch public", e);
        });
    }

    adminSetPatchCC0(targetEle)
    {
        const patchId = targetEle.dataset.patchid;
        if (!patchId)
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("no patchid given!");
            return;
        }

        api.post("admin/project/" + patchId + "/setcc0", {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true);
            setTimeout(() =>
            {
                const licenceWarning = ele.byId("op_example_warning_noncc0example");
                if (licenceWarning) ele.hide(licenceWarning);
            }, 400);
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("error setting patch cc0", e);
        });
    }

    adminAddPatchTeam(targetEle)
    {
        const patchId = targetEle.dataset.patchid;
        const teamid = targetEle.dataset.teamid;
        if (!patchId)
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("no patchid or teamid given! patchid:", patchId, "teamid:", teamid);
            return;
        }

        api.post("admin/project/" + patchId + "/addteam/" + teamid, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true);
            setTimeout(() =>
            {
                const teamWarning = ele.byId("op_example_warning_notinopteam");
                if (teamWarning) ele.hide(teamWarning);
            }, 400);
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(targetEle, true, true);
            console.error("error adding patch to team", e);
        });
    }

    togglePatchListDialog(id, type = "op")
    {
        const patchListModal = new PatchListModalDialog();
        patchListModal.togglePatchListDialog(id, type);
    }

    _loadChangelog(opId)
    {
        const changelogContainer = ele.byId("changelogContainer");
        if (changelogContainer)
        {
            changelogContainer.innerHTML = "<div class=\"loading\"></div>";
            api.get("ops/changelog/" + opId + "?sort=asc", (result) =>
            {
                const changelog = result.data;
                if (changelog && changelog.length > 0) opId = changelog[0].opId;
                const editable = changelogContainer.dataset.editable || this._settings.userIsCreator;
                src_client.setHandleBarHtml("op_changelog", {
                    "editAuthor": this._settings.editAuthor,
                    "opName": this._settings.opName,
                    "opId": opId,
                    "changelog": result.data,
                    "editable": editable,
                    "liveEditWarning": editable && this._settings.isCoreOp && !this._settings.isDev,
                    "timeEditable": changelogContainer.dataset.timeEditable
                }, changelogContainer);
                const changelogForm = ele.byId("changelogform");
                if (changelogForm)
                {
                    changelogForm.onsubmit = (e) =>
                    {
                        this.addChangelog(ele.byId("changelogsave"), opId);
                        return false;
                    };
                }

                src_client.shortcuts.registerListeners(changelogContainer);
                ele.clickables(changelogContainer, ".clickable", (e, dataset) =>
                {
                    const button = e.currentTarget;
                    switch (dataset.onclick)
                    {
                    case "editentry":
                        this.editChangelogEntry(opId, dataset.message, dataset.type, dataset.date, dataset.author);
                        break;
                    case "toggleform":
                        this.toggleChangelogEntry();
                        break;
                    case "changetype":
                        if (dataset.type) this.toggleChangelogType(dataset.type);
                        break;
                    case "addchangelog":
                        this.addChangelog(button, opId);
                        break;
                    case "deleteentry":
                        this.deleteChangelogEntry(button, opId, ele.byId("changelogdate").value);
                        break;
                    default:
                        break;
                    }
                });
            }, (err) =>
            {
                changelogContainer.innerText = "Error getting changelog: " + err.msg;
            });
        }
    }

    handleModalSelection(listId, id, type, listName, listLink)
    {
        const modal = new PatchListModalDialog();
        return modal.handleModalSelection(listId, id, type, listName, listLink);
    }

    handleModalSearch(searchEle)
    {
        const modal = new PatchListModalDialog();
        return modal.handleModalSearch(searchEle);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_home.js




class PageHome
{
    constructor()
    {
        this.getLatestProjectList();
        this.getTopProjectList();
        this.getRandomOps();
    }

    loadActivityFeed(targetElement)
    {
        const apiUrl = src_client.tabs.addPagination("activityfeed/myfeed", 14);
        api.get(apiUrl, (result) =>
        {
            const data = result.data;
            const entries = data.entries;
            let feedHtml = "";
            let lastUsername = "";
            let usernameCount = 0;

            if (entries.length > 0)
            {
                for (let i = 0; i < entries.length; i++)
                {
                    const entry = entries[i];
                    if (entry.displayActions && entry.displayActions.length > 3)
                    {
                        const allActions = entry.displayActions;
                        const buttons = allActions.slice(0, 3);
                        const menuItems = allActions.slice(3);
                        entry.displayActions = buttons;
                        entry.menuItems = menuItems;
                    }

                    const diffUsername = lastUsername != entry.initiator.username;
                    if (diffUsername)
                    {
                        usernameCount = 0;
                        lastUsername = entry.initiator.username;
                    }
                    else
                    {
                        const maxItemsSameUser = 3;
                        usernameCount++;
                        if (usernameCount == maxItemsSameUser) feedHtml += "<div class=\"cute-1-phone hide-tablet hide-phone left\"></div><a href=\"/myactivityfeed\">even more...</a>";
                        if (usernameCount >= maxItemsSameUser) continue;
                    }

                    entry.thumbFormat = "projectThumb";
                    if (["TeamInvite", "Membership"].includes(entry.topic)) entry.thumbFormat = "team-container";
                    const vars = {
                        "entry": entry,
                        "diffUsername": diffUsername,
                        "first": i === 0,
                        "last": i === (entries.length - 1),
                    };

                    feedHtml += src_client.getHandleBarHtml("activityfeed_entry_home", vars);
                }
            }
            if (targetElement) targetElement.innerHTML = feedHtml;
        }, () =>
        {
            console.warn("failed to load activityfeed");
            if (targetElement) ele.hide(targetElement);
        });
    }

    getLatestProjectList()
    {
        api.get("latestProjects", (result) =>
        {
            let html = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/patches",
                "title": "Latest Patches"
            });
            html += "<div class=\"row\">";
            result.length = 12;
            for (const i in result)
            {
                const project = result[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            html += "</div>";
            ele.byId("latest-projects").innerHTML = html;
        });
    }

    getTopProjectList()
    {
        api.get("fav/top", (result) =>
        {
            let i = 0;
            let topMonthHtml = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/patches#topMonth",
                "title": "Top Of The Month"
            });
            topMonthHtml += "<div class=\"row\">";

            if (result.topFavs.length > 8) result.topFavs.length = 8;
            if (result.topFavs.length < 4) result.topFavs.length = Math.min(4, result.topFavs.length);

            for (i in result.topFavs)
            {
                const project = result.topFavs[i].proj;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                topMonthHtml += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            topMonthHtml += "</div>";
            document.getElementById("top-of-the-month").innerHTML = topMonthHtml;

            let allTimeHtml = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/patches?or=favs#ppub",
                "title": "Top Patches (Six Months)"
            });
            allTimeHtml += "<div class=\"row\">";
            for (i in result.allTimeTop)
            {
                const project = result.allTimeTop[i].proj;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                allTimeHtml += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            allTimeHtml += "</div>";
            document.getElementById("alltimetop").innerHTML = allTimeHtml;

            const featureFeed = document.getElementById("featured");
            if (featureFeed)
            {
                let project = result.featured;
                let template = "project_featured";
                let projectInfo = "";
                if (result.madeWithCables && result.featured)
                {
                    if ((Math.random() >= 0.5) ? 1 : 0)
                    {
                        project = result.featured;
                        projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                    }
                    else
                    {
                        project = result.madeWithCables;
                        template = "project_made_with_cables";
                    }
                }
                else if (result.featured)
                {
                    project = result.featured;
                    projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                }
                else if (result.madeWithCables)
                {
                    project = result.madeWithCables;
                }
                src_client.setHandleBarHtml(template, { "project": project, "projectInfo": projectInfo }, featureFeed);
            }
        });
    }

    getRandomOps()
    {
        api.get("doc/ops/random", (result) =>
        {
            let html = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/ops",
                "title": "Random Ops"
            });
            html += "<div class=\"row\">";

            for (const i in result.ops)
            {
                if (result.ops[i]) html += src_client.getHandleBarHtml("projectop", result.ops[i]);
            }
            html += "</div>";
            document.getElementById("random-ops").innerHTML = html;
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/patches/page_patch.js





class PagePatch
{
    constructor(targetElement)
    {
        const projectId = targetElement.dataset.projectid;
        const sandboxurl = targetElement.dataset.sandboxurl;

        this.patch = null;
        this.prevStyleWidth = "";
        this.prevStyleHeight = "";
        this.maximized = false;
        this.oldClasses = [];
        this.projectId = projectId;

        src_client.embedPatch(
            {
                "elementId": "canvascontainer",
                "projectId": projectId,
                "sandboxUrl": sandboxurl,
                "locationHash": window.location.hash,
                "queryString": window.location.search
            }, (error) =>
            {
                const errorEl = document.getElementById("errorEl");
                const canvasContainer = document.getElementById("canvascontainer");
                if (canvasContainer) canvasContainer.style.display = "none";
                if (errorEl)
                {
                    errorEl.style.display = "block";
                    const msg = errorEl.querySelector(".errorMessage");
                    msg.innerText = error.msg;
                }
            });

        this.resize();
        this.getProjectComments(projectId, src_client.env.loggedIn);
        // this.disableIframeScrolling();
        src_client.favs.showFavToggle(ele.byId("toggleFav"));

        window.addEventListener("resize", this.resize.bind(this), false);

        window.addEventListener("message", (event) =>
        {
            if (event.origin !== sandboxurl) return;
            if (event.data && event.data.type === "hashchange")
            {
                window.location.hash = event.data.data;
            }
        }, false);

        window.addEventListener("hashchange", (event) =>
        {
            const patchIframe = document.getElementById("canvasiframe");
            if (patchIframe)
            {
                const srcParts = patchIframe.src.split("#", 2);
                const newUrl = srcParts[0] + window.location.hash;
                patchIframe.contentWindow.location.replace(newUrl);
            }
        }, false);

        let iframeFocus = false;

        const modalBgEle = document.createElement("div");
        modalBgEle.style.width = "100vw";
        modalBgEle.style.height = "100vh";
        modalBgEle.style.top = "0px";
        modalBgEle.style.left = "0px";
        modalBgEle.style.pointerEvents = "none";
        modalBgEle.style.zIndex = "1000";
        modalBgEle.style.position = "absolute";
        modalBgEle.style.display = "none";
        modalBgEle.style.backgroundColor = "rgba(0,0,0,0.5)";
        document.body.appendChild(modalBgEle);

        const iframe = ele.byId("canvasiframe");
        setInterval(() =>
        {
            if (document.activeElement == iframe)
            {
                if (!iframeFocus)
                {
                    iframeFocus = true;
                    document.body.style.overflowY = "scroll";
                    document.body.style.position = "fixed";
                    document.body.style.width = "100%";
                    iframe.style.zIndex = 1001;
                    iframe.style.position = "absolute";

                    modalBgEle.style.display = "block";
                }
            }
            else
            {
                if (iframeFocus)
                {
                    iframeFocus = false;

                    iframe.style.zIndex = "initial";

                    iframe.style.position = "initial";
                    document.body.style.overflowY = "initial";
                    document.body.style.position = "initial";
                    document.body.style.width = "auto";

                    modalBgEle.style.display = "none";
                }
            }
        }, 50);
    }

    showError(txt)
    {
        document.getElementById("glcanvas").remove();

        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "error");
        newDiv.innerText = txt;

        document.body.appendChild(newDiv);
        this.canceled = true;
    }

    resize()
    {
        let m = document.getElementById("canvasiframe");
        let c = document.getElementById("canvascontainer");
        let w = c.offsetWidth;

        let h = w * 9 / 16;
        if (document.body.clientHeight > document.body.clientWidth)
        {
            // mobile
            h = c.clientHeight;
        }

        if (m)m.style.width = w + "px";
        if (m)m.style.height = h + "px";
        if (c)c.style.height = h + "px";
    }

    requestPatchAccess(projectId, permission = "read")
    {
        src_client.projects.requestAccess(projectId, permission, (result) =>
        {
            ele.hide(ele.byId("request-access-button"));
            ele.show(ele.byId("request-pending-text"));
        });
    }

    getProjectComments(projectId)
    {
        api.get("comments/" + projectId, (result) =>
        {
            let html = "";
            result.reverse();
            for (const i in result)
            {
                html += src_client.getHandleBarHtml("comment", result[i]);
            }

            ele.byId("project_comments").innerHTML = html;
            src_client.buttons.stopSavingAnimButton();
        });
    }

    comment(projectId)
    {
        if (ele.byQuery(".comment_content textarea").value === "") return src_client.buttons.stopSavingAnimButton();
        api.post(
            "comment/" + projectId,
            { "content": ele.byQuery(".comment_content textarea").value },
            (res) =>
            {
                this.getProjectComments(projectId, true);
            }
        );
    }

    handleModalSelection(listId, id, type, listName, listLink)
    {
        const modal = new PatchListModalDialog();
        return modal.handleModalSelection(listId, id, type, listName, listLink);
    }

    handleModalSearch(searchEle)
    {
        const modal = new PatchListModalDialog();
        return modal.handleModalSearch(searchEle);
    }

    showMaximized(id)
    {
        let elIframe = document.getElementById(id);
        let elContain = document.getElementById("canvascontainer");

        this.maximized = !this.maximized;

        if (!this.maximized)
        {
            elContain.parentElement.parentElement.classList.add("row");
            elContain.style.width = this.prevStyleWidth;
            elContain.style.height = this.prevStyleHeight;

            for (let i = 0; i < this.oldClasses.length; i++)
            {
                elContain.parentElement.classList.add(this.oldClasses[i]);
            }
            this.oldClasses.length = 0;

            elIframe.style = "";
            elIframe.style.height = "100%";
            return;
        }
        else
        {
            elContain.parentElement.parentElement.classList.remove("row");

            this.prevStyleWidth = elContain.style.width;
            this.prevStyleHeight = elContain.style.height;

            elContain.style = "";

            const classList = elContain.parentElement.classList;
            while (classList.length > 0)
            {
                this.oldClasses.push(classList.item(0));
                classList.remove(classList.item(0));
            }
        }

        let newHeight = window.innerHeight * 0.85;
        let newWidth = newHeight * 16 / 9;

        if (newWidth > document.body.scrollWidth)
        {
            newWidth = document.body.scrollWidth;
            newHeight = newWidth * 9 / 16;
        }

        elIframe.style.height = newHeight + "px";
        elIframe.style.width = newWidth + "px";
        elIframe.style["margin-left"] = (document.body.scrollWidth - newWidth) / 2 + "px";

        if (window.resizeListenwerAdded) return;
        window.resizeListenwerAdded = true;
        window.addEventListener("resize", () =>
        {
            if (!this.maximized) return;
            this.showMaximized(id);
        });
    }

    showFullscreen(id)
    {
        let element = document.getElementById(id);
        if (!element) return;

        if (element.requestFullScreen)
        {
            element.requestFullScreen();
        }
        else if (element.mozRequestFullScreen)
        {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen)
        {
            element.webkitRequestFullScreen();
        }
        else
        {
            element.classList.add("fakefullscreen");
            document.body.styleoverflow = "none";
        }
    }

    genQrCode()
    {
        const qrcanvas = document.getElementById("qrcanvas");
        qrcanvas.innerText = "";

        new QRCode(document.getElementById("qrcanvas"), {
            "text": document.location.href,
            "width": 150,
            "height": 150,
            "colorDark": "#000000",
            "colorLight": "#ffffff",
            "correctLevel": QRCode.CorrectLevel.H
        });
    }

    leaveProject(id, uid)
    {
        api.delete("project/" + id + "/user/" + uid, {}, () =>
        {
            document.location.reload();
        });
    }

    togglePatchListDialog(id, type = "project")
    {
        const patchListModal = new PatchListModalDialog();
        patchListModal.togglePatchListDialog(id, type);
    }
}

;// CONCATENATED MODULE: ./src_client/search.js


class Search
{
    constructor()
    {
        const headSearch = ele.byId("headsearch");
        if (headSearch)
        {
            headSearch.addEventListener("keydown", (e) =>
            {
                if (e.keyCode === 13)
                {
                    e.preventDefault();
                    this.showResult(headSearch.value);
                }
            });
        }

        const bodySearch = ele.byId("search");
        if (bodySearch)
        {
            bodySearch.addEventListener("keydown", (e) =>
            {
                if (e.keyCode === 13)
                {
                    e.preventDefault();
                    this.showResult(bodySearch.value, bodySearch.dataset.selectedtab);
                }
            });
        }
    }

    showResult(searchValue, selectedTab = null)
    {
        const newUrl = new URL(window.location);
        if (!newUrl.pathname.startsWith("/patches"))
        {
            newUrl.hash = selectedTab || "";
            newUrl.pathname = "/patches";
        }
        newUrl.searchParams.delete("o");
        newUrl.searchParams.delete("or");
        if (!searchValue)
        {
            newUrl.searchParams.delete("s");
        }
        else
        {
            newUrl.searchParams.set("s", searchValue);
        }
        window.location.href = newUrl;
    }
}

;// CONCATENATED MODULE: ./src_client/nav.js




class Nav
{
    constructor()
    {
        this._lastPatchTemplates = 0;
        this._lastRecentProjects = "recentpatches";

        this._infoBar = {
            "text": "",
            "classes": []
        };

        const mailEle = document.querySelector(".page-footer__link--email");
        if (mailEle)
        {
            const hi = "hi";
            const hi2 = "undev";
            const hi3 = "de";

            mailEle.onclick = () =>
            {
                const a = document.createElement("a");
                a.href = "mai" + "lto:" + hi + "@" + hi2 + "." + hi3;
                a.click();
            };
        }

        if (src_client.env.isDev())
        {
            this.showInfoBar("<a href=\"/docs/faq/general/dev/dev\">dev environment</a> - here be dragons!  <a href=\"/ops/changelog\">op changelog</a> | <a href=\"/standalone\">standalone download</a>");
        }
        const announcement = ele.byId("announcementMessage");
        if (announcement)
        {
            this.showInfoBar(announcement.innerHTML, announcement.dataset.level);
        }
        const maintenance = ele.byId("maintenanceMessage");
        if (maintenance)
        {
            const state = maintenance.dataset.state;
            if (state === "active")
            {
                if (src_client.env.loggedIn)
                {
                    this.showInfoBar("MAINTENANCE MODE: site is closed for normal users!");
                }
                else
                {
                    this.showInfoBar("cables is currently in maintenance mode, login and registration are disabled, please come back later");
                }
            }
            if (state === "scheduled")
            {
                const schedule = maintenance.dataset.schedule;
                const date = new Date(Date.parse(schedule));
                const dateMoment = moment(date).format("DD.MM.YYYY HH:mm");
                const timeZone = "Europe/Berlin";
                this.showInfoBar("SCHEDULED DOWNTIME: site will be closed for approx. one to three hours at " + dateMoment + " (" + timeZone + ")", "info");
            }
        }

        const darkModeTurnOn = document.querySelector("#nav-bar-avatar-dropdown .dark-theme");
        const lightModeTurnOn = document.querySelector("#nav-bar-avatar-dropdown .light-theme");

        document.body.style.transition = "background-color 0.3s ease-out";
        if (darkModeTurnOn)
        {
            darkModeTurnOn.addEventListener("click", () =>
            {
                fetch("/api/user/settings/theme/dark");

                if (document.body)
                {
                    document.body.classList.remove("light");
                    document.body.classList.add("dark");
                }
            });
        }
        if (lightModeTurnOn)
        {
            lightModeTurnOn.addEventListener("click", () =>
            {
                fetch("/api/user/settings/theme/light");

                if (document.body)
                {
                    document.body.classList.remove("dark");
                    document.body.classList.add("light");
                }
            });
        }
        this.getMyProjectListNav();
    }

    newProject()
    {
        api.post("project/", null, (result) =>
        {
            const id = result.shortId || result._id;
            document.location.href = "/edit/" + id;
        });
    }

    showInfoBar(text, level = "neutral", saveState = true)
    {
        if (!level) level = "neutral";

        if (src_client.isOnBeforeUnload) return;
        if (level === "error" && !src_client.env.loggedIn) return;

        const bar = document.getElementById("nav-infobar");
        if (bar)
        {
            bar.innerHTML = decodeURIComponent(text);
            bar.classList.remove("warning");
            bar.classList.remove("info");
            bar.classList.remove("neutral");
            bar.classList.remove("hidden");
            bar.classList.add(level);
            if (saveState)
            {
                this._infoBar.text = bar.innerHTML;
                this._infoBar.classes = Array.from(bar.classList);
            }
        }
    }

    resetInfoBar()
    {
        if (!this._infoBar || !this._infoBar.text) return;
        const bar = document.getElementById("nav-infobar");
        if (bar)
        {
            bar.innerHTML = this._infoBar.text;
            if (this._infoBar.classes)
            {
                this._infoBar.classes.forEach((c) =>
                {
                    bar.classList.add(c);
                });
            }
        }
    }

    getTemplateListNav()
    {
        if (this._lastPatchTemplates === 0)
        {
            this._lastPatchTemplates = Date.now();
            api.get("templates", (result) =>
            {
                src_client.setHandleBarHtml("nav_patch_templates", { "templates": result }, ele.byId("template-list-dropdown"));
            });
        }
    }

    getMyProjectListNav(which)
    {
        if (which === "recentpatches" && this._lastRecentProjects === which)
        {
            document.location.href = "/mypatches";
            return;
        }
        if (which === "recentinvitedpatches" && this._lastRecentProjects === which)
        {
            document.location.href = "/mypatches#sharedme";
            return;
        }

        if (which === "teams" && this._lastRecentProjects === which)
        {
            document.location.href = "/myteams";
            return;
        }

        if (which === "patchlists" && this._lastRecentProjects === which)
        {
            document.location.href = "/mypatchlists";
            return;
        }

        const dropDown = document.getElementById("my-recent-projects-dropdown");
        if (!dropDown) return;
        dropDown.innerHTML = "<div class=\"loading\"></div>";

        document.getElementById("mypatches_" + this._lastRecentProjects).classList.remove("myPatchesFilterActive");
        document.getElementById("mypatches_" + this._lastRecentProjects).classList.add("myPatchesFilterInActive");

        which = which || "recentpatches";
        document.getElementById("mypatches_" + which).classList.add("myPatchesFilterActive");
        document.getElementById("mypatches_" + which).classList.remove("myPatchesFilterInActive");

        this._lastRecentProjects = which;

        let apiEndpoint = which;
        if (which === "teams") apiEndpoint = "teams/myteams?l=4";
        if (which === "patchlists") apiEndpoint = "patchlists/mylists/all?l=4";

        api.get(apiEndpoint, (result) =>
        {
            const nProjects = 4;
            let html = "";

            if (which === "teams")
            {
                if (result.data.length === 0)
                    html += "<div class=\"text-center\">No teams yet!<br/><br/></div>";

                if (result.data.length > nProjects) result.data.length = nProjects;

                for (const i in result.data)
                    html += src_client.getHandleBarHtml("team_thumb", result.data[i]);

                html += "<div class=\"text-center\"><a class=\"button-small\"href=\"/myteams\">Manage your teams</a></div>";
            }
            else if (which === "patchlists")
            {
                if (result.data.length === 0)
                    html += "<div class=\"text-center\">No lists yet!<br/><br/></div>";

                if (result.data.length > nProjects) result.data.length = nProjects;

                for (const i in result.data)
                {
                    const list = result.data[i];
                    const projectInfo = src_client.getHandleBarHtml("project_info", { "project": list, "user": list.owner });
                    html += src_client.getHandleBarHtml("patchlist_thumb", { "list": list, "projectInfo": projectInfo });
                }

                html += "<div class=\"text-center\"><a class=\"button-small\"href=\"/mypatchlists\">Manage your lists</a></div>";
            }
            else
            {
                if (result.msg) result = result.msg;
                if (result.length === 0) html = "";
                if (result.length > nProjects) result.length = nProjects;

                for (const i in result)
                    html += src_client.getHandleBarHtml("project_nav", result[i]);

                if (which === "recentinvitedpatches")
                    html += "<div class=\"text-center\"><a class=\"button-small\" href=\"/myactivityfeed\">See all invites</a></div>";
                else
                    html += "<div class=\"text-center\"><a class=\"button-small\" href=\"/mypatches\">All my patches</a></div>";
            }
            dropDown.innerHTML = html;
        });
    }
}

;// CONCATENATED MODULE: ./src_client/buttons.js


class Buttons
{
    startSavingAnimButton(buttonEle, title = "Working...")
    {
        if (!buttonEle) return;
        buttonEle.classList.remove("buttonSavingError");
        if (!buttonEle.classList.contains("buttonSavingAnim"))
        {
            this.buttonSavingEle = buttonEle;
            this.buttonSavingText = buttonEle.innerHTML;
            buttonEle.innerText = title;

            const e = document.createElement("span");
            e.classList.add("icon-loader");
            e.classList.add("icon");
            e.classList.add("icon-0_75x");
            e.style.backgroundColor = "#000";

            e.style["margin-left"] = "10px";

            buttonEle.classList.add("buttonSavingAnim");

            buttonEle.appendChild(e);
            this.buttonSavingStart = performance.now();
        }
    }

    stopSavingAnimButton(buttonEle = null, showDoneText = true, isError = false)
    {
        if (performance.now() - this.buttonSavingStart < 200)
        {
            setTimeout(() =>
            {
                this.stopSavingAnimButton(buttonEle, showDoneText, isError);
            }, 50);
            return;
        }

        let buttonsloadingIcons = [];
        let buttonsloading = [];
        if (buttonEle && buttonEle.querySelectorAll)
        {
            const buttonsIcons = buttonEle.querySelectorAll(".icon-loader");
            if (buttonsIcons.length > 0) buttonsloadingIcons = buttonsIcons;
            buttonsloading.push(buttonEle);
        }
        else
        {
            buttonsloadingIcons = ele.byQueryAll(".buttonSavingAnim .icon-loader");
            buttonsloading = ele.byQueryAll(".buttonSavingAnim");
        }

        const button = buttonEle || this.buttonSavingEle;
        let timeout = 400;
        if (button)
        {
            if (showDoneText)
            {
                if (isError)
                {
                    if (buttonEle) buttonEle.classList.add("buttonSavingError");
                    button.innerText = "Error!";
                    timeout = 2000;
                }
                else
                {
                    button.innerText = "Done!";
                }
            }

            setTimeout(() =>
            {
                button.classList.remove("buttonSavingError");
                button.innerHTML = this.buttonSavingText;
            }, timeout);
        }

        if (buttonsloading)
            for (let i = 0; i < buttonsloading.length; i++)
                buttonsloading[i].classList.remove("buttonSavingAnim");

        if (buttonsloadingIcons)
            for (let i = 0; i < buttonsloadingIcons.length; i++)
                buttonsloadingIcons[i].remove();
    }
}

;// CONCATENATED MODULE: ./src_client/shortcuts.js


class Shortcuts
{
    constructor()
    {
        document.body.addEventListener("keydown", (e) =>
        {
            if (!(e.key === "Enter" && e.metaKey)) return;
            if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

            let target = e.target;
            if (target.form) target.form.submit();
        });
        this.registerListeners(document);
    }

    registerListeners(containerElement)
    {
        const targetElements = containerElement.querySelectorAll("[data-shortcut]");
        for (let i = 0; i < targetElements.length; i++)
        {
            const sEle = targetElements[i];
            document.body.addEventListener("keydown", (event) =>
            {
                if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;

                if (sEle.dataset.shortcut === "hide" && event.key === "Escape")
                {
                    ele.hide(sEle);
                    return;
                }

                if (!(sEle.dataset.shortcut === "finish" && event.key === "Enter" && (event.ctrlKey || event.metaKey)))
                {
                    if (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT") return;
                    if (event.key !== sEle.dataset.shortcut) return;
                }
                if (document.body.contains(sEle) && sEle.click) sEle.click();
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/tabs.js



class Tabs
{
    init()
    {
        const tabs = ele.byQueryAll("ul.tab-bar li");
        this.initTabs(tabs);
        this._activeTab = null;
    }

    initTabs(tabs)
    {
        let hasActiveTab = false;
        tabs.forEach((tab) =>
        {
            if (tab.dataset.tabName)
            {
                ele.clickable(tab, () =>
                {
                    this.activateTab(tabs, tab, !tab.classList.contains("nested"));
                });

                if (window.location.hash && (window.location.hash === "#" + tab.dataset.tabName))
                {
                    this.activateTab(tabs, tab);
                    hasActiveTab = true;
                    if (!this._elementIsVisibleInViewport(tab))
                    {
                        setTimeout(() =>
                        {
                            tab.scrollIntoView();
                        }, 500);
                    }
                }
                if (tab.dataset.getCount)
                {
                    src_client.executeFunctionByName(tab.dataset.getCount, window, tab, false);
                }
            }
            if (tab.classList.contains("active"))
            {
                hasActiveTab = true;
            }
        });

        if (!hasActiveTab)
        {
            let defaultTab = null;
            for (let i = 0; i < tabs.length; i++)
            {
                const tab = tabs[i];
                if (tab.dataset.tabName && tab.classList.contains("active"))
                {
                    defaultTab = tab;
                    break;
                }
            }
            if (!defaultTab) defaultTab = tabs[0];
            this.activateTab(tabs, defaultTab);
        }

        window.addEventListener("hashchange", (event) =>
        {
            if (event.newURL)
            {
                try
                {
                    const url = new URL(event.newURL);
                    tabs.forEach((tab) =>
                    {
                        if (url.hash && (url.hash === "#" + tab.dataset.tabName))
                        {
                            this.activateTab(tabs, tab);
                        }
                    });
                }
                catch (e)
                {
                    // ignore broken urls
                }
            }
        }, false);
    }

    activateTab(tabs, tabToActivate, fromUserInteraction = false)
    {
        if (!tabToActivate) return;
        // if (tabToActivate === this._activeTab) return;

        tabs.forEach((tab) =>
        {
            if (tab.dataset.tabName)
            {
                tab.classList.remove("active");
                const selector = ".tab-bar-content[data-tab-name=\"" + tab.dataset.tabName + "\"]";
                const oldContent = ele.byQuery(selector);
                if (oldContent) ele.hide(oldContent);
            }
        });
        tabToActivate.classList.add("active");
        if (tabToActivate.dataset.tabName)
        {
            if (fromUserInteraction)
            {
                if (history.pushState)
                {
                    let url = new URL(window.location);
                    url.searchParams.delete("l");
                    url.searchParams.delete("o");
                    url.hash = "#" + tabToActivate.dataset.tabName;
                    window.history.propertyIsEnumerable({}, "", url);
                }
                else
                {
                    location.hash = "#" + tabToActivate.dataset.tabName;
                }
            }

            const selector = ".tab-bar-content[data-tab-name=\"" + tabToActivate.dataset.tabName + "\"]";
            const contentEle = ele.byQuery(selector);
            if (contentEle)
            {
                const loadingStatus = "<br/><br/><br/><div class=\"loading\" style=\"margin-bottom:600px;\"></div>";
                if (contentEle.dataset.getContent)
                {
                    if (contentEle.dataset.targetElement)
                    {
                        const targetElement = document.querySelector(contentEle.dataset.targetElement);
                        if (targetElement)
                        {
                            targetElement.innerHTML = loadingStatus;
                            src_client.executeFunctionByName(contentEle.dataset.getContent, window, targetElement, fromUserInteraction);
                        }
                        else
                        {
                            contentEle.innerHTML = loadingStatus;
                            src_client.executeFunctionByName(contentEle.dataset.getContent, window, contentEle, fromUserInteraction);
                        }
                    }
                    else
                    {
                        contentEle.innerHTML = loadingStatus;
                        src_client.executeFunctionByName(contentEle.dataset.getContent, window, contentEle, fromUserInteraction);
                    }
                }
                ele.show(contentEle);
            }
        }
        this._activeTab = tabToActivate;
        tabToActivate.dispatchEvent(new CustomEvent("activated", { "detail": { "fromUserInteraction": fromUserInteraction } }));
    }

    requestedTabExists(tabs)
    {
        if (!tabs) return false;
        if (!window.location.hash) return false;
        return Array.from(tabs).some((tab) => { return tab.dataset.tabName && "#" + tab.dataset.tabName === window.location.hash; });
    }

    isRequestedTab(tabs, tabElement)
    {
        if (!tabs || !tabElement) return false;
        if (!window.location.hash) return false;
        return Array.from(tabs).some((tab) => { return tab.dataset.tabName && "#" + tab.dataset.tabName === window.location.hash && tab.dataset.tabName === tabElement.dataset.tabName; });
    }

    initPagination(containerElement, pageInfo, limit, offset, callback)
    {
        limit = Number(limit);
        offset = Number(offset);

        if (!callback)
        {
            callback = (newLimit, newOffset) =>
            {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set("l", newLimit);
                searchParams.set("o", newOffset);
                window.location.search = searchParams.toString();
            };
        }

        const url = new URL(window.location.href);
        if (!limit)
        {
            limit = Number(limit);
            limit = url.searchParams.get("l") || 48;
        }

        if (!offset)
        {
            offset = url.searchParams.get("o");
            offset = Number(offset);
        }

        if (containerElement)
        {
            const oldPagination = containerElement.querySelector(".row.pagination");
            if (oldPagination) oldPagination.remove();
            containerElement.innerHTML += src_client.getHandleBarHtml("pagination", pageInfo);

            const selectorBar = containerElement.querySelector(".pagination .tab-bar");
            if (selectorBar)
            {
                const prevButtons = selectorBar.querySelectorAll(".prev");
                prevButtons.forEach((prevButton) =>
                {
                    if (prevButton)
                    {
                        const prev = () =>
                        {
                            const newOffset = Math.max(0, offset - limit);
                            callback(limit, newOffset);
                        };

                        prevButton.removeEventListener("click", prev);
                        prevButton.addEventListener("click", prev);
                    }
                });

                const nextButtons = selectorBar.querySelectorAll(".next");
                nextButtons.forEach((nextButton) =>
                {
                    if (nextButton)
                    {
                        const next = () =>
                        {
                            const newOffset = Math.min(pageInfo.count, offset + limit);
                            callback(limit, newOffset);
                        };
                        nextButton.removeEventListener("click", next);
                        nextButton.addEventListener("click", next);
                    }
                });

                const moreButtons = selectorBar.querySelectorAll(".more");
                moreButtons.forEach((moreButton) =>
                {
                    if (moreButton)
                    {
                        const more = () =>
                        {
                            callback(0, 0);
                        };
                        moreButton.removeEventListener("click", more);
                        moreButton.addEventListener("click", more);
                    }
                });

                const paginationTabs = selectorBar.querySelectorAll("li.page");
                paginationTabs.forEach((tab, i) =>
                {
                    tab.addEventListener("click", (e) =>
                    {
                        let pageIndex = i;
                        if (tab.dataset.pageIndex)
                        {
                            pageIndex = Number(tab.dataset.pageIndex) - 1;
                        }
                        const newOffset = pageIndex * limit;
                        callback(limit, newOffset);
                    });
                });
            }
        }
    }

    addPagination(apiUrl, limit = 48, offset = 0)
    {
        let url = new URL(window.location.href);
        limit = Number(url.searchParams.get("l")) || limit;
        offset = Number(url.searchParams.get("o")) || offset;

        const pagedUrl = new URL(apiUrl, "https://cables.gl/"); // stephan: baseurl placeholder to manipulate getstring in next line, value is ignored
        if (offset)
        {
            pagedUrl.searchParams.set("o", String(offset));
        }
        if (limit || limit === 0)
        {
            pagedUrl.searchParams.set("l", String(limit));
        }

        return pagedUrl.pathname + pagedUrl.search;
    }

    _elementIsVisibleInViewport(el, partiallyVisible = false)
    {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible
            ? ((top > 0 && top < innerHeight) ||
                (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
            : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    }
}

;// CONCATENATED MODULE: ./src_client/activityfeed.js




class ActivityFeed
{
    constructor()
    {
        document.addEventListener("visibilitychange", () =>
        {
            if (document.visibilityState === "visible")
            {
                this.updateNavIcon();
            }
        });

        this.registerActionListeners(document);
        this.updateNavIcon();
    }

    updateNavIcon()
    {
        const feedIcon = ele.byId("nav-bar-activityfeed-wrapper");
        if (feedIcon)
        {
            api.get("activityfeed/myfeedcount", (res) =>
            {
                const data = res.data;
                const actionable = feedIcon.querySelector(".redbubble");
                const unread = feedIcon.querySelector(".dot");
                const important = feedIcon.querySelector(".important");
                if (data.action_required)
                {
                    ele.hide(unread);
                    ele.hide(important);
                    actionable.innerText = data.action_required;
                    ele.show(actionable);
                }
                else if (data.important)
                {
                    ele.show(important);
                    ele.hide(actionable);
                }
                else if (data.unread)
                {
                    ele.hide(actionable);
                    ele.hide(important);
                    ele.show(unread);
                }
                else
                {
                    ele.hide(unread);
                    ele.hide(important);
                    ele.hide(actionable);
                }
            });
        }
    }

    registerActionListeners(scopeEl)
    {
        const allActions = scopeEl.querySelectorAll(".feedaction");
        allActions.forEach((feedaction) =>
        {
            feedaction.addEventListener("click", () =>
            {
                const topic = feedaction.dataset.topic;
                const delegateId = feedaction.dataset.delegateId;
                const action = feedaction.dataset.action;
                if (action !== "delete_entry") src_client.buttons.startSavingAnimButton(feedaction);
                api.post("activityfeed/" + topic + "/" + delegateId + "/" + action, {}, (res) =>
                {
                    if (action !== "delete_entry")
                    {
                        src_client.buttons.stopSavingAnimButton(feedaction, true);
                        window.location.reload();
                    }
                    ele.hide(feedaction.closest(".activityFeedEntry"));
                }, (e) =>
                {
                    if (action !== "delete_entry") src_client.buttons.stopSavingAnimButton(feedaction, false);
                });
            });
        });
    }
}

;// CONCATENATED MODULE: ./src_client/cookies.js


class Cookies
{
    /**
     * Creates a cookie
     */
    createCookie(name, value, days)
    {
        let expires = "";
        if (days)
        {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/; secure=true; SameSite=lax";
    }

    /**
     * Reads a cookie
     */
    readCookie(name)
    {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++)
        {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Shows the cookie warning
     */
    showWarning()
    {
        if (!this.readCookie("accepted"))
        {
            const cookieWarning = ele.byId("cookie-warning");
            if (cookieWarning)
            {
                ele.show(cookieWarning);
                cookieWarning.addEventListener("click", () =>
                {
                    ele.hide(cookieWarning);
                    cookieWarning.style.display = "none";
                    this.createCookie("accepted", true, 365 * 10);
                });
            }
        }
    }
}




;// CONCATENATED MODULE: ./src_client/login.js




class Login
{
    constructor()
    {
        const elSignup = ele.byClass("tab_content_signup");
        const elFn = ele.byId("firstname");
        if (elFn && elSignup)
        {
            ele.byId("firstname").style.zIndex = -100;
            ele.byId("firstname").style.position = "absolute";
        }
    }

    ajaxLogin()
    {
        const data = {
            "username": ele.byId("login_username").value,
            "password": ele.byId("login_password").value,
        };

        api.post(
            "loginajax",
            data,
            (res) =>
            {
                if (res.success)
                {
                    let redir = document.location.pathname;
                    const successRedir = ele.byId("successRedir");
                    if (successRedir && successRedir.value) redir = successRedir.value;
                    if (!redir) redir = "/home";
                    window.location.href = redir;
                }
                else
                {
                    let msg = "Login failed";

                    if (res.error) msg += ": " + res.error + "";

                    const errorsEle = ele.byQuery(".errors_login");
                    errorsEle.style.display = "block";
                    errorsEle.innerHTML = msg;
                }
            },
            (res) =>
            {
                const errorsEle = ele.byQuery(".errors_login");
                errorsEle.style.display = "block";
                errorsEle.innerText = "Something went wrong... No success";
            },
        );
    }

    signup()
    {
        const data = {
            "username": ele.byId("username").value,
            "firstname": ele.byId("firstname").value,
            "password": ele.byId("password").value,
            "email": ele.byId("theemail").value,
            "newsletter": document.getElementById("newslettercheckbox").checked,
        };

        const secretEle = ele.byId("secret");
        if (secretEle)
        {
            data.secred = secretEle.value;
        }

        if (document.getElementById("privacycheckbox").checked)
        {
            ele.byQuery(".errors_signup").style.display = "none";
            ele.byQuery(".errors_signup").innerText = "";
        }
        else
        {
            ele.byQuery(".errors_signup").style.display = "block";
            ele.byQuery(".errors_signup").innerText = "Please read and accept the privacy policy";
            return;
        }

        api.post(
            "user/signup",
            data,
            (res) =>
            {
                if (res.status == "SUCCESS" && res.goto)
                {
                    ele.byQuery(".tab_content_signup").innerHTML = "<div class=\"text-center\">Thank you for signing up! <br/><br/>Please check your inbox to confirm your email. <br/>After that you can <a href=\"/login\">login</a></div>";
                }
                else
                {
                    ele.byQuery(".errors_signup").style.display = "block";
                    ele.byQuery(".errors_signup").innerText = "";
                    ele.byQuery(".errors_signup").innerText = "Something went wrong... No success " + res.errors;
                }
            },
            (res) =>
            {
                ele.byQuery(".errors_signup").style.display = "block";
                ele.byQuery(".errors_signup").innerText = "";

                if (res.errors && res.errors.length > 0)
                {
                    if (!res.errors.includes("MAINTENANCE_MODE"))
                    {
                        ele.byQuery(".errors_signup").innerHTML = "Please check your data:<br/><br/>";
                    }

                    if (res.errors)
                    {
                        for (const i in res.errors)
                        {
                            if (res.errors[i] === "EMAIL_INVALID") ele.byQuery(".errors_signup").innerHTML += "- This is not a valid email<br/>";
                            else if (res.errors[i] === "PASSWORD_TOO_SHORT") ele.byQuery(".errors_signup").innerHTML += "- Please use a longer password<br/>";
                            else if (res.errors[i] === "USERNAME_TOO_SHORT") ele.byQuery(".errors_signup").innerHTML += "- Please use a longer username<br/>";
                            else if (res.errors[i] === "EMAIL_EXISTS") ele.byQuery(".errors_signup").innerHTML += "- This email is already registered<br/>";
                            else if (res.errors[i] === "USER_EXISTS") ele.byQuery(".errors_signup").innerHTML += "- Username already exists<br/>";
                            else if (res.errors[i] === "INVALID CHARACTERS") ele.byQuery(".errors_signup").innerHTML += "- Please do not use any special characters or spaces in your username<br/>";
                            else if (res.errors[i] === "ERROR_USERNAME_EQUALS_EMAIL") ele.byQuery(".errors_signup").innerHTML += "- Your username cannot be your email-address<br/>";
                            else if (res.errors[i] === "MAINTENANCE_MODE") ele.byQuery(".errors_signup").innerHTML += "cables is currently in maintenance mode,<br/>please try again later";
                            else ele.byQuery(".errors_signup").innerHTML += "- " + res.errors[i] + "<br/>";
                        }
                    }
                }
                else
                {
                    ele.byQuery(".errors_signup").innerText = "something went wrong...";
                }
            },
        );
    }

    setResetPassword()
    {
        const data = {
            "password": ele.byId("password").value,
            "hash": ele.byId("hash").value,
        };

        api.post(
            "user/setResetPassword",
            data,
            (res) =>
            {
                if (res.success)
                {
                    ele.byQuery(".errors").style.display = "block";
                    ele.byQuery(".errors").innerText = "";
                    ele.byQuery(".tab_content_signup").innerHTML = "new password set!<br/><br/><a href=\"/login\">login now</a>";
                }
                else
                {
                    ele.byQuery(".errors").style.display = "block";
                    ele.byQuery(".errors").innerText = "Something went wrong... No success";
                }
            },
            (res) =>
            {
                ele.byQuery(".errors").style.display = "block";
                ele.byQuery(".errors").innerText = "";

                if (res.errors && res.errors.length > 0)
                {
                    if (!res.errors.includes("USER_LOGGED_IN"))
                    {
                        ele.byQuery(".errors").innerHTML = "please check your data:<br/><br/>";
                    }

                    for (const i in res.errors)
                    {
                        if (res.errors[i] === "USER_LOGGED_IN")
                        {
                            ele.byQuery(".errors").innerHTML += "you are currently logged in, <a href='/logout'>log out</a> to reset your password";
                        }
                        else
                        {
                            ele.byQuery(".errors").innerHTML += "- " + res.errors[i] + "<br/>";
                        }
                    }
                }
                else
                {
                    ele.byQuery(".errors").innerHTML += "something went wrong...";
                }
            }
        );
    }

    unsubscribeNewsletter(subscriberId, newsletterKey, button)
    {
        src_client.buttons.startSavingAnimButton(button);
        const resultEle = document.getElementById("result");
        if (resultEle)
        {
            ele.hide(resultEle);
            resultEle.classList.remove("error");
        }
        api.post("user/unsubscribe/" + newsletterKey + "/" + subscriberId, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(button);
            if (resultEle)
            {
                resultEle.innerText = "Successfully unsubscribed!";
                resultEle.classList.add("info");
                ele.show(resultEle);
            }
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(button, false, true);
            if (resultEle)
            {
                resultEle.innerText = "Failed to unsubscribe: " + e.msg;
                resultEle.classList.add("error");
                ele.show(resultEle);
            }
        });
    }

    resetPassword()
    {
        const data = {
            "email": ele.byId("email").value,
        };

        api.post(
            "user/resetPassword",
            data,
            (res) =>
            {
                if (res.success)
                {
                    ele.byQuery(".errors").style.display = "block";
                    ele.byQuery(".errors").innerText = "";
                    ele.byQuery(".errors").innerText = "password reset email sent!";

                    ele.byId("resetpasswdbutton").style.display = "none";
                    ele.byId("email").style.display = "block";
                }
                else
                {
                    ele.byQuery(".errors").style.display = "block";
                    ele.byQuery(".errors").innerText = "";
                    ele.byQuery(".errors").innerText = "Something went wrong... No success";
                }
            },
            (res) =>
            {
                ele.byQuery(".errors").style.display = "block";
                ele.byQuery(".errors").innerText = "";

                if (res.errors && res.errors.length > 0)
                {
                    if (!res.errors.includes("USER_LOGGED_IN"))
                    {
                        ele.byQuery(".errors").innerHTML = "please check your data:<br/><br/>";
                    }

                    for (const i in res.errors)
                    {
                        if (res.errors[i] === "USER_LOGGED_IN")
                        {
                            ele.byQuery(".errors").innerHTML += "you are currently logged in, <a href='/logout'>log out</a> to reset your password";
                        }
                        else
                        {
                            ele.byQuery(".errors").innerHTML += "- " + res.errors[i] + "<br/>";
                        }
                    }
                }
                else
                {
                    ele.byQuery(".errors").innerHTML += "something went wrong...";
                }
            },
        );
    }

    resendConfirmEmail()
    {
        const data = {
            "email": ele.byId("email").value,
        };

        api.post(
            "send_confirm/",
            data,
            (res) =>
            {
                if (res.success)
                {
                    ele.byId("result").innerText = "password reset email sent!";
                    ele.byId("form").style.display = "none";
                }
                else
                {
                    ele.byId("result").innerText = "Something went wrong... No success";
                    ele.byId("form").style.display = "none";
                }
            },
            (res) =>
            {
                ele.byId("result").innerText = "Something went wrong... No success";
                ele.byId("form").style.display = "none";
            }
        );
    }
}

;// CONCATENATED MODULE: ./src_client/favs.js




class Favs
{
    follow(userid)
    {
        api.post(
            "follow/" + userid,
            (res) =>
            {
            },
            (res) =>
            {
                if (res.followstate) ele.byId("follow-button").innerText = "Following";
                else ele.byId("follow-button").innerText = "Follow";
            }
        );
    }

    loadFavsAndUpdateDom(referenceId, type = null)
    {
        const referenceType = type || "project";
        let apiUrl = "favs/" + referenceId;
        if (referenceType) apiUrl += "/" + referenceType;
        api.get(apiUrl, (likes) =>
        {
            const data = {};
            data.likes = likes;
            data.likeColumns = Math.max(Math.ceil(likes.length / 10), 1);
            if (likes)
            {
                if (likes.length > 0)
                {
                    const view = ele.byId("fav-hover-view");
                    src_client.setHandleBarHtml("likelist", data, view);
                }
                const numFavs = ele.byQueryAll(".num-favs");
                numFavs.forEach((numFav) =>
                {
                    numFav.innerText = likes.length;
                });
            }
        });
    }

    updateFav(state, projectId, type)
    {
        if (state)
        {
            ele.byQueryAll(".fav-text-and-icon .fav-icon")
                .forEach((icon) =>
                {
                    icon.classList.remove("icon-heart");
                    icon.classList.add("icon-heart-fill");
                });
        }
        else
        {
            ele.byQueryAll(".fav-text-and-icon .fav-icon")
                .forEach((icon) =>
                {
                    icon.classList.add("icon-heart");
                    icon.classList.remove("icon-heart-fill");
                });
        }
        this.loadFavsAndUpdateDom(projectId, type);
    }

    toggleFav(id, type = "project")
    {
        const apiUrl = "fav/toggle/" + id;
        api.post(
            apiUrl,
            {
                "type": type
            },
            (res) =>
            {
                this.updateFav(res.favstate, id, type);
            }
        );
    }

    showFavToggle(favEle)
    {
        if (favEle)
        {
            const id = favEle.dataset.id;
            const type = favEle.dataset.type || "project";
            const isFav = favEle.dataset.isfav && (favEle.dataset.isfav !== "false");
            const numFavs = favEle.dataset.numfavs;
            src_client.setHandleBarHtml("favtoggle", { "reference": { "_id": id }, "type": type, "isFav": isFav, "numFavs": numFavs }, favEle);
        }
    }
}

;// CONCATENATED MODULE: ./src_client/tables.js



class Tables
{
    init()
    {
        const tables = ele.byQueryAll("table.sortable");
        this.initTables(tables);
    }

    initTables(tables)
    {
        let sortBy = "";
        let sortAsc = true;
        tables.forEach((table) =>
        {
            let rows = table.querySelectorAll("tr:nth-child(n+2)");
            const headings = table.querySelectorAll("th");
            headings.forEach((heading, i) =>
            {
                heading.addEventListener("click", () =>
                {
                    const by = heading.innerText;
                    if (sortBy === by) sortAsc = !sortAsc;
                    sortBy = by;
                    [...rows].sort((a, b) =>
                    {
                        const num = i + 1;
                        const selector = "td:nth-child(" + num + ")";
                        const tdLeft = a.querySelector(selector);
                        const tdRight = b.querySelector(selector);
                        const t1 = tdLeft ? tdLeft.innerText : "z";
                        const t2 = tdRight ? tdRight.innerText : "a";
                        if (sortAsc) return t1.localeCompare(t2);
                        return t2.localeCompare(t1);
                    }).forEach((node) => { return table.appendChild(node); });
                });
            });
        });
    }
}

;// CONCATENATED MODULE: ./src_client/projects.js




class Projects
{
    getTagsFromProjects(projects)
    {
        const tags = {};
        const tagArr = [];

        for (const i in projects)
        {
            if (projects[i].tags)
                for (let j = 0; j < projects[i].tags.length; j++)
                {
                    const t = projects[i].tags[j];
                    if (t != name)
                        if (tags.hasOwnProperty(t)) tags[t]++;
                        else tags[t] = 0;
                }
        }

        for (const index in tags)
        {
            tagArr.push({
                "name": index,
                "num": tags[index],
                "fontsize": tags[index] * 2 + 12
            });
        }

        tagArr.sort((a, b) => { return a.num - b.num; });

        return tagArr;
    }

    getUserProjects(userId, admin, limit, offset = 0)
    {
        let url = "user/" + userId + "/projects";
        if (admin) url = "admin/user/" + userId + "/projects";

        limit = Number(limit);
        offset = Number(offset);
        if (limit || limit === 0)
        {
            url += "?l=" + limit;
        }
        if (offset)
        {
            url += "&o=" + offset;
        }

        api.get(url, (result) =>
        {
            let html = "";
            let displayedDate = "published";
            if (admin) displayedDate = "updated";
            for (const i in result.projects)
            {
                const project = result.projects[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": displayedDate });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }

            document.getElementById("projects").innerHTML = html;

            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("results_container"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "?l=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&o=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + window.location.hash;
                });
            }
        });
    }

    downloadBackup(id)
    {
        const pagination = ele.byQuery(".pagination");
        if (pagination) ele.hide(pagination);
        const quotaBox = ele.byId("backupsQuota");
        if (quotaBox) ele.hide(quotaBox);
        const table = ele.byId("backups");
        const statusElement = ele.byQuery(".restoreStatus");
        const statusText = statusElement.querySelector(".text");
        const errorContainer = statusElement.querySelector(".error");
        const errorText = errorContainer.querySelector(".text");
        errorText.innerText = "";
        ele.hide(errorContainer);
        const loadingIndicator = statusElement.querySelector(".loading");
        ele.show(loadingIndicator);
        if (statusText) statusText.innerText = "Preparing backup for download...";
        if (table) ele.hide(table);
        ele.show(statusElement);
        api.get("projectversion/download/prepare/" + id, (res) =>
        {
            ele.hide(loadingIndicator);
            if (res?.data?.urls?.downloadUrl)
            {
                const filename = res?.data?.filename;
                statusText.innerHTML = "Backup is ready for download<br/><br/><a href=\"" + res.data.urls.downloadUrl + "\" download=\"" + filename + "\" class=\"button button-primary\">Download</a>";
            }
            else
            {
                statusText.innerText = "";
                errorText.innerHTML = "Something went wrong:<br/><br/>Could not find download for backup<br/><br/><a class=\"button\" onclick=\"window.location.reload();\">Try again</a>";
                ele.show(errorContainer);
            }
        }, (e) =>
        {
            ele.hide(loadingIndicator);
            statusText.innerText = "";
            errorText.innerHTML = "Something went wrong:<br/><br/>" + e.msg + "<br/><br/><a class=\"button\" onclick=\"window.location.reload();\">Try again</a>";
            ele.show(errorContainer);
        });
    }

    createPatchFromBackup(versionId)
    {
        const pagination = ele.byQuery(".pagination");
        if (pagination) ele.hide(pagination);
        const sortElement = ele.byId("backups_sort");
        if (sortElement) ele.hide(sortElement);
        const quotaBox = ele.byId("backupsQuota");
        if (quotaBox) ele.hide(quotaBox);
        const table = ele.byId("backups");
        const statusElement = ele.byQuery(".restoreStatus");
        if (statusElement)
        {
            if (table) ele.hide(table);
            ele.show(statusElement);
        }
        api.get("projectversion/recover/" + versionId, (result) =>
        {
            if (result && result.data && result.data.projectId)
            {
                const href = "/edit/" + result.data.projectId;
                const target = src_client.isIframe ? "_blank" : "_self";
                if (statusElement)
                {
                    statusElement.innerHTML = "<span class=\"icon icon-check\"></span><br/>successfully created new patch<br/><a href=\"" + href + "\" target=\"" + target + "\">open in editor</a>";
                }
            }
            else if (result && result.data && result.data.problems)
            {
                let message = "";
                Object.values(result.data.problems).forEach((problem) =>
                {
                    message += problem + "<br/>";
                });
                if (statusElement) statusElement.innerHTML = "failed to create new patch:<br/> " + message;
            }
            else
            {
                const message = result.error ? result.msg : "UNKNOWN_ERROR";
                if (statusElement) statusElement.innerText = "failed to create new patch:<br/> " + message;
            }
        }, (e) =>
        {
            if (statusElement) statusElement.innerText = "failed to create new patch:<br/> " + e.msg;
        });
    }

    deleteBackup(versionId, menuElement)
    {
        const errorEle = ele.byId("errors");
        if (errorEle) ele.hide(errorEle);
        const formerText = menuElement.innerText;
        menuElement.innerText = "working...";
        api.delete("projectversion/delete/" + versionId, {}, () =>
        {
            menuElement.innerText = formerText;
            window.location.reload();
        }, (e) =>
        {
            menuElement.innerText = formerText;
            errorEle.innerText = "failed to delete backup:" + e.msg;
            ele.show(errorEle);
        });
    }

    keepBackup(versionId, menuElement)
    {
        const errorEle = ele.byId("errors");
        if (errorEle) ele.hide(errorEle);
        const formerText = menuElement.innerText;
        menuElement.innerText = "working...";
        api.get("projectversion/keep/" + versionId, (result) =>
        {
            menuElement.innerText = formerText;
            window.location.reload();
        }, (e) =>
        {
            menuElement.innerText = formerText;
            errorEle.innerText = "failed to keep backup:" + e.msg;
            ele.show(errorEle);
        });
    }

    getBackupsTable(baseUrl, targetElement, showPatchNames = false, quotaPosition = "top")
    {
        const url = new URL(window.location.href);
        const order = url.searchParams.get("or") || "created";
        const limit = url.searchParams.get("l") || 20;
        const offset = url.searchParams.get("o") || 0;

        let apiUrl = src_client.tabs.addPagination(baseUrl + "?or=" + order, limit, offset);
        api.get(apiUrl, (res) =>
        {
            if (res && res.data && res.data.backups)
            {
                const backups = res.data.backups;
                const quota = res.data.quota;
                const quotaEl = src_client.getHandleBarHtml("backups_quota", { "quota": quota, "showUsage": !src_client.isIframe });
                src_client.setHandleBarHtml("backups_table", { "backups": backups, "quota": quota, "showPatch": showPatchNames, "sortable": !src_client.isIframe }, targetElement);
                if (quotaPosition === "top")
                {
                    targetElement.innerHTML = quotaEl + targetElement.innerHTML;
                }
                else
                {
                    targetElement.innerHTML += quotaEl;
                }
                src_client.tabs.initPagination(targetElement, res.pagination, res.pagination.limit, res.pagination.offset);
                src_client.tables.initTables(targetElement.querySelectorAll("table.sortable"));

                const orderTabs = ele.byQueryAll("#order-tab-bar li");
                orderTabs.forEach((orderTab) =>
                {
                    if (orderTab.classList.contains(order)) orderTab.classList.add("active");
                    orderTab.addEventListener("click", () =>
                    {
                        const sort = orderTab.dataset.sort;
                        window.location.search = "?or=" + sort;
                    });
                });
            }
        }, (err) =>
        {
            targetElement.innerText = "failed to get backups: " + err.msg;
        });
    }

    requestAccess(projectId, permission, cbSuccess = null, cbError = null)
    {
        api.post("patchinvite/request/" + projectId + "/" + permission, {}, cbSuccess, cbError);
    }
}

;// CONCATENATED MODULE: ./src_client/web.js














class CablesWeb
{
    constructor()
    {
        this.env = {
            "loggedIn": false,
            "env": "live",
            "envTitle": "",
            "isDev": () =>
            {
                return this.env.env === "dev";
            }
        };
        this.isOnBeforeUnload = false;
        this.isIframe = false;
        this._ignoreAutoSuggestRequest = false;
    }

    init(loggedIn, env, envTitle)
    {
        this.isIframe = ele.byQuery("body").classList.contains("framed");
        if (loggedIn) this.env.loggedIn = loggedIn;
        if (env) this.env.env = env;
        if (envTitle) this.env.envTitle = envTitle;

        this.nav = new Nav();
        this.search = new Search();
        this.buttons = new Buttons();
        this.shortcuts = new Shortcuts();
        this.tabs = new Tabs();
        this.tables = new Tables();
        this.activityFeed = new ActivityFeed();
        this.cookies = new Cookies();
        this.favs = new Favs();
        this.api = api;

        this.login = new Login();
        this.projects = new Projects();

        const toHighlight = document.querySelectorAll(".hljs");
        toHighlight.forEach((element) =>
        {
            hljs.highlightElement(element);
        });

        this.catHide();
    }

    catHide()
    {
        const catClosed = localStorage.getItem("catClose") || 0;
        const cat = ele.byId("sadcat");

        if (cat)
        {
            if (Date.now() - catClosed > (Math.random() + 3) * 2 * 60 * 60 * 1000) cat.classList.remove("hidden");
            else cat.classList.add("hidden");
        }
    }

    catClose()
    {
        localStorage.setItem("catClose", Date.now());

        this.catHide();
    }

    initializeAutosuggestsFromApi(inputElements, options = {})
    {
        const fillSuggestionList = (e) =>
        {
            if (this._ignoreAutoSuggestRequest) return;

            const el = e.target;
            const search = el.value;
            if (options.minLength && search.length < options.minLength) return;
            const url = new URL(el.dataset.autosuggest, "https://cables.gl/"); // stephan: baseurl placeholder to manipulate getstring in next line, value is ignored
            url.searchParams.set("ac", search);
            api.get(url.pathname + url.search, (response) =>
            {
                const suggestions = [];
                response.data.forEach((d) =>
                {
                    const suggestion = {
                        "title": d[el.dataset.autosuggestTitlefield],
                        "value": d[el.dataset.autosuggestValuefield]
                    };
                    if (d.image)
                    {
                        suggestion.image = d.image;
                    }
                    if (d.inactive)
                    {
                        suggestion.inactive = d.inactive;
                    }
                    suggestions.push(suggestion);
                });
                if (!this._ignoreAutoSuggestRequest)
                {
                    this.showInputSuggestions(el, suggestions, options);
                }
            });
        };

        if (inputElements)
        {
            inputElements.forEach((inputElement) =>
            {
                const focusListener = (e) =>
                {
                    this._ignoreAutoSuggestRequest = false;
                    fillSuggestionList(e);
                };
                inputElement.addEventListener("focus", focusListener);
                inputElement.addEventListener("input", fillSuggestionList);
                if (options.focusElement === inputElement)
                {
                    fillSuggestionList({ "target": inputElement });
                }
            });
        }
    }

    showInputSuggestions(targetEle, list, options = {})
    {
        // remove previous eventlisteners and hide already opened suggestions
        targetEle.onkeydown = null;
        document.querySelectorAll(".inputSuggestionList")
            .forEach((el) => { return el.remove(); });

        const div = document.createElement("div");
        div.classList.add("inputSuggestionList");

        for (let i = 0; i < list.length; i++)
        {
            const item = list[i];
            const element = document.createElement("div");
            element.classList.add("autosuggestLine");
            if (item.inactive)
            {
                element.classList.add("inactive");
            }
            element.dataset.value = item.value;
            element.dataset.title = item.title;
            if (item.image)
            {
                const imageElement = document.createElement("img");
                imageElement.src = item.image;
                element.appendChild(imageElement);
            }
            element.appendChild(document.createTextNode(item.title));
            div.appendChild(element);
        }

        const r = targetEle.getBoundingClientRect();

        div.style.top = r.top + r.height + window.scrollY + "px";
        div.style.left = r.left + "px";
        div.style.width = r.width + "px";

        const cstyle = getComputedStyle(targetEle);

        div.style.background = cstyle.background;
        div.style["background-color"] = cstyle["background-color"];

        div.dataset.selected = 0;
        const keypressListener = (event) =>
        {
            const key = event.key;

            targetEle.dataset.autosuggestTitle = "";
            targetEle.dataset.autosuggestValue = "";

            if (key === "ArrowDown")
            {
                div.dataset.selected++;
                if (div.dataset.selected > list.length) div.dataset.selected = list.length;
                div.childNodes.forEach((node, index) =>
                {
                    const itemNr = index + 1;
                    if (div.dataset.selected == itemNr)
                    {
                        node.classList.add("selected");
                        div.scrollTop = node.offsetTop;
                    }
                    else
                    {
                        node.classList.remove("selected");
                    }
                });
            }
            else if (key === "ArrowUp")
            {
                div.dataset.selected--;
                if (div.dataset.selected < 1) div.dataset.selected = 1;
                div.childNodes.forEach((node, index) =>
                {
                    const itemNr = index + 1;
                    if (div.dataset.selected == itemNr)
                    {
                        node.classList.add("selected");
                        div.scrollTop = node.offsetTop;
                    }
                    else
                    {
                        node.classList.remove("selected");
                    }
                });
            }
            else if (key === "Enter")
            {
                if (div.dataset.selected && div.dataset.selected > 0 && div.dataset.selected <= list.length)
                {
                    let newValue = list[div.dataset.selected - 1].title;
                    let newSuggestTitle = list[div.dataset.selected - 1].title;
                    let newSuggestValue = list[div.dataset.selected - 1].value;
                    if (options.append)
                    {
                        const seperator = options.seperator || ",";
                        newValue = targetEle.value += seperator + list[div.dataset.selected - 1].title;
                        newSuggestTitle = targetEle.dataset.autosuggestTitle + seperator + list[div.dataset.selected - 1].title;
                        newSuggestValue = targetEle.dataset.autosuggestValue + seperator + list[div.dataset.selected - 1].value;
                        newValue = newValue.replace(seperator + seperator, seperator);
                        newSuggestTitle = newSuggestTitle.replace(seperator + seperator, seperator);
                        newSuggestValue = newSuggestValue.replace(seperator + seperator, seperator);
                    }

                    targetEle.value = newValue;
                    targetEle.dataset.autosuggestTitle = newSuggestTitle;
                    targetEle.dataset.autosuggestValue = newSuggestValue;

                    targetEle.removeEventListener("keydown", keypressListener);
                    div.remove();
                    targetEle.dispatchEvent(new Event("change"));
                }
            }
        };

        targetEle.onkeydown = keypressListener;

        targetEle.addEventListener("blur", () =>
        {
            this._ignoreAutoSuggestRequest = true;
            setTimeout(() =>
            {
                targetEle.onkeydown = null;
                div.remove();
            }, 100);
        });

        div.addEventListener("pointerdown", (e) =>
        {
            let value = e.target.dataset.title;
            if (options.append)
            {
                value = targetEle.value + "," + e.target.dataset.title;
            }
            if (value && value !== "undefined")
            {
                targetEle.value = value;
                targetEle.dataset.autosuggestTitle = e.target.dataset.title;
                targetEle.dataset.autosuggestValue = e.target.dataset.value;
                targetEle.onkeydown = null;
                div.remove();
                targetEle.dispatchEvent(new Event("change"));
            }
        });

        document.body.appendChild(div);
    }

    executeFunctionByName(functionName, context, ...args)
    {
        const namespaces = functionName.split(".");

        const func = namespaces.pop();
        for (let i = 0; i < namespaces.length; i++)
        {
            try
            {
                context = context[namespaces[i]];
            }
            catch (e)
            {
                console.warn("missing context to execute function", functionName, context, args);
            }
        }
        if (!context || !context[func])
        {
            console.error("could not executeFunctionByName", functionName);
            return;
        }
        return context[func].apply(context, args);
    }

    getServiceWorkerSubscription(workerUrl, cb)
    {
        if (!navigator.serviceWorker)
        {
            cb("WEBPUSH_UNSUPPORTED");
            return;
        }
        navigator.serviceWorker.getRegistration(workerUrl).then((registration) =>
        {
            if (registration && registration.pushManager)
            {
                try
                {
                    registration.pushManager.getSubscription().then((sub) =>
                    {
                        cb(null, sub);
                    }).catch((e) =>
                    {
                        cb("ERROR_GETTING_SUBSCRIPTION", e);
                    });
                }
                catch (e)
                {
                    cb("ERROR", e);
                }
            }
            else
            {
                if (window.Notification)
                {
                    cb(null, null);
                }
                else
                {
                    cb("WEBPUSH_UNSUPPORTED");
                }
            }
        });
    }

    registerWebPushWorker(workerUrl, publicKey, cb)
    {
        if (!navigator.serviceWorker)
        {
            cb("WEBPUSH_UNSUPPORTED");
            return;
        }
        navigator.serviceWorker.ready.then((registration) =>
        {
            if (registration && registration.pushManager)
            {
                try
                {
                    Notification.requestPermission().then((permission) =>
                    {
                        if (permission === "granted")
                        {
                            registration.pushManager.subscribe({
                                "userVisibleOnly": true,
                                "applicationServerKey": publicKey
                            }).then((webPushSubscription) =>
                            {
                                if (webPushSubscription)
                                {
                                    if (cb) cb(null, webPushSubscription);
                                }
                                else
                                {
                                    if (cb) cb("FAILED_TO_SUBSCRIBE");
                                }
                            }).catch((e) =>
                            {
                                if (cb) cb("ERROR", e);
                            });
                        }
                        else
                        {
                            if (cb) cb("PERMISSION_NOT_GRANTED", "Check your browser settings to allow push notifications.");
                        }
                    });
                }
                catch (e)
                {
                    if (cb) cb("ERROR", e);
                }
            }
            else
            {
                if (cb) cb("WEBPUSH_UNSUPPORTED");
            }
        });
        navigator.serviceWorker.register(workerUrl, { "scope": "/", "updateViaCache": "all" });
    }

    unregisterWebPushWorker(workerUrl, cb)
    {
        if (!navigator.serviceWorker)
        {
            cb("WEBPUSH_UNSUPPORTED");
            return;
        }
        navigator.serviceWorker.ready.then((registration) =>
        {
            if (!registration)
            {
                if (cb) cb("NOT_REGISTERED");
            }
            else
            {
                registration.pushManager.getSubscription().then((subscription) =>
                {
                    if (subscription)
                    {
                        subscription.unsubscribe().then(() =>
                        {
                            if (cb) cb();
                        });
                    }
                    else
                    {
                        if (cb) cb("NOT_SUBSCRIBED");
                    }
                });
            }
        });
        navigator.serviceWorker.register(workerUrl, { "scope": "/", "updateViaCache": "all" });
    }

    getQueryVariable(variable)
    {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++)
        {
            const pair = vars[i].split("=");
            if (pair[0] === variable)
            { return pair[1]; }
        }
        return false;
    }

    getSearchParams(key)
    {
        const p = {};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (s, k, v) => { p[k] = v; });
        return key ? p[key] : p;
    }

    getHandleBarHtml(name, vars)
    {
        // eslint-disable-next-line no-undef
        if (!cables.templates[name])
        {
            console.error("template not found: " + name);
            return "";
        }

        // eslint-disable-next-line no-undef
        return cables.templates[name](vars);
    }

    setHandleBarHtml(name, vars, element)
    {
        if (!element) return;
        element.innerHTML = this.getHandleBarHtml(name, vars);
    }

    parseDustJson(data, defaultValue = null)
    {
        if (!data) return defaultValue;
        let value = defaultValue;
        try
        {
            value = JSON.parse(data);
        }
        catch (e)
        {
            console.warn("failed to parse data from dust", data);
        }
        return value;
    }

    showCcIcons(text, show)
    {
        const element = ele.byId("patch-licence-text");
        if (element) element.innerText = text;

        if (show)
        {
            ele.show(element);
        }
        else
        {
            ele.hide(element);
        }
    }

    projectPagePatchList(projects, id, emptyText, pagination = {}, template = "project", html = "")
    {
        for (const i in projects)
        {
            const project = projects[i];
            const projectInfo = this.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername } });
            html += this.getHandleBarHtml(template, { "project": project, "projectInfo": projectInfo });
        }

        const el = document.getElementById(id);
        if (el)
        {
            el.innerHTML = html;
            if (!projects || projects.length === 0) el.innerHTML = "<div class=\"cute-12-phone\">" + emptyText + "</div>";
        }
    }

    embedPatch(params, callbackError = null)
    {
        let viewerUrl = params.sandboxUrl + "/sandboxviewer/" + params.projectId;
        viewerUrl = new URL(viewerUrl);

        let searchParams = viewerUrl.searchParams;

        if (params.queryString)
        {
            const parentSearchParams = new URLSearchParams(params.queryString);
            parentSearchParams.forEach((value, key) =>
            {
                searchParams.append(key, value);
            });
        }

        if (params.embedOverlay)
        {
            searchParams.append("embed", "true");
        }

        if (params.locationHash) viewerUrl += params.locationHash;

        const canvasiframe = document.createElement("iframe");
        canvasiframe.id = "canvasiframe";
        canvasiframe.frameBorder = "0";
        canvasiframe.allow = client_contstants.IFRAME_OPTIONS_ALLOW;
        canvasiframe.src = viewerUrl;
        canvasiframe.style = "width:100%;";
        canvasiframe.title = "patch rendering canvas";
        canvasiframe.sandbox = client_contstants.IFRAME_OPTIONS_SANDBOX;
        canvasiframe.setAttribute("allowfullscreen", "true");
        canvasiframe.setAttribute("webkitallowfullscreen", "true");
        canvasiframe.setAttribute("mozallowfullscreen", "true");
        document.getElementById(params.elementId).appendChild(canvasiframe);

        const frame = document.getElementById("canvasiframe");
        const talker = new TalkerAPI(frame.contentWindow);
        talker.addEventListener(TalkerAPI.CMD_SEND_PATCH, (options, next) =>
        {
            let url = "project/" + params.projectId + "?nocache=" + Date.now();
            api.get(url, (data) =>
            {
                talker.send(TalkerAPI.EVENT_PATCH, { "patch": data, "focusPatch": params.hasOwnProperty("focusPatch") ? params.focusPatch : true });
            }, (e) =>
            {
                console.warn("api error on url:", url);
                console.log(e);
                if (typeof callbackError === "function") callbackError(e);
            });
        });
        talker.addEventListener(TalkerAPI.CMD_SEND_ERROR_REPORT, (data, next) =>
        {
            api.post(
                "errorReport", data, (r) => { next(null, r); }, (r, r2) => { next(r, r2); }
            );
        });
    }

    startUploadManually()
    {
        const fileElem = document.getElementById("hiddenfileElem");
        if (fileElem) fileElem.click();
    }

    uploadFiles(files, url)
    {
        let formData = new FormData();
        formData.append(0, files[0]);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.upload.onprogress = (event) =>
        {
            document.getElementById("uploadtext").innerText = "Uploading...";
        };

        xhr.onload = (e, r) =>
        {
            if (xhr.readyState === xhr.DONE)
            {
                if (xhr.status === 200 || xhr.status == 0)
                {
                    document.getElementById("uploadtext").innerText = "Processing...";
                    setTimeout(() => { document.location.reload(); }, 2000);
                }
                else
                {
                    document.getElementById("uploadtext").innerHTML = "Failed to Upload!<br/><br/>Status: " + xhr.status;
                }
            }
        };

        xhr.send(formData);
    }
}

/* harmony default export */ var src_client_web = (new CablesWeb());

;// CONCATENATED MODULE: ./src_client/pages/page_error.js




class PageError
{
    requestPatchAccess(projectId, permission = "read")
    {
        src_client_web.projects.requestAccess(projectId, permission, (result) =>
        {
            ele.hide(ele.byId("request-access-button"));
            ele.show(ele.byId("request-pending-text"));
        });
    }

    showProject(targetEl)
    {
        const projectId = targetEl.dataset.projectId;
        api.get("projectinfo/" + projectId, (res) =>
        {
            const project = res.data.info.project;
            const user = res.data.info.user;
            const projectInfo = src_client_web.getHandleBarHtml("project_info", { "project": project, "user": user, "displayedDate": "updated" });
            src_client_web.setHandleBarHtml("project", { "project": project, "projectInfo": projectInfo }, targetEl);
        }, () => {});
    }

    findOpEnvironments(targetEl)
    {
        const opIdentifier = targetEl.dataset.opidentifier;
        api.get("op/" + opIdentifier + "/find", (res) =>
        {
            if (res.data && res.data.environments && res.data.environments.length > 0)
            {
                let html = "<h3>Other environments:</h3><ul>";
                const opName = res.data.name;
                res.data.environments.forEach((envName) =>
                {
                    html += "<li>Found <a href=\"https://" + envName + "/op/" + opName + "\">" + opName + "</a> on <a href=\"https://" + envName + "/op/" + opName + "\">" + envName + "</a></li>";
                });
                html += "</ul>";
                targetEl.innerHTML = html;
            }
            else
            {
                targetEl.innerText = "";
            }
        }, (err) =>
        {
            targetEl.innerText = "";
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/patches/page_projectsettings.js




class PageProjectSettings
{
    constructor(targetElement)
    {
        const patchId = targetElement.dataset.patchId;
        const shortId = targetElement.dataset.shortId;

        this._iframe = targetElement.dataset.iframe;

        this._id = patchId;
        this._shortId = shortId;

        this._talkerAPI = null;
        if (this._iframe)
        {
            this._talkerAPI = new TalkerAPI(window.parent);
            this._talkerAPI.addEventListener(TalkerAPI.EVENT_SCREENSHOT_SAVED, () =>
            {
                setTimeout(() =>
                {
                    if (document.getElementById("screenshotsavebutton"))
                    {
                        document.getElementById("screenshotsavebutton").style.display = "block";
                        document.getElementById("screenshotsaveloading").style.display = "none";
                        document.getElementById("patchscreenshot").src = "/thumb/hq/" + patchId + "/thumb.webp?rnd=" + Math.random();
                    }
                }, 500);
            });
        }

        this._licences = [
            "cc-by",
            "cc-by-sa",
            "cc-by-nd",
            "cc-by-nc",
            "cc-by-nc-sa",
            "cc-by-nc-nd",
            "cc0",
            "none",
            "copyright"
        ];

        const infoTab = document.getElementById("tab_info");
        const basicsTab = document.getElementById("tab_basics");
        const userTab = document.getElementById("tab_users");

        if (infoTab)
        {
            api.get("projectinfo/" + this._shortId, (res) =>
            {
                const project = res.data.info.project;
                const user = res.data.info.user;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": user, "displayedDate": "updated" });
                src_client.setHandleBarHtml("project", { "project": project, "projectInfo": projectInfo }, infoTab);
            }, () => {});
        }

        if (basicsTab)
        {
            const autoSuggestTags = basicsTab.querySelectorAll("#settings_tags");
            const autoSuggestNamespace = basicsTab.querySelectorAll("#settings_namespace");
            src_client.initializeAutosuggestsFromApi(autoSuggestTags, { "append": true, "minLength": 3 });
            src_client.initializeAutosuggestsFromApi(autoSuggestNamespace);
        }

        if (userTab)
        {
            const autoSuggests = userTab.querySelectorAll("[data-autosuggest]");
            src_client.initializeAutosuggestsFromApi(autoSuggests);
        }

        const tabs = ele.byQueryAll("ul.tab-bar li");
        tabs.forEach((t) =>
        {
            t.addEventListener("activated", () =>
            {
                this.show(t);
            });
        });
    }

    delete(button)
    {
        src_client.buttons.startSavingAnimButton(button);
        const patchId = this._id;
        if (this._talkerAPI) this._talkerAPI.send(TalkerAPI.CMD_UI_SET_SAVED_STATE, { "state": true });

        api.delete("project/" + patchId, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton(button);
            if (window.top)
            {
                window.top.location.href = "/mypatches";
                return false;
            }
            else
            {
                document.location.href = "/mypatches";
                return false;
            }
        }, (err) =>
        {
            src_client.buttons.stopSavingAnimButton(button, true, true);
            console.error("failed to delete patch", err);
        });
    }

    showError(errors)
    {
        let msg = "";
        for (let i = 0; i < errors.length; i++)
        {
            msg += "<li>" + errors[i] + "</li>";
        }
        let html = "<ul>" + msg + "</ul>";

        const errorEle = ele.byId("errors");
        if (errorEle)
        {
            errorEle.innerHTML = html;
            ele.show(errorEle);
        }
    }

    _saveSettings(data, options)
    {
        options = options || {};

        api.put(
            "patch/settings/" + this._id,
            {
                "data": data,
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                if (!res.success)
                {
                    if (res.msg === "CANNOT_PUBLISH")
                        if (options.cbSuccess)
                            options.cbSuccess(res.data);

                    if (options.cbFail) options.cbFail(res);
                    this.showError(res.data.errors);
                }
                else
                {
                    ele.hide(ele.byId("errors"));
                    ele.byId("unsaved").classList.add("hidden");
                    if (res.data && res.data.visibility)
                    {
                        const visibilityInfos = ele.byQueryAll(".highlightBlock.visibility");
                        visibilityInfos.forEach((visibilityInfo) => { ele.hide(visibilityInfo); });
                        const newVisibilityInfo = ele.byQuery(".highlightBlock.visibility." + res.data.visibility);
                        if (newVisibilityInfo) ele.show(newVisibilityInfo);
                        if (options.cbSuccess) options.cbSuccess(res);
                    }
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                ele.byId("settingssavebutton").innerText = "something went wrong: " + res.msg;
            }
        );
    }

    setLicence(licence, visibility)
    {
        if (visibility === "public" && licence === "none") return this.showError(["unable to remove licence from public patch"]);
        if (!this._licences.includes(licence)) return this.showError(["unknown licence"]);

        ele.byQueryAll(".radiodiv").forEach((e) =>
        {
            e.classList.remove("radiodiv_checked");
        });

        ele.byId("patch-licence-" + licence).classList.add("radiodiv_checked");
        ele.byId("unsaved").classList.remove("hidden");
    }

    toggleManualScreenshot()
    {
        api.put("patch/settings/" + this._id + "/toggleScreenshot/", {}, (r) =>
        {
            if (this._talkerAPI) this._talkerAPI.send(TalkerAPI.CMD_UI_SETTING_MANUAL_SCREENSHOT, { "manualScreenshot": r.manualScreenshot });
            document.location.reload();
        });
    }

    createScreenshot()
    {
        if (this._talkerAPI) this._talkerAPI.send(TalkerAPI.CMD_UI_SETTING_MANUAL_SCREENSHOT, { "manualScreenshot": true });

        const saveButton = document.getElementById("screenshotsavebutton");
        if (saveButton) saveButton.style.display = "none";
        const saveLoading = document.getElementById("screenshotsaveloading");
        if (saveLoading) saveLoading.style.display = "block";
    }

    updateSetting(ids, doScreenshotOnSuccess = false)
    {
        let data = {};

        for (let i = 0; i < ids.length; i++)
        {
            const id = ids[i];
            const prop = ele.byId(id).dataset.property;
            let v = ele.byId(id).value;

            if (ele.byId(id).getAttribute("type") === "checkbox") v = document.getElementById(id).checked;
            data[prop] = v;
        }

        const licencesEle = ele.byId("patchLicences");
        const checkedLicenceEle = licencesEle.querySelector(".radiodiv_checked");
        data.licence = checkedLicenceEle.dataset.value;

        this._saveSettings(data,
            {
                "cbSuccess": () =>
                {
                    if (this._talkerAPI)
                    {
                        this._talkerAPI.send(TalkerAPI.CMD_UI_NOTIFY, { "msg": "Settings Saved" });
                        if (data.hasOwnProperty("name"))
                        {
                            this._talkerAPI.send(TalkerAPI.CMD_UI_UPDATE_PATCH_NAME, { "name": data.name });
                        }
                        if (doScreenshotOnSuccess)
                        {
                            this._talkerAPI.createScreenshot();
                        }
                    }
                }
            });
    }

    removeUser(uid)
    {
        api.delete("project/" + this._id + "/user/" + uid, {}, () =>
        {
            document.location.reload();
        });
    }

    makeOwner(uid)
    {
        api.put("project/" + this._id + "/owner/" + uid, {}, () =>
        {
            document.location.reload();
        });
    }

    addUser(username)
    {
        if (username.length < 2) return this.showError(["username to short"]);
        api.put("project/" + this._id + "/username/" + username, {}, () =>
        {
            document.location.reload();
        }, () =>
        {
            this.showError(["Username unknown"]);
        });
    }

    inviteUser(username, fullAccess = "true")
    {
        let readOnly = (fullAccess !== "true");
        if (username.length < 2) return this.showError(["username to short"]);
        api.put("patchinvite/" + this._id + "/username/" + username, { "readOnly": readOnly }, () =>
        {
            src_client.buttons.stopSavingAnimButton();
            document.location.reload();
        }, (error) =>
        {
            src_client.buttons.stopSavingAnimButton();
            let errorString = "invitation not possible";
            if (error.msg)
            {
                errorString += ": \"" + error.msg + "\"";
            }
            this.showError([errorString]);
        });
    }

    revokeInvitation(invitationId)
    {
        api.delete("patchinvite/" + invitationId, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton();
            document.location.reload();
        }, (error) =>
        {
            src_client.buttons.stopSavingAnimButton();
            let errorString = "revocation not possible";
            if (error.msg)
            {
                errorString += ": \"" + error.msg + "\"";
            }
            this.showError([errorString]);
        });
    }

    addTeam(teamId)
    {
        if (teamId)
        {
            api.post("teams/" + teamId + "/projects/" + this._id, {}, () =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton();
                this.showError(["Error adding team: " + e.msg]);
            });
        }
        else
        {
            src_client.buttons.stopSavingAnimButton();
            this.showError(["Unknown team or insufficient permissions"]);
        }
    }

    removeTeam(teamId)
    {
        const url = "teams/" + teamId + "/projects/" + this._id;
        api.delete(url, {}, () =>
        {
            document.location.reload();
        }, (e) =>
        {
            this.showError(["error removing team: " + e.msg]);
        });
    }

    show(tabEle, fromUserInteraction = false)
    {
        ele.hide(ele.byId("errors"));
        const tab = tabEle.dataset.tabName;
        if (tab === "delete")
        {
            const opDepsContainer = ele.byId("opdependencies");
            const patchDepsContainer = ele.byId("patchdependencies");

            const containerEle = ele.byId("tab_delete");
            const headline = containerEle.querySelector(".text");
            headline.innerText = "Delete";
            ele.hide(opDepsContainer);
            ele.hide(patchDepsContainer);
            ele.hide(ele.byId("deletepatch"));

            const loadingEle = containerEle.querySelector(".checkDelete");
            const confirmEle = ele.byId("deletepatch");
            const checkError = confirmEle.querySelector(".checkDepsError");
            ele.hide(checkError);

            if (loadingEle) ele.show(loadingEle);
            const doneCallback = (err, result) =>
            {
                if (loadingEle) ele.hide(loadingEle);

                let deps = {};
                if (!err && result)
                {
                    deps = result.data;
                }
                else
                {
                    ele.show(checkError);
                }

                let allowDelete = true;
                if (deps.ops > 0 || deps.projects > 1)
                {
                    const opDeps = opDepsContainer.querySelector(".ops");
                    ele.show(opDeps);
                    let html = "Assets of this patch are used in ";
                    if (deps.projects > 1)
                    {
                        html += (deps.projects - 1) + " other patch";
                        if (deps.projects > 2) html += "es";
                        if (deps.ops > 0) html += " and ";
                    }
                    if (deps.ops > 0)
                    {
                        html += (deps.ops) + " op";
                        if (deps.ops > 1) html += "s";
                    }
                    html += "! Check them before deleting the patch:<br/><br/><ul>";
                    deps.usedAssets.forEach((usedAsset) =>
                    {
                        html += "<li><a href='/asset/patches/?filename=/assets/" + this._id + "/" + usedAsset + "'>" + usedAsset + "</a></li>";
                    });
                    html += "</ul>";
                    opDeps.querySelector(".text").innerHTML = html;
                    allowDelete = deps.ops < 1;
                    ele.show(opDepsContainer);
                }
                if (allowDelete)
                {
                    ele.show(confirmEle);
                }
                else
                {
                    headline.innerText = "Patch cannot be deleted!";
                    ele.hide(confirmEle);
                }
            };
            api.get("assets/dependencies/count/" + this._id, (result) =>
            {
                doneCallback(null, result);
            }, (e) =>
            {
                doneCallback(e, null);
            });
        }
    }

    setPatchPermissions(value, userId, cb = false)
    {
        let fullAccess = (value === "fullAccess");
        api.put("project/" + this._id + "/" + userId + "/permissions/write/" + fullAccess, {}, () =>
        {
            if (cb) cb();
            else document.location.reload();
        });
    }

    getBackupsTable(targetElement)
    {
        src_client.projects.getBackupsTable("project/" + this._id + "/backups", targetElement, false, "bottom");
    }

    requestPatchAccess(projectId, permission = "read")
    {
        src_client.projects.requestAccess(projectId, permission, (result) =>
        {
            ele.hide(ele.byId("request-access-button"));
            ele.show(ele.byId("request-pending-text"));
        });
    }

}

;// CONCATENATED MODULE: ./src_client/pages/page_changelog.js




class PageChangelog
{
    constructor(targetElement)
    {
        const url = new URL(window.location.href);
        const limit = url.searchParams.get("l") || 3;
        const offset = url.searchParams.get("o");
        let pagination = targetElement.dataset.pagination;
        pagination = src_client.parseDustJson(pagination, {});

        src_client.tabs.initPagination(ele.byQuery(".changelogPagination"), pagination, limit, offset, (newLimit, newOffset) =>
        {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("l", newLimit);
            searchParams.set("o", newOffset);
            window.location.search = searchParams.toString();
        });
    }

    deleteEntry(targetElement)
    {
        if (!targetElement) return;
        const ts = targetElement.dataset.ts;
        if (!ts) return;
        api.delete("admin/changelog/" + ts, {}, (res) =>
        {
            window.location.reload();
        }, (err) =>
        {
            targetElement.innerText = err.msg ? err.msg : err;
            console.log("ERROR DELETING", targetElement.dataset.ts, err);
        });
    }

}

;// CONCATENATED MODULE: ./src_client/pages/tests/page_test.js




class PageTest
{
    constructor(targetElement)
    {

        this._currentProjectId = targetElement.dataset.projectid;
        let categories = targetElement.dataset.categories || "";
        categories = src_client.parseDustJson(categories, []);
        this.initCategories(ele.byId("categoriesContainer"), categories, this._currentProjectId);
    }

    initCategories(containerElement, categories, projectId = null)
    {
        src_client.setHandleBarHtml("test_categories", { "categories": categories }, containerElement);
        const categoryTabs = ele.byQueryAll("#categories li");
        const firstTab = categoryTabs[0];

        categoryTabs.forEach((categoryTab) =>
        {
            categoryTab.addEventListener("click", () =>
            {
                this._setCategoryTab(categoryTab, 10, 0);
            });
        });

        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 10;
        let offset = url.searchParams.get("o") || 0;
        if (firstTab) this._setCategoryTab(firstTab, limit, offset);
    }

    _setCategoryTab(currentTab, limit, offset)
    {
        const loadingIndicator = ele.byId("loading");
        const resultContainer = ele.byId("testresults");
        resultContainer.innerText = "";
        if (loadingIndicator) ele.show(loadingIndicator);

        let currentCat = currentTab.dataset.category;
        ele.byQueryAll("#categories li").forEach((tab) => { return tab.classList.remove("active"); });
        currentTab.classList.add("active");

        api.post("test/category/results?l=" + limit + "&o=" + offset, {
            "projectId": this._currentProjectId,
            "category": currentCat
        }, (result) =>
        {
            if (loadingIndicator) ele.hide(loadingIndicator);
            if (result.data && Array.isArray(result.data))
            {
                let html = "<table>";
                result.data.forEach((testResult) =>
                {
                    html += src_client.getHandleBarHtml("test_runrow", testResult);
                });
                resultContainer.innerHTML = html + "</table>";
            }

            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("pagination"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    this._setCategoryTab(currentTab, newLimit, newOffset);
                });
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/tests/page_tests.js




class PageTests
{
    constructor(_targetElement)
    {
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 20;
        let offset = url.searchParams.get("o") || 0;

        ele.clickables(ele.byId("lists"), ".button", (e, dataSet) =>
        {
            if (dataSet && dataSet.id) window.location.href = "/patchlist/" + dataSet.id;
        });

        const resultContainer = ele.byId("runcontainer");
        const apiUrl = src_client.tabs.addPagination("test/runs", limit, offset);
        api.get(apiUrl, (result) =>
        {
            if (result.data && Array.isArray(result.data))
            {
                let html = "<table>";
                result.data.forEach((testRun) =>
                {
                    testRun.showProjectLink = true;
                    html += src_client.getHandleBarHtml("test_runrow", testRun);
                });
                resultContainer.innerHTML = html + "</table>";
            }
            src_client.tabs.initPagination(resultContainer, result.pagination, limit, offset);
        }, () => {});
    }
}

;// CONCATENATED MODULE: ./src_client/pages/tests/page_test_run.js




class PageTestRun
{
    constructor(targetElement)
    {
        let runId = targetElement.dataset.run;
        const loadingIndicator = ele.byId("loading");
        const runResultEl = ele.byId("run_results");

        if (loadingIndicator) ele.show(loadingIndicator);

        api.post("test/run/category/results", {
            "run": runId,
        }, (result) =>
        {
            if (loadingIndicator) ele.hide(loadingIndicator);
            if (result.data && Array.isArray(result.data))
            {
                const allEl = ele.byId("all");
                const failedEl = ele.byId("failed");
                const passedEl = ele.byId("passed");
                const errorEl = ele.byId("error");

                let passed = result.data.length;
                result.data.forEach((testResult) =>
                {
                    testResult.hideRunButton = true;
                    testResult.showTestInfo = true;
                    const rowHtml = src_client.getHandleBarHtml("test_resultrow", testResult);
                    allEl.innerHTML += rowHtml;
                    if (testResult.status === "passed")
                    {
                        passed--;
                        passedEl.innerHTML += rowHtml;
                    }
                    else if (testResult.status === "failed")
                    {
                        failedEl.innerHTML += rowHtml;
                    }
                    else if (testResult.status === "error")
                    {
                        errorEl.innerHTML += rowHtml;
                    }
                });
                if (runResultEl)
                {
                    runResultEl.innerText = " - " + passed + "/" + result.data.length;
                    ele.show(runResultEl);
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/tests/page_test_result.js


class PageTestResult extends PageTest {}

;// CONCATENATED MODULE: ./src_client/pages/user/page_activityfeed.js




class PageActivityFeed
{
    constructor(targetElement)
    {
        this._webpush = {
            "WEBPUSH_WORKER": "/webpush_worker.js",
            "publicKey": targetElement.dataset.webpushkey,
            "forceHideRegisterButton": targetElement.dataset.forcehideregisterbutton
        };

        document.addEventListener("visibilitychange", (event) =>
        {
            if (document.visibilityState === "visible")
            {
                this.displayMyFeed(ele.byId("activityFeed"), false);
            }
        });
    }

    displayMyFeed(targetEl, fromUserInteraction)
    {
        const feedTarget = targetEl || ele.byId("activityFeed");
        api.get("activityfeed/myfeed?pushConfig=true", (result) =>
        {
            const data = result.data;
            const entries = data.entries;
            const serverSubscriptions = data.webpushSubscriptions;

            src_client.getServiceWorkerSubscription(this._webpush.WEBPUSH_WORKER, (err, sub) =>
            {
                let showRegisterButton = false;
                if (!err)
                {
                    if (sub)
                    {
                        if (serverSubscriptions && !serverSubscriptions.find((ws) => { return ws.deviceId === sub.endpoint; }))
                        {
                            if (!this._webpush.forceHideRegisterButton) showRegisterButton = true;
                            // cleanup orphaned subscription deleted on other device
                            src_client.unregisterWebPushWorker(this._webpush.WEBPUSH_WORKER);
                        }
                    }
                    else
                    {
                        if (window.Notification && window.Notification.permission === "denied")
                        {
                            if (!this._webpush.forceHideRegisterButton) showRegisterButton = false;
                        }
                        else
                        {
                            if (!this._webpush.forceHideRegisterButton) showRegisterButton = true;
                        }
                    }
                }

                for (let i = 0; i < entries.length; i++)
                {
                    const entry = entries[i];
                    if (entry.displayActions && entry.displayActions.length > 3)
                    {
                        const allActions = entry.displayActions;
                        const buttons = allActions.slice(0, 3);
                        const menuItems = allActions.slice(3);
                        entry.displayActions = buttons;
                        entry.menuItems = menuItems;
                    }
                    entry.thumbFormat = "projectThumb";
                    if (["TeamInvite", "Membership"].includes(entry.topic)) entry.thumbFormat = "team-container";
                }

                if (feedTarget)
                {
                    src_client.setHandleBarHtml("activityfeed", {
                        "entries": entries,
                        "retentionDate": data.retentionDate,
                        "showRegisterButton": showRegisterButton,
                        "count": entries.length,
                        "states": data.states
                    }, feedTarget);

                    const allFilters = feedTarget.querySelectorAll(".filters .feedfilter");
                    allFilters.forEach((filter) =>
                    {
                        filter.addEventListener("click", () =>
                        {
                            const filterState = filter.dataset.filter;
                            allFilters.forEach((f) =>
                            {
                                f.classList.remove("active");
                            });
                            filter.classList.add("active");
                            feedTarget.querySelectorAll(".activityFeedEntry").forEach((item) =>
                            {
                                if (filterState === "all" || item.classList.contains(filterState))
                                {
                                    ele.show(item);
                                }
                                else
                                {
                                    ele.hide(item);
                                }
                            });
                        });
                    });

                    src_client.activityFeed.registerActionListeners(feedTarget);
                }
            });
        });
    }

    registerDevice(button)
    {
        const errorEle = ele.byId("adddevice-error");
        if (errorEle) ele.hide(errorEle);
        src_client.buttons.startSavingAnimButton(button);
        src_client.registerWebPushWorker(this._webpush.WEBPUSH_WORKER, this._webpush.publicKey, (err, sub) =>
        {
            if (!err)
            {
                src_client.buttons.stopSavingAnimButton(button);
                let body = [];
                ["PatchInvite", "TeamInvite", "Membership"].forEach((topic) =>
                {
                    let browserName = "Unknown Browser";
                    if (platform) browserName = platform.name + " (" + platform.os.family + ")";
                    const data = {
                        "topic": topic,
                        "channel": "webpush",
                        "scope": "all",
                        "deviceId": sub.endpoint,
                        "deviceName": browserName
                    };
                    data.subscriptionData = sub;
                    body.push(data);
                });
                api.patch("activityfeed/subscriptions", body, () =>
                {
                    if (button) ele.hide(button);
                });
            }
            else
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
                if (errorEle)
                {
                    const errorMsg = errorEle.querySelector(".msg");
                    errorMsg.innerText = err + ": " + sub;
                    ele.show(errorEle);
                    if (button) ele.hide(button);
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/user/page_myfavs.js




class PageMyFavs
{
    constructor(targetElement)
    {
        this.getMyFavs();
    }

    getMyFavs(filter)
    {
        api.get("myfavs", (result) =>
        {
            let html = "";
            for (const i in result)
            {
                const project = result[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername } });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            ele.byId("myfavs").innerHTML = html;
        });
    }
}


;// CONCATENATED MODULE: ./src_client/pages/user/page_mypatches.js




class PageMyPatches
{
    constructor(_targetElement)
    {
        this.projects = src_client.projects;

        this._settings = {
            "lastFilter": "all",
            "lastOrder": "updated"
        };

        const url = new URL(window.location.href);
        const order = url.searchParams.get("or") || "updated";
        if (order)
        {
            const orderTabs = ele.byQueryAll("#order-tab-bar li");
            orderTabs.forEach((orderTab) =>
            {
                if (orderTab.classList.contains(order)) orderTab.classList.add("active");
            });
        }
    }

    get lastFilter()
    {
        return this._settings.lastFilter;
    }

    getMyPatches(targetEl, fromUserInteraction = false)
    {
        if (typeof targetEl === "string")
        {
            const selector = ".tab-bar-content[data-tab-name=\"" + targetEl + "\"]";
            targetEl = ele.byQuery(selector);
        }
        let filter = "";
        if (window.location.hash)
        {
            filter = window.location.hash.split("#", 2)[1];
        }
        const url = new URL(window.location.href);

        filter = filter || url.searchParams.get("w") || "all";
        const order = url.searchParams.get("or") || "updated";
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");
        limit = Number(limit);
        offset = Number(offset);

        this._settings.lastFilter = filter;
        this._settings.lastOrder = order;

        let apiUrl = "mypatches?filter=" + filter + "&sort=" + order;

        if (limit || limit === 0)
        {
            apiUrl += "&l=" + limit;
        }
        if (offset)
        {
            apiUrl += "&o=" + offset;
        }
        api.get(apiUrl, (result) =>
        {
            const tagArr = this.projects.getTagsFromProjects(result);
            const tagsEle = ele.byId("tags");
            if (tagsEle)
            {
                src_client.setHandleBarHtml("tags", { "tags": tagArr }, tagsEle);
            }

            let html = "";
            html += "<div class=\"row\">";
            for (const i in result.patches)
            {
                const project = result.patches[i];
                let displayedDate = "updated";
                if (order === "created") displayedDate = "created";
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": displayedDate });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            html += "</div>";
            targetEl.innerHTML = html;
            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("my-projects"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    this.setUrl(filter, order, newLimit, newOffset);
                });
            }
        });
    }

    setUrl(filter, order, limit, offset)
    {
        let newSearch = "";
        if (order)
        {
            newSearch += newSearch ? "&" : "?";
            newSearch += "or=" + order;
        }
        if (limit || limit === 0)
        {
            newSearch += newSearch ? "&" : "?";
            newSearch += "l=" + limit;
        }
        if (offset)
        {
            newSearch += newSearch ? "&" : "?";
            newSearch += "o=" + offset;
        }
        window.location.search = newSearch;
        history.pushState(null, null, "#" + filter);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/user/page_settings_mydata.js




class PageMyData
{
    constructor(targetElement)
    {
        this._files = null;

        const tabs = targetElement.querySelectorAll("ul.tab-bar li");
        tabs.forEach((tab) =>
        {
            tab.addEventListener("activated", (e) =>
            {
                if (e.detail && e.detail.fromUserInteraction)
                {
                    window.history.propertyIsEnumerable(null, "", window.location.pathname + window.location.hash);
                }
            });
        });
    }

    getPatchStorageTable(targetElement)
    {
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("pl") || 20;
        let offset = url.searchParams.get("po") || 0;

        const apiUrl = src_client.tabs.addPagination("mydata/patchassets", limit, offset);
        api.get(apiUrl, (res) =>
        {
            if (res && res.data)
            {
                src_client.setHandleBarHtml("settings_mydata_patches", { "patches": res.data }, targetElement);
                src_client.tabs.initPagination(targetElement, res.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "?pl=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&po=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + window.location.hash;
                });
            }
        });
    }

    getAssetStorageTable(targetElement)
    {
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("al") || 20;
        let offset = url.searchParams.get("ao") || 0;

        const apiUrl = src_client.tabs.addPagination("mydata/assets", limit, offset);
        api.get(apiUrl, (res) =>
        {
            if (res && res.data)
            {
                src_client.setHandleBarHtml("settings_mydata_assets", { "assets": res.data }, targetElement);
                src_client.tabs.initPagination(targetElement, res.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "?al=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&ao=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + window.location.hash;
                });
            }
        });
    }

    getMyOpsTable(targetElement)
    {
        api.get("mydata/ops", (res) =>
        {
            if (res && res.data)
            {
                const patchesTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.patches });
                const usersTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.users });
                const teamsTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.teams });
                const extensionsTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.extensions });
                const baseTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.base });
                src_client.setHandleBarHtml("settings_mydata_ops", { "ops": res.data, patchesTable, usersTable, teamsTable, extensionsTable, baseTable }, targetElement);
                src_client.tabs.initTabs(targetElement.querySelectorAll("ul.tab-bar li"));
            }
        });
    }

    getBackupsTable(targetElement)
    {
        src_client.projects.getBackupsTable("mydata/backups", targetElement, true);
    }

    importZip()
    {
        if (this._files)
        {
            this.importProjectZip();
        }
        else
        {
            const fileElem = document.getElementById("hiddenzipElem");
            if (fileElem)
            {
                fileElem.click();
            }
        }
    }

    importProjectZip(files)
    {
        const button = ele.byId("import-zip-button");
        const resultEle = ele.byId("uploadResult");
        resultEle.classList.add("info");
        resultEle.classList.remove("error");
        resultEle.innerText = "";

        const problemsEle = ele.byId("uploadProblems");
        const filePicker = ele.byId("import-file-picker");

        ele.hide(resultEle);
        ele.hide(problemsEle);
        ele.hide(filePicker);

        let url = new URL("/api/project/import/zip", window.location.href);
        if (this._files)
        {
            files = this._files;
        }

        if (filePicker.value)
        {
            url.searchParams.append("projectFile", filePicker.value);
        }

        let formData = new FormData();
        formData.append(0, files[0]);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.onload = (e) =>
        {
            button.classList.remove("button-primary");
            if (filePicker.value) filePicker.value = "";

            let res = { };
            src_client.buttons.stopSavingAnimButton(button, true, xhr.status !== 200);

            if (xhr.status === 200)
            {
                try
                {
                    res = JSON.parse(e.target.response);
                }
                catch (ex)
                {
                    resultEle.classList.remove("info");
                    resultEle.classList.add("error");
                    resultEle.innerText = "Unknown Error - failed to parse response from server, try again.";
                    ele.show(resultEle);
                    console.error("zip upload failed", ex);
                    this._files = null;
                }

                if (res.data.projectId)
                {
                    resultEle.classList.add("info");
                    resultEle.classList.remove("error");
                    resultEle.innerHTML = "Import successful! " + "<a href=\"/edit/" + res.data.projectId + "\">Open patch</a>";
                    ele.show(resultEle);
                    const optionsEle = ele.byId("importOptions");
                    if (optionsEle) ele.hide(optionsEle);
                    this._files = null;
                    setTimeout(() =>
                    {
                        button.innerText = "Import Zip";
                    }, 500);
                }
                else
                {
                    this._files = files;
                    if (res.data.problems && Object.keys(res.data.problems).length > 0)
                    {
                        const list = problemsEle.querySelector("ul");
                        list.innerText = "";
                        Object.values(res.data.problems).forEach((text) =>
                        {
                            const item = document.createElement("li");
                            item.innerHTML = text;
                            list.appendChild(item);
                        });
                        ele.show(problemsEle);
                        if (res.data.problems.import_multiple_projects && res.data.projectFiles)
                        {
                            res.data.projectFiles.forEach((projectFile) =>
                            {
                                const option = document.createElement("option");
                                option.setAttribute("value", projectFile);
                                option.innerText = projectFile;
                                filePicker.appendChild(option);
                            });
                            ele.show(filePicker);
                        }
                        else
                        {
                            this._files = null;
                        }
                    }
                    else
                    {
                        setTimeout(() =>
                        {
                            button.classList.add("button-primary");
                            button.innerText = "OK, Import!";
                        }, 500);
                    }
                }
            }
            else
            {
                this._files = null;
                resultEle.classList.remove("info");
                resultEle.classList.add("error");
                resultEle.innerText = res.msg;
                ele.show(resultEle);
            }
        };

        src_client.buttons.startSavingAnimButton(button, "importing...");
        xhr.send(formData);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/user/page_settings_profile.js




class PageProfileSettings
{
    constructor(targetElement)
    {
        const webPushKey = targetElement.dataset.webpushkey;
        const addWebPushEl = ele.byQuery("#notificationSettings .device-sub.add");

        this._settings = {
            "WEBPUSH_WORKER": "/webpush_worker.js",
            "currentDeviceId": null,
            "publicKey": null,
            "pushBlocked": false
        };

        if (window.Notification && window.Notification.permission === "denied")
        {
            this._settings.pushBlocked = true;
            const errorEl = ele.byId("pushblocked-error");
            if (errorEl)
            {
                const errorMsg = errorEl.querySelector(".msg");
                errorMsg.innerText = "Check your browser settings, and reload this page.";
                ele.show(errorEl);
            }
        }

        this._settings.publicKey = webPushKey;
        const webPushCheckbox = ele.byQuery("#webpush_scope");
        const pushActive = ele.byQuery("#webpush_scope").checked && !this._settings.pushBlocked;
        if (addWebPushEl && pushActive) ele.hide(addWebPushEl);

        src_client.getServiceWorkerSubscription(this._settings.WEBPUSH_WORKER, (err, sub) =>
        {
            if (!err)
            {
                if (sub)
                {
                    const subEl = ele.byQuery("#notificationSettings .webpush_subscriptions .webpush_subscription[data-device-id='" + sub.endpoint + "']");
                    if (subEl)
                    {
                        subEl.classList.add("currentDevice");
                        this._settings.currentDeviceId = sub.endpoint;
                    }
                    else
                    {
                        if (addWebPushEl && pushActive) ele.show(addWebPushEl);
                    }
                }
                else
                {
                    if (addWebPushEl && pushActive) ele.show(addWebPushEl);
                }
            }
            else
            {
                if (addWebPushEl) ele.hide(addWebPushEl);
                if (err === "WEBPUSH_UNSUPPORTED")
                {
                    if (platform && platform.os && platform.os.family === "iOS" || platform.os.family === "OS X")
                    {
                        const iosHint = ele.byQuery(".webpush_subscriptions .ios-hint");
                        if (iosHint) ele.show(iosHint);
                    }
                }
            }
        });

        webPushCheckbox.addEventListener("change", () =>
        {
            const subscriptionsEle = ele.byQuery("#notificationSettings .webpush_subscriptions");
            if (subscriptionsEle)
            {
                if (webPushCheckbox.checked)
                {
                    ele.show(subscriptionsEle);
                    const subs = subscriptionsEle.querySelector(".webpush_subscription");
                    if (!subs || subs.length === 0)
                    {
                        if (addWebPushEl) ele.show(addWebPushEl);
                    }
                }
                else
                {
                    ele.hide(subscriptionsEle);
                }
            }
        });

        const saveButton = ele.byId("notificationsavebutton");
        if (saveButton)
        {
            saveButton.addEventListener("click", () =>
            {
                const errorEle = ele.byId("apisave-error");
                if (errorEle) ele.hide(errorEle);
                src_client.buttons.startSavingAnimButton(saveButton);
                const allSubscriptions = this._getSubscriptionsFromFields();
                this.saveSubscriptions(allSubscriptions, (err) =>
                {
                    if (!err)
                    {
                        src_client.buttons.stopSavingAnimButton(saveButton);
                    }
                    else
                    {
                        src_client.buttons.stopSavingAnimButton(saveButton, true, true);
                        if (errorEle)
                        {
                            const errorMsg = errorEle.querySelector(".msg");
                            errorMsg.innerText = err.msg;
                            ele.show(errorEle);
                        }
                    }
                });
            });
        }

        addWebPushEl.addEventListener("click", () =>
        {
            const errorEle = ele.byId("adddevice-error");
            if (errorEle) ele.hide(errorEle);

            const sendErrorEl = ele.byId("sendtest-error");
            if (sendErrorEl) ele.hide(sendErrorEl);

            src_client.buttons.startSavingAnimButton(addWebPushEl);
            this.registerDevice((error, deviceId, browserName, webPushSubscription) =>
            {
                if (!error)
                {
                    const subscriptions = [];
                    const data = {
                        "topic": addWebPushEl.dataset.topic,
                        "channel": addWebPushEl.dataset.channel,
                        "scope": addWebPushEl.dataset.scope,
                        "deviceId": webPushSubscription.endpoint,
                        "deviceName": browserName,
                        "subscriptionData": webPushSubscription
                    };
                    const patchSub = {
                        ...data,
                        "topic": "PatchInvite"
                    };
                    subscriptions.push(patchSub);
                    const teamSub = {
                        ...data,
                        "topic": "TeamInvite"
                    };
                    subscriptions.push(teamSub);
                    const membershipSub = {
                        ...data,
                        "topic": "Membership"
                    };
                    subscriptions.push(membershipSub);

                    this.saveSubscriptions(subscriptions, (err, r) =>
                    {
                        if (!err && r.success)
                        {
                            window.location.reload();
                        }
                        else
                        {
                            src_client.buttons.stopSavingAnimButton(addWebPushEl, true, true);
                            if (errorEle)
                            {
                                const errorMsg = errorEle.querySelector(".msg");
                                errorMsg.innerText = err.msg;
                                ele.show(errorEle);
                            }
                        }
                    });
                }
                else
                {
                    src_client.buttons.stopSavingAnimButton(addWebPushEl, true, true);
                    if (errorEle)
                    {
                        const msgEle = errorEle.querySelector(".msg");
                        if (msgEle) msgEle.innerText = error + ": " + deviceId;
                        ele.show(errorEle);
                    }
                }
            });
        });

        this.registerRemoveListeners();
        this.registerTestWebPushListeners();
    }

    saveAccount()
    {
        const saveButton = ele.byId("accountsavebutton");
        saveButton.innerText = "Working....";
        api.put(
            "user/account/",
            {
                "account_email": ele.byId("account_email").value,
                "account_newsletter": document.getElementById("account_newsletter").checked,
                "account_newsletter_meetup": document.getElementById("account_newsletter_meetup").checked,
                "account_newsletter_cologne": document.getElementById("account_newsletter_cologne").checked
            },
            (res) =>
            {
                if (!res.success)
                {
                    saveButton.innerText = "Something went wrong: " + res.msg;
                    console.log("fail ", res);
                }
                else
                {
                    setTimeout(() =>
                    {
                        saveButton.innerText = "Account updated!";
                        setTimeout(() =>
                        {
                            saveButton.innerText = "Save";
                        }, 1000);
                    }, 500);
                }
            },
            (res) =>
            {
                saveButton.innerText = "Something went wrong: " + res.msg;
                console.log("err res", res);
            }
        );
    }

    deleteAccount(id, userName)
    {
        const controlName = prompt("Please enter your username:", "");
        if (controlName && controlName === userName)
        {
            api.delete(
                "user/" + id + "?userName=" + userName,
                {},
                (res) =>
                {
                    window.location = "/logout";
                },
                (err) =>
                {
                    document.getElementById("errors_delete").innerText = "this did not work as expected...";
                });
        }
        else
        {
            document.getElementById("errors_delete").innerText = "usernames do not match...";
        }
    }

    saveProfile(saveButton)
    {
        src_client.buttons.startSavingAnimButton(saveButton);
        let website = ele.byId("profile-website").value;
        let errorEle = ele.byId("errors_links");
        if (website.length > 0)
        {
            let error = false;
            if (website.indexOf("https://") === -1 && website.indexOf("http://") === -1) error = true;
            if (website.indexOf(".") === -1) error = true;
            if (error)
            {
                errorEle.innerText = "Website invalid url";
                ele.show(errorEle);
                src_client.buttons.stopSavingAnimButton(saveButton, true, true);
                return;
            }
            else
            {
                errorEle.innerText = "";
                ele.hide(errorEle);
            }
        }
        else
        {
            ele.hide(errorEle);
        }

        api.put(
            "user/profile/",
            {
                "profile_bio": ele.byId("profile-bio").value,
                "profile_website": website,
                "profile_twitter": ele.byId("profile-twitter").value,
                "profile_facebook": ele.byId("profile-facebook").value,
                "profile_instagram": ele.byId("profile-instagram").value,
                "profile_mastodon": ele.byId("profile-mastodon").value,
                "profile_country": ele.byId("profile-country").value,
                "profile_city": ele.byId("profile-city").value
            },
            (res) =>
            {
                ele.hide(errorEle);
                if (!res.success)
                {
                    src_client.buttons.stopSavingAnimButton(saveButton);
                    errorEle.innerText = "Something went wrong!";
                    ele.show(errorEle);
                }
                else
                {
                    setTimeout(() =>
                    {
                        src_client.buttons.stopSavingAnimButton(saveButton);
                        saveButton.innerText = "Profile saved!";

                        setTimeout(() =>
                        {
                            saveButton.innerText = "Save again";
                        }, 3000);
                    }, 500);
                }
            },
            (res) =>
            {
                errorEle.innerText = "Something went wrong: " + res.msg;
                ele.show(errorEle);
                src_client.buttons.stopSavingAnimButton(saveButton, true, true);
            }
        );
    }

    savePassword()
    {
        const saveButton = ele.byId("passwordSavebutton");
        saveButton.classList.remove("buttonSavingError");
        saveButton.innerText = "Working....";

        api.put(
            "user/password/",
            {
                "password1": ele.byId("password1").value,
                "password2": ele.byId("password2").value
            },
            (res) =>
            {
                saveButton.classList.remove("buttonSavingError");
                if (!res.success)
                {
                    console.log("fail ", res);
                }
                else
                {
                    setTimeout(() =>
                    {
                        saveButton.innerText = "Password changed!";

                        setTimeout(() =>
                        {
                            saveButton.innerText = "Set password";
                        }, 3000);
                    }, 500);
                }
            },
            (res) =>
            {
                saveButton.classList.add("buttonSavingError");
                if (res.msg) saveButton.innerText = res.msg;
                else saveButton.innerText = "Something went wrong";
                console.log("err res", res);

                setTimeout(() =>
                {
                    saveButton.innerText = "Set password";
                    saveButton.classList.remove("buttonSavingError");
                }, 3000);
            }
        );
    }

    registerDevice(cb = null)
    {
        src_client.registerWebPushWorker(this._settings.WEBPUSH_WORKER, this._settings.publicKey, (err, webPushSubscription) =>
        {
            if (!err)
            {
                this._settings.currentDeviceId = webPushSubscription.endpoint;
                let browserName = "Unknown Browser";
                if (platform) browserName = platform.name + " " + platform.os.family;
                if (cb) cb(null, this._settings.currentDeviceId, browserName, webPushSubscription);
            }
            else
            {
                if (cb) cb(err, webPushSubscription);
            }
        });
    }

    saveSubscriptions(subscriptions, cb = null)
    {
        let body = [];
        subscriptions.forEach((subscription) =>
        {
            const data = {
                "topic": subscription.topic,
                "channel": subscription.channel,
                "scope": subscription.scope,
                "deviceId": subscription.deviceId,
                "deviceName": subscription.deviceName || subscription.deviceId,
                "subscriptionData": subscription.subscriptionData
            };
            body.push(data);
        });

        api.patch("activityfeed/subscriptions", body, (res) =>
        {
            if (cb) cb(null, res);
        }, (e) =>
        {
            if (cb) cb(e);
        });
    }

    _getSubscriptionsFromFields()
    {
        const allSubscriptionEles = ele.byQueryAll("#notificationSettings .subscription");
        const allSubscriptions = [];
        let pushActive = true;
        allSubscriptionEles.forEach((subEle) =>
        {
            let data = { ...subEle.dataset };
            const disable = !subEle.checked;
            if (disable) data.scope = "none";
            if (data.channel === "webpush" && subEle.type === "checkbox")
            {
                pushActive = subEle.checked;
            }
            else
            {
                if (data.channel === "webpush")
                {
                    data = {
                        ...data,
                        "scope": pushActive ? subEle.dataset.scope : "none"
                    };
                }

                if (subEle.dataset.topic === "InvitesAndRequests")
                {
                    const patchSub = {
                        ...data,
                        "topic": "PatchInvite"
                    };
                    allSubscriptions.push(patchSub);
                    const teamSub = {
                        ...data,
                        "topic": "TeamInvite"
                    };
                    allSubscriptions.push(teamSub);
                    const membershipSub = {
                        ...data,
                        "topic": "Membership"
                    };
                    allSubscriptions.push(membershipSub);
                }
                else
                {
                    allSubscriptions.push(data);
                }
            }
        });
        return allSubscriptions;
    }

    unregisterDevice(cb = null)
    {
        src_client.unregisterWebPushWorker(this._settings.WEBPUSH_WORKER, (unsubErr) =>
        {
            if (!unsubErr)
            {
                if (cb) cb();
            }
            else
            {
                if (cb) cb("NOT_SUBSCRIBED");
            }
        });
    }

    registerTestWebPushListeners()
    {
        const testWebPushEles = ele.byQueryAll("#notificationSettings .webpush_subscriptions .sendTestNotification");
        testWebPushEles.forEach((testWebPushEle) =>
        {
            const clickListener = () =>
            {
                const errorEl = ele.byId("sendtest-error");
                if (errorEl) ele.hide(errorEl);
                src_client.buttons.startSavingAnimButton(testWebPushEle, "");
                const subEle = testWebPushEle.closest(".webpush_subscription");
                if (subEle)
                {
                    const subId = subEle.dataset.subscriptionId;
                    this.sendWebPushTest(subId, (err, r) =>
                    {
                        if (err)
                        {
                            src_client.buttons.stopSavingAnimButton(testWebPushEle, true, true);
                            if (errorEl)
                            {
                                const errorMsg = errorEl.querySelector(".msg");
                                if (errorMsg)
                                {
                                    errorMsg.innerText = err.msg;
                                    if (err.msg && (err.msg === "DEVICE_TOKEN_UNSUBSCRIBED" || err.msg === "WEBPUSH_NO_ENDPOINT"))
                                    {
                                        errorMsg.innerHTML += "<br/>We removed your expired subscription, please add the device again!";
                                        subEle.remove();
                                    }
                                    ele.show(errorEl);
                                }
                            }
                        }
                        else
                        {
                            src_client.buttons.stopSavingAnimButton(testWebPushEle, true);
                        }
                    });
                }
            };
            testWebPushEle.removeEventListener("click", clickListener);
            testWebPushEle.addEventListener("click", clickListener);
        });
    }

    sendWebPushTest(subId, cb)
    {
        if (subId)
        {
            api.post("activityfeed/" + subId, {}, (r) =>
            {
                cb(null, r);
            }, (e) =>
            {
                cb(e, e);
            });
        }
    }

    registerRemoveListeners()
    {
        const removeWebPushEles = ele.byQueryAll("#notificationSettings .webpush_subscriptions .device-sub.remove");
        removeWebPushEles.forEach((removeWebPushEle) =>
        {
            const clickListener = () =>
            {
                const errorEle = ele.byId("apisave-error");
                if (errorEle) ele.hide(errorEle);
                const subEle = removeWebPushEle.closest(".webpush_subscription");
                if (subEle)
                {
                    if (subEle.classList.contains("currentDevice"))
                    {
                        this.unregisterDevice(() =>
                        {
                            const addWebPushEl = ele.byQuery("#notificationSettings .device-sub.add");
                            if (addWebPushEl) ele.show(addWebPushEl);
                        });
                    }
                    subEle.dataset.scope = "delete";
                    ele.hide(subEle);
                    const subscriptionEles = ele.byQueryAll("#notificationSettings .webpush_subscription:not(.hidden)");
                    if (subscriptionEles.length === 0)
                    {
                        const dndHint = ele.byId("dndHint");
                        if (dndHint) ele.hide(dndHint);
                    }
                    const allSubscriptions = this._getSubscriptionsFromFields();
                    this.saveSubscriptions(allSubscriptions, (err) =>
                    {
                        if (err)
                        {
                            if (errorEle)
                            {
                                const errorMsg = errorEle.querySelector(".msg");
                                errorMsg.innerText = err.msg;
                                ele.show(errorEle);
                            }
                        }
                    });
                }
            };
            removeWebPushEle.removeEventListener("click", clickListener);
            removeWebPushEle.addEventListener("click", clickListener);
        });
    }

    deleteApikey(key)
    {
        const errorEl = ele.byId("errors_apikey");
        if (errorEl) ele.hide(errorEl);
        if (confirm("Really delete ?"))
        {
            api.delete(
                "apikey",
                { "key": key },
                (res) =>
                {
                    document.location.reload();
                },
                (res) =>
                {
                    if (errorEl)
                    {
                        const msg = errorEl.querySelector(".msg");
                        if (msg) msg.innerText = res.msg;
                        ele.show(errorEl);
                    }
                }
            );
        }
    }

    createApikey()
    {
        const comment = document.getElementById("apikey-comment").value;
        api.post(
            "apikey",
            { "comment": comment },
            (res) =>
            {
                document.location.reload();
            });
    }

    changeAvatar()
    {
        const id = ele.byId("avatarselect").value;

        api.post(
            "settings/profilePatch/",
            { "id": id },
            (res) =>
            {

            },
            (res) =>
            {

            }
        );
    }

    sendConfirmationEMail()
    {
        document.getElementById("settings_emailconfirm").innerHTML = "<i class=\"icon icon-loader\"></i>";

        api.get("settings/sendConfirmation", (result) =>
        {
            let msg = "an error occured, try again later.";
            if (result.success) msg = "confirmation email sent. check your inbox";
            document.getElementById("settings_emailconfirm").innerText = msg;
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/user/page_user.js





class PageUser
{
    constructor(targetElement)
    {
        // (targetEl, userId, username, avatarId, sandboxUrl)
        const userId = targetElement.dataset.userid;
        const username = targetElement.dataset.username;
        const avatarId = targetElement.dataset.avatarid;
        const sandboxUrl = targetElement.dataset.sandboxurl;

        this.projects = src_client.projects;
        this.patchLists = new PatchLists();

        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");

        if (avatarId)
        {
            src_client.embedPatch({
                "projectId": avatarId,
                "elementId": "canvascontainer",
                "sandboxUrl": sandboxUrl
            }, (error) =>
            {
                const errorEl = document.getElementById("errorEl");
                const canvasContainer = document.getElementById("canvascontainer");
                if (canvasContainer) canvasContainer.style.display = "none";
                if (errorEl)
                {
                    errorEl.style.display = "block";
                    const msg = errorEl.querySelector(".errorMessage");
                    msg.innerText = error.msg;
                }
            });
        }

        ele.byId("nav-bar").style.marginBottom = "0";
        this.projects.getUserProjects(userId, false, limit, offset);

        let followBtn = document.getElementById("follow-button");
        if (followBtn)
        {
            followBtn.addEventListener("click", (ev) =>
            {
                ev.preventDefault();
                src_client.favs.follow(userId);
            });
        }

        this.initFeaturedPatches(username);
        this.initLikedPatches(username);
    }

    initFeaturedPatches(username)
    {
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");

        ele.byId("nav-bar").style.marginBottom = "0";
        this.getUserFeatured(username, limit, offset);
    }

    initLikedPatches(username)
    {
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");

        ele.byId("nav-bar").style.marginBottom = "0";
        this.getUserLikes(username, limit, offset);
    }

    getUserFeatured(username, limit, offset = 0)
    {
        limit = Number(limit);
        offset = Number(offset);
        let url = "user/featured/" + username;
        if (limit || limit === 0)
        {
            url += "?l=" + limit;
        }
        if (offset)
        {
            url += "&o=" + offset;
        }

        api.get(url, (result) =>
        {
            let html = "";
            for (const i in result.projects)
            {
                const project = result.projects[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername } });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }

            ele.byId("featured_projects").innerHTML = html;

            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("featured_results_container"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "?l=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&o=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch;
                });
            }
        });
    }

    getUserLikes(username, limit, offset = 0)
    {
        limit = Number(limit);
        offset = Number(offset);
        let url = "user/favs/" + username;
        if (limit || limit === 0)
        {
            url += "?l=" + limit;
        }
        if (offset)
        {
            url += "&o=" + offset;
        }

        api.get(url, (result) =>
        {
            let html = "";
            for (const i in result.projects)
            {
                const project = result.projects[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername } });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            ele.byId("liked_projects").innerHTML = html;
            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("liked_results_container"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newLimit || newLimit === 0)
                    {
                        newSearch += "?l=" + newLimit;
                    }
                    if (newOffset)
                    {
                        newSearch += "&o=" + newOffset;
                    }
                    window.location = location.origin + location.pathname + newSearch + "#likes";
                });
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/teams/page_team.js




class PageTeam
{
    constructor(targetElement)
    {
        const teamId = targetElement.dataset.teamid;
        const namespacesJson = targetElement.dataset.namespacesjson;
        const extensionsJson = targetElement.dataset.extensionsjson;

        this.getTeamProjects(teamId, "teamProjects");
        this.getTeamPatchLists(teamId, ele.byId("teamPatchLists"));

        const namespaces = src_client.parseDustJson(namespacesJson, []);
        const extensions = src_client.parseDustJson(extensionsJson, []);

        this.getTeamNamespaceOps(namespaces, ele.byId("teamNamespaces"));
        this.getTeamExtensionOps(extensions, ele.byId("teamExtensions"));
    }

    requestTeamAccess(teamId, permission = false)
    {
        const data = {};
        if (permission) data.permission = permission;

        api.post("teaminvites/request/" + teamId, data, (result) =>
        {
            ele.hide(ele.byId("request-access-button"));
            ele.show(ele.byId("request-pending-text"));
        });
    }

    joinTeam(teamId, permission = false)
    {
        const data = {};
        if (permission) data.permission = permission;

        const joinButton = ele.byId("join-team-button");
        src_client.buttons.startSavingAnimButton(joinButton);
        api.post("teams/join/" + teamId, data, (result) =>
        {
            if (result.success)
            {
                window.location.reload();
            }
        }, (err) =>
        {
            src_client.buttons.stopSavingAnimButton();
        });
    }

    leaveTeam(teamId)
    {
        const data = {};
        const joinButton = ele.byId("leave-team-button");
        src_client.buttons.startSavingAnimButton(joinButton);
        api.post("teams/leave/" + teamId, data, (result) =>
        {
            if (result.success)
            {
                window.location.href = "/myteams";
            }
        }, (err) =>
        {
            src_client.buttons.stopSavingAnimButton();
        });
    }

    _getOpsList(cssClass, ops, headlineIcon = null)
    {
        const deprecatedNs = ".Deprecated";
        let html = "";
        // if (ops.length > 0)
        {
            const splitNamespaces = {};
            ops.forEach((op) =>
            {
                let nsPath = op.name.substr(0, op.name.lastIndexOf("." + op.shortName));
                if (nsPath.endsWith(deprecatedNs)) nsPath = op.name.substr(0, op.name.lastIndexOf(deprecatedNs));

                if (!splitNamespaces.hasOwnProperty(nsPath))
                {
                    splitNamespaces[nsPath] = {
                        "name": nsPath,
                        "ops": []
                    };
                }
                splitNamespaces[nsPath].ops.push(op);
            });

            const keys = Object.keys(splitNamespaces).sort((a, b) => { return a.localeCompare(b); });
            keys.forEach((i) =>
            {
                const splitNamespace = splitNamespaces[i];
                let headlineHtml = src_client.getHandleBarHtml("headline", { "splitter": true, "link": "/ops/" + splitNamespace.name, "icon": headlineIcon, "title": splitNamespace.name });
                html += headlineHtml + "<section class=\"project-list\"><div class=\"row\"><div class=\"cute-12-phone left cute-12-tablet center-tablet \">";

                const deprecatedOps = splitNamespace.ops.filter((op) => { return op.name.includes(deprecatedNs); });
                const visibleOps = splitNamespace.ops.filter((op) => { return !op.name.includes(deprecatedNs); });

                if (visibleOps.length)
                {
                    html += "<div class=\"row " + cssClass + " " + splitNamespace.name + "\">";
                    visibleOps.forEach((op) =>
                    {
                        html += src_client.getHandleBarHtml("projectop", op);
                    });
                    html += "</div>";
                }
                else
                {
                    html += "No ops in this namespace";
                }

                if (deprecatedOps.length)
                {
                    const optTitle = deprecatedOps.length > 1 ? "ops" : "op";
                    html += visibleOps.length === 0 ? ", but " : "+";
                    html += deprecatedOps.length + " <a href=\"/ops/" + splitNamespace.name + "\">deprecated " + optTitle + "</a>";
                }
                html += "</div></div></section>";
            });
        }
        return html;
    }

    getTeamNamespaceOps(namespaces, targetEl)
    {
        if (!namespaces || !targetEl || namespaces.length === 0) return;

        namespaces.forEach((namespace) =>
        {
            let url = "teams/namespace/" + namespace + "/ops?deprecated=true";
            let html = "";
            api.get(url, (result) =>
            {
                html = this._getOpsList("teamNamespaceOps", result.data.ops);
                targetEl.innerHTML += html;
            }, (e) =>
            {
                html += "<div class=\"emptyState cute-12-phone left cute-12-tablet center-tablet\"><h3><span class=\"icon icon-alert-triangle icon-warning icon-near-text left\"></span>Error while getting namespace ops!</h3><br/></div>";
                html += "</div></div></section></div>";
                targetEl.innerHTML += html;
            });
        });
    }

    getTeamExtensionOps(namespaces, targetEl)
    {
        if (!namespaces || !targetEl || namespaces.length === 0) return;

        namespaces.forEach((namespace) =>
        {
            let url = "extension/" + namespace + "/ops?deprecated=true";
            let html = "";
            api.get(url, (result) =>
            {
                html = this._getOpsList("teamExtensionOps", result.data.ops);
                targetEl.innerHTML += html;
            }, (e) =>
            {
                html += "<div class=\"emptyState cute-12-phone left cute-12-tablet center-tablet\"><h3><span class=\"icon icon-alert-triangle icon-warning icon-near-text left\"></span>Error while getting namespace ops!</h3><br/></div>";
                html += "</div></div></section></div>";
                targetEl.innerHTML += html;
            });
        });
    }

    getTeamProjects(teamId, targetElId)
    {
        const url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");
        limit = Number(limit);
        offset = Number(offset);

        let apiUrl = "teams/" + teamId + "/projects";
        if (offset)
        {
            apiUrl += "?o=" + offset;
        }
        if (limit || limit === 0)
        {
            if (offset)
            {
                apiUrl += "&l=" + limit;
            }
            else
            {
                apiUrl += "?l=" + limit;
            }
        }

        api.get(apiUrl, (result) =>
        {
            const containerEl = ele.byId("patches");
            if (result && result.projects.length > 0) ele.show(containerEl);
            src_client.projectPagePatchList(result.projects, targetElId, "No patches found", result.pagination);
            if (result.pagination)
            {
                src_client.tabs.initPagination(containerEl, result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    let newSearch = "";
                    if (newOffset)
                    {
                        newSearch += "?o=" + newOffset;
                    }
                    if (newLimit || newLimit === 0)
                    {
                        if (newOffset)
                        {
                            newSearch += "&l=" + newLimit;
                        }
                        else
                        {
                            newSearch += "?l=" + newLimit;
                        }
                    }
                    window.location = location.origin + location.pathname + newSearch + "#" + targetElId;
                });
            }
        });
    }

    getTeamPatchLists(teamId, targetEl)
    {
        if (!teamId || !targetEl) return;

        const container = ele.byId("patchlists");
        const apiUrl = src_client.tabs.addPagination("/patchlists/team/" + teamId);
        api.get(apiUrl, (res) =>
        {
            if (container) ele.hide(container);
            let html = "";
            if (res.data.length > 0)
            {
                res.data.forEach((list) =>
                {
                    const projectInfo = src_client.getHandleBarHtml("project_info", { "project": list, "user": { "_id": list.owner._id, "username": list.owner.username }, "displayedDate": "updated", "isPatchlist": true });
                    html += src_client.getHandleBarHtml("patchlist", { "list": list, "projectInfo": projectInfo });
                });
                targetEl.innerHTML = html;
                src_client.tabs.initPagination(targetEl, res.pagination);
                if (container) ele.show(container);
            }
        }, (e) =>
        {
            console.error(e);
            if (container) ele.hide(container);
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/teams/page_team_settings.js




class PageTeamSettings
{
    constructor(targetElement)
    {
        const userTab = ele.byQuery(".project-list");
        const autoSuggests = userTab.querySelectorAll("[data-autosuggest]");
        src_client.initializeAutosuggestsFromApi(autoSuggests);

        this.teamId = ele.byId("team-id").value;
        const deleteTab = ele.byId("deleteTeam");
        if (deleteTab)
        {
            deleteTab.addEventListener("activated", () =>
            {
                this.checkDelete(this.teamId);
            });
        }
    }

    checkDelete(teamId)
    {
        const teamLink = ele.byId("team-link").value;
        const deleteTab = ele.byId("deleteTab");
        if (!deleteTab) return;
        const loadingTab = deleteTab.querySelector(".checkDelete");
        ele.show(loadingTab);
        api.get("teams/" + teamId + "/dependencies", (res) =>
        {
            ele.hide(loadingTab);
            let namespaceCount = 0;
            let opsCount = 0;
            if (res.data.namespaces)
            {
                const namespaces = Object.keys(res.data.namespaces);
                namespaceCount = namespaces.length;
                namespaces.forEach((nsName) =>
                {
                    const ops = res.data.namespaces[nsName];
                    opsCount += ops.length;
                });
            }
            let projectsCount = 0;
            if (res.data.projects)
            {
                projectsCount = res.data.projects.length;
            }
            const opdependencies = ele.byId("opdependencies");
            const patchdependencies = ele.byId("patchdependencies");
            if (opdependencies)
            {
                const okInfo = opdependencies.querySelector(".highlightBlock.info");
                const errorInfo = opdependencies.querySelector(".highlightBlock.error");
                if (opsCount > 0)
                {
                    const text = errorInfo.querySelector(".text");
                    text.innerHTML = "Team <a href=\"" + teamLink + "#teamNamespaces\">is responsible</a> for " + namespaceCount + " namespaces with " + opsCount + " ops, clean them up before you delete the team.";
                    ele.hide(okInfo);
                    ele.show(errorInfo);
                }
                else
                {
                    ele.hide(errorInfo);
                    ele.show(okInfo);
                }
                ele.show(opdependencies);
            }

            if (patchdependencies)
            {
                const okInfo = patchdependencies.querySelector(".highlightBlock.info");
                if (projectsCount > 0)
                {
                    const text = okInfo.querySelector(".text");
                    text.innerHTML = "Team <a href=\"" + teamLink + "#patches\">is associated with</a> " + projectsCount + " patches. Deleting this team will remove it from all patches.";
                    ele.show(okInfo);
                }
                else
                {
                    ele.show(okInfo);
                }
                ele.show(patchdependencies);
            }

            if (opsCount === 0)
            {
                const deleteButton = ele.byId("deletebutton");
                if (deleteButton) ele.show(deleteButton);
            }
        });
    }

    delete()
    {
        const id = ele.byId("team-id").value;
        const name = ele.byId("team-name").value;
        if (confirm("Really delete " + name + " ?"))
        {
            const deleteButton = ele.byQuery("#deletebutton .button");
            const errorEle = ele.byQuery("#deletebutton .error");

            src_client.buttons.startSavingAnimButton(deleteButton);
            api.delete(
                "teams/" + id,
                {},
                (res) =>
                {
                    let msg = res.msg || JSON.stringify(res);
                    src_client.buttons.stopSavingAnimButton();
                    if (res.success)
                    {
                        document.location.href = "/myteams";
                    }
                    else
                    {
                        if (errorEle)
                        {
                            errorEle.innerText = "Failed to delete team: " + msg;
                            ele.show(errorEle);
                        }
                    }
                },
                (res) =>
                {
                    src_client.buttons.stopSavingAnimButton();
                    let msg = res.msg || JSON.stringify(res);
                    if (errorEle)
                    {
                        errorEle.innerText = "Failed to delete team: " + msg;
                        ele.show(errorEle);
                    }
                });
        }
    }

    updateTeam(button, isStaff)
    {
        src_client.buttons.startSavingAnimButton(button);
        const id = ele.byId("team-id").value;
        const name = ele.byId("team-name").value;
        const description = ele.byId("team-description").value;
        const visibility = ele.byId("team-visibility").value;

        const newSettings = {
            "name": name,
            "description": description,
            "visibility": visibility
        };

        const registerNamespaceEl = ele.byId("register-team-namespace");
        if (registerNamespaceEl && registerNamespaceEl.checked)
        {
            newSettings.registerNamespace = true;
        }

        if (isStaff)
        {
            const key = ele.byId("team-key").value;
            let extension = ele.byId("team-extension").value;
            const newExtension = ele.byId("new-team-extension").value;
            if (newExtension)
            {
                extension = extension + "," + newExtension.trim();
            }

            let namespace = ele.byId("team-namespace").value;
            const newNamespace = ele.byId("new-team-namespace").value;
            if (newNamespace)
            {
                namespace = namespace + "," + newNamespace.trim();
            }

            let todoNamespace = ele.byId("todo-namespace").value;
            const newTodoNamespace = ele.byId("new-todo-namespace").value;
            if (newTodoNamespace)
            {
                todoNamespace = todoNamespace + "," + newTodoNamespace.trim();
            }

            newSettings.key = key;
            newSettings.extensions = extension.split(",");
            newSettings.namespaces = namespace.split(",");
            newSettings.todoNamespaces = todoNamespace.split(",");
        }

        const errorEle = ele.byId("errors");
        if (errorEle) ele.hide(errorEle);
        api.patch(
            "teams/" + id, newSettings, (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                window.location.href = "/team/" + res.data._id + "/settings#profile";
                window.location.reload();
            }, (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
                this.showError(res.data.errors);
            });
    }

    addNamespace(type, inputEle, button)
    {
        src_client.buttons.startSavingAnimButton(button);
        const namespace = inputEle.value;
        const apiUrl = "teams/" + this.teamId + "/namespace/" + namespace;
        const errorId = "add-" + type + "-error";
        api.post(apiUrl, { "type": type }, (res) =>
        {
            src_client.buttons.stopSavingAnimButton(button);
            window.location.href = "/team/" + res.data._id + "/settings#profile";
            window.location.reload();
        }, (res) =>
        {
            src_client.buttons.stopSavingAnimButton(button, true, true);
            this.showError(res.data.errors, errorId);
        });
    }

    showError(errors, eleId = "errors")
    {
        let msg = "";
        for (let i = 0; i < errors.length; i++)
        {
            msg += "<li>" + errors[i] + "</li>";
        }
        let html = "<ul>" + msg + "</ul>";

        const errorEle = ele.byId(eleId);
        if (errorEle)
        {
            errorEle.innerHTML = html;
            ele.show(errorEle);
        }
    }

    inviteTeamUser(button)
    {
        src_client.buttons.startSavingAnimButton(button);
        const name = ele.byId("team-inviteuser").dataset.autosuggestValue || ele.byId("team-inviteuser").value;
        const teamId = ele.byId("team-id").value;
        const fullAccess = ele.byId("inviteWritePermission").value;
        let readOnly = (fullAccess !== "true");

        api.post(
            "teaminvites/create",
            {
                "userName": name,
                "teamId": teamId,
                "readOnly": readOnly
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(false, false);
                const errorEle = ele.byId("invite-error");
                if (errorEle)
                {
                    errorEle.innerText = "Invitation not possible: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    removeTeamMember(el)
    {
        const errorEle = ele.byId("invite-error");
        if (errorEle) ele.hide(errorEle);

        const userId = el.dataset.userid;
        const teamId = ele.byId("team-id").value;
        api.delete(
            "teams/" + teamId + "/members/" + userId,
            {},
            (res) =>
            {
                document.location.reload();
            },
            (res) =>
            {
                if (errorEle)
                {
                    errorEle.innerText = "Failed to remove team member: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    setTeamPermissions(value, userId, cb = false)
    {
        let fullAccess = (value === "fullAccess");
        const teamId = ele.byId("team-id").value;
        api.put("teams/" + teamId + "/" + userId + "/permissions/write/" + fullAccess, {}, () =>
        {
            if (cb)
            {
                cb();
            }
            else
            {
                document.location.reload();
            }
        });
    }

    makeTeamOwner(el)
    {
        const errorEle = ele.byId("invite-error");
        if (errorEle) ele.hide(errorEle);

        const userId = el.dataset.userid;
        const teamId = ele.byId("team-id").value;
        api.post(
            "teams/" + teamId + "/owner",
            {
                "userId": userId
            },
            (res) =>
            {
                document.location.reload();
            },
            (res) =>
            {
                if (errorEle)
                {
                    errorEle.innerText = "Failed to change team ownership: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    deleteTeam(el)
    {
        const errorEle = ele.byId("invite-error");
        if (errorEle) ele.hide(errorEle);

        let r = confirm("are you sure? delete team?");

        if (r)
        {
            const teamId = ele.byId("team-id").value;
            api.delete(
                "teams/" + teamId,
                {},
                (res) =>
                {
                    window.location.href = "/myteams";
                },
                (res) =>
                {
                    if (errorEle)
                    {
                        errorEle.innerText = "Failed to delete team: \"" + res.msg + "\"";
                        ele.show(errorEle);
                    }
                });
        }
    }

    revokeTeamInvitation(invitationId)
    {
        const errorEle = ele.byId("invite-error");
        if (errorEle) ele.hide(errorEle);

        api.delete("teaminvites/" + invitationId, {}, () =>
        {
            src_client.buttons.stopSavingAnimButton();
            document.location.reload();
        }, (res) =>
        {
            src_client.buttons.stopSavingAnimButton();
            if (errorEle)
            {
                errorEle.innerText = "Failed to revoke invitation: \"" + res.msg + "\"";
                ele.show(errorEle);
            }
        });
    }

    removeNamespace(namespace, type)
    {
        const data = { "type": type };
        api.delete("teams/" + this.teamId + "/namespace/" + namespace, data, (res) =>
        {
            if (res.success)
            {
                document.location.reload();
            }
            else
            {
                const errorEle = ele.byQuery("#add-namespace-error .warn-hint");
                if (errorEle) errorEle.innerText = res.msg;
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/teams/page_team_todos.js




class PageTeamTodos
{
    constructor(targetElement)
    {
        const teamId = targetElement.dataset.teamid;

        const todoEle = ele.byId("todos");
        const searchParams = new URLSearchParams(window.location.search);

        const apiParams = new URLSearchParams();
        if (searchParams.has("type")) apiParams.set("type", searchParams.get("type"));
        if (searchParams.has("category")) apiParams.set("category", searchParams.get("category"));
        let apiUrl = "teams/" + teamId + "/todos";
        if (apiParams.size > 0) apiUrl += "?" + apiParams;

        api.get(apiUrl, (res) =>
        {
            src_client.setHandleBarHtml("todos", res.data, todoEle);
            const tabs = todoEle.querySelectorAll("ul.tab-bar li");
            tabs.forEach((tab) =>
            {
                tab.addEventListener("activated", (e) =>
                {
                    const table = ele.byId(tab.dataset.tabName);
                    if (table)
                    {
                        const todos = table.querySelectorAll("tr.todo");
                        const numEle = ele.byId("num_todos");
                        if (numEle) numEle.innerText = todos.length;
                    }
                });
            });
            src_client.tabs.initTabs(tabs);
            src_client.tables.initTables(todoEle.querySelectorAll("table.sortable"));
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/teams/page_team_create.js



class PageTeamCreate
{
    createTeam(button)
    {
        const name = document.getElementById("team-name").value;
        const description = document.getElementById("team-description").value;
        const registerNamespace = true;

        src_client.buttons.startSavingAnimButton(button);
        api.post(
            "teams/create",
            {
                "name": name,
                "description": description,
                "registerNamespace": registerNamespace
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                window.location.href = "/team/" + res.data._id + "/settings";
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
            });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/ops/page_op_delete.js




class PageOpDelete
{
    constructor(targetElement)
    {
        this._talkerAPI = new TalkerAPI(window.parent);

        const ops = ele.byQueryAll("#oplist .op");
        const opIds = [];
        ops.forEach((op) =>
        {
            opIds.push(op.dataset.opid);
        });

        const loadingEle = ele.byId("checkDelete");
        const deleteButton = ele.byId("deletebutton");
        const containerEle = ele.byId("problems");

        let responseReceived = 0;
        let allowDelete = true;
        const successCb = (opId, response) =>
        {
            responseReceived++;
            const count = response.data.projectsCount || 0;
            const opCount = response.data.opsCount || 0;
            const depCount = response.data.dependenciesCount || 0;
            if (count || opCount || depCount)
            {
                const opIssuesEle = ele.byId("issues_" + opId);
                if (opIssuesEle)
                {
                    const countEle = opIssuesEle.querySelector(".countProjects");
                    const opCountEle = opIssuesEle.querySelector(".countOps");
                    const depCountEle = opIssuesEle.querySelector(".countDependencies");
                    const countPlural = countEle.querySelector(".plural");
                    const opCountPlural = opCountEle.querySelector(".plural");
                    const depCountPlural = opCountEle.querySelector(".plural");

                    if (countEle) ele.hide(countEle);
                    if (opCountEle) ele.hide(opCountEle);
                    if (depCountEle) ele.hide(depCountEle);
                    if (count > 1 && countPlural) ele.show(countPlural);
                    if (opCount > 1 && opCountPlural) ele.show(opCountPlural);
                    if (depCount > 1 && depCountPlural) ele.show(depCountPlural);

                    if (countEle && count)
                    {
                        countEle.querySelector(".count").innerText = count;
                        ele.show(countEle);
                    }
                    if (opCountEle && opCount)
                    {
                        opCountEle.querySelector(".count").innerText = opCount;
                        ele.show(opCountEle);
                    }
                    if (depCountEle && depCount)
                    {
                        depCountEle.querySelector(".count").innerText = depCount;
                        ele.show(depCountEle);
                    }
                    if (containerEle) ele.show(containerEle);
                    ele.show(opIssuesEle);
                    allowDelete = false;
                }
            }

            if (responseReceived === ops.length)
            {
                if (loadingEle) ele.hide(loadingEle);
                if (allowDelete && deleteButton) ele.show(deleteButton);
            }
        };

        const errorCB = (e) =>
        {
            responseReceived++;
            if (responseReceived === ops.length)
            {
                if (loadingEle) ele.hide(loadingEle);
            }
        };

        opIds.forEach((opId) =>
        {
            const url = "op/" + opId + "/dependencies";
            api.get(url, (r) => { successCb(opId, r); }, errorCB);
        });
    }

    deleteOps(ops)
    {
        ops = src_client.parseDustJson(ops, []);
        const deleteButton = ele.byQuery("#deletebutton .button");
        const errorEle = ele.byQuery("#deletebutton .error");

        const opIdentifiers = [];
        ops.forEach((op) =>
        {
            if (op.id)
            {
                opIdentifiers.push(op.id);
            }
            else if (op.name)
            {
                opIdentifiers.push(op.name);
            }
        });
        src_client.buttons.startSavingAnimButton(deleteButton);
        api.post(
            "ops/delete",
            { "opIdentifiers": opIdentifiers },
            (res) =>
            {
                let msg = res.msg || JSON.stringify(res);
                src_client.buttons.stopSavingAnimButton();
                if (res.success)
                {
                    this._talkerAPI.send(TalkerAPI.CMD_UI_OPS_DELETED, { "ops": ops });
                    const infoEle = ele.byId("hints");
                    if (infoEle)
                    {
                        ele.hide(infoEle);
                    }
                    if (errorEle)
                    {
                        errorEle.classList.remove("error");
                        errorEle.classList.add("info");
                        errorEle.innerText = "Successfully deleted " + ops.length + " ops.";
                        ele.show(errorEle);
                    }
                    ele.hide(deleteButton);
                }
                else
                {
                    if (errorEle)
                    {
                        errorEle.innerText = "Failed to delete op: " + msg;
                        ele.show(errorEle);
                    }
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                let msg = res.msg || JSON.stringify(res);
                if (errorEle)
                {
                    errorEle.innerText = "Failed to delete op: " + msg;
                    ele.show(errorEle);
                }
            });
        // }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/ops/page_op_edit.js




class PageOpEdit
{
    save(button, opName)
    {
        if (!opName) return;
        const codeEle = ele.byId("code");
        if (!codeEle) return;

        const code = codeEle.value;
        const errorEle = ele.byId("errors");
        ele.hide(errorEle);

        src_client.buttons.startSavingAnimButton(button);
        api.put(
            "ops/" + opName,
            {
                "code": code
            },
            this._handleResponse,
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false, true);
                errorEle.innerText = "Error while saving: " + res.msg;
                ele.show(errorEle);
            }
        );
    }

    saveAttachment(button, opName, attName)
    {
        if (!opName) return;
        if (!attName) return;
        const codeEle = ele.byId(attName);
        if (!codeEle) return;
        const code = codeEle.value;
        const errorEle = ele.byId("errors");
        ele.hide(errorEle);

        src_client.buttons.startSavingAnimButton(button);
        api.post(
            "op/" + opName + "/attachment/" + attName,
            {
                "content": code
            },
            this._handleResponse,
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false, true);
                errorEle.innerText = "Error while saving: " + res.msg;
                ele.show(errorEle);
            }
        );
    }

    format(button, opName)
    {
        if (!opName) return;
        const codeEle = ele.byId("code");
        if (!codeEle) return;
        const code = codeEle.value;

        const errorEle = ele.byId("errors");
        ele.hide(errorEle);

        src_client.buttons.startSavingAnimButton(button);
        api.post(
            "ops/code/format",
            {
                "code": code,
            },
            (res) =>
            {
                this._handleResponse(res);
                if (!res.error)
                {
                    codeEle.value = res.opFullCode;
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false, true);
                errorEle.innerText = "Error while saving: " + res.msg;
                ele.show(errorEle);
            }
        );
    }

    formatAttachment(button, opName, attName)
    {
        if (!opName) return;
        if (!attName) return;
        const codeEle = ele.byId(attName);
        if (!codeEle) return;
        const code = codeEle.value;
        const errorEle = ele.byId("errors");
        ele.hide(errorEle);

        src_client.buttons.startSavingAnimButton(button);
        api.post(
            "ops/code/format",
            {
                "code": code,
            },
            (res) =>
            {
                this._handleResponse(res);
                if (!res.error)
                {
                    codeEle.value = res.opFullCode;
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false, true);
                errorEle.innerText = "Error while saving: " + res.msg;
                ele.show(errorEle);
            }
        );
    }

    formatJson(button)
    {
        const errorEle = ele.byId("errors");
        if (errorEle) ele.hide(errorEle);
        const textarea = ele.byId("json");
        if (!textarea) return;

        src_client.buttons.startSavingAnimButton(button);
        try
        {
            const json = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(json, null, 4);
            src_client.buttons.stopSavingAnimButton(button);
            return true;
        }
        catch (e)
        {
            src_client.buttons.stopSavingAnimButton(button, false, true);
            console.error(e.message);
            if (errorEle)
            {
                errorEle.innerText = "Failed to format JSON: " + e.message;
                ele.show(errorEle);
            }
        }
        return false;
    }

    saveJson(button, opName)
    {
        const errorEle = ele.byId("errors");
        if (errorEle) ele.hide(errorEle);
        const textarea = ele.byId("json");
        if (!textarea) return;

        const valid = this.formatJson(button);
        if (valid)
        {
            const json = JSON.parse(textarea.value);
            src_client.buttons.startSavingAnimButton(button);
            api.post("op/json/" + opName, json, (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                if (res && res.data)
                {
                    textarea.value = JSON.stringify(res.data, null, 4);
                }
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false, true);
                if (errorEle)
                {
                    errorEle.innerText = "Failed to save: " + e.msg;
                    ele.show(errorEle);
                }

            });
        }

    }

    _handleResponse(res)
    {
        src_client.buttons.stopSavingAnimButton(false, true, (res && res.error));
        const errorEle = ele.byId("errors");
        if (res && res.error)
        {
            errorEle.innerText = "Line " + res.error.line + " - " + res.error.message;
            ele.show(errorEle);
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/ops/page_op_rename.js


class PageOpRename
{
    constructor(targetElement)
    {
        this._iframe = targetElement.dataset.iframe;

        const oldName = targetElement.dataset.oldname;
        const newName = targetElement.dataset.newname;
        const opId = targetElement.dataset.opid;

        if (targetElement.dataset.showresult && targetElement.dataset.showresult !== "false")
        {
            if (window !== window.parent)
            {
                this._talkerAPI = new TalkerAPI(window.parent);
                const data = { "opId": opId, "oldName": oldName, "objName": newName };
                this._talkerAPI.send(TalkerAPI.CMD_UI_OP_RENAMED, data);
            }
        }
        const opNameInput = ele.byId("newfullname");
        if (opNameInput)
        {
            opNameInput.addEventListener("keypress", (event) =>
            {
                if (event.key === "Enter")
                {
                    event.preventDefault();
                    this.checkIfValid(oldName);
                }
            });

            if (opNameInput.value)
            {
                const parts = opNameInput.value.split(".");
                let lastPartLength = parts[parts.length - 1].length;
                if (parts.length > 1)
                {
                    opNameInput.setSelectionRange(opNameInput.value.length - lastPartLength, opNameInput.value.length);
                    opNameInput.focus();
                }
            }
        }
        const suggestionElements = ele.byQueryAll(".versionSuggestion");
        suggestionElements.forEach((suggest) =>
        {
            if (suggest.dataset.shortName)
            {
                suggest.addEventListener("click", (e) =>
                {
                    this.checkIfValid(oldName, suggest.innerText);
                });
            }
        });

        const allVersionsEle = ele.byId("renameOldVersions");
        if (allVersionsEle)
        {
            allVersionsEle.addEventListener("change", () =>
            {
                this.checkIfValid(oldName);
            });
        }

        this.listOldVersions();
    }

    reallyRename(oldName)
    {
        const newName = ele.byId("newfullname").value;
        const renameOldEle = ele.byId("renameOldVersions");
        const renameAll = renameOldEle ? renameOldEle.checked : false;
        let url = "/op/rename/?doit=true&op=" + oldName + "&new=" + newName + "&allVersions=" + renameAll;
        if (this._iframe && this._iframe !== "false") url += "&iframe=true";
        document.location.href = url;
    }

    checkIfValid(oldName, newName = null)
    {
        newName = newName || ele.byId("newfullname").value;
        let url = "/op/rename/?checkit=true&op=" + oldName + "&new=" + newName;
        const renameOldEle = ele.byId("renameOldVersions");
        const renameAll = renameOldEle ? renameOldEle.checked : false;
        if (!renameAll) url += "&allVersions=false";
        if (this._iframe && this._iframe !== "false") url += "&iframe=true";
        document.location.href = url;
    }

    changeNamespace()
    {
        const problemsEle = ele.byId("problems");
        if (problemsEle) ele.hide(problemsEle);

        const opNameInput = ele.byId("newfullname");
        const selectEle = ele.byId("newNamespace");

        if (selectEle.value)
        {
            ele.hide(ele.byId("dorenamebutton"));
            ele.show(ele.byId("checkbutton"));

            const opName = opNameInput.value;
            const opBasename = opName.substring(opName.lastIndexOf(".") + 1);
            const newNamespace = selectEle.value;
            const newOpName = newNamespace + opBasename;
            if (opNameInput) opNameInput.value = newOpName;
        }
    }

    changeOpName()
    {
        const problemsEle = ele.byId("problems");
        if (problemsEle) ele.hide(problemsEle);

        ele.hide(ele.byId("dorenamebutton"));
        ele.show(ele.byId("checkbutton"));
    }

    listOldVersions()
    {
        const newNameElement = ele.byId("newfullname");
        const oldVersionElements = ele.byQueryAll(".oldVersion");
        oldVersionElements.forEach((oldVersionElement) =>
        {
            const oldLink = oldVersionElement.querySelector("a");
            const oldOpName = oldVersionElement.dataset.oldName;
            const oldVersionName = oldVersionElement.dataset.oldName;
            const newVersionEle = oldVersionElement.querySelector(".newVersion");

            if (oldOpName)
            {
                let carryVersion = "";
                const parts = oldOpName.split("_v", 2);
                if (parts.length > 1)
                {
                    carryVersion = "_v" + parts[1];
                }
                let newName = newNameElement.value.split("_v", 2)[0] + carryVersion;
                oldLink.href = "/op/rename/?op=" + oldVersionName + "&new=" + newName;
                if (newVersionEle) newVersionEle.innerText = newName;
            }
        });
    }

    close()
    {
        if (this._talkerAPI) this._talkerAPI.send(TalkerAPI.CMD_UI_CLOSE_RENAME_DIALOG, {});
    }
}

;// CONCATENATED MODULE: ./src_client/pages/assets/page_asset_delete.js




class PageAssetDelete
{
    constructor(targetElement)
    {
        // targetEl, fileUrl)
        const fileUrl = targetElement.dataset.fileurl;
        if (!fileUrl) return;

        const url = "assets/uses/count";

        const loadingEle = ele.byId("checkDelete");
        const errorEle = ele.byQuery("#problems .error");
        const containerEle = ele.byId("problems");
        const deleteContainer = ele.byId("deleteAsset");
        const deleteButton = ele.byId("deletebutton");

        api.post(url, { "filenames": [fileUrl] }, (response) =>
        {
            if (loadingEle) ele.hide(loadingEle);
            const count = response.data.countPatches || 0;
            const opCount = response.data.countOps || 0;
            if (count || opCount)
            {
                if (errorEle)
                {
                    const countEle = errorEle.querySelector(".countProjects");
                    const opCountEle = errorEle.querySelector(".countOps");
                    if (countEle) ele.hide(countEle);
                    if (opCountEle) ele.hide(opCountEle);

                    if (countEle && count)
                    {
                        countEle.querySelector(".count").innerText = count;
                        ele.show(countEle);
                    }
                    if (opCountEle && opCount)
                    {
                        opCountEle.querySelector(".count").innerText = opCount;
                        ele.show(opCountEle);
                    }
                    if (containerEle) ele.show(containerEle);
                }
                if (deleteButton)
                {
                    deleteButton.classList.remove("button-primary");
                    deleteButton.classList.add("button-delete");
                    deleteButton.innerText = "Delete anyhow";
                }
            }
            else
            {
                if (deleteContainer) ele.show(deleteContainer);
            }
        }, (e) =>
        {
            if (loadingEle) loadingEle.hide();
        });
    }

    deleteAsset(projectId, fileId)
    {
        const deleteButton = ele.byQuery("#deletebutton");
        const errorEle = ele.byQuery("#deleteAsset .error");

        src_client.buttons.startSavingAnimButton(deleteButton);
        api.delete(
            "project/" + projectId + "/file/" + fileId,
            (res) =>
            {
                document.location.reload();
            },
            (res) =>
            {
                let msg = res.msg || JSON.stringify(res);
                src_client.buttons.stopSavingAnimButton();
                if (res.success)
                {
                    const infoEle = ele.byId("hints");
                    if (infoEle)
                    {
                        ele.hide(infoEle);
                    }
                    if (errorEle)
                    {
                        errorEle.classList.remove("error");
                        errorEle.classList.add("info");
                        errorEle.innerText = "Successfully deleted!";
                        ele.show(errorEle);
                    }
                    ele.hide(deleteButton);
                }
                else
                {
                    if (errorEle)
                    {
                        errorEle.innerText = "Failed to delete file: " + msg;
                        ele.show(errorEle);
                    }
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                let msg = res.msg || JSON.stringify(res);
                if (errorEle)
                {
                    errorEle.innerText = "Failed to delete file: " + msg;
                    ele.show(errorEle);
                }
            });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/assets/page_asset_dependencies.js




class PageAssetDependencies
{
    constructor(targetElement)
    {
        // (targetEl, filename, originalPatchJSON)
        const filename = targetElement.dataset.filename;
        const originalPatchJSON = targetElement.dataset.originalpatchjson;

        let originalPatch = src_client.parseDustJson(originalPatchJSON, {});

        if (originalPatch)
        {
            const origPatchEle = ele.byId("originalPatch");
            if (origPatchEle)
            {
                const project = originalPatch;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "updated" });
                src_client.setHandleBarHtml("project", { "project": project, "projectInfo": projectInfo }, origPatchEle);
            }
        }

        const usagesEle = ele.byId("usages");
        if (usagesEle)
        {
            const loadingIndicator = ele.byId("loading");
            if (loadingIndicator) loadingIndicator.classList.remove("hide");

            const apiUrl = "assets/uses?filename=" + filename;

            api.get(apiUrl, (result) =>
            {
                ele.byId("num_patches").innerText = "(" + result.data.projects.length + ")";
                if (result.data.projects.length > 0) ele.show(ele.byId("tab_patches"));
                ele.byId("num_ops").innerText = "(" + result.data.ops.length + ")";
                if (result.data.ops.length > 0) ele.show(ele.byId("tab_ops"));

                src_client.projectPagePatchList(result.data.projects, "patches", "No patches found", result.pagination);

                const morePatchesEle = ele.byId("otherPatchesCount");
                if (morePatchesEle)
                {
                    if (result.data.moreCount)
                    {
                        const countField = morePatchesEle.querySelector(".count");
                        countField.innerHTML = result.data.moreCount;
                        ele.show(morePatchesEle);
                    }
                    else
                    {
                        ele.hide(morePatchesEle);
                    }
                }

                let html = "";
                const ops = result.data.ops;
                for (const i in ops)
                {
                    html += src_client.getHandleBarHtml("op", ops[i]);
                }

                ele.byId("ops").innerHTML = html;
                if (loadingIndicator) loadingIndicator.classList.add("hide");
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/assets/page_patch_dependencies.js




class PagePatchDependencies
{
    constructor(targetElement)
    {
        // (targetEl, projectId)
        const projectId = targetElement.dataset.projectid;
        const loadingIndicator = ele.byId("loading");
        if (loadingIndicator) loadingIndicator.classList.remove("hide");

        const apiUrl = "assets/dependencies/" + projectId;

        api.get(apiUrl, (result) =>
        {
            ele.byId("num_patches").innerText = "(" + result.data.projects.length + ")";
            if (result.data.projects.length > 0) ele.show(ele.byId("tab_patches"));
            ele.byId("num_ops").innerText = "(" + result.data.ops.length + ")";
            if (result.data.ops.length > 0) ele.show(ele.byId("tab_ops"));

            src_client.projectPagePatchList(result.data.projects, "patches", "No patches found", result.pagination);

            const morePatchesEle = ele.byId("otherPatchesCount");
            if (morePatchesEle)
            {
                if (result.data.moreCount)
                {
                    const countField = morePatchesEle.querySelector(".count");
                    countField.innerText = result.data.moreCount;
                    ele.show(morePatchesEle);
                }
                else
                {
                    ele.hide(morePatchesEle);
                }
            }

            let html = "";
            const ops = result.data.ops;
            for (const i in ops)
            {
                html += src_client.getHandleBarHtml("op", ops[i]);
            }

            ele.byId("ops").innerHTML = html;
            if (loadingIndicator) loadingIndicator.classList.add("hide");
        });
    }
}


;// CONCATENATED MODULE: ./src_client/pages/page_examples.js




class PageExamples
{
    constructor(targetElement)
    {
        // (targetEl, exampleId, sandboxUrl)
        const exampleId = targetElement.dataset.exampleid;
        const sandboxUrl = targetElement.dataset.sandboxurl;
        if (exampleId)
        {
            api.get("project/" + exampleId, (exampleObj) =>
            {
                src_client.embedPatch({
                    "projectId": exampleId,
                    "elementId": "examplecontainer",
                    "sandboxUrl": sandboxUrl
                });
            });


            const eleNav = ele.byId(exampleId);
            if (eleNav)
            {
                eleNav.parentElement.parentElement.scrollIntoView({ "block": "start", "inline": "end" });
                eleNav.classList.add("active");
            }
        }
        else
        {
            api.get("examples", (result) =>
            {
                let html = "";
                for (const i in result)
                {
                    html += src_client.getHandleBarHtml("example", result[i]);
                }
                ele.byId("example-thumbs").innerHTML = html;
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_tags.js




class PageTags
{
    constructor(targetElement)
    {
        // (targetEl, tagName)
        const tagName = targetElement.dataset.tagname;
        this.projects = src_client.projects;
        this.getTagProjects(tagName);
    }

    getTagProjects(name)
    {
        api.get("tag/" + name + "/projects", (result) =>
        {
            let html = "";
            for (const i in result.projects)
            {
                const project = result.projects[i];
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername } });
                html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            const tagArr = this.projects.getTagsFromProjects(result.projects);

            src_client.setHandleBarHtml("tags", { "tags": tagArr }, ele.byId("tags"));
            ele.byId("tag_projects").innerHTML = html;

            if (!result.projects || result.projects.length === 0) ele.byId("tag_projects").innerText = "No Projects found.";
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_project_export.js




class PageProjectExport
{
    constructor(targetElement)
    {
        // (targetEl, id)
        this._settings = {
            "id": targetElement.dataset.id,
            "currentTab": "",
        };
        const minifyCheckbox = ele.byId("export_settings_minify");
        const sourcemapsOption = ele.byId("export_option_sourcemaps");
        if (minifyCheckbox && sourcemapsOption)
        {
            minifyCheckbox.addEventListener("change", () =>
            {
                if (minifyCheckbox.checked)
                {
                    ele.show(sourcemapsOption);
                }
                else
                {
                    ele.hide(sourcemapsOption);
                }
            });
        }
        const tabs = ele.byQueryAll("ul.tab-bar li");
        tabs.forEach((targetEl) =>
        {
            targetEl.addEventListener("activated", (which) =>
            {
                const tabName = targetEl.dataset.tabName;
                const tab = ele.byId("export_options_" + tabName);

                this._settings.currentTab = tabName;
                let exportButtonText = "Export ZIP File";
                if (tabName === "netlify") exportButtonText = "Deploy to Netlify";
                if (tabName === "github") exportButtonText = "Deploy to Github";
                if (tabName === "exe") exportButtonText = "Build Executable";
                if (tabName === "patch")
                {
                    exportButtonText = "Export";
                    ele.byId("export_settings_assets").value = "all";
                }
                ele.byQuery("#exportbutton .button").value = exportButtonText;
                ele.byId("deploymentbutton").value = "View Deployment";
                ele.byId("overviewbutton").innerText = "Deployments overview";

                const hideOptions = { "patch": [
                    "export_option_combine",
                    "export_option_flat",
                    "export_option_minify",
                    "export_option_sourcemaps",
                    "export_option_minify_glsl"
                ] };
                const noOptions = ["cmdline", "iframe"];
                const noButton = ["cmdline", "iframe"];
                if (noOptions.includes(tabName))
                {
                    ele.hide(ele.byId("exportoptions"));
                }
                else
                {
                    const optionsEle = ele.byId("exportoptions");
                    const allOptions = optionsEle.querySelectorAll(".export_option");
                    const checkHide = hideOptions.hasOwnProperty(tabName);
                    allOptions.forEach((optionEle) =>
                    {
                        if (checkHide && hideOptions[tabName].includes(optionEle.id))
                        {
                            ele.hide(optionEle);
                        }
                        else
                        {
                            ele.show(optionEle);
                        }
                    });
                    ele.show(optionsEle);
                }

                if (noButton.includes(tabName))
                {
                    ele.hide(ele.byId("exportbutton"));
                }
                else
                {
                    ele.show(ele.byId("exportbutton"));
                }
            });
        });
    }

    export()
    {
        ele.hide(ele.byId("export_dialog"));
        ele.show(ele.byId("export_loading"));
        ele.hide(ele.byId("exportError"));

        let apiUrl = "project/" + this._settings.id + "/export?a=1";

        apiUrl += "&type=" + this._settings.currentTab;
        apiUrl += "&assets=" + ele.byId("export_settings_assets").value;
        if (ele.byId("export_settings_assets").value === "none") apiUrl += "&ignoreAssets=true";
        if (ele.byId("export_settings_combine").value === "single") apiUrl += "&combineJS=true";
        if (ele.byId("export_settings_flat").checked) apiUrl += "&flat=true";
        if (ele.byId("export_settings_minify").checked)
        {
            if (ele.byId("export_settings_sourcemaps").checked) apiUrl += "&sourcemaps=true";
            apiUrl += "&minify=" + true;
        }
        else
        {
            apiUrl += "&minify=" + false;
        }
        if (ele.byId("export_settings_minify_glsl").checked) apiUrl += "&minifyGlsl=true";

        const options = document.querySelectorAll("#export_options_" + this._settings.currentTab + " .exportOption");
        options.forEach((option) =>
        {
            apiUrl += "&" + option.dataset.name + "=" + encodeURIComponent(option.value);
        });

        api.get(
            apiUrl,
            (res) => { this.exportFinished(null, res); },
            (r) => { this.exportFinished(r, r); });
    }

    exportFinished(err, res)
    {
        ele.hide(ele.byId("export_loading"));
        if (err)
        {
            const errorEle = ele.byId("exportError");
            if (errorEle)
            {
                const msg = errorEle.querySelector(".msg");
                if (msg) msg.innerHTML = err.msg || err;
                ele.hide(ele.byId("retrybutton"));
                ele.show(errorEle);
            }
        }
        else
        {
            const logEle = ele.byId("export_log");
            if (res.log && Array.isArray(res.log))
            {
                res.log.forEach((logEntry) =>
                {
                    if (logEntry.text)
                    {
                        if (logEntry.level === "error")
                        {
                            logEle.innerHTML += "<div class=\"highlightBlock " + logEntry.level + "\">" + logEntry.text + "</div><br/>";
                        }
                        else if (logEntry.level === "info")
                        {
                            const entryEle = document.createElement("li");
                            entryEle.innerHTML = logEntry.text;
                            logEle.appendChild(entryEle);
                        }
                    }
                    else
                    {
                        logEle.innerHTML += "<br/>";
                    }
                });
            }
            else
            {
                logEle.innerHTML = res.log || res.message;
            }
        }

        if (res.urls)
        {
            if (res.urls.downloadUrl)
            {
                ele.show(ele.byId("downloadbutton"));
                ele.byId("downloadbutton").setAttribute("href", res.urls.downloadUrl);
                ele.byId("downloadbutton").click();
            }
            else
            {
                ele.hide(ele.byId("downloadbutton"));
            }

            if (res.urls.deploymentUrl)
            {
                ele.show(ele.byId("deploymentbutton"));
                ele.byId("deploymentbutton").setAttribute("href", res.urls.deploymentUrl);
            }
            else
            {
                ele.hide(ele.byId("deploymentbutton"));
            }

            if (res.urls.overviewUrl)
            {
                ele.show(ele.byId("overviewbutton"));
                ele.byId("overviewbutton").setAttribute("href", res.urls.overviewUrl);
            }
            else
            {
                ele.hide(ele.byId("overviewbutton"));
            }
        }

        ele.hide(ele.byId("export_dialog"));
        ele.show(ele.byId("export_result"));
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_made_with_cables.js



class PageMadeWithCables
{
    constructor(targetElement)
    {
        // (targetEl, data)
        let data = targetElement.dataset.pagination;
        const url = new URL(window.location.href);
        const limit = url.searchParams.get("l") || 16;
        const offset = url.searchParams.get("o");
        data = src_client.parseDustJson(data, {});

        src_client.tabs.initPagination(ele.byId("madewithcablesPagination"), data, limit, offset, (newLimit, newOffset) =>
        {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("l", newLimit);
            searchParams.set("o", newOffset);
            window.location.search = searchParams.toString();
        });
    }
}


;// CONCATENATED MODULE: ./src_client/pages/page_landing.js




class PageLanding
{
    constructor(targetElement)
    {
        this._settings = {
            "sloganTimer": -1,
            "scene": null
        };

        // (targetEl, demosJson)
        const demosJson = targetElement.dataset.demosjson;
        const demos = src_client.parseDustJson(demosJson, []);
        let demoIndex = Math.floor(Math.random() * demos.length);
        document.getElementById("demoiframe").src = "/api/demo/" + demoIndex;

        this.resize();

        ele.byQuery("body").innerHTML += "<link href=\"//fonts.googleapis.com/css?family=Ubuntu\" rel=\"stylesheet\" type=\"text/css\"/>\n";
        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();

        const demoContainer = ele.byId("democontainer");
        if (demoContainer)
        {
            demoContainer.addEventListener("pointerenter", () =>
            {
                this.hideSlogan();
            });
            demoContainer.addEventListener("pointerleave", () =>
            {
                this._settings.sloganTimer = setTimeout(() => { ele.show(ele.byQuery(".slogan")); }, 1000);
            });
        }
        this.landingPatchteaser();
    }

    resize()
    {
        let switcher = document.getElementById("demoswitcher");
        let m = document.getElementById("democontainer");
        let iframe = document.getElementById("demoiframe");

        let w = m.getBoundingClientRect().width;
        let h = w * 8 / 20;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            h = w * 3 / 3;

        m.style.height = h + "px";

        iframe.style.height = h + "px";
        iframe.style.width = w + "px";

        if (switcher)switcher.style.top = h + "px";

        if (this._settings.scene) this._settings.scene.cgl.updateSize();
        else setTimeout(this.resize.bind(this), 100);
    }

    hideSlogan()
    {
        if (this._settings.sloganTimer !== -1)clearTimeout(this._settings.sloganTimer);
        this._settings.sloganTimer = -1;
        const slogan = ele.byQuery(".slogan");
        if (slogan) ele.hide(slogan);
    }

    landingPatchteaser()
    {
        api.get("fav/top", (result) =>
        {
            let i = 0;
            let favHtml = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/ops",
                "title": ""
            });
            favHtml += "<div class=\"row\">";

            if (result.topFavs.length > 4) result.topFavs.length = 4;
            for (i in result.topFavs)
            {
                const project = result.topFavs[i].proj;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                favHtml += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            favHtml += "</div>";
            document.getElementById("landingteaser").innerHTML = favHtml;

            let allTimeHtml = src_client.getHandleBarHtml("project_list_headline", {
                "link": "/ops",
                "title": ""
            });
            allTimeHtml += "<div class=\"row\">";
            if (result.allTimeTop.length > 4) result.allTimeTop.length = 4;
            for (i in result.allTimeTop)
            {
                const project = result.allTimeTop[i].proj;
                const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": "published" });
                allTimeHtml += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
            }
            allTimeHtml += "</div>";
            document.getElementById("landingteaser2").innerHTML = allTimeHtml;
        });
    }
}

;// CONCATENATED MODULE: ./src_client/browser.js




class Browser
{
    constructor()
    {
        this._logResult = {};
        this._Browser = {};
        this._Browser.browserCounter = 0;

        this._tests = [
            () =>
            {
                this._logResult.browser = platformLib.name;
                this._logResult.browser_version = platformLib.version;
            },
            () =>
            {
                let str = "";
                if (platformLib.os)
                {
                    if (platformLib.os.family)
                    {
                        str += platformLib.os.family + " ";
                        this._logResult.os_family = platformLib.os.family;
                    }
                    if (platformLib.os.version)
                    {
                        str += platformLib.os.version + " ";
                        this._logResult.os_version = platformLib.os.version;
                    }
                    if (platformLib.os.architecture)
                    {
                        str += platformLib.os.architecture + "bit ";
                        this._logResult.os_architecture = platformLib.os.architecture;
                    }
                    if (platformLib.product)
                    {
                        str += "(" + platformLib.product + ")";
                        this._logResult.product = platformLib.product;
                    }
                }

                this._logResult.language = navigator.language || navigator.userLanguage;
            },

            () =>
            {
                const result = {};
                let canvas;
                let gl;
                let exts;

                try
                {
                    canvas = document.createElement("canvas");
                    // gl = canvas.getContext('webgl2')  || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

                    let glVersion = 0;

                    gl = canvas.getContext("webgl2", canvas);
                    if (gl)
                    {
                        glVersion = 2;
                    }
                    else
                    {
                        gl = canvas.getContext("webgl", canvas) || canvas.getContext("experimental-webgl", canvas);
                        glVersion = 1;
                    }

                    // window.testgl=gl;

                    if (gl)
                    {
                        let html = "";

                        this._logResult.webgl_versionNum = glVersion;
                        exts = gl.getSupportedExtensions();

                        const webglVersion = gl.getParameter(gl.VERSION);
                        this._logResult.webgl_version = webglVersion;

                        const glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
                        this._logResult.webgl_glsl_version = glslVersion;

                        const dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
                        if (dbgRenderInfo)
                        {
                            const webGlRenderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
                            this._logResult.webgl_renderer = webGlRenderer;

                            this._logResult.webgl_gpu_info = this.getGPU(webGlRenderer);
                            const webGlVendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
                            this._logResult.webgl_vendor = webGlVendor;
                        }

                        if (gl.isContextLost())
                        {
                            this._logResult.webgl_renderer = "BROKEN WEBGL: CONTEXT LOST";
                        }

                        canvas = document.createElement("canvas");
                        const glcaveat = canvas.getContext("webgl", { "failIfMajorPerformanceCaveat": true }) || canvas.getContext("experimental-webgl", { "failIfMajorPerformanceCaveat": true });
                        this._logResult.webgl_majorPerformanceCaveat = !glcaveat;

                        this._logResult.webgl_params = {};

                        if (gl.MAX_SAMPLES !== undefined) this._logResult.webgl_params.MAX_SAMPLES = gl.getParameter(gl.MAX_SAMPLES);
                        this._logResult.webgl_params.MAX_FRAGMENT_UNIFORM_VECTORS = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
                        this._logResult.webgl_params.MAX_VERTEX_UNIFORM_VECTORS = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
                        this._logResult.webgl_params.MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                        this._logResult.webgl_params.DEPTH_BITS = gl.getParameter(gl.DEPTH_BITS);

                        this._logResult.webgl_params.MAX_VARYING_VECTORS = gl.getParameter(gl.MAX_VARYING_VECTORS);
                        this._logResult.webgl_params.MAX_VERTEX_ATTRIBS = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
                        this._logResult.webgl_params.MAX_COMBINED_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                        this._logResult.webgl_params.MAX_VERTEX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                        this._logResult.webgl_params.MAX_RENDERBUFFER_SIZE = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

                        const dbgWEBGL_draw_buffers = gl.getExtension("WEBGL_draw_buffers");
                        if (dbgWEBGL_draw_buffers)
                        {
                            this._logResult.webgl_params.MAX_DRAW_BUFFERS = gl.getParameter(dbgWEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL);
                        }
                        else
                        {
                            if (gl.MAX_DRAW_BUFFERS !== undefined)
                            {
                                this._logResult.webgl_params.MAX_DRAW_BUFFERS = gl.getParameter(gl.MAX_DRAW_BUFFERS);
                            }
                        }

                        const extAniso = gl.getExtension("EXT_texture_filter_anisotropic");
                        if (extAniso)
                        {
                            const max = gl.getParameter(extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                            this._logResult.webgl_params.MAX_TEXTURE_MAX_ANISOTROPY_EXT = max;
                        }

                        if (!exts || exts.length === 0)
                        {
                        }
                        else
                        {
                            this._logResult.webgl_extensions = exts;

                            for (let i = 0; i < exts.length; i++)
                                html += "&nbsp;&nbsp;&nbsp;- " + exts[i] + "<br/>";
                        }
                    }
                    else
                    {
                        this._logResult.webgl_versionNum = 0;
                    }
                }
                catch (e)
                {
                    console.log("webgl getcontext", e);
                    return;
                }

                canvas = undefined;
            },

            async () =>
            {
                let hasWebGpu = navigator.gpu != undefined;

                if (navigator.gpu)
                {
                    let adapter = null;
                    let device = null;
                    try
                    {
                        adapter = await navigator.gpu.requestAdapter();
                        device = await adapter.requestDevice();
                    }
                    catch (e)
                    {
                        adapter = null;
                        hasWebGpu = false;
                        return;
                    }

                    this._logResult.api_webGpu = hasWebGpu;

                    hasWebGpu = !!adapter;
                    if (hasWebGpu)
                    {

                        this._logResult.webgpu_adapter_vendor = adapter.info.vendor;
                        this._logResult.webgpu_adapter_architecture = adapter.info.architecture;
                        this._logResult.webgpu_adapter_device = adapter.info.device || "unknown";
                    }

                    const limits = [];
                    for (let i in device.limits) limits.push({ "title": i, "value": device.limits[i] });
                    this._logResult.webgpu_limits = limits;

                    const features = [];
                    const valueIterator = adapter.features.values();
                    for (const value of valueIterator)
                        features.push(value);
                    this._logResult.webgpu_features = features;

                    this._logResult.api_webGpu = hasWebGpu;
                }
            },

            () =>
            {
                let hasWebCodecs = window.VideoEncoder != undefined;
                this._logResult.api_webCodecs = hasWebCodecs;
            },

            () =>
            {
                this._logResult.display_pixel_ratio = window.devicePixelRatio;
                if (window.devicePixelRatio)
                {
                    this._logResult.display_pixel_ratio_float = window.devicePixelRatio.toPrecision(2);
                }
                this._logResult.window_size_width = window.innerWidth;
                this._logResult.window_size_height = window.innerHeight;

                this._logResult.window_size_pixel_width = window.innerWidth * window.devicePixelRatio;
                this._logResult.window_size_pixel_height = window.innerHeight * window.devicePixelRatio;

                this._logResult.screen_size_width = window.screen.availWidth;
                this._logResult.screen_size_height = window.screen.availHeight;

                this._logResult.screen_dynamic_range_standard = window.matchMedia("(dynamic-range: standard)").matches;
                this._logResult.screen_dynamic_range_high = window.matchMedia("(dynamic-range: high)").matches;
                this._logResult.screen_dynamic_range_high_string = window.matchMedia("(dynamic-range: high)").matches ? "true" : "false";
                this._logResult.screen_colorDepth = window.screen.colorDepth;

                this._logResult.screen_gamut_srgb = window.matchMedia("(color-gamut: srgb)").matches;
                this._logResult.screen_gamut_p3 = window.matchMedia("(color-gamut: p3)").matches;
                this._logResult.screen_gamut_rec2020 = window.matchMedia("(color-gamut: rec2020)").matches;
            },

            () =>
            {
                const api_gamepad = !(!navigator.getGamepads);
                this._logResult.api_gamepad = api_gamepad;

                const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            },

            () =>
            {
                const api_bluetooth = !!navigator.bluetooth || false;
            },

            async () =>
            {
                let xr = navigator.xr;
                if (!xr) return;

                this._logResult.api_webxr = !!xr;
                this._logResult.api_webxrvr = await xr.isSessionSupported("immersive-vr");
                this._logResult.api_webxrar = await xr.isSessionSupported("immersive-ar");
            },

            () =>
            {
                let prefix = "";
                if (window.RTCPeerConnection)
                {
                    prefix = "";
                }
                else if (window.mozRTCPeerConnection || navigator.mozGetUserMedia)
                {
                    prefix = "moz";
                }
                else if (window.webkitRTCPeerConnection || navigator.webkitGetUserMedia)
                {
                    prefix = "webkit";
                }

                const peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia;
                const mediaStream = window.webkitMediaStream || window.MediaStream;
                const ice = window.mozRTCIceCandidate || window.RTCIceCandidate;

                this._logResult.api_webrtc_support = !!peerConnection && !!getUserMedia;
                this._logResult.api_webrtc_prefix = prefix;
                this._logResult.api_webrtc_peer_connection = !!peerConnection;
                this._logResult.api_webrtc_ice = !!ice;
                this._logResult.api_webrtc_media_stream = !!(mediaStream && mediaStream.prototype.removeTrack);
                this._logResult.api_webrtc_get_user_media = !!getUserMedia;
                this._logResult.api_webrtc_data_channel = !!(peerConnection && peerConnection.prototype && peerConnection.prototype.createDataChannel);
            },

            () =>
            {
                if (navigator.getVRDisplays)
                {
                    navigator.getVRDisplays().then((displays) =>
                    {
                        for (let displs = 0; displs < displays.length; displs++)
                            this._logResult.api_webvr_display = displays[displs].displayName;

                        const api_webvr = !(!navigator.getVRDisplays);
                        this._logResult.api_webvr = api_webvr;
                    });
                }
            },

            () =>
            {
                const api_midi = !(!window.MIDIAccess);
                this._logResult.api_midi = api_midi;
            },

            () =>
            {
                let api_webaudio = false;
                if (window.audioContext) api_webaudio = true;
                if (!api_webaudio && ("webkitAudioContext" in window || "AudioContext" in window)) api_webaudio = true;
                this._logResult.api_webaudio = api_webaudio;

                if (api_webaudio)
                {
                    const audioContext = new AudioContext();
                    if (audioContext)
                    {
                        if ("baseLatency" in audioContext) this._logResult.web_audio_base_latency = audioContext.baseLatency;
                        if ("outputLatency" in audioContext) this._logResult.web_audio_output_latency = audioContext.outputLatency;
                        if ("sampleRate" in audioContext) this._logResult.web_audio_sample_rate = audioContext.sampleRate;
                        if (audioContext.destination)
                        {
                            if ("channelCount" in audioContext.destination) this._logResult.web_audio_channel_count = audioContext.destination.channelCount;
                            if ("channelCountMode" in audioContext.destination) this._logResult.web_audio_channel_count_mode = audioContext.destination.channelCountMode;
                            if ("channelInterpretation" in audioContext.destination) this._logResult.web_audio_channel_interpretation = audioContext.destination.channelInterpretation;
                            if ("maxChannelCount" in audioContext.destination) this._logResult.web_audio_max_channel_count = audioContext.destination.maxChannelCount;
                            if ("numberOfInputs" in audioContext.destination) this._logResult.web_audio_number_of_inputs = audioContext.destination.numberOfInputs;
                            if ("numberOfOutputs" in audioContext.destination) this._logResult.web_audio_number_of_outputs = audioContext.destination.numberOfOutputs;
                        }
                    }
                }
            },

            () =>
            {
                const api_fonts = ("fonts" in document);
                this._logResult.api_fonts = api_fonts;
            },

            () =>
            {
                const api_pointerlock = ("exitPointerLock" in document);
                this._logResult.api_pointerlock = api_pointerlock;
            },

            () =>
            {
                const api_performanceTimer = ("performance" in window);
                this._logResult.api_performanceTimer = api_performanceTimer;
            },

            () =>
            {
                const canSvg = !!(document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect);
                this._logResult.api_svg = canSvg;
            },

            () =>
            {
                const api_websocket = ("WebSocket" in window);
                this._logResult.api_websocket = api_websocket;
            },

            () =>
            {
                const api_bluetooth = ("bluetooth" in navigator);
                this._logResult.api_bluetooth = api_bluetooth;
            },

            () =>
            {
                const api_broadcastchannel = ("BroadcastChannel" in window);
                this._logResult.api_broadcastchannel = api_broadcastchannel;
            },

            () =>
            {
                const api_notifications = ("Notification" in window);
                this._logResult.api_notifications = api_notifications;
            },

            () =>
            {
                const api_fileSystemAccessApi = ("showOpenFilePicker" in window);
                this._logResult.api_fileSystemAccessApi = api_fileSystemAccessApi;
            },

            () =>
            {
                const api_webshare = ("share" in navigator);
                this._logResult.api_webshare = api_webshare;
            }
        ];
    }

    getGPU(renderer)
    {
        const info = {};

        let gpu = renderer;

        gpu = gpu.replace("Mesa DRI ", "");
        gpu = gpu.replace("Mesa ", "");
        gpu = gpu.replace("NVIDIA Corporation, ", "");
        gpu = gpu.replace("Intel Open Source Technology Center, ", "");
        gpu = gpu.replace("(R)", "");
        gpu = gpu.replace("(TM)", "");
        gpu = gpu.replace("Direct3D11 vs_5_0 ps_5_0)", "");
        gpu = gpu.replace("Direct3D11 vs_4_1 ps_4_1)", "");
        gpu = gpu.replace("OpenGL Engine", "");
        gpu = gpu.replace("/PCIe/SSE2", "");
        gpu = gpu.replace("X.Org, ", "");
        gpu = gpu.replace("ATI Radeon", "Radeon");
        gpu = gpu.replace("with Max-Q Design", "");
        gpu = gpu.replace("Series", "");
        gpu = gpu.replace("  ", " ");

        let parts = gpu.split(/[,(/)]/);
        let found = null;

        for (let j = 0; j < parts.length; j++)
        {
            let p = parts[j].trim();

            if (p.indexOf("Radeon") == 0)found = p;
            else if (p.indexOf("NVIDIA") == 0)found = p;
            else if (p.indexOf("AMD") == 0)found = p;
            else if (p.indexOf("GeForce") == 0)found = p;
            else if (p.indexOf("Intel") == 0)found = p;
            else if (p.indexOf("Mali") == 0)found = p;
            else if (p.indexOf("Adreno") == 0)found = p;
            else if (p.indexOf("PowerVR") == 0)found = p;
            else if (p.indexOf("VMware") == 0)found = p;
            else if (p.indexOf("Apple") == 0)found = p;
        }

        if (found && found.indexOf("Radeon") == 0)found = "AMD " + found;
        if (found && found.indexOf("GeForce") == 0)found = "NVIDIA " + found;

        if (!found)
        {
            info.gpu_unsure = true;
            console.log("unsure of gpu:", renderer);
        }
        info.gpu = (found || renderer).trim();

        let vendor = "";
        if (renderer.toLowerCase().indexOf("nvidia") > -1)vendor = "Nvidia";
        if (renderer.toLowerCase().indexOf("geforce") > -1)vendor = "Nvidia";
        if (renderer.toLowerCase().indexOf("radeon") > -1)vendor = "AMD";
        if (renderer.toLowerCase().indexOf("amd ") > -1)vendor = "AMD";
        if (renderer.toLowerCase().indexOf("intel") > -1)vendor = "Intel";
        if (renderer.toLowerCase().indexOf("swiftshader") > -1)vendor = "Google";
        if (renderer.toLowerCase().indexOf("adreno") > -1)vendor = "Qualcom";
        if (renderer.toLowerCase().indexOf("mali-") > -1)vendor = "ARM";
        if (renderer.toLowerCase().indexOf("apple") > -1)vendor = "Apple";

        info.vendor = vendor;

        if (renderer.toLowerCase().indexOf("swiftshader") > -1)
        {
            info.software = true;
        }

        return info;
    }

    async doBrowserTest(cb)
    {
        for (const i in this._tests)
        {
            // eslint-disable-next-line no-await-in-loop
            await this._tests[i]();
        }

        src_client.cookies.createCookie("browserinfo", true, 100);
        api.post("browser", { "browser": this._logResult }, (r) =>
        {
            const loadingEle = ele.byId("browserLoading");
            if (loadingEle) ele.hide(loadingEle);

            const resultIframe = document.getElementById("resultIframe");
            if (resultIframe) resultIframe.src = "/browser/r/" + r.id + "?embed=true";

            const head = document.getElementsByTagName("head");
            if (head && head.length > 0)
            {
                const baseTag = document.createElement("base");
                baseTag.setAttribute("target", "_parent");
                head[0].appendChild(baseTag);
            }

            const footer = document.getElementsByTagName("footer");
            if (footer && footer.length > 0) footer[0].remove();

            if (cb) cb(r);
        });
    }

    doBrowserSpeedTest(button)
    {
        function randomData(size)
        {
            let chars = "abcdefghijklmnopqrstuvwxyz".split("");
            let len = chars.length;
            let random_data = [];

            while (size--)
            {
                random_data.push(chars[Math.random() * len | 0]);
            }

            return random_data.join("");
        }

        function showSpeedTestResult(className, numBytes, speedTest, hideLoading)
        {
            const dir = speedTest.dir;
            const containerEle = document.getElementById("speedtestResult");
            const resultEle = containerEle.querySelector(".results");
            if (speedTest.result.clientDiff)
            {
                const clientEl = resultEle.querySelector("." + className + " .client .time");
                clientEl.innerText = parseInt(speedTest.result.clientDiff) + "ms";
                const diffEl = resultEle.querySelector("." + className + " .client .speed");
                diffEl.innerText = parseInt(Number(speedTest.result.clientDiff - speedTest.result.diff)) + "ms";

                const speed = ((numBytes * 8) / 1024 / 1024) / (speedTest.result.clientDiff / 1000);
                diffEl.innerText = speed.toFixed(2) + " mbit/s";
            }
            if (speedTest.result.hasOwnProperty("processingTime"))
            {
                const serverEl = resultEle.querySelector("." + className + " .servertime");
                serverEl.innerText = parseInt(speedTest.result.processingTime) + "ms";
            }
            if (dir)
            {
                if (hideLoading)
                {
                    const dirLoader = ele.byQuery("." + dir + " .loading");
                    if (dirLoader) ele.hide(dirLoader);
                }
                const dirResultsEl = ele.byQueryAll("." + dir + " .result");
                dirResultsEl.forEach((el) => { ele.show(el); });
            }
        }

        function showSpeedTestError(e)
        {
            src_client.buttons.stopSavingAnimButton();
            const containerEle = document.getElementById("speedtestResult");
            const el = containerEle.querySelector(".error");
            if (el)
            {
                el.classList.remove("hidden");
                const msgEl = el.querySelector(".message");
                if (msgEl) msgEl.innerText = "error during speedtest:" + e;
            }
        }

        src_client.buttons.startSavingAnimButton(button);
        const all = {};

        const dirResultsEl = ele.byQueryAll(".results .result");
        dirResultsEl.forEach((el) => { ele.hide(el); });
        const dirLoaders = ele.byQueryAll(".results .loading");
        dirLoaders.forEach((el) => { ele.show(el); });

        const containerEle = document.getElementById("speedtestResult");
        const resultEle = containerEle.querySelector(".results");
        resultEle.classList.remove("hidden");

        const startDirectSmall = performance.now();
        const cb = Date.now();
        fetch("/test_files/onemb.txt?cb=" + cb).then((resp) => { return resp.text(); }).then(() =>
        {
            let endDirectSmall = performance.now();
            let data = {};
            data.clientStart = startDirectSmall;
            data.clientEnd = endDirectSmall;
            data.clientDiff = endDirectSmall - startDirectSmall;
            all.fetchDirectSmall = {
                "dir": "downdirect",
                "size": "small",
                "result": data
            };
            showSpeedTestResult("downdirectsmall", 1048576, all.fetchDirectSmall);
            const startSmall = performance.now();
            api.get("browser/download/small?cb=" + cb, (fsres) =>
            {
                const endSmall = performance.now();
                data = {};
                if (fsres.data) data = fsres.data;
                if (fsres.data.data) delete fsres.data.data;
                data.clientStart = startSmall;
                data.clientEnd = endSmall;
                data.clientDiff = endSmall - startSmall;
                all.fetchSmall = {
                    "dir": "down",
                    "size": "small",
                    "result": data
                };
                showSpeedTestResult("downsmall", 1048576, all.fetchSmall);
                const startDirectBig = performance.now();
                fetch("/test_files/tenmb.txt?cb=" + cb).then((resp) => { return resp.text(); }).then(() =>
                {
                    const endDirectBig = performance.now();
                    data = {};
                    data.clientStart = startDirectBig;
                    data.clientEnd = endDirectBig;
                    data.clientDiff = endDirectBig - startDirectBig;
                    all.fetchDirectBig = {
                        "dir": "downdirect",
                        "size": "big",
                        "result": data
                    };
                    showSpeedTestResult("downdirectbig", 10485760, all.fetchDirectBig, true);
                    const startBig = performance.now();
                    api.get("browser/download/big?cb=" + cb, (fbres) =>
                    {
                        const endBig = performance.now();
                        data = {};
                        if (fbres.data) data = fbres.data;
                        if (fbres.data.data) delete fbres.data.data;
                        data.clientStart = startBig;
                        data.clientEnd = endBig;
                        data.clientDiff = endBig - startBig;
                        all.fetchBig = {
                            "dir": "down",
                            "size": "big",
                            "result": data
                        };
                        showSpeedTestResult("downbig", 10485760, all.fetchBig, true);
                        let content = { "data": randomData(1048576) };
                        const startUpSmall = performance.now();
                        api.post("browser/upload/small", content, (usres) =>
                        {
                            const endUpSmall = performance.now();
                            data = {};
                            if (usres.data) data = usres.data;
                            if (usres.data.data) delete usres.data.data;
                            data.clientStart = startUpSmall;
                            data.clientEnd = endUpSmall;
                            data.clientDiff = endUpSmall - startUpSmall;
                            all.upSmall = {
                                "dir": "up",
                                "size": "small",
                                "result": data
                            };
                            showSpeedTestResult("upsmall", 1048576, all.upSmall);
                            content = { "data": randomData(10485760) };
                            const startUpBig = performance.now();
                            api.post("browser/upload/big", content, (ubres) =>
                            {
                                const endUpBig = performance.now();
                                data = {};
                                if (ubres.data) data = ubres.data;
                                if (ubres.data.data) delete ubres.data.data;
                                data.clientStart = startUpBig;
                                data.clientEnd = endUpBig;
                                data.clientDiff = endUpBig - startUpBig;
                                all.upBig = {
                                    "dir": "up",
                                    "size": "big",
                                    "result": data
                                };
                                showSpeedTestResult("upbig", 10485760, all.upBig, true);
                                src_client.buttons.stopSavingAnimButton();
                                api.post("browser/speedtest", all);
                            }, showSpeedTestError);
                        }, showSpeedTestError);
                    }, showSpeedTestError);
                }, showSpeedTestError);
            }, showSpeedTestError);
        }, showSpeedTestError);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_browser.js


class PageBrowser
{
    constructor()
    {
        this.browser = new Browser();
        this.browser.doBrowserTest();
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_browserevents.js

class PageBrowserEvents
{
    constructor(targetElement)
    {
        this.lastBrowserEvent = {};
        this.browserEventHistory = [];
        this.initBrowserEvents();
    }

    _smallObj(t, oo, lvl = 0)
    {
        lvl++;
        if (lvl > 3) return t;

        for (let dd in oo)
        {
            const o = oo[dd];
            if (!o || typeof o == "number" || typeof o == "boolean" || typeof o == "string")
            {
                t += "__" + dd + ":" + o + "<br/>";
            }
            else
            if (Array.isArray(o))
            {
                t += "array<br/>";
            }
            else
            if (typeof o == "object")
            {
                t += "[" + typeof o + "] ";

                const constr = o.constructor;
                if (constr.name && constr.name !== "Function")
                {
                    t += constr.name;
                }
                t += "<br/>";

                if (constr.name == "TouchList" || constr.name == "Touch") t += this._smallObj("", o, lvl) || "";
            }
        }
        return t;
    }

    logEventObject(orig, e, html, lvl)
    {
        lvl = lvl || 0;
        if (lvl > 3) return "oops";
        html = html || "";

        for (const i in e)
        {
            if (i === "parent") continue;
            else if (!e[i] || typeof e[i] == "number" || typeof e[i] == "boolean" || typeof e[i] == "string")
            {
                html += "<tr><td>" + i + "</td><td style=\"width:100%\">";
                if (!this.lastBrowserEvent[e.type] || this.lastBrowserEvent[e.type][i] !== e[i]) html += "<b>";
                html += e[i];
                if (!this.lastBrowserEvent[e.type] || this.lastBrowserEvent[e.type][i] !== e[i]) html += "</b>";

                html += "</td></tr>";
            }
            else if (Array.isArray(e[i]))
            {
                let str = "";
                try
                {
                    str = JSON.stringify(e[i]);
                }
                catch (e2) {}
                html += "<tr><td>" + i + "</td><td>" + str + "</td></tr>";
            }
            else
            {
                if (!e[i].constructor) return;

                let t = "[" + typeof e[i] + "] ";

                const constr = e[i].constructor;
                if (constr.name && constr.name !== "Function")
                {
                    t += constr.name;
                }

                t += "<br/>";
                t += this._smallObj(t, e[i], 0);

                html += "<tr><td>" + i + "</td><td>" + t + "</td></tr>";
            }
        }

        this.lastBrowserEvent[e.type] = e;

        return html;
    }

    logBrowserEvent(e)
    {
        e.preventDefault();

        const maxHist = 50;
        this.browserEventHistory.unshift(e.type);
        if (this.browserEventHistory.length > maxHist) this.browserEventHistory.length = maxHist;
        let historyHtml = "";
        for (let i = 0; i < this.browserEventHistory.length; i++)
        {
            historyHtml += this.browserEventHistory[i] + "<br/>";
        }
        document.getElementById("history").innerHTML = historyHtml;

        let html = "";

        html += "<h3>" + e.type + "</h3><br/>";

        html += "<table>";
        html += this.logEventObject(e, e, "", 0);
        html += "</table>";

        document.getElementById("output").innerHTML = html;

        return false;
    }


    initBrowserEvents()
    {
        document.getElementById("results").innerText = "";

        window.addEventListener("load", this.logBrowserEvent.bind(this));
        window.addEventListener("gamepadconnected", this.logBrowserEvent.bind(this));
        window.addEventListener("DOMContentLoaded", this.logBrowserEvent.bind(this));

        window.addEventListener("gamepadconnected", this.logBrowserEvent.bind(this));
        window.addEventListener("gamepaddisconnected", this.logBrowserEvent.bind(this));


        document.addEventListener("keydown", this.logBrowserEvent.bind(this));
        document.addEventListener("keyup", this.logBrowserEvent.bind(this));
        document.addEventListener("scroll", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("focus", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("blur", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("contextmenu", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("mouseenter", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("mouseleave", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("mousemove", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("pointerenter", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("pointerleave", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("pointermove", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("mousedown", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("mouseup", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("pointerdown", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("pointerup", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("click", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("dblclick", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("wheel", this.logBrowserEvent.bind(this));

        document.getElementById("input").addEventListener("touchmove", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("touchstart", this.logBrowserEvent.bind(this));
        document.getElementById("input").addEventListener("touchend", this.logBrowserEvent.bind(this));
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_search.js




class PageSearch
{
    constructor(targetElement)
    {
        this.lastOptions = {
            "what": "ppub",
            "order": "date",
            "limit": 48,
            "offset": 0
        };
        this.lastTerm = "";

        this._defaultOptions = {
            "ppub": {
                "order": "date",
                "orderFields": [
                    "date",
                    "favs"
                ]
            },
            "ppriv": {
                "order": "updated",
                "orderFields": [
                    "updated", "" +
                    "favs"
                ]
            },
            "pshared": {
                "order": "updated",
                "orderFields": [
                    "updated",
                    "favs"
                ]
            },
            "topMonth": {
                "order": "favs",
                "orderFields": [
                    "date",
                    "favs"
                ]
            },
            "example": {
                "order": "date",
                "orderFields": [
                    "date",
                    "favs"
                ]
            },
            "ops": {
                "orderFields": []
            },
            "u": {
                "orderFields": []
            }
        };

        const headSearch = ele.byId("headsearch");
        if (headSearch)
        {
            let searchWord = headSearch.value;
            this.lastTerm = searchWord;
            this.search(searchWord, { "what": "ppub" });
        }

        const url = new URL(window.location);
        let what = "";
        if (window.location.hash)
        {
            what = window.location.hash.split("#", 2)[1];
        }
        what = what || url.searchParams.get("w") || "all";

        this.lastOptions.what = what;
        this.lastOptions.order = url.searchParams.get("or");
        this.lastOptions.limit = url.searchParams.get("l") || 48;
        this.lastOptions.offset = url.searchParams.get("o") || 0;

        const eleheadsearch = ele.byClassAll("searchformsmall");
        if (eleheadsearch.length > 0) eleheadsearch[0].style.display = "none";
    }

    search(term, options = {}, cb = () => {}, limit = 48, offset = 0)
    {
        const targetEle = options.targetEle;

        let params = "s=" + term;
        this.lastOptions = options;
        if (!options.count)
        {
            this.lastOptions.limit = limit;
            this.lastOptions.offset = offset;
        }
        this.lastTerm = term;

        if (options.order)
        {
            params += "&or=" + options.order;
            const orderDropdown = document.getElementById("order");
            if (orderDropdown)
            {
                orderDropdown.value = options.order;
            }
        }
        if (options.what) params += "&w=" + options.what;

        if (options.count)
        {
            params += "&count=" + true;
        }
        else
        {
            limit = Number(limit);
            offset = Number(offset);
            if (limit || limit === 0)
            {
                params += "&l=" + limit;
            }
            if (offset)
            {
                params += "&o=" + offset;
            }
        }

        let url = "search?" + params;

        const doUserSearch = term ? term.length > 2 : false;
        if (options.what === "u" && !doUserSearch)
        {
            if (cb) cb(null, { "numResults": 0 });
            const usersTab = ele.byId("tab_users");
            if (usersTab.classList.contains("active")) ele.show(usersTab);
        }
        else
        {
            api.get(
                url,
                (result) =>
                {
                    if (cb) cb(null, result, targetEle);
                },
                (res) =>
                {
                    console.log(res);
                });
        }
    }

    getCount(targetEle, fromUserInteraction = false)
    {
        const options = JSON.parse(JSON.stringify(this.lastOptions));
        options.count = true;
        options.what = targetEle.dataset.tabName;
        options.targetEle = targetEle;

        if (targetEle.id === "tab_users")
        {
            const doUserSearch = this.lastTerm ? this.lastTerm.length > 2 : false;
            if (!doUserSearch)
            {
                if (targetEle.classList.contains("active"))
                {
                    targetEle.innerHTML += " <span class=\"tab-bar-count\">(0)</span> ";
                    ele.show(targetEle);
                }
                return;
            }
            else
            {
                ele.show(targetEle);
            }
        }

        if (targetEle.id === "tab_ops")
        {
            const doOpSearch = this.lastTerm ? this.lastTerm.length > 2 : false;
            if (!doOpSearch)
            {
                if (targetEle.classList.contains("active"))
                {
                    targetEle.innerHTML += " <span class=\"tab-bar-count\">(0)</span> ";
                    ele.show(targetEle);
                }
                return;
            }
            else
            {
                ele.show(targetEle);
            }
        }

        this.search(this.lastTerm, options, (err, re) =>
        {
            targetEle.innerHTML += " <span class=\"tab-bar-count\">(" + re.numResults + ")</span> ";
        });
    }

    showResults(targetEle, fromUserInteraction = false)
    {
        const tabDefaults = this._defaultOptions[targetEle.dataset.tabName];
        const options = {
            ...tabDefaults,
            "what": targetEle.dataset.tabName,
            "count": false,
        };
        const term = this.lastTerm;

        const limit = this.lastOptions.limit;
        let offset = this.lastOptions.offset;
        if (fromUserInteraction)
        {
            offset = 0;
            const searchParams = new URLSearchParams();
            if (term) searchParams.set("s", term);
            if (options.order && options.order != tabDefaults.order)
            {
                searchParams.set("or", options.order);
            }
            let historyUrl = "/patches";
            if (searchParams.toString()) historyUrl += "?" + searchParams.toString();
            historyUrl += "#" + options.what;
            history.pushState(null, null, historyUrl);
        }
        else
        {
            if (this.lastOptions.order && this.lastOptions.order !== tabDefaults.order) options.order = this.lastOptions.order;
        }

        const orderEle = ele.byId("order-tab-bar");
        if (orderEle)
        {
            if (options.orderFields && options.orderFields.length > 0)
            {
                orderEle.querySelectorAll("li").forEach((li) =>
                {
                    ele.hide(li);
                    li.classList.remove("active");
                    options.orderFields.forEach((field) =>
                    {
                        if (li.classList.contains(field)) ele.show(li);
                    });
                    if (li.classList.contains(options.order)) li.classList.add("active");
                });
                ele.show(orderEle);
            }
            else
            {
                ele.hide(orderEle);
            }
        }

        this.search(term, options, (err, result) =>
        {
            let html = "";
            let i = 0;
            const append = false;

            if (result.tags && result.tags.length > 0)
            {
                html += "<div class=\"cute-12-phone\">Related tags: ";
                for (i = 0; i < result.tags.length; i++)
                {
                    if (result.tags[i].tag && result.tags[i].tag !== "") html += "<a class=\"tag \" href=\"/patches?s=" + result.tags[i].tag + "\">" + result.tags[i].tag + "</a> ";
                }

                html += "</div><br/>";
            }

            if (result.projects)
            {
                for (i in result.projects)
                {
                    const project = result.projects[i];
                    let displayedDate = "published";
                    if (project.allowEdit) displayedDate = "updated";
                    const projectInfo = src_client.getHandleBarHtml("project_info", { "project": project, "user": { "_id": project.userId, "username": project.cachedUsername }, "displayedDate": displayedDate });
                    html += src_client.getHandleBarHtml("project", { "project": project, "projectInfo": projectInfo });
                }
            }

            if (result.users)
            {
                for (i in result.users)
                {
                    html += src_client.getHandleBarHtml("user", result.users[i]);
                }
            }

            if (result.items)
            {
                for (i in result.items)
                {
                    html += src_client.getHandleBarHtml("op", result.items[i]);
                }
            }

            if (html.length === 0)
            {
                let emtpyText = "No Results";
                if (!this.lastOptions.term)
                {
                    if (targetEle.dataset.tabName === "ops") emtpyText += ", enter a searchword to find ops.";
                    if (targetEle.dataset.tabName === "u") emtpyText += ", enter a searchword to find users.";
                }
                html = "<div class=\"cute-12-tablet left\"><h3>" + emtpyText + "</h3></div>";
            }

            if (!append) targetEle.innerHTML = html;
            else targetEle.innerHTML += html;
            if (result.pagination)
            {
                src_client.tabs.initPagination(ele.byId("pagination"), result.pagination, limit, offset, (newLimit, newOffset) =>
                {
                    ele.show(ele.byId("pagination"));
                    this.lastOptions.limit = newLimit;
                    this.lastOptions.offset = newOffset;
                    this.setWhat(options.what, options.order, newLimit, newOffset);
                });
            }
            else
            {
                ele.hide(ele.byId("pagination"));
            }
        }, limit, offset);
    }

    setWhat(val, order, limit, offset)
    {
        limit = Number(limit);
        offset = Number(offset);
        let newSearch = "?s=" + this.lastTerm;
        if (order)
        {
            newSearch += "&or=" + order;
        }
        if (limit || limit === 0)
        {
            newSearch += "&l=" + limit;
        }
        if (offset)
        {
            newSearch += "&o=" + offset;
        }
        window.location.search = newSearch;
        history.pushState(null, null, "#" + val);
    }

    setOrder(val)
    {
        this.lastOptions.order = val;
        this.setWhat(this.lastOptions.what, val, this.lastOptions.limit, this.lastOptions.offset);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_error_report.js


class PageErrorReport
{
    constructor(targetElement)
    {
        const locationHash = window.location.hash.split("#")[1];
        if (locationHash)
        {
            const elError = ele.byId(locationHash);
            if (elError)
            {
                ele.toggle(elError);
                elError.scrollIntoView({ "block": "center" });
            }
        }

        const allErrorTabs = ele.byQueryAll(".errordata .tab-bar li");
        allErrorTabs.forEach((tab) =>
        {
            tab.addEventListener("click", () =>
            {
                const errorId = tab.dataset.id;
                const tabName = tab.dataset.tabName;
                const tabs = ele.byQueryAll("#error" + errorId + " .tab-bar li");
                tabs.forEach((t) => { t.classList.remove("active"); });
                tab.classList.add("active");

                const contents = ele.byQueryAll("#error" + errorId + " .content");
                contents.forEach((content) => { content.classList.add("hidden"); });
                const content = ele.byQuery("#error" + errorId + " .content." + tabName);
                content.classList.remove("hidden");
            });
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_maintenance.js



class PageAdminMaintenance
{
    constructor(targetElement)
    {
        const now = new Date();
        targetElement.value = now.toISOString()
            .split("T")[0];
    }

    toggleMaintenance()
    {
        api.get("admin/togglemaintenance", () => { document.location.reload(); });
    }

    scheduleMaintenance()
    {
        api.post("admin/schedulemaintenance", {
            "date": ele.byId("maintenance-schedule-date").value,
            "time": ele.byId("maintenance-schedule-time").value
        }, () => { document.location.reload(); });
    }

    removeMaintenance()
    {
        api.post("admin/schedulemaintenance?remove=true", {}, () => { document.location.reload(); });
    }

    postAnnouncement()
    {
        api.post("admin/announcement", { "message": document.getElementById("announcement").value, "level": document.getElementById("annoucement_level").value }, () => { document.location.reload(); });
    }

    removeAnnouncement()
    {
        api.delete("admin/announcement", {}, () => { document.location.reload(); });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_activity.js




class PageAdminActivity
{
    constructor(_targetElement)
    {
        this.updateActivity(true);
        this.updateProjects();
    }

    updateActivity(includeInactive = false)
    {
        let apiUrl = "admin/activity";
        if (includeInactive) apiUrl += "?inactive=true";
        api.get(apiUrl, (res) =>
        {
            const statsEle = ele.byId("stats");
            const activityEle = ele.byId("activity");
            const users = res.users;
            const feed = res.feed;
            let count24h = 0;
            const userTable = { "cols": [], "rows": [] };
            users.forEach((user) =>
            {
                let in24h = user.secondsAgo <= 24 * 60 * 60;
                if (in24h)count24h++;

                let location = user.ip || "";
                if (user.geo)location = user.geo.country + " - " + user.geo.city;
                const row = [
                    "<a href=\"/user/" + user.username + "\">" + user.username + "</a>",
                    user.ago,
                    user.lastUrl,
                    "<a href=\"https://ipinfo.io/" + user.ip + "\">" + location + "</a>"
                ];
                userTable.rows.push(row);
            });
            src_client.setHandleBarHtml("table", userTable, activityEle);
            const feedTable = { "cols": [], "rows": [] };
            let lastEntry = { "initiator": { }, "title": null, "description": null };
            feed.forEach((feedEntry) =>
            {
                if (lastEntry.initiator.username !== feedEntry.initiator.username && lastEntry.title !== feedEntry.title && lastEntry.description !== feedEntry.description)
                {
                    const m = moment(feedEntry.updated);
                    let displayDate = m.fromNow();
                    if (m.isBefore(moment().subtract(7, "days"))) displayDate = moment(feedEntry.updated).format(client_contstants.DATE_FORMAT_RELATIVEDATE_FULL);

                    const row = [
                        "<a href=\"/user/" + feedEntry.initiator.username + "\">" + feedEntry.initiator.username + "</a>",
                        displayDate,
                        feedEntry.title,
                        feedEntry.description,
                        "<a href=\"" + feedEntry.referenceUrl + "\">link</a>"
                    ];
                    feedTable.rows.push(row);
                }
                lastEntry = feedEntry;
            });
            src_client.setHandleBarHtml("table", feedTable, ele.byId("activityFeed"));
            ele.byId("activitystats").innerHTML = "<h2 style=\"margin-top: 0;\">" + count24h + "</h2>users in 24h";
            if (res.inactive)
            {
                const inactiveEle = ele.byId("inactivitystats");
                let inactiveHtml = "";
                if (res.inactive.unconfirmed) inactiveHtml += "<div class=\"cute-3-tablet\"><h2 style=\"margin-top: 0; color: var(--middle-grey);\">" + res.inactive.unconfirmed + "</h2>unconfirmed emails</div>";
                if (res.inactive.neverLoggedIn) inactiveHtml += "<div class=\"cute-3-tablet\"><h2 style=\"margin-top: 0; color: var(--middle-grey);\">" + res.inactive.neverLoggedIn + "</h2>never logged in</div>";
                if (res.inactive.longTimeNoLogin) inactiveHtml += "<div class=\"cute-3-tablet\"><h2 style=\"margin-top: 0; color: var(--middle-grey);\">" + res.inactive.longTimeNoLogin + "</h2>no login in " + res.inactive.yearsToInactive + " years</div>";
                inactiveEle.innerHTML = inactiveHtml;
            }
            src_client.tables.initTables(statsEle.querySelectorAll("table.sortable"));
            setTimeout(this.updateActivity.bind(this), 15000);
        });
    }

    updateProjects()
    {
        api.get("admin/latest", (res) =>
        {
            let html = "";
            for (let i = 0; i < res.length; i++)
            {
                html += src_client.getHandleBarHtml("project_small", res[i]);
            }

            ele.byId("latestpatches").innerHTML = "<div class=\"row\">" + html + "</div>";
            setTimeout(this.updateActivity.bind(this), 30000);
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_notifications.js



class PageAdminNotifications
{
    deleteSub(button, username, subId, topic, channel)
    {
        if (confirm("delete " + topic + " for " + username + " via " + channel + "?"))
        {
            src_client.buttons.startSavingAnimButton(button);
            api.delete("activityfeed/" + subId, {}, () =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                window.location.reload();
            }, (e) =>
            {
                console.log("e", e);
                src_client.buttons.stopSavingAnimButton(button, true, true);
            });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_ops.js


class PageAdminOps
{
    constructor(targetElement)
    {
        api.get("ops/stats", (res) =>
        {
            let html = "<table class=\"admintable\">";
            html += "<tr>";
            html += "<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>";
            html += "<th>&nbsp;&nbsp;</th>";
            html += "<th>&nbsp;&nbsp;</th>";
            html += "<th>&nbsp;&nbsp;</th>";
            html += "<th>name&nbsp;&nbsp;</th>";
            html += "<th>summary&nbsp;&nbsp;</th>";
            html += "<th>op example&nbsp;&nbsp;</th>";
            html += "<th>testcase&nbsp;&nbsp;</th>";
            html += "<th>layout&nbsp;&nbsp;</th>";
            html += "<th>hasOpId&nbsp;&nbsp;</th>";

            html += "<th>code sucks&nbsp;&nbsp;</th>";
            html += "<th>lines&nbsp;&nbsp;</th>";
            html += "<th>libs&nbsp;&nbsp;</th>";
            html += "</tr>";

            for (let i in res.active)
            {
                html += this.getAdminOpRow(res.active[i], false);
            }

            for (let i in res.deprecated)
            {
                html += this.getAdminOpRow(res.deprecated[i], true);
            }

            html += "</table>";
            document.getElementById("stats").innerHTML = html;
        });
    }

    getAdminOpRow(op, deprecated)
    {
        let data = op;
        data.opGood = (op.hasDoc && op.hasExample && op.hasTest && !op.containsThis && !op.containsSelf && !op.containsApply && !op.containsConsole && !op.containsVal) == true;

        let points = 0;
        if (op.hasSummary)points += 3;
        if (op.hasDoc)points += 5;
        if (op.hasExample)points += 5;
        if (op.hasOpExample)points += 5;
        if (op.hasTest)points += 5;
        if (op.hasLayout)points += 3;
        if (!op.containsThis)points++;
        if (!op.containsSelf)points++;
        if (!op.containsApply)points++;
        if (!op.containsConsole)points++;
        if (!op.containsVal)points++;

        data.point = points;

        let g = points / 26 / 1.3;
        let r = 1.0 - points / 19;

        data.color = "background-color:rgb(" + (Math.round(r * 255)) + "," + (Math.round(g * 255)) + ",20);";
        let style = "";

        if (deprecated)style += "opacity:0.3;";
        if (op.invalid)style += "background-color:var(--warning);";

        data.style = style;

        data.warnings = "";
        for (let j in op.srcWarnings)
        {
            data.warnings += "[" + op.srcWarnings[j].id + "] ";
        }

        data.invalid = "";
        if (op.invalid) data.invalid += "[invalid]";

        data.oplibs = "";
        if (op.libs) data.oplibs = op.libs.join(" ");

        return web.getHandleBarHtml("admin_op", data);
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_user.js




class PageAdminUser
{
    constructor(targetElement)
    {
        const userId = targetElement.dataset.userid;
        let url = new URL(window.location.href);
        let limit = url.searchParams.get("l") || 48;
        let offset = url.searchParams.get("o");

        this.projects = src_client.projects;
        this.projects.getUserProjects(userId, true, limit, offset);
        const rolesTab = ele.byId("roles");
        const autoSuggests = rolesTab.querySelectorAll("[data-autosuggest]");
        src_client.initializeAutosuggestsFromApi(autoSuggests);
    }

    removeRole(button)
    {
        src_client.buttons.startSavingAnimButton(button);

        const key = button.dataset.key;
        const userId = button.dataset.userId;

        api.delete(
            "user_roles/user/" + userId + "/" + key,
            {},
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false);
                const errorEle = ele.byId("role-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- removing role not possible: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    addRole(button)
    {
        src_client.buttons.startSavingAnimButton(button);

        const suggestField = ele.byId("user-add-role");
        const key = suggestField.dataset.autosuggestValue || suggestField.value;
        const userId = suggestField.dataset.userId;

        api.post(
            "user_roles/user/" + userId + "/" + key,
            {},
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false);
                const errorEle = ele.byId("role-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- adding role not possible: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    getOpsTable(targetElement)
    {
        api.get("admin/user/" + targetElement.dataset.userId + "/ops", (res) =>
        {
            if (res && res.data)
            {
                const patchesTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.patches });
                const usersTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.users });
                const teamsTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.teams });
                const extensionsTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.extensions });
                const baseTable = src_client.getHandleBarHtml("settings_mydata_ops_table", { "ops": res.data.base });
                src_client.setHandleBarHtml("settings_mydata_ops", { "ops": res.data, patchesTable, usersTable, teamsTable, extensionsTable, baseTable, "hideDownload": true }, targetElement);
                src_client.tabs.initTabs(targetElement.querySelectorAll("ul.tab-bar li"));
            }
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_users.js




class PageAdminUsers
{
    constructor(targetElement)
    {
        const url = new URL(window.location.href);
        const limit = url.searchParams.get("l") || 50;
        const offset = url.searchParams.get("o");
        let pagination = targetElement.dataset.pagination;
        pagination = src_client.parseDustJson(pagination, {});

        src_client.tabs.initPagination(ele.byQuery(".adminUsersPagination"), pagination, limit, offset, (newLimit, newOffset) =>
        {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("l", newLimit);
            searchParams.set("o", newOffset);
            window.location.search = searchParams.toString();
        });
    }

    adminDeleteUser(id)
    {
        if (id)
        {
            if (confirm("really delete " + id + " ?"))
            {
                api.delete(
                    "user/" + id,
                    {},
                    (res) =>
                    {
                        window.location.reload();
                    });
            }
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/namespaces/page_namespace_delete.js




class PageNamespaceDelete
{
    constructor(targetElement)
    {
        const namespace = targetElement.dataset.namespace;
        if (!namespace) return;

        const url = "namespace/" + namespace + "/dependencies";

        const loadingEle = ele.byId("checkDelete");
        const errorEle = ele.byQuery("#problems .error");
        const containerEle = ele.byId("problems");
        const hintEle = ele.byId("hints");
        const deleteButton = ele.byId("deletebutton");

        api.get(url, (response) =>
        {
            if (loadingEle) ele.hide(loadingEle);
            const count = response.data.opsCount || "";
            if (count)
            {
                if (errorEle)
                {
                    const countEle = errorEle.querySelector(".count");
                    if (count)
                    {
                        if (countEle && response.data) countEle.innerText = count;
                    }
                    if (containerEle) ele.show(containerEle);
                }
            }
            else
            {
                if (deleteButton) ele.show(deleteButton);
                if (hintEle) ele.show(hintEle);
            }
        }, (e) =>
        {
            let msg = e.msg || JSON.stringify(e);
            if (errorEle)
            {
                errorEle.innerText = "Error: " + msg;
                ele.show(containerEle);
            }
            if (loadingEle) ele.hide(loadingEle);
        });
    }

    deleteNamespace(button, name, successUrl)
    {
        const errorEle = ele.byId("problems");
        if (errorEle) ele.hide(errorEle);
        src_client.buttons.startSavingAnimButton(button);
        api.delete(
            "namespace/" + name,
            {},
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                if (successUrl)
                {
                    document.location.href = successUrl;
                }
                else
                {
                    document.location.reload();
                }
            },
            (e) =>
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
                let msg = e.msg || JSON.stringify(e);
                if (errorEle)
                {
                    const error = errorEle.querySelector(".error");
                    if (error)
                    {
                        error.innerText = "Failed to delete namespace: " + msg;
                        ele.show(errorEle);
                    }
                }
            });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/namespaces/page_namespace_edit.js




class PageNamespaceEdit
{
    updateNamespace(button, namespace)
    {
        src_client.buttons.startSavingAnimButton(button);
        const summaryEle = ele.byId("namespace-summary");
        const descriptionsEle = ele.byId("namespace-description");
        const visibilityEle = ele.byId("namespace-visibility");
        if (!summaryEle || !descriptionsEle) return;
        const data = { "summary": summaryEle.value, "description": descriptionsEle.value, "visibility": visibilityEle.value };
        api.post(
            "namespace/docs/" + namespace,
            data,
            () =>
            {
                src_client.buttons.stopSavingAnimButton(button);
                const searchParams = new URLSearchParams(window.location.search);
                if (searchParams.has("return"))
                {
                    document.location.href = searchParams.get("return");
                }
                else
                {
                    document.location.href = "/ops/" + namespace;
                }
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, true, true);
                let msg = res.msg || JSON.stringify(res);
                console.log(msg);
            });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/namespaces/page_namespaces.js
class PageNamespace
{

}

;// CONCATENATED MODULE: ./src_client/pages/patchlists/page_patchlist_edit.js





class PagePatchlistEdit
{
    constructor(targetElement)
    {
        this.patchLists = new PatchLists();
        const userTab = ele.byId("collaboration");
        const autoSuggests = userTab.querySelectorAll("[data-autosuggest]");
        src_client.initializeAutosuggestsFromApi(autoSuggests);
    }

    inviteListUser(button)
    {
        src_client.buttons.startSavingAnimButton(button);
        const name = ele.byId("list-inviteuser").dataset.autosuggestValue || ele.byId("list-inviteuser").value;
        const listId = ele.byId("list-id").value;
        const fullAccess = ele.byId("inviteWritePermission").value;
        let readOnly = (fullAccess !== "true");

        api.post(
            "patchlists/" + listId + "/members/" + name,
            {
                "readOnly": readOnly
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(button, false);
                const errorEle = ele.byId("invite-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- adding not possible: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    removeListMember(el)
    {
        let r = confirm("are you sure? remove from list?");

        if (r)
        {
            const userId = el.dataset.userid;
            const listId = ele.byId("list-id").value;
            api.delete(
                "patchlists/" + listId + "/members/" + userId,
                {},
                (res) =>
                {
                    src_client.buttons.stopSavingAnimButton(el, false);
                    document.location.reload();
                },
                (res) =>
                {
                    src_client.buttons.stopSavingAnimButton(el, false);
                    const errorEle = ele.byId("invite-error");
                    if (errorEle)
                    {
                        const target = errorEle.querySelector(".warn-hint");
                        if (target) target.innerText = "- removal not possible: \"" + res.msg + "\"";
                        ele.show(errorEle);
                    }
                });
        }
    }

    makeListOwner(el)
    {
        const userId = el.dataset.userid;
        const listId = ele.byId("list-id").value;
        api.post(
            "patchlists/" + listId + "/owner",
            {
                "userId": userId
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(el, false);
                document.location.reload();
            },
            (res) =>
            {
                src_client.buttons.stopSavingAnimButton(el, false);
                const errorEle = ele.byId("invite-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- removal not possible: \"" + res.msg + "\"";
                    ele.show(errorEle);
                }
            });
    }

    setListPermissions(value, userId, cb = false)
    {
        let fullAccess = (value === "fullAccess");
        const listId = ele.byId("list-id").value;
        api.put("patchlists/" + listId + "/" + userId + "/permissions/write/" + fullAccess, {}, () =>
        {
            if (cb)
            {
                cb();
            }
            else
            {
                document.location.reload();
            }
        });
    }

    addTeam(teamId)
    {
        const listId = ele.byId("list-id").value;
        const errorEle = ele.byId("invite-error");
        if (teamId)
        {
            api.post("patchlists/" + listId + "/teams/" + teamId, {}, (response) =>
            {
                src_client.buttons.stopSavingAnimButton();
                document.location.reload();
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton(false, false);
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- adding team not possible: \"" + e.msg + "\"";
                    ele.show(errorEle);
                }
            });
        }
        else
        {
            src_client.buttons.stopSavingAnimButton(false, false);
            if (errorEle)
            {
                const target = errorEle.querySelector(".warn-hint");
                if (target) target.innerText = "- Unknown team or insufficient permissions";
                ele.show(errorEle);
            }
        }
    }

    removeTeam(teamId)
    {
        const listId = ele.byId("list-id").value;
        api.delete("patchlists/" + listId + "/teams/" + teamId, {}, (response) =>
        {
            document.location.reload();
        }, (e) =>
        {
            src_client.buttons.stopSavingAnimButton(false, false);
            const errorEle = ele.byId("invite-error");
            if (errorEle)
            {
                const target = errorEle.querySelector(".warn-hint");
                if (target) target.innerText = "- removal not possible: \"" + e.msg + "\"";
                ele.show(errorEle);
            }
        });
    }

    removeOp(listId, opId)
    {
        let r = confirm("are you sure? remove op?");
        if (r)
        {
            api.delete("patchlists/" + listId + "/ops/" + opId, {}, (response) =>
            {
                document.location.reload();
            }, (e) =>
            {
                src_client.buttons.stopSavingAnimButton(false, false);
                const errorEle = ele.byId("patch-error");
                if (errorEle)
                {
                    const target = errorEle.querySelector(".warn-hint");
                    if (target) target.innerText = "- removal not possible: \"" + e.msg + "\"";
                    ele.show(errorEle);
                }
            });
        }
    }

    deletePatchlist(id, name, successUrl = "/mypatchlists")
    {
        if (confirm("Really delete " + name + " ?"))
        {
            api.delete(
                "patchlists/" + id,
                {},
                (res) =>
                {
                    if (successUrl)
                    {
                        document.location.href = successUrl;
                    }
                    else
                    {
                        const successMsg = ele.byId("successmsg");
                        if (successMsg)
                        {
                            ele.show(successMsg);
                        }
                        else
                        {
                            document.location.reload();
                        }
                    }
                },
                (res) =>
                {
                    const errorMsg = ele.byId("errormsg");
                    if (errorMsg)
                    {
                        const msgEl = errorMsg.querySelector(".error");
                        msgEl.innerText = res.msg;
                        ele.show(errorMsg);
                    }
                });
        }
    }
}

;// CONCATENATED MODULE: ./src_client/pages/patchlists/page_patchlist.js




class PagePatchlist
{
    constructor(targetElement)
    {
        this.listId = targetElement.dataset.listid;
        this.patchLists = new PatchLists();
        this.patchLists.displayPatchList(ele.byId("patchlist"), false, this.listId, () =>
        {
            src_client.favs.showFavToggle(ele.byId("toggleFav"));
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/ops/page_ops_changelog.js




class PageOpsChangelog
{
    constructor(targetElement)
    {
        this.opName = targetElement.dataset.opname;
        const container = targetElement.querySelector("#changelog");
        if (container)
        {
            this.displayChangelog(container);
        }
    }

    displayChangelog(targetElement)
    {
        if (!targetElement) return;
        const errorBlock = ele.byId("changeLogError");
        if (errorBlock) ele.hide(errorBlock);
        const emptyBlock = ele.byId("changeLogEmpty");
        if (emptyBlock) ele.hide(emptyBlock);
        let apiUrl = "ops/changelog";
        if (this.opName) apiUrl += "/" + this.opName;
        const from = src_client_web.getQueryVariable("from") || 0;
        const to = src_client_web.getQueryVariable("to") || Date.now();
        const limit = src_client_web.getQueryVariable("l");
        const offset = src_client_web.getQueryVariable("o");
        apiUrl += "?from=" + from;
        apiUrl += "&to=" + to;
        apiUrl = src_client_web.tabs.addPagination(apiUrl, limit, offset);
        api.get(apiUrl, (res) =>
        {
            if (res && res.data && res.data.length > 0)
            {
                src_client_web.setHandleBarHtml("ops_changelog", { "changes": res.data }, targetElement);
                src_client_web.tabs.initPagination(targetElement, res.pagination);
            }
            else
            {
                targetElement.innerText = "";
                if (emptyBlock) ele.show(emptyBlock);
            }
        }, (e) =>
        {
            console.error("failed to load ops changelog", e);
            if (errorBlock)
            {
                let msg = e.msg;
                if (e.code === 503)
                {
                    msg = "You lack permissions to the requested namespace.";
                }
                errorBlock.innerText = "Failed to load changelog: " + msg;
                ele.show(errorBlock);
            }
            targetElement.innerText = "";
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_patchlists.js




class PageAdminPatchlists
{
    constructor()
    {
        this.patchLists = new PatchLists();
    }
}

;// CONCATENATED MODULE: ./src_client/pages/user/page_mypatchlists.js


class PageMyPatchLists
{
    constructor()
    {
        this.patchLists = new PatchLists();
    }
}

;// CONCATENATED MODULE: ./src_client/pages/patchlists/page_patchlists_public.js


class PagePatchlistsPublic
{
    constructor()
    {
        this.patchLists = new PatchLists();
    }
}

;// CONCATENATED MODULE: ./src_client/pages/page_browserspeed.js


class PageBrowserSpeed
{
    constructor()
    {
        this.browser = new Browser();
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_teams.js




class PageAdminTeams
{
    constructor(targetElement)
    {
        const url = new URL(window.location.href);
        const limit = url.searchParams.get("l") || 50;
        const offset = url.searchParams.get("o");
        let pagination = targetElement.dataset.pagination;
        pagination = src_client.parseDustJson(pagination, {});

        src_client.tabs.initPagination(ele.byQuery(".adminTeamsPagination"), pagination, limit, offset, (newLimit, newOffset) =>
        {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("l", newLimit);
            searchParams.set("o", newOffset);
            window.location.search = searchParams.toString();
        });
    }
}

;// CONCATENATED MODULE: ./src_client/pages/admin/page_admin_backups.js




class PageAdminBackups
{
    constructor(targetElement)
    {
        const url = new URL(window.location.href);
        this._order = url.searchParams.get("or") || "count";

        const orderTabs = ele.byQueryAll("#order-tab-bar li");
        orderTabs.forEach((orderTab) =>
        {
            if (orderTab.classList.contains(this._order)) orderTab.classList.add("active");
            orderTab.addEventListener("click", () =>
            {
                const sort = orderTab.dataset.sort;
                window.location.search = "?or=" + sort;
            });
        });

        let limit = url.searchParams.get("l") || 50;
        let offset = url.searchParams.get("o") || 0;
        const apiUrl = src_client.tabs.addPagination("admin/backups?or=" + this._order, limit, offset);

        const resultEle = ele.byId("backup_table");
        const statusEle = ele.byId("status");
        api.get(apiUrl, (res) =>
        {
            const userTable = { "cols": [], "rows": [] };
            if (res.data && res.data.patches)
            {
                res.data.patches.forEach((p) =>
                {
                    let sizeMb = p.sizeMb || 0;
                    let parsed = parseFloat(sizeMb);
                    if (!parsed) parsed = 0;
                    parsed = parsed.toFixed(2);

                    const row = [
                        "<a href=\"/p/" + p.projectId + "\">" + p.name + "</a>",
                        p.numBackups + " Backups",
                        parsed + " MB"
                    ];
                    userTable.rows.push(row);
                });
            }
            statusEle.innerText = res.data.count + " backups in " + res.data.patchCount + " patches (" + res.data.sizeGb + "GB)";
            if (this._order === "size") statusEle.innerText += " - showing biggest first.";
            if (this._order === "count") statusEle.innerText += " - showing \"most backups\" first.";
            ele.show(statusEle);
            src_client.setHandleBarHtml("table", userTable, resultEle);
            src_client.tabs.initPagination(resultEle, res.pagination, limit, offset);
        }, (err) =>
        {
            resultEle.innerText = err;
        });
    }

}

;// CONCATENATED MODULE: ./src_client/index.js
























































window.ele = ele;
document.addEventListener("DOMContentLoaded", () =>
{
    handlebars.initHandleBarsHelper();
    const envEle = ele.byId("environmentVars");
    if (envEle)
    {
        src_client_web.init(envEle.dataset.loggedin, envEle.dataset.env, envEle.dataset.title);
    }
    else
    {
        src_client_web.init();
    }
    window.web = src_client_web;

    const pageLoaders = {
        "pageOp": PageOp,
        "pageHome": PageHome,
        "pagePatch": PagePatch,
        "pageError": PageError,
        "pageProjectSettings": PageProjectSettings,
        "pageChangelog": PageChangelog,
        "pageTest": PageTest,
        "pageTests": PageTests,
        "pageTestRun": PageTestRun,
        "pageTestResult": PageTestResult,
        "pageActivityFeed": PageActivityFeed,
        "pageMyFavs": PageMyFavs,
        "pageMyPatches": PageMyPatches,
        "pageMyPatchLists": PageMyPatchLists,
        "pageMyData": PageMyData,
        "pageProfileSettings": PageProfileSettings,
        "pageUser": PageUser,
        "pageTeam": PageTeam,
        "pageTeamSettings": PageTeamSettings,
        "pageTeamTodos": PageTeamTodos,
        "pageTeamCreate": PageTeamCreate,
        "pageOpDelete": PageOpDelete,
        "pageOpEdit": PageOpEdit,
        "pageOpRename": PageOpRename,
        "pageOpsChangelog": PageOpsChangelog,
        "pageAssetDelete": PageAssetDelete,
        "pageAssetDependencies": PageAssetDependencies,
        "pagePatchDependencies": PagePatchDependencies,
        "pageExamples": PageExamples,
        "pageTags": PageTags,
        "pageProjectExport": PageProjectExport,
        "pageMadeWithCables": PageMadeWithCables,
        "pageLanding": PageLanding,
        "pageBrowser": PageBrowser,
        "pageBrowserEvents": PageBrowserEvents,
        "pageBrowserSpeed": PageBrowserSpeed,
        "pageSearch": PageSearch,
        "pageAdminActivity": PageAdminActivity,
        "pageAdminBackups": PageAdminBackups,
        "pageErrorReport": PageErrorReport,
        "pageAdminMaintenance": PageAdminMaintenance,
        "pageAdminNotifications": PageAdminNotifications,
        "pageAdminOps": PageAdminOps,
        "pageAdminPatchlists": PageAdminPatchlists,
        "pageAdminUser": PageAdminUser,
        "pageAdminUsers": PageAdminUsers,
        "pageAdminTeams": PageAdminTeams,
        "pageNamespaceDelete": PageNamespaceDelete,
        "pageNamespaceEdit": PageNamespaceEdit,
        "pageNamespace": PageNamespace,
        "pagePatchlistEdit": PagePatchlistEdit,
        "pagePatchlist": PagePatchlist,
        "pagePatchlistsPublic": PagePatchlistsPublic
    };

    const usedPageLoaders = ele.byQueryAll("[data-page-load]");
    usedPageLoaders.forEach((loaderElement) =>
    {
        const loaderName = loaderElement.dataset.pageLoad;
        if (pageLoaders[loaderName])
        {
            window.page = new pageLoaders[loaderName](loaderElement, src_client_web);
            window[loaderName] = window.page;
        }
        else
        {
            console.error("page loader not found for:", loaderName);
        }
    });

    const loadElements = ele.byQueryAll("[data-element-load]");
    loadElements.forEach((targetElement) =>
    {
        src_client_web.executeFunctionByName(targetElement.dataset.elementLoad, window, targetElement);
    });

    src_client_web.tabs.init();
    src_client_web.tables.init();
    src_client_web.cookies.showWarning();
    document.dispatchEvent(new Event("cablesWebReady"));
});

window.addEventListener("beforeunload", () =>
{
    src_client_web.isOnBeforeUnload = true;
});
/* harmony default export */ var src_client = (src_client_web);

}();
/******/ })()
;
var CABLES = CABLES || { "API": {}}; CABLES.API = CABLES.API || {}; CABLES.API.build = {"timestamp":1767030583684,"created":"2025-12-29T17:49:43.684Z","git":{"branch":"master","commit":"626dd4dff9c656f7dc01701b34414d02f39e5b34","date":"1767030525","message":"confirm hash"}};
//# sourceMappingURL=scripts.js.map
}
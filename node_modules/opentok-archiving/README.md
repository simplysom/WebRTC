![logo](../tokbox-logo.png)

# Accelerator Archiving for JavaScript

## Quick start

The OpenTok Archiving Accelerator Pack provides functionality you can add to your OpenTok applications that enables users to record, save, and retrieve OpenTok sessions.

This section shows you how to use the accelerator pack.

## Install

```bash
$ npm install --save opentok-archiving
```

If using browserify or webpack:

```javascript
const archiving = require('opentok-archiving');
```

Otherwise, include the accelerator pack in your html:

```html
<script src="../your/path/to/opentok-archiving.js"></script>
```
 . . . and it will be available in global scope as `ArchivingAccPack`

-----------------

Click [here](https://www.npmjs.com/search?q=opentok-acc-pack) for a list of all OpenTok accelerator packs.

## Exploring the code

The `ArchivingAccPack` class in opentok-archiving.js is the backbone of the archiving feature for the app.

This class provides functions for starting and stopping sessions archiving.

The [Accelerator Core JS](https://github.com/opentok/accelerator-core-js#configuration) shows the best-practices for Javascript to use the Accelerator Archiving.

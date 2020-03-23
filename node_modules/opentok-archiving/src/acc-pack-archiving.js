/* global ArchivingAccPack define */
(function () {
  /** Include external dependencies */
  let $;

  if (typeof module === 'object' && typeof module.exports === 'object') {
    /* eslint-disable import/no-unresolved */
    $ = require('jquery');
    /* eslint-enable import/no-unresolved */
  } else {
    $ = this.$;
  }

  let _startURL;
  let _stopURL;
  let _currentArchive;
  let _shouldAppendControl;
  let _recording = false;
  let _controlAdded = false;
  let _accPack;
  let _session;

  const _triggerEvent = (event, data) => {
    if (_accPack) {
      _accPack.triggerEvent(event, data);
    }
  };

  const _waitingModalTemplate = () => [
    '<div id="otsArchivingModal" class="ots-archiving-modal">',
    '<div class="modal-content">',
    '<div class="modal-header">',
    '<h2>Archive is being prepared</h2>',
    '<span id="closeArchiveModal" class="close-button"></span>',
    '</div>',
    '<div class="modal-info">', // eslint-disable-next-line max-len
    '<span class="message"> Your session archive file is now being prepared. You\'ll recieve a notification as soon as it\'s ready.  Please be patient, this won\'t take long.</span>',
    '</div>',
    '<div class="modal-buttons">',
    '<div id="closeArchiveModalBtn" class="btn ok" target="_blank">Ok, Thanks!</div>',
    '</div>',
    '</div>',
    '</div>'
  ].join('\n');

  const _readyModalTemplate = (archive) => {
    const date = new Date(null);
    date.setSeconds(archive.duration);
    const duration = date.toISOString().substr(11, 8);
    const size = `${(archive.size / (1000 * 1000)).toString().slice(0, 5)}mb`;
    return [
      '<div id="otsArchivingModal" class="ots-archiving-modal">',
      '<div class="modal-content">',
      '<div class="modal-header">',
      '<h2>Archive is ready</h2>',
      '<span id="closeArchiveModal" class="close-button"></span>',
      '</div>',
      '<div class="modal-info">',
      `<span class="archive-id">${archive.id}</span>`, // eslint-disable-next-line max-len
      `<div class="archive-details">Archive details: ${duration} / ${size}</div>`,
      '</div>',
      '<div class="modal-buttons">',
      `<a href="${archive.url}" class="btn download" target="_blank">Download Archive</a>`,
      '</div>',
      '</div>',
      '</div>'
    ].join('\n');
  };

  /**
   * Displays a modal with the status of the archive.  If no archive object is passed,
   * the 'waiting' modal will be displayed.  If an archive object is passed, the 'ready'
   * modal will be displayed.
   * @param {Object} archive
   */
  const _displayModal = archive => {
    // Clean up existing modal
    const existingModal = document.getElementById('otsArchivingModal');
    existingModal && existingModal.remove();

    const template = archive ? _readyModalTemplate(archive) : _waitingModalTemplate();
    const modalParent = document.querySelector('#otsWidget') || document.body;
    const el = document.createElement('div');
    el.innerHTML = template;

    const modal = el.firstChild;
    modalParent.appendChild(modal);

    const closeModal = document.getElementById('closeArchiveModal');
    const closeModalBtn = document.getElementById('closeArchiveModalBtn');

    closeModal.onclick = () => modal.remove();
    if (closeModalBtn) {
      closeModalBtn.onclick = () => modal.remove();
    }
  };

  const start = () => {
    $.post(_startURL, { sessionId: _session.id })
      .then(archive => {
        _currentArchive = archive;
        _triggerEvent('startArchive', archive);
      })
      .fail(error => {
        _triggerEvent('archiveError', error);
      });
  };

  const stop = () => {
    _triggerEvent('stopArchive');
    _displayModal();
    $.post(_stopURL, { archiveId: _currentArchive.id })
      .then(function (data) {
        _displayModal(data);
        _triggerEvent('archiveReady', data);
      })
      .fail(function (error) {
        _triggerEvent('archiveError', error);
      });
  };

  const _appendControl = (container) => {
    const feedControls = document.querySelector(container);

    // eslint-disable-next-line max-len
    const btn = '<div class="ots-video-control circle archiving enabled" id="enableArchiving"></div>';

    const el = document.createElement('div');
    el.innerHTML = btn;

    const enableArchiving = el.firstChild;

    feedControls.appendChild(enableArchiving);

    _controlAdded = true;

    enableArchiving.onclick = () => {
      if (_recording) {
        _recording = false;
        document.querySelector('#enableArchiving').classList.remove('active');
        stop();
      } else {
        _recording = true;
        document.querySelector('#enableArchiving').classList.add('active');
        start();
      }
    };
  };

  const _registerEvents = () => {
    const events = ['startArchive', 'stopArchive', 'archiveReady', 'archiveError'];
    _accPack.registerEvents(events);
  };

  const _addEventListeners = () => {
    _accPack.registerEventListener('startCall', function () {
      if (_controlAdded) {
        document.getElementById('enableArchiving').classList.remove('ots-hidden');
      } else {
        _shouldAppendControl && _appendControl();
      }
    });

    _accPack.registerEventListener('endCall', function () {
      _shouldAppendControl && document.getElementById('enableArchiving').classList.add('ots-hidden');
    });
  };

  const _validateOptions = options => {
    const requiredOptions = ['session', 'startURL', 'stopURL'];

    requiredOptions.forEach(option => {
      if (!options[option]) {
        throw new Error(['OT: Archiving Accelerator Pack requires a', option].join(''));
      }
    });

    _session = options.session;
    _startURL = options.startURL;
    _stopURL = options.stopURL;
    _accPack = options.accPack;
    _shouldAppendControl = options.hasOwnProperty('appendControl') ? options.appendControl : true;
  };

  const ArchivingAccPack = options => {
    _validateOptions(options);

    const controlsContainer = options.controlsContainer || '#feedControls';
    _shouldAppendControl && _appendControl(controlsContainer);

    _registerEvents();
    _addEventListeners();
  };

  ArchivingAccPack.prototype = {
    constructor: ArchivingAccPack,
    start,
    stop
  };

  if (typeof exports === 'object') {
    module.exports = ArchivingAccPack;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return ArchivingAccPack;
    });
  } else {
    this.ArchivingAccPack = ArchivingAccPack;
  }
}.call(this));

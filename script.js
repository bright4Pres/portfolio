/* ══════════════════════════════════════════
   BRIGHT BASTASA — script.js
   Book mechanics + Screenshot modal
   ══════════════════════════════════════════ */

/* ────────────────────────────────────────
   PROJECT DATA
   Replace `screenshots` arrays with real
   image paths: ['img/proj1-1.png', ...]
   ──────────────────────────────────────── */
var PROJECTS = [
  {
    title: 'Personal Brand Website',
    screenshots: [
      { label: 'Home — Hero section', bg: 'ss-bg-1' },
      { label: 'About — Bio page', bg: 'ss-bg-2' },
      { label: 'Contact — Form view', bg: 'ss-bg-3' }
    ]
  },
  {
    title: 'Study Tracker',
    screenshots: [
      { label: 'Dashboard — Overview', bg: 'ss-bg-1' },
      { label: 'Session timer', bg: 'ss-bg-2' },
      { label: 'Subject log', bg: 'ss-bg-3' },
      { label: 'Goals tracker', bg: 'ss-bg-4' }
    ]
  },
  {
    title: 'Weather Dashboard',
    screenshots: [
      { label: 'Main view — Current weather', bg: 'ss-bg-1' },
      { label: 'Search — Location lookup', bg: 'ss-bg-2' },
      { label: 'Extended forecast', bg: 'ss-bg-3' }
    ]
  },
  {
    title: 'CSS Art Collection',
    screenshots: [
      { label: 'Piece I — Geometric study', bg: 'ss-bg-1' },
      { label: 'Piece II — Typography art', bg: 'ss-bg-2' },
      { label: 'Piece III — Animation loop', bg: 'ss-bg-3' },
      { label: 'Piece IV — UI experiment', bg: 'ss-bg-4' },
      { label: 'Piece V — Color study', bg: 'ss-bg-5' }
    ]
  }
];

/* ────────────────────────────────────────
   BOOK STATE
   ──────────────────────────────────────── */
var book         = $('.bk-book');
var viewBookLink = book.find('.bk-bookview');
var viewBackLink = book.find('.bk-bookback');
var changeColorLink = book.find('.change-color');
var colorContainers = book.find('.color-container');

var bookDefault = function () {
  book.data({ opened: false, flip: false })
      .removeClass('bk-viewback bk-viewinside')
      .addClass('bk-bookdefault');
};
var bookBack = function () {
  book.data({ opened: false, flip: true })
      .removeClass('bk-viewinside bk-bookdefault')
      .addClass('bk-viewback');
};
var bookInside = function () {
  book.data({ opened: true, flip: false })
      .removeClass('bk-viewback bk-bookdefault')
      .addClass('bk-viewinside');
};

bookDefault();

viewBackLink.on('click', function () {
  book.data('flip') ? bookDefault() : bookBack();
  return false;
});
viewBookLink.on('click', function () {
  bookInside();
  return false;
});

/* Click outside closes book */
$('html').on('click', function (e) {
  /* Don't close if modal is open */
  if ($('#screenshotModal').hasClass('active')) return false;
  if ($(e.target).parents('.bk-book').length === 0) {
    bookDefault();
    if (!colorContainers.hasClass('hidden')) changeColorLink.click();
  }
  return false;
});

/* ────────────────────────────────────────
   TINT / COLOR SWITCHER
   ──────────────────────────────────────── */
var colorLabel = (function () {
  var labels = ['⊹ Tint', '✓ Applied'];
  return function () { labels.push(labels.shift()); return labels[0]; };
})();

changeColorLink.click(function () {
  colorContainers.toggleClass('hidden');
  $(this).text(colorLabel());
});

var dynamicStyle = $('<style></style>').appendTo('head');

colorContainers.find('.color-square').click(function () {
  var color = $(this).attr('class').match(/background-color-([a-f0-9]{6})/i)[1];
  dynamicStyle.text(
    '.highlight { color: #' + color + '; }' +
    '.cover-role.highlight { color: #' + color + '; }' +
    '.avail-dot { background: #' + color + '; }' +
    '.contact-entry { border-left-color: #' + color + '; }' +
    '.back-mono { color: #' + color + '; }' +
    '.back-rule { background: #' + color + '; }' +
    '.cover-rule { background: #' + color + '; }' +
    '.modal-dot.active { background: #' + color + '; }' +
    '.proj-preview-card:hover { border-color: #' + color + '; }'
  );
});

/* ────────────────────────────────────────
   BOOKBLOCK SETUP
   ──────────────────────────────────────── */
var bookBlock         = $('.bb-bookblock');
var backCover         = bookBlock.parents('.bk-book').find('.bk-cover-back');
var backCoverBookBlock = bookBlock.clone();
backCoverBookBlock.appendTo(backCover);

var bbFirst = function () { bookBlock.bookblock('first');  backCoverBookBlock.bookblock('first'); };
var bbLast  = function () { bookBlock.bookblock('last');   backCoverBookBlock.bookblock('last'); };
var bbLastIndex = bookBlock.children().length - 1;

var bbNext = function () {
  if (book.data('flip'))    return bookDefault();
  if (!book.data('opened')) return bookInside();
  if (bookBlock.find('.bb-item:visible').index() === bbLastIndex)
    return bookBack(), bbFirst();
  bookBlock.bookblock('next');
  backCoverBookBlock.bookblock('next');
};

var bbPrev = function () {
  if (book.data('flip'))    return bbLast(), bookInside();
  if (!book.data('opened')) return bookBack();
  if (bookBlock.find('.bb-item:visible').index() === 0)
    return bookDefault();
  bookBlock.bookblock('prev');
  backCoverBookBlock.bookblock('prev');
};

bookBlock.children().add(backCoverBookBlock.children()).on({
  swipeleft:  function () { bbPrev(); return false; },
  swiperight: function () { bbPrev(); return false; },
  click: function (e) {
    /* Don't flip if clicking the project card */
    if ($(e.target).closest('.proj-preview-card').length) return;
    if ($(e.target).parents('.bk-cover-back').length === 0) bbNext();
    else bbPrev();
    return false;
  }
});

bookBlock.bookblock({ speed: 800, shadow: false });
backCoverBookBlock.bookblock({ speed: 800, shadow: false });

/* Keyboard nav */
var throttle = function (fn, limit, queueMax) {
  var last = +new Date, queued = 0;
  return function throttled() {
    var now = +new Date, args = [].slice.call(arguments);
    if (now - last > limit) {
      fn.apply(this, args); last = +new Date;
    } else {
      var bound = throttled.bind.apply(throttled, [this].concat(args));
      queued++;
      if (queued < queueMax) setTimeout(bound, last + limit - now);
    }
  };
};

$(document).keydown(throttle(function (e) {
  if ($('#screenshotModal').hasClass('active')) return; /* modal handles keys */
  var k = e.keyCode || e.which;
  if (k === 37) bbPrev();
  if (k === 39) bbNext();
}, 500, 2));

/* ────────────────────────────────────────
   SCREENSHOT MODAL
   ──────────────────────────────────────── */
var modal        = $('#screenshotModal');
var modalTitle   = $('#modalTitle');
var modalCounter = $('#modalCounter');
var modalFrame   = $('#modalFrame');
var modalDots    = $('#modalDots');
var arrowLeft    = $('#arrowLeft');
var arrowRight   = $('#arrowRight');
var modalClose   = $('#modalClose');

var currentProject = null;
var currentIndex   = 0;

/* Build screenshot placeholder HTML */
function buildScreenshot(ss, index) {
  return (
    '<div class="modal-screenshot ' + ss.bg + ' ' + (index === 0 ? 'active' : '') + '" data-index="' + index + '">' +
      '<div class="ss-mockbody">' +
        '<div class="ss-mockbar"></div>' +
        '<div class="ss-mockbar short"></div>' +
        '<div class="ss-mockbar accent"></div>' +
        '<div class="ss-mockrow"></div>' +
        '<div class="ss-mockrow"></div>' +
        '<div class="ss-mockrow"></div>' +
        '<div class="ss-mockrow"></div>' +
      '</div>' +
      '<span class="ss-label">' + ss.label + '</span>' +
    '</div>'
  );
}

/* Build dot nav */
function buildDots(count, active) {
  var html = '';
  for (var i = 0; i < count; i++) {
    html += '<span class="modal-dot' + (i === active ? ' active' : '') + '" data-dot="' + i + '"></span>';
  }
  return html;
}

/* Open modal */
function openModal(projectIndex) {
  currentProject = PROJECTS[projectIndex];
  currentIndex   = 0;

  modalTitle.text(currentProject.title);

  /* Build screens */
  modalFrame.empty();
  currentProject.screenshots.forEach(function (ss, i) {
    modalFrame.append(buildScreenshot(ss, i));
  });

  updateModal();
  modal.addClass('active');

  /* Stop book interaction while modal is open */
  e && e.stopPropagation && e.stopPropagation();
}

/* Update counter, dots, visibility */
function updateModal() {
  var total = currentProject.screenshots.length;
  modalCounter.text((currentIndex + 1) + ' / ' + total);
  modalDots.html(buildDots(total, currentIndex));

  /* Show active screenshot */
  modalFrame.find('.modal-screenshot').removeClass('active');
  modalFrame.find('[data-index="' + currentIndex + '"]').addClass('active');

  /* Arrow visibility */
  arrowLeft.css('opacity',  currentIndex === 0         ? '0.2' : '1');
  arrowRight.css('opacity', currentIndex === total - 1 ? '0.2' : '1');
}

/* Navigate */
function modalPrev() {
  if (currentIndex > 0) { currentIndex--; updateModal(); }
}
function modalNext() {
  if (currentIndex < currentProject.screenshots.length - 1) {
    currentIndex++; updateModal();
  }
}

/* Close modal */
function closeModal() {
  modal.removeClass('active');
  currentProject = null;
}

/* Event bindings */
$(document).on('click', '.proj-preview-card', function (e) {
  e.stopPropagation();
  var projIndex = parseInt($(this).data('project'), 10);
  openModal(projIndex);
});

arrowLeft.on('click',  function (e) { e.stopPropagation(); modalPrev(); });
arrowRight.on('click', function (e) { e.stopPropagation(); modalNext(); });
modalClose.on('click', function (e) { e.stopPropagation(); closeModal(); });

/* Click backdrop to close */
modal.on('click', function (e) {
  if ($(e.target).is(modal)) closeModal();
});

/* Dot clicks */
$(document).on('click', '.modal-dot', function (e) {
  e.stopPropagation();
  currentIndex = parseInt($(this).data('dot'), 10);
  updateModal();
});

/* Keyboard: arrows + escape inside modal */
$(document).on('keydown', function (e) {
  if (!modal.hasClass('active')) return;
  var k = e.keyCode || e.which;
  if (k === 37) modalPrev();
  if (k === 39) modalNext();
  if (k === 27) closeModal();
});

/* Swipe inside modal frame */
var touchStartX = null;
modalFrame[0].addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
modalFrame[0].addEventListener('touchend', function (e) {
  if (touchStartX === null) return;
  var dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { dx < 0 ? modalNext() : modalPrev(); }
  touchStartX = null;
});
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
    title: 'Canteen Mobile App (Flutter + Firebase)',
    screenshots: [
      { label: 'Login and role selection', src: 'screenshots/canteen-1.png', bg: 'ss-bg-1' },
      { label: 'Menu and ordering flow', src: 'screenshots/canteen-2.png', bg: 'ss-bg-2' },
      { label: 'Order management view', src: 'screenshots/canteen-3.png', bg: 'ss-bg-3' },
      { label: 'Sales summary and history', src: 'screenshots/canteen-4.png', bg: 'ss-bg-4' }
    ]
  },
  {
    title: 'eTala Library Database (Django + MySQL)',
    screenshots: [
      { label: 'Book catalog table', src: 'screenshots/etala-1.png', bg: 'ss-bg-1' },
      { label: 'Borrow and return records', src: 'screenshots/etala-2.png', bg: 'ss-bg-2' },
      { label: 'Admin dashboard stats', src: 'screenshots/etala-3.png', bg: 'ss-bg-3' },
      { label: 'Search and filter tools', src: 'screenshots/etala-4.png', bg: 'ss-bg-4' }
    ]
  },
  {
    title: 'SideStep Sneaker Website (Django + PostgreSQL)',
    screenshots: [
      { label: 'Storefront homepage', src: 'screenshots/sidestep-1.png', bg: 'ss-bg-1' },
      { label: 'Product details and checkout', src: 'screenshots/sidestep-2.png', bg: 'ss-bg-2' },
      { label: 'Auto-post API integration logs', src: 'screenshots/sidestep-3.png', bg: 'ss-bg-3' },
      { label: 'Orders and inventory panel', src: 'screenshots/sidestep-4.png', bg: 'ss-bg-4' }
    ]
  },
  {
    title: 'Intramurals AJAX Scoretracker',
    screenshots: [
      { label: 'Live team standings', src: 'screenshots/scoretracker-1.png', bg: 'ss-bg-1' },
      { label: 'Per-event scoring updates', src: 'screenshots/scoretracker-2.png', bg: 'ss-bg-2' },
      { label: 'Admin score input panel', src: 'screenshots/scoretracker-3.png', bg: 'ss-bg-3' },
      { label: 'Mobile live scoreboard view', src: 'screenshots/scoretracker-4.png', bg: 'ss-bg-4' }
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
var backCover = bookBlock.parents('.bk-book').find('.bk-cover-back');
var backCoverBookBlock = $();
var hasBookblock = typeof $.fn.bookblock === 'function' && bookBlock.length > 0;

var bbFirst = function () {};
var bbLast = function () {};

var bbNext = function () {
  if (book.data('flip')) return bookDefault();
  if (!book.data('opened')) return bookInside();
  return bookBack();
};

var bbPrev = function () {
  if (book.data('flip')) return bookInside();
  if (!book.data('opened')) return bookBack();
  return bookDefault();
};

if (hasBookblock) {
  backCoverBookBlock = bookBlock.clone();
  backCoverBookBlock.appendTo(backCover);

  bbFirst = function () {
    bookBlock.bookblock('first');
    backCoverBookBlock.bookblock('first');
  };

  bbLast = function () {
    bookBlock.bookblock('last');
    backCoverBookBlock.bookblock('last');
  };

  var bbLastIndex = bookBlock.children().length - 1;

  bbNext = function () {
    if (book.data('flip')) return bookDefault();
    if (!book.data('opened')) return bookInside();
    if (bookBlock.find('.bb-item:visible').index() === bbLastIndex) return bookBack(), bbFirst();
    bookBlock.bookblock('next');
    backCoverBookBlock.bookblock('next');
  };

  bbPrev = function () {
    if (book.data('flip')) return bbLast(), bookInside();
    if (!book.data('opened')) return bookBack();
    if (bookBlock.find('.bb-item:visible').index() === 0) return bookDefault();
    bookBlock.bookblock('prev');
    backCoverBookBlock.bookblock('prev');
  };

  bookBlock.children().add(backCoverBookBlock.children()).on({
    swipeleft: function () { bbPrev(); return false; },
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
}

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
  var imageHtml = ss.src
    ? '<img class="modal-image" src="' + ss.src + '" alt="' + ss.label + '" loading="lazy" onerror="this.style.display=\'none\'" />'
    : '';

  return (
    '<div class="modal-screenshot ' + ss.bg + ' ' + (index === 0 ? 'active' : '') + '" data-index="' + index + '">' +
      imageHtml +
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
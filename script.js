/* ══════════════════════════════════════════
   BRIGHT BASTASA — script.js
   ══════════════════════════════════════════ */

var PROJECTS = [
  {
    title: 'Canteen Mobile App',
    screenshots: [
      { label: 'Login and role selection',  src: 'screenshots/canteen-1.png' },
      { label: 'Menu and ordering flow',    src: 'screenshots/canteen-2.png' },
      { label: 'Order management view',     src: 'screenshots/canteen-3.png' },
      { label: 'Sales summary and history', src: 'screenshots/canteen-4.png' }
    ]
  },
  {
    title: 'eTala Library Database',
    screenshots: [
      { label: 'Book catalog table',        src: 'screenshots/etala-1.png' },
      { label: 'Borrow and return records', src: 'screenshots/etala-2.png' },
      { label: 'Admin dashboard stats',     src: 'screenshots/etala-3.png' },
      { label: 'Search and filter tools',   src: 'screenshots/etala-4.png' },
      { label: 'Reports and analytics',     src: 'screenshots/etala-5.png' },
      { label: 'Settings and management',   src: 'screenshots/etala-6.png' }
    ]
  },
  {
    title: 'SideStep Sneaker Website',
    screenshots: [
      { label: 'Storefront homepage',            src: 'screenshots/sidestep-1.png' },
      { label: 'Product details and checkout',   src: 'screenshots/sidestep-2.png' },
      { label: 'Auto-post API integration logs', src: 'screenshots/sidestep-3.png' },
      { label: 'Orders and inventory panel',     src: 'screenshots/sidestep-4.png' }
    ]
  },
  {
    title: 'Intramurals Scoretracker',
    screenshots: [
      { label: 'Live team standings',        src: 'screenshots/scoretracker-1.png' },
      { label: 'Per-event scoring updates',  src: 'screenshots/scoretracker-2.png' },
      { label: 'Admin score input panel',    src: 'screenshots/scoretracker-3.png' },
      { label: 'Mobile live scoreboard',     src: 'screenshots/scoretracker-4.png' }
    ]
  }
];

/* ══════════════════════════════════════════
   BOOK STATE
   ══════════════════════════════════════════ */
var book            = $('.bk-book');
var viewBookLink    = book.find('.btn-open');
var viewBackLink    = book.find('.btn-back');
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

viewBackLink.on('click', function (e) {
  e.preventDefault();
  if (book.data('flip')) { bookDefault(); } else { bookBack(); }
  return false;
});
viewBookLink.on('click', function (e) {
  e.preventDefault();
  bookInside();
  return false;
});

$('html').on('click', function (event) {
  if ($('#screenshotModal').hasClass('active')) return;
  if ($(event.target).parents('.bk-book').length === 0) {
    bookDefault();
    if (!colorContainers.hasClass('hidden')) changeColorLink.click();
  }
  return false;
});

/* ══════════════════════════════════════════
   TINT SWITCHER
   ══════════════════════════════════════════ */
var colorLabel = (function () {
  var labels = ['⊹ Tint', '✓ Applied'];
  return function () { labels.push(labels.shift()); return labels[0]; };
})();

changeColorLink.on('click', function (e) {
  e.preventDefault(); e.stopPropagation();
  colorContainers.toggleClass('hidden');
  $(this).text(colorLabel());
});

var dynamicStyle = $('<style></style>').appendTo('head');
colorContainers.find('.color-square').on('click', function (e) {
  e.stopPropagation();
  var c = $(this).attr('class').match(/background-color-([a-f0-9]{6})/i)[1];
  dynamicStyle.text([
    '.highlight{color:#'                   + c + '}',
    '.avail-dot{background:#'             + c + '}',
    '.contact-entry{border-left-color:#'  + c + '}',
    '.back-mono{color:#'                  + c + '}',
    '.back-rule,.cover-rule{background:#' + c + '}',
    '.modal-dot.active{background:#'      + c + '}',
    '.ss-cell:hover{border-color:#'       + c + '}',
    '.ss-cell::after{color:#'             + c + '}'
  ].join(''));
});

/* ══════════════════════════════════════════
   BOOKBLOCK SETUP
   ══════════════════════════════════════════ */
var bookBlock          = $('.bb-bookblock');
var backCover          = bookBlock.parents('.bk-book').find('.bk-cover-back');
var backCoverBookBlock = bookBlock.clone();
backCoverBookBlock.appendTo(backCover);

var bookBlockLastIndex = bookBlock.children().length - 1;
var currentPageIndex   = 0;

var bookBlockFirst = function () {
  currentPageIndex = 0;
  bookBlock.bookblock('first');
  backCoverBookBlock.bookblock('first');
};
var bookBlockLast = function () {
  currentPageIndex = bookBlockLastIndex;
  bookBlock.bookblock('last');
  backCoverBookBlock.bookblock('last');
};

var bookBlockNext = function () {
  if (book.data('flip'))    return bookDefault();
  if (!book.data('opened')) return bookInside();
  if (currentPageIndex === bookBlockLastIndex) {
    currentPageIndex = 0;
    return bookBack() + bookBlockFirst();
  }
  currentPageIndex++;
  bookBlock.bookblock('next');
  backCoverBookBlock.bookblock('next');
};
var bookBlockPrev = function () {
  if (book.data('flip'))    return bookBlockLast() + bookInside();
  if (!book.data('opened')) return bookBack();
  if (currentPageIndex === 0) return bookDefault();
  currentPageIndex--;
  bookBlock.bookblock('prev');
  backCoverBookBlock.bookblock('prev');
};

/* Page flip click — left half prev, right half next.
   ss-cell and proj-github get plain `return` so they don't flip pages. */
bookBlock.children().add(backCoverBookBlock.children()).on({
  'swipeleft':  function () { bookBlockNext(); return false; },
  'swiperight': function () { bookBlockPrev(); return false; },
  'click': function (event) {
    if ($(event.target).closest('.ss-cell').length)     return;
    if ($(event.target).closest('.proj-github').length) return;
    var isRight = (event.pageX - $(this).offset().left) > ($(this).outerWidth() / 2);
    if (isRight) bookBlockNext(); else bookBlockPrev();
    return false;
  }
});

bookBlock.bookblock({ speed: 800, shadow: false });
backCoverBookBlock.bookblock({ speed: 800, shadow: false });

/* ── Bind ss-cell click DIRECTLY on every cell in both instances.
      Delegated (document-level) listeners don't work here because the
      bookblock plugin calls stopPropagation on its own click handlers,
      killing the event before it ever reaches document.
      By binding directly on the element, our handler fires FIRST (before
      the event bubbles up to the plugin), so stopPropagation here prevents
      the plugin from ever seeing the click.                                ── */
function bindCells(container) {
  container.find('.ss-cell').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    openModal(
      parseInt($(this).data('project'), 10),
      parseInt($(this).data('index'),   10)
    );
    return false;
  });
}
bindCells(bookBlock);
bindCells(backCoverBookBlock);

/* ── Keyboard nav ── */
var throttleFunc = function (func, limit, limitQueue) {
  var lastTime = +new Date, queued = 0;
  return function throttledFunc () {
    var now = +new Date, args = Array.prototype.slice.call(arguments);
    if (now - lastTime > limit) {
      func.apply(this, args); lastTime = +new Date;
    } else {
      var b = throttledFunc.bind.apply(throttledFunc, [this].concat(args));
      queued++;
      if (queued < limitQueue) window.setTimeout(b, lastTime + limit - now);
    }
  };
};
$(document).keydown(throttleFunc(function (e) {
  if ($('#screenshotModal').hasClass('active')) return;
  var k = e.keyCode || e.which;
  if (k === 37) bookBlockPrev();
  if (k === 39) bookBlockNext();
}, 500, 2));

/* ══════════════════════════════════════════
   SCREENSHOT MODAL
   ══════════════════════════════════════════ */
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

function buildSlide (ss, index) {
  return (
    '<div class="modal-screenshot' + (index === 0 ? ' active' : '') + '" data-index="' + index + '">' +
      '<img class="modal-image" src="' + ss.src + '" alt="' + ss.label + '">' +
      '<div class="ss-placeholder">' +
        '<div class="ss-mockbody">' +
          '<div class="ss-mockbar"></div><div class="ss-mockbar short"></div>' +
          '<div class="ss-mockbar accent"></div>' +
          '<div class="ss-mockrow"></div><div class="ss-mockrow"></div>' +
          '<div class="ss-mockrow"></div><div class="ss-mockrow"></div>' +
        '</div>' +
      '</div>' +
      '<span class="ss-label">' + ss.label + '</span>' +
    '</div>'
  );
}

function buildDots (count, active) {
  var h = '';
  for (var i = 0; i < count; i++)
    h += '<span class="modal-dot' + (i === active ? ' active' : '') + '" data-dot="' + i + '"></span>';
  return h;
}

function openModal (projectIndex, startIndex) {
  currentProject = PROJECTS[projectIndex];
  currentIndex   = startIndex || 0;
  modalTitle.text(currentProject.title);
  modalFrame.empty();
  currentProject.screenshots.forEach(function (ss, i) {
    modalFrame.append(buildSlide(ss, i));
  });
  updateModal();
  modal.addClass('active');
}

function updateModal () {
  var total = currentProject.screenshots.length;
  modalCounter.text((currentIndex + 1) + ' / ' + total);
  modalDots.html(buildDots(total, currentIndex));
  modalFrame.find('.modal-screenshot').removeClass('active');
  modalFrame.find('[data-index="' + currentIndex + '"]').addClass('active');
  arrowLeft.css('opacity',  currentIndex === 0         ? '0.2' : '1');
  arrowRight.css('opacity', currentIndex === total - 1 ? '0.2' : '1');
}

function modalPrev () { if (currentIndex > 0)                                       { currentIndex--; updateModal(); } }
function modalNext () { if (currentIndex < currentProject.screenshots.length - 1)  { currentIndex++; updateModal(); } }
function closeModal () { modal.removeClass('active'); currentProject = null; }

arrowLeft.on('click',  function (e) { e.stopPropagation(); modalPrev(); });
arrowRight.on('click', function (e) { e.stopPropagation(); modalNext(); });
modalClose.on('click', function (e) { e.stopPropagation(); closeModal(); });
modal.on('click', function (e) { if ($(e.target).is(modal)) closeModal(); });

$(document).on('click', '.modal-dot', function (e) {
  e.stopPropagation();
  currentIndex = parseInt($(this).data('dot'), 10);
  updateModal();
});
$(document).on('keydown', function (e) {
  if (!modal.hasClass('active')) return;
  var k = e.keyCode || e.which;
  if (k === 37) modalPrev();
  if (k === 39) modalNext();
  if (k === 27) closeModal();
});

var touchStartX = null;
document.getElementById('modalFrame').addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('modalFrame').addEventListener('touchend', function (e) {
  if (touchStartX === null) return;
  var dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { dx < 0 ? modalNext() : modalPrev(); }
  touchStartX = null;
});
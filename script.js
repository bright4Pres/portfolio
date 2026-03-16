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
      { label: 'Search and filter tools',   src: 'screenshots/etala-4.png' }
    ]
  },
  {
    title: 'SideStep Sneaker Website',
    screenshots: [
      { label: 'Storefront homepage',           src: 'screenshots/sidestep-1.png' },
      { label: 'Product details and checkout',  src: 'screenshots/sidestep-2.png' },
      { label: 'Auto-post API integration logs',src: 'screenshots/sidestep-3.png' },
      { label: 'Orders and inventory panel',    src: 'screenshots/sidestep-4.png' }
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

var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

function imageBase(path) {
  return path.replace(/\.[^/.]+$/, '');
}

function extensionOrder(path) {
  var m = path.match(/\.([^.\/]+)$/);
  var preferred = m ? m[1].toLowerCase() : 'png';
  return [preferred].concat(IMAGE_EXTENSIONS.filter(function (ext) { return ext !== preferred; }));
}

function initImageFallback(img, preferredPath) {
  var base = imageBase(preferredPath);
  var order = extensionOrder(preferredPath);
  img.dataset.base = base;
  img.dataset.order = order.join(',');
  img.dataset.tryIndex = '0';
  img.src = base + '.' + order[0];
}

function tryNextImage(img) {
  var order = (img.dataset.order || '').split(',').filter(Boolean);
  var nextIndex = parseInt(img.dataset.tryIndex || '0', 10) + 1;

  if (nextIndex >= order.length) {
    img.style.display = 'none';
    return;
  }

  img.dataset.tryIndex = String(nextIndex);
  img.src = img.dataset.base + '.' + order[nextIndex];
}

/* ─── Book state ─── */
var book            = $('.bk-book');
var viewBookLink    = book.find('.bk-bookview');
var viewBackLink    = book.find('.bk-bookback');
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

viewBackLink.on('click', function () { book.data('flip') ? bookDefault() : bookBack(); return false; });
viewBookLink.on('click', function () { bookInside(); return false; });

/* Click outside closes book (unless modal open) */
$('html').on('click', function (e) {
  if ($('#screenshotModal').hasClass('active')) return false;
  if ($(e.target).parents('.bk-book').length === 0) {
    bookDefault();
    if (!colorContainers.hasClass('hidden')) changeColorLink.click();
  }
  return false;
});

/* ─── Tint switcher ─── */
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
  var c = $(this).attr('class').match(/background-color-([a-f0-9]{6})/i)[1];
  dynamicStyle.text([
    '.highlight{color:#' + c + '}',
    '.avail-dot{background:#' + c + '}',
    '.contact-entry{border-left-color:#' + c + '}',
    '.back-mono{color:#' + c + '}',
    '.back-rule,.cover-rule{background:#' + c + '}',
    '.modal-dot.active{background:#' + c + '}',
    '.ss-cell:hover{border-color:#' + c + '}',
    '.ss-cell::after{color:#' + c + '}'
  ].join(''));
});

/* ─── Bookblock setup ─── */
var bookBlock         = $('.bb-bookblock');
var backCover         = bookBlock.parents('.bk-book').find('.bk-cover-back');
var backCoverBookBlock = $();
var hasBookblock      = typeof $.fn.bookblock === 'function' && bookBlock.length > 0;

var bbFirst = function () {};
var bbLast  = function () {};
var bbNext  = function () {
  if (book.data('flip'))    return bookDefault();
  if (!book.data('opened')) return bookInside();
  return bookBack();
};
var bbPrev  = function () {
  if (book.data('flip'))    return bookInside();
  if (!book.data('opened')) return bookBack();
  return bookDefault();
};

if (hasBookblock) {
  backCoverBookBlock = bookBlock.clone();
  backCoverBookBlock.appendTo(backCover);

  bbFirst = function () { bookBlock.bookblock('first');  backCoverBookBlock.bookblock('first'); };
  bbLast  = function () { bookBlock.bookblock('last');   backCoverBookBlock.bookblock('last'); };

  var bbLastIndex = bookBlock.children().length - 1;

  bbNext = function () {
    if (book.data('flip'))    return bookDefault();
    if (!book.data('opened')) return bookInside();
    if (bookBlock.find('.bb-item:visible').index() === bbLastIndex) { bookBack(); bbFirst(); return; }
    bookBlock.bookblock('next');
    backCoverBookBlock.bookblock('next');
  };

  bbPrev = function () {
    if (book.data('flip'))    { bbLast(); bookInside(); return; }
    if (!book.data('opened')) return bookBack();
    if (bookBlock.find('.bb-item:visible').index() === 0) return bookDefault();
    bookBlock.bookblock('prev');
    backCoverBookBlock.bookblock('prev');
  };

  /* Swipe/click to turn pages — but NOT on screenshot grid cells */
  bookBlock.children().add(backCoverBookBlock.children()).on({
    swipeleft:  function () { bbPrev(); return false; },
    swiperight: function () { bbPrev(); return false; },
    click: function (e) {
      if ($(e.target).closest('.ss-cell').length)        return; /* handled by modal */
      if ($(e.target).closest('.proj-github').length)    return; /* external link */
      if ($(e.target).parents('.bk-cover-back').length === 0) bbNext();
      else bbPrev();
      return false;
    }
  });

  bookBlock.bookblock({ speed: 800, shadow: false });
  backCoverBookBlock.bookblock({ speed: 800, shadow: false });
}

/* Throttled keyboard nav */
var throttle = function (fn, limit, qMax) {
  var last = +new Date, queued = 0;
  return function throttled () {
    var now  = +new Date, args = [].slice.call(arguments);
    if (now - last > limit) { fn.apply(this, args); last = +new Date; }
    else {
      var b = throttled.bind.apply(throttled, [this].concat(args));
      queued++;
      if (queued < qMax) setTimeout(b, last + limit - now);
    }
  };
};

$(document).keydown(throttle(function (e) {
  if ($('#screenshotModal').hasClass('active')) return;
  var k = e.keyCode || e.which;
  if (k === 37) bbPrev();
  if (k === 39) bbNext();
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

/* Build one slide (real image + fallback skeleton) */
function buildSlide (ss, index) {
  return (
    '<div class="modal-screenshot ' + (index === 0 ? 'active' : '') + '" data-index="' + index + '">' +
      '<img class="modal-image" data-preferred-src="' + ss.src + '" alt="' + ss.label + '" loading="lazy">' +
      '<div class="ss-placeholder">' +
        '<div class="ss-mockbody">' +
          '<div class="ss-mockbar"></div>' +
          '<div class="ss-mockbar short"></div>' +
          '<div class="ss-mockbar accent"></div>' +
          '<div class="ss-mockrow"></div>' +
          '<div class="ss-mockrow"></div>' +
          '<div class="ss-mockrow"></div>' +
          '<div class="ss-mockrow"></div>' +
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

  modalFrame.find('.modal-image').each(function () {
    var img = this;
    var preferred = img.getAttribute('data-preferred-src') || '';
    img.onerror = function () { tryNextImage(img); };
    initImageFallback(img, preferred);
  });

  updateModal();
  modal.addClass('active');
}

/* Thumbnail fallback for screenshot cells on the page */
$('.ss-cell img').each(function () {
  var img = this;
  var preferred = img.getAttribute('src') || '';
  img.onerror = function () { tryNextImage(img); };
  initImageFallback(img, preferred);
});

function updateModal () {
  var total = currentProject.screenshots.length;
  modalCounter.text((currentIndex + 1) + ' / ' + total);
  modalDots.html(buildDots(total, currentIndex));
  modalFrame.find('.modal-screenshot').removeClass('active');
  modalFrame.find('[data-index="' + currentIndex + '"]').addClass('active');
  arrowLeft.css('opacity',  currentIndex === 0         ? '0.2' : '1');
  arrowRight.css('opacity', currentIndex === total - 1 ? '0.2' : '1');
}

function modalPrev () { if (currentIndex > 0) { currentIndex--; updateModal(); } }
function modalNext () { if (currentIndex < currentProject.screenshots.length - 1) { currentIndex++; updateModal(); } }
function closeModal () { modal.removeClass('active'); currentProject = null; }

/* ── Click any ss-cell thumbnail → open at that index ── */
$(document).on('click', '.ss-cell', function (e) {
  e.stopPropagation();
  var projIndex  = parseInt($(this).data('project'), 10);
  var slideIndex = parseInt($(this).data('index'), 10);
  openModal(projIndex, slideIndex);
});

/* Modal controls */
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

/* Touch swipe inside modal */
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
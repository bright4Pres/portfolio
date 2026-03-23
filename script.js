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

  var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

  function imageBase(path) { return path.replace(/\.[^/.]+$/, ''); }

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
    if (nextIndex >= order.length) { img.style.display = 'none'; return; }
    img.dataset.tryIndex = String(nextIndex);
    img.src = img.dataset.base + '.' + order[nextIndex];
  }

  /* ─── Book state ─── */
  var book = $('.bk-book');
  var viewBookLink    = book.find('.btn-open');
  var viewBackLink    = book.find('.btn-back');
  var changeColorLink = book.find('.change-color');
  var colorContainers = book.find('.color-container');

  function setBookState(state) {
    if (state === 'default') {
      book.data({ opened: false, flip: false }).removeClass('bk-viewback bk-viewinside').addClass('bk-bookdefault');
    } else if (state === 'back') {
      book.data({ opened: false, flip: true }).removeClass('bk-viewinside bk-bookdefault').addClass('bk-viewback');
    } else {
      book.data({ opened: true, flip: false }).removeClass('bk-viewback bk-bookdefault').addClass('bk-viewinside');
    }
  }

  function getBookState() {
    if (book.hasClass('bk-viewinside')) return 'inside';
    if (book.hasClass('bk-viewback'))   return 'back';
    return 'default';
  }

  var bookDefault = function () { setBookState('default'); };
  var bookBack    = function () { setBookState('back'); };
  var bookInside  = function () { setBookState('inside'); };

  bookDefault();

  viewBackLink.on('click', function (e) {
    e.preventDefault(); e.stopImmediatePropagation();
    if (book.data('flip')) bookDefault();
    else bookBack();
  });

  viewBookLink.on('click', function (e) {
    e.preventDefault(); e.stopImmediatePropagation();
    bookInside();
  });

  book.find('.bk-cover').on('click', function (e) {
    if ($(e.target).closest('a, .color-container, .color-square').length) return;
    e.stopPropagation();
    if (!book.data('opened')) bookInside();
  });

  $('html').on('click', function (e) {
    if ($('#screenshotModal').hasClass('active')) return;
    if ($(e.target).closest('.bk-book').length === 0) {
      bookDefault();
      if (!colorContainers.hasClass('hidden')) changeColorLink.click();
    }
  });

  /* ─── Tint switcher ─── */
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
  var bookBlock          = $('.bb-bookblock');
  var backCover          = bookBlock.parents('.bk-book').find('.bk-cover-back');
  var backCoverBookBlock = $();

  /* ══ THE KEY FIX: Gemini set this to `false`, which meant .bookblock()
    was never called and the plugin never ran. ══ */
  var hasBookblock = typeof $.fn.bookblock === 'function' && bookBlock.length > 0;

  var fallbackItems = bookBlock.children('.bb-item');
  var fallbackIndex = 0;

  function showFallbackItem(index) {
    if (!fallbackItems.length) return;
    fallbackIndex = Math.max(0, Math.min(index, fallbackItems.length - 1));
    fallbackItems.removeClass('is-active').eq(fallbackIndex).addClass('is-active');
  }

  /* Only activate fallback if the plugin genuinely didn't load */
  if (!hasBookblock && fallbackItems.length) {
    book.addClass('bb-fallback');
    showFallbackItem(0);
  }

  var bbFirst = function () {};
  var bbLast  = function () {};

  var bbNext = function () {
    if (book.data('flip')) return bookDefault();
    if (!book.data('opened')) return bookInside();

    if (hasBookblock) {
      var items     = bookBlock.children('.bb-item');
      var lastIndex = items.length - 1;
      var curIndex  = bookBlock.find('.bb-item:visible').index();
      if (curIndex === lastIndex) return bookBack() + bbFirst();
      bookBlock.bookblock('next');
      backCoverBookBlock.bookblock('next');
    } else {
      if (fallbackIndex >= fallbackItems.length - 1) return bookBack(), showFallbackItem(0);
      showFallbackItem(fallbackIndex + 1);
    }
  };

  var bbPrev = function () {
    if (book.data('flip')) {
      if (!hasBookblock && fallbackItems.length) showFallbackItem(fallbackItems.length - 1);
      return bbLast() + bookInside();
    }
    if (!book.data('opened')) return bookBack();

    if (hasBookblock) {
      var curIndex = bookBlock.find('.bb-item:visible').index();
      if (curIndex === 0) return bookDefault();
      bookBlock.bookblock('prev');
      backCoverBookBlock.bookblock('prev');
    } else {
      if (fallbackIndex === 0) return bookDefault();
      showFallbackItem(fallbackIndex - 1);
    }
  };

  if (hasBookblock) {
    backCoverBookBlock = bookBlock.clone();
    backCoverBookBlock.appendTo(backCover);

    bbFirst = function () { bookBlock.bookblock('first');  backCoverBookBlock.bookblock('first'); };
    bbLast  = function () { bookBlock.bookblock('last');   backCoverBookBlock.bookblock('last'); };

    bookBlock.children().add(backCoverBookBlock.children()).on({
      swipeleft:  function () { bbNext(); return false; },
      swiperight: function () { bbPrev(); return false; },
      click: function (e) {
        if ($(e.target).closest('.ss-cell').length)     return;
        if ($(e.target).closest('.proj-github').length) return;
        e.stopPropagation();
        if ($(e.target).closest('.bk-cover-back').length === 0) bbNext();
        else bbPrev();
      }
    });

    bookBlock.bookblock({ speed: 800, shadows: false });
    backCoverBookBlock.bookblock({ speed: 800, shadows: false });

  } else {
    bbFirst = function () { showFallbackItem(0); };
    bbLast  = function () { showFallbackItem(fallbackItems.length - 1); };

    bookBlock.children().on({
      swipeleft:  function () { bbNext(); return false; },
      swiperight: function () { bbPrev(); return false; },
      click: function (e) {
        if ($(e.target).closest('.ss-cell').length)     return;
        if ($(e.target).closest('.proj-github').length) return;
        e.stopPropagation();
        bbNext();
      }
    });
  }

  /* ─── Keyboard nav ─── */
  var throttle = function (fn, limit, qMax) {
    var last = +new Date, queued = 0;
    return function throttled () {
      var now = +new Date, args = [].slice.call(arguments);
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

  function buildSlide (ss, index) {
    return (
      '<div class="modal-screenshot ' + (index === 0 ? 'active' : '') + '" data-index="' + index + '">' +
        '<img class="modal-image" data-preferred-src="' + ss.src + '" alt="' + ss.label + '" loading="lazy">' +
        '<div class="ss-placeholder">' +
          '<div class="ss-mockbody">' +
            '<div class="ss-mockbar"></div>' +
            '<div class="ss-mockbar short"></div>' +
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
    currentProject.screenshots.forEach(function (ss, i) { modalFrame.append(buildSlide(ss, i)); });
    modalFrame.find('.modal-image').each(function () {
      var img = this;
      img.onerror = function () { tryNextImage(img); };
      initImageFallback(img, img.getAttribute('data-preferred-src') || '');
    });
    updateModal();
    modal.addClass('active');
  }

  $('.ss-cell img').each(function () {
    var img = this;
    img.onerror = function () { tryNextImage(img); };
    initImageFallback(img, img.getAttribute('src') || '');
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

  $(document).on('click', '.ss-cell', function (e) {
    e.stopPropagation();
    openModal(parseInt($(this).data('project'), 10), parseInt($(this).data('index'), 10));
  });

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
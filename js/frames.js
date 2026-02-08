/*
 * Frame router for the site: swaps the central iframe (id="enframe")
 * and keeps the navigation in sync.
 *
 * Enhancements (2026):
 * - Deep-linking via URL hash: #p=15
 * - Back/forward support (history)
 * - Touch-friendly dropdown toggles (keeps hover for desktop)
 */

var FRAME_MAP = {
  1: "pages/home.html",

  // 1) About
  5: "pages/about_me.html",

  // 2) Writings
  15: "pages/EssaysIndex.html",
  16: "pages/writingsonmusic.html",
  17: "pages/Poetry.html",
  18: "pages/others.html",

  // 3) Music
  19: "pages/reviews.html",
  20: "pages/Interviews.html",
  21: "pages/thelist.html",

  // 4) Miscellaneous
  22: "pages/misc_wikipedia.html",
  23: "pages/misc_oracle.html",
  24: "pages/misc_favorite_websites.html",
  25: "pages/misc_favorite_yt.html",
  26: "pages/misc_poetry_anthology.html",

  // 5) Blog
  27: "pages/blog.html"
};

function getIframe(){
  return document.getElementById("enframe");
}

function resizeIframe(){
  var iframe = getIframe();
  if(!iframe) return;

  try{
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    var body = doc.body;
    var html = doc.documentElement;

    var height = Math.max(
      body ? body.scrollHeight : 0,
      html ? html.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      html ? html.offsetHeight : 0
    ) + 18;

    if(height > 0) iframe.style.height = height + "px";
  }catch(e){
    // Same-origin should work on GitHub Pages, but keep it safe.
  }
}

function clearActiveNav(){
  var active = document.querySelectorAll("a.is-active, a.is-active-parent");
  for(var i=0;i<active.length;i++){
    active[i].classList.remove("is-active");
    active[i].classList.remove("is-active-parent");
  }
}

function setActiveNav(variable){
  clearActiveNav();

  var link = document.querySelector('a[data-frame="' + variable + '"]');
  if(link){
    link.classList.add("is-active");

    // Highlight the top-level section too (for dropdown items).
    var topLi = link.closest ? link.closest("ul.nav-inf > li") : null;
    if(topLi && topLi.firstElementChild && topLi.firstElementChild.tagName === "A"){
      var topA = topLi.firstElementChild;
      if(topA !== link) topA.classList.add("is-active-parent");
    }
  }
}

/* --- Hash helpers (#p=15) --- */
function frameFromHash(){
  var h = (window.location.hash || "").replace("#", "");
  if(!h) return null;

  // Accept: p=15 or p15
  var m = h.match(/(?:^|[?&])p=?(\d+)/i);
  if(m && m[1]){
    var n = Number(m[1]);
    return isFinite(n) ? n : null;
  }
  return null;
}

function setHashFrame(v, push){
  var hash = "#p=" + v;
  if(window.location.hash === hash) return;

  try{
    if(push) history.pushState(null, "", hash);
    else history.replaceState(null, "", hash);
  }catch(e){
    // Fallback: old browsers
    window.location.hash = hash;
  }
}

/* --- Dropdown helpers (touch + keyboard friendly) --- */
function closeAllDropdowns(){
  var open = document.querySelectorAll(".nav-inf > li.is-open");
  for(var i=0;i<open.length;i++){
    open[i].classList.remove("is-open");
    var a = open[i].querySelector(":scope > a.nav-parent");
    if(a) a.setAttribute("aria-expanded", "false");
  }
}

function setupDropdownToggles(){
  var parents = document.querySelectorAll(".nav-inf > li > a.nav-parent");
  for(var i=0;i<parents.length;i++){
    (function(a){
      a.addEventListener("click", function(e){
        // On desktop, hover already works; click should still toggle for touch.
        e.preventDefault();
        var li = a.parentElement;
        if(!li) return;

        var willOpen = !li.classList.contains("is-open");
        closeAllDropdowns();
        if(willOpen){
          li.classList.add("is-open");
          a.setAttribute("aria-expanded", "true");
        }else{
          a.setAttribute("aria-expanded", "false");
        }
      });
    })(parents[i]);
  }

  // Clicking any real link closes the dropdowns.
  document.addEventListener("click", function(e){
    var t = e.target;
    if(!t) return;

    // If click is outside the nav, close.
    var nav = document.getElementById("navigation-inf");
    if(nav && !nav.contains(t)){
      closeAllDropdowns();
      return;
    }

    // If click is on a frame link, close.
    var a = t.closest ? t.closest('a[data-frame]') : null;
    if(a) closeAllDropdowns();
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      closeAllDropdowns();
    }
  });
}

function loadFrame(src, variable, opts){
  var iframe = getIframe();
  if(!iframe) return;

  opts = opts || {};

  setActiveNav(variable);

  iframe.onload = function(){
    resizeIframe();
    window.setTimeout(resizeIframe, 120);
    window.setTimeout(resizeIframe, 450);
  };

  iframe.src = src;

  if(!opts.skipHistory){
    setHashFrame(variable, true);
  }
}

/* Global function used by onclick handlers in index.html */
function frames(variable){
  var v = Number(variable);
  var src = FRAME_MAP[v] || FRAME_MAP[1];
  loadFrame(src, v || 1, { skipHistory: false });
}

/* Initial load: respect URL hash if present */
window.addEventListener("load", function(){
  setupDropdownToggles();

  var initial = frameFromHash();
  if(initial && FRAME_MAP[initial]){
    // Don't create a second history entry on initial load
    var v = Number(initial);
    setActiveNav(v);
    var iframe = getIframe();
    if(iframe) iframe.src = FRAME_MAP[v];
    window.setTimeout(resizeIframe, 80);
    window.setTimeout(resizeIframe, 250);
    setHashFrame(v, false);
  }else{
    setActiveNav(1);
    setHashFrame(1, false);
    resizeIframe();
  }
});

window.addEventListener("resize", function(){
  resizeIframe();
});

window.addEventListener("popstate", function(){
  var v = frameFromHash();
  if(v && FRAME_MAP[v]){
    loadFrame(FRAME_MAP[v], v, { skipHistory: true });
  }
});

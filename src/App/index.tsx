import AppProvider from 'App/AppProvider';
import Router from 'router';
import { ClientRouter } from 'router/routes';

const App = () => {
  if (
    process.env.REACT_APP_ENV === 'production' &&
    (window.location.pathname.includes(ClientRouter.APP) ||
      window.location.pathname === '/')
  ) {
    const googleScript = document.createElement('script');
    googleScript.innerHTML = `(function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-TK7JV6P');`;
    document.body.appendChild(googleScript);
    const hotjarScript = document.createElement('script');
    hotjarScript.innerHTML = `(function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 2572694, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');`;
    document.body.appendChild(hotjarScript);
    const fbPixelScript = document.createElement('script');
    fbPixelScript.innerHTML = `!function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '689497118402251');
    fbq('track', 'PageView')`;
    const fbPixelNoScript = document.createElement('noscript');
    fbPixelNoScript.setAttribute(
      'src',
      'https://www.facebook.com/tr?id=689497118402251&ev=PageView&noscript=1'
    );
    fbPixelNoScript.setAttribute('height', '1');
    fbPixelNoScript.setAttribute('width', '1');
    fbPixelNoScript.setAttribute('style', 'display:none');
    document.head.appendChild(fbPixelScript);
    document.head.appendChild(fbPixelNoScript);
  }

  if (
    window.location.pathname.includes(ClientRouter.APP) ||
    window.location.pathname === '/'
  ) {
    let accessibilityScript = document.getElementById('accessibilityScript');
    if (!accessibilityScript) {
      accessibilityScript = document.createElement('script');
      accessibilityScript.setAttribute('id', 'accessibilityScript');
    }
    accessibilityScript.innerHTML = `window.interdeal = {
        sitekey   : "f9baca9bd9c6d9085ab18742ca2af1e5",
        Position  : ${window.innerWidth < 500 ? '"Left"' : '"Right"'},
        Menulang  : "HE",
        domains	 : {
          js  : "https://js.nagich.co.il/",
          acc : "https://access.nagich.co.il/"
        },	
        isPartial : true,
        btnStyle  : {
            color : {
                main   : "#09698a",
                second : "#ffffff"
            },
            vPosition : ["80%",undefined], //Y-axis position of the widget, left side is reffering to the desktop version, the right side is for mobile.
            scale	  : ["0.5","0.5"], //Size of the widget, the left side is referring to the desktop version, the right side is for mobile.
            icon	  : { 
              type	: 6, //You can choose between 1- 14 icons, or set value as string like "Accessibility".
              shape	: "circle", //You can choose the following shapes: "circle", "rectangle", "rounded", "semicircle".
              outline	: true //true / false.
            }
          }
      };
      (function(doc, head, body){
        var coreCall             = doc.createElement('script');
        coreCall.src             = 'https://js.nagich.co.il/core/4.1.1/accessibility.js';
        coreCall.defer           = true;
        coreCall.integrity       = 'sha512-Sa9czHEwHavqXKmdJEaYdtc0YzuvwZmRRZoovLeWq8Lp5R4ZB1LLCSBoQm6ivUfuncFOM+/9oR08+WCAcBH61Q==';
        coreCall.crossOrigin     = 'anonymous';
        coreCall.setAttribute('data-cfasync', true );
        body? body.appendChild(coreCall) : head.appendChild(coreCall);
      })(document, document.head, document.body);`;
    document.body.appendChild(accessibilityScript);
    if (process.env.REACT_APP_ENV === 'production') {
      let heapScript = document.getElementById('heapScript');
      if (!heapScript) {
        heapScript = document.createElement('script');
        heapScript.setAttribute('id', 'heapScript');
        heapScript.setAttribute('type', 'text/javascript');
        heapScript.innerHTML = `(window.heap = window.heap || []),
      (heap.load = function (e, t) {
        (window.heap.appid = e), (window.heap.config = t = t || {});
        var r = document.createElement('script');
        (r.type = 'text/javascript'),
          (r.async = !0),
          (r.src = 'https://cdn.heapanalytics.com/js/heap-' + e + '.js');
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(r, a);
        for (
          var n = function (e) {
              return function () {
                heap.push(
                  [e].concat(Array.prototype.slice.call(arguments, 0))
                );
              };
            },
            p = [
              'addEventProperties',
              'addUserProperties',
              'clearEventProperties',
              'identify',
              'resetIdentity',
              'removeEventProperty',
              'setEventProperties',
              'track',
              'unsetEventProperty',
            ],
            o = 0;
          o < p.length;
          o++
        )
          heap[p[o]] = n(p[o]);
      });
    heap.load('673657630');`;
        document.head.appendChild(heapScript);
      }
    }
  }

  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;

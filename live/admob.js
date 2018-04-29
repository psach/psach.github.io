var admobid = {};

/* var banner = 'ca-app-pub-9777986405041883/5940226316';
var inter = 'ca-app-pub-9777986405041883/7173416934';
var testing = false; */


/* var banner = 'ca-app-pub-3940256099942544/6300978111';
var inter = 'ca-app-pub-3940256099942544/1033173712';
var testing = true; */



var banner = 'ca-app-pub-9777986405041883/2774613717';
var inter = 'ca-app-pub-9777986405041883/6706846212';
var testing = false;


if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
  admobid = {
    banner: banner,
    interstitial: inter,
  }
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
  admobid = {
    banner: banner,
    interstitial: inter,
  }
}

document.addEventListener('deviceready', function() {
  admob.banner.config({
    id: admobid.banner,
	overlap:true,
	bannerAtTop:true,
    isTesting: testing,
    autoShow: true,
  })
  admob.banner.prepare()

  admob.interstitial.config({
    id: admobid.interstitial,
    isTesting: testing,
    autoShow: false,
  })
  admob.interstitial.prepare()

  document.getElementById('showAd').disabled = true
  document.getElementById('showAd').onclick = function() {
    admob.interstitial.show()
  }

}, false)

document.addEventListener('admob.banner.events.LOAD_FAIL', function(event) {
  console.log(event)
})

document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
  console.log(event)
})

document.addEventListener('admob.interstitial.events.LOAD', function(event) {
  console.log(event)
  document.getElementById('showAd').disabled = false
})

document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
  console.log(event)

  admob.interstitial.prepare()
})

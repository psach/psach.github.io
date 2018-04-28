var admobid = {};

//var banner = 'ca-app-pub-9777986405041883/5940226316';
//var inter = 'ca-app-pub-9777986405041883/5940226316';
//var testing = false;

var banner = 'ca-app-pub-3940256099942544/6300978111';
var inter = 'ca-app-pub-3940256099942544/1033173712';
var testing = true;


// TODO: replace the following ad units with your own
if( /(android)/i.test(navigator.userAgent) ) {
  admobid = { // for Android
    banner: banner,
    interstitial: inter,
    rewardvideo: '',
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
  admobid = { // for iOS
    banner: banner,
    interstitial: inter,
    rewardvideo: '',
  };
} else {
  admobid = { // for Windows Phone
    banner: banner,
    interstitial: inter,
    rewardvideo: '',
  };
}

function initApp() {
  if (! AdMob ) { alert( 'admob plugin not ready' ); return; }

  // this will create a banner on startup
  AdMob.createBanner( {
    adId: admobid.banner,
    position: AdMob.AD_POSITION.TOP_CENTER,
    isTesting: testing, // TODO: remove this line when release
    overlap: true,
    offsetTopBar: false,
    bgColor: 'black'
  } );

 
}

if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
    document.addEventListener('deviceready', initApp, false);
} else {
    initApp();
}

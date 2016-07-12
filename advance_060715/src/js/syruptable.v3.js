//textarea auto height : angular
$('.textarea-wrap').on( 'keyup', 'textarea', function (e){
    $(this).css('height', 'auto' );
    $(this).height( this.scrollHeight );
});
$('.textarea-wrap').find( 'textarea' ).keyup();

//keyboard-on
var $body = $('body'); 
$('.header-fix').on('focus', function(e) {
    $body.addClass('keyboard-on');
})
$('.header-fix').on('blur', function(e) {
    $body.removeClass('keyboard-on');
});

//layer
function dEI(elementID){
    return document.getElementById(elementID);
} 
function openLayer(IdName){
    $('body').addClass('stop-scrolling');
    $(document).bind(
      'touchmove',
      function(e) {
        e.preventDefault();
      }
    );
    var pop = dEI(IdName);
    pop.style.display = "block";
    var wrap = dEI("wrap");
    var dimm = document.createElement("div");
    dimm.setAttribute("id", "ui-dimm");
    wrap.appendChild(dimm);
    return false;
}
function closeLayer(IdName){
    $('body').removeClass('stop-scrolling');
    $(document).unbind(
      'touchmove'
    );
    var pop = dEI(IdName);
    pop.style.display = "none";
    var clearEl = dEI("ui-dimm");
    var momEl = dEI("wrap");
    if (clearEl) {
        momEl.removeChild(clearEl);
    }
    return false;
}

//sweetSwipe
$('.viewArea > div > div').each(function(index){
    $(this).css("transform", "translate3d(" + index*100 + "%, 0px, 0px)");
});

//sweetSwipe - poi list swipe : angular
if( $('.pym-rsv .viewArea > div > div').length == 1 ){
    $('.pym-rsv .viewArea > div > div').css("width", "98.5%");
}


//A PAGE MENU from main html source
var oMyswipe = new SweetSwipe(document.getElementById("swipeWrap"), {
  'nDuration' : 100,  //default 100
  'nBackWidth' : 60,  //default 60
  'nSideWidth' : 20,  //default 0
  'nDecisionSlope' : 0.8, //default 0.8
  'nForcedSwipeTime' : 100, //default 0
  'bSettingScreenHeight':true
});
oMyswipe.onPlugins([
  { 
   'name': 'SwipeNavigationPlugin',
   'option': {
     'usage': true,
     'elNaviWrap': document.querySelector("#swipeNaviWrap > ul"),
     'seletedClassName': 'selected-swipe-li',
     'nDuration': 200
    },
    'userMethod' : {}
  }
]);


function _setHeight() {
  var el = document.querySelector("#swipeWrap");
  el.style.height = el.scrollHeight + "px";
}



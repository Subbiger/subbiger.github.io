window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
    $('#scroll_up').show(200);
  } else {
    $('#scroll_up').hide(200);
  }
}

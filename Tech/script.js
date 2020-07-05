$(document).ready(function(){
    $("#button1").click(function(){
      $("#tech_list1").toggleClass("tech_list2");
    });
    $("#button2").click(function(){
        $("#tech_list2").toggleClass("tech_list2");
      });
    $("#button3").click(function(){
        $("#tech_list3").toggleClass("tech_list2");
      });
  });
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
    $('.scroll_up').show(200);
  } else {
    $('.scroll_up').hide(200);
  }
}
/*
 * Craftyslide
 * Created by: Abid Din - http://craftedpixelz.co.uk
 * Version: 1.0
 * Copyright: Crafted Pixelz
 * License: MIT license
 * Updated: 7th June 2011
 */

(function($) {
  $.fn.craftyslide = function(options) {

    // Defaults
    var defaults = {
      "width"     : 600,
      "height"    : 300,
      "pagination": true,
      "fadetime"  : 350,
      "delay"     : 5000
    };

    var options = $.extend(defaults, options);

    return this.each(function() {

      // Vars
      var $this = $(this);
      var $slides = $this.find("ul li");

      $slides.not(':first').hide();

      // Pagination
      function paginate() {
        var slideContainer = $this.find('div').eq(0);
        slideContainer.prepend("<a id='crafty-slide-previous' class='icon-arrow-left-2'></a>");
        slideContainer.append("<a id='crafty-slide-next' class='icon-arrow-right-2'></a>");
        $this.append("<ol id='pagination' />");

        var i = 1;
        $slides.each(function() {
          $(this).attr("id", "slide" + i);
          $("#pagination").append("<li><a href='#slide" + i + "'>" + i + "</a></li>");
          i++;
        });

        $("#pagination li a:first").addClass("active");
      }

      // Add captions
      function captions() {
        $slides.each(function() {
          $caption = $(this).find("img").attr("title");
          if ($caption !== undefined) {
            $(this).prepend("<p class='caption'>" + $caption + "</p>");
          }
          $slides.filter(":first").find(".caption").css("bottom", 0);
        });
      }

      // Manual mode
      function manual() {
        var $pagination = $("#pagination li a")
          , $currentIndex = 0
          , $next = $("#crafty-slide-next")
          , $previous = $("#crafty-slide-previous");

        function pageTo(current) {
          return function(e) {
            e.preventDefault();
            var that = current ? current() : this
              , $current = $(that.hash);
            
            if ($current.is(":hidden")) {
              $slides.fadeOut(options.fadetime);
              $current.fadeIn(options.fadetime);
              $pagination.removeClass("active");
              $(that).addClass("active");
              $(".caption").css("bottom", "-37px");
              $current.find(".caption").delay(300).animate({
                bottom: 0
              }, 300);
            }
          }
        }

        function nextPage() {
          $pagination.eq($currentIndex + 1).length > 0
            ? $currentIndex += 1
            : $currentIndex = 0;
          return $pagination.eq($currentIndex)[0];
        }
        
        function previousPage() {
          $pagination.eq($currentIndex - 1).length > 0
            ? $currentIndex -= 1
            : $currentIndex = ($pagination.length - 1);
          return $pagination.eq($currentIndex)[0];
        }

        $pagination.click(pageTo());
        $next.click(pageTo(nextPage));
        $previous.click(pageTo(previousPage));
      }

      // Auto mode
      function auto() {
        setInterval(function() {
          $slides.filter(":first-child").fadeOut(options.fadetime).next("li").fadeIn(options.fadetime).end().appendTo("#slideshow ul");

          $slides.each(function() {
            if ($slides.is(":visible")) {
              $(".caption").css("bottom", "-37px");
              $(this).find(".caption").delay(300).animate({
                bottom: 0
              }, 300);
            }
          });

        }, options.delay);
      }

      // Width
      $this.width(options.width);
      $this.find("ul, li img").width(options.width);

      // Height
      $this.height(options.height);
      $this.find("ul, li").height(options.height);

      // Check Boolean values
      if (options.pagination === true) {
        paginate();
      } else {
        auto();
      }

      captions();
      manual();

    });
  };
})(jQuery);
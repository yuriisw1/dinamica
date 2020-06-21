
//IBG
jQuery(document)[0].querySelectorAll(".ibg").forEach(el => {
   if (el.querySelector('img')) {
      el.style.backgroundImage = 'url(' + el.querySelector('img').getAttribute('src') + ')';
      el.querySelector('img').style.display = 'none';
   }
});

//accordion
jQuery(document).ready(function () {
   jQuery('.pull-up').click(function (event) {
      if (jQuery('.section').hasClass('one')) {
         jQuery('.pull-up').not(jQuery(this)).removeClass('.active');
         jQuery('.toolbar__list').not(jQuery(this).next()).slideUp(300);
      }
      jQuery(this).toggleClass('active').next().slideToggle(300);
   });
   //RADIO
   $.each($('.radiobuttons__item'), function (index, val) {
      if ($(this).find('input').prop('checked') == true) {
         $(this).addClass('active');
      }
   });
   $(document).on('click', '.radiobuttons__item', function (event) {
      $(this).parents('.radiobuttons').find('.radiobuttons__item').removeClass('active');
      $(this).parents('.radiobuttons').find('.radiobuttons__item input').prop('checked', false);
      $(this).toggleClass('active');
      $(this).find('input').prop('checked', true);
      return false;
   });

   $(document).ready(function () {
      $('.header__burger').click(function (event) {
         $('.header__burger,.header__burger-page').toggleClass('active');
         $('body').toggleClass('lock');
      });



      jQuery('.tabs__content').not(":first").hide();
      jQuery('.tabs .tabs__link').click(function () {
         jQuery('.tabs .tabs__link').removeClass('active').eq($(this).index()).addClass('active');
         jQuery('.tabs__content').hide().eq($(this).index()).fadeIn()
      }).eq(0).addClass('active');

   });

   $('.image-popup-no-margins').magnificPopup({
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
      image: {
         verticalFit: true
      },
      zoom: {
         enabled: true,
         duration: 300,// don't foget to change the duration also in CSS
         easing: 'ease-in-out', // CSS transition easing function
         opener: function (openerElement) {
            return openerElement.is('img') ? openerElement : openerElement.find('img');
         }
      }
   });

   $('.popup-with-form').magnificPopup({
      type: 'inline',
      preloader: false,
      focus: '#name',

      // When elemened is focused, some mobile browsers in some cases zoom in
      // It looks not nice, so we disable it:
      callbacks: {
         beforeOpen: function () {
            if ($(window).width() < 700) {
               this.st.focus = false;
            } else {
               this.st.focus = '#name';
            }
         }
      }
   });
});



"use strict";

(function () {
   let originalPositions = [];
   let daElements = document.querySelectorAll('[data-da]');
   let daElementsArray = [];
   let daMatchMedia = [];
   //Заполняем массивы
   if (daElements.length > 0) {
      let number = 0;
      for (let index = 0; index < daElements.length; index++) {
         const daElement = daElements[index];
         const daMove = daElement.getAttribute('data-da');
         if (daMove != '') {
            const daArray = daMove.split(',');
            const daPlace = daArray[1] ? daArray[1].trim() : 'last';
            const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
            const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
            const daDestination = document.querySelector('.' + daArray[0].trim())
            if (daArray.length > 0 && daDestination) {
               daElement.setAttribute('data-da-index', number);
               //Заполняем массив первоначальных позиций
               originalPositions[number] = {
                  "parent": daElement.parentNode,
                  "index": indexInParent(daElement)
               };
               //Заполняем массив элементов 
               daElementsArray[number] = {
                  "element": daElement,
                  "destination": document.querySelector('.' + daArray[0].trim()),
                  "place": daPlace,
                  "breakpoint": daBreakpoint,
                  "type": daType
               }
               number++;
            }
         }
      }
      dynamicAdaptSort(daElementsArray);

      //Создаем события в точке брейкпоинта
      for (let index = 0; index < daElementsArray.length; index++) {
         const el = daElementsArray[index];
         const daBreakpoint = el.breakpoint;
         const daType = el.type;

         daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
         daMatchMedia[index].addListener(dynamicAdapt);
      }
   }
   //Основная функция
   function dynamicAdapt(e) {
      for (let index = 0; index < daElementsArray.length; index++) {
         const el = daElementsArray[index];
         const daElement = el.element;
         const daDestination = el.destination;
         const daPlace = el.place;
         const daBreakpoint = el.breakpoint;
         const daClassname = "_dynamic_adapt_" + daBreakpoint;

         if (daMatchMedia[index].matches) {
            //Перебрасываем элементы
            if (!daElement.classList.contains(daClassname)) {
               let actualIndex = indexOfElements(daDestination)[daPlace];
               if (daPlace === 'first') {
                  actualIndex = indexOfElements(daDestination)[0];
               } else if (daPlace === 'last') {
                  actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
               }
               daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
               daElement.classList.add(daClassname);
            }
         } else {
            //Возвращаем на место
            if (daElement.classList.contains(daClassname)) {
               dynamicAdaptBack(daElement);
               daElement.classList.remove(daClassname);
            }
         }
      }
      customAdapt();
   }

   //Вызов основной функции
   dynamicAdapt();

   //Функция возврата на место
   function dynamicAdaptBack(el) {
      const daIndex = el.getAttribute('data-da-index');
      const originalPlace = originalPositions[daIndex];
      const parentPlace = originalPlace['parent'];
      const indexPlace = originalPlace['index'];
      const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
      parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
   }
   //Функция получения индекса внутри родителя
   function indexInParent(el) {
      var children = Array.prototype.slice.call(el.parentNode.children);
      return children.indexOf(el);
   }
   //Функция получения массива индексов элементов внутри родителя 
   function indexOfElements(parent, back) {
      const children = parent.children;
      const childrenArray = [];
      for (let i = 0; i < children.length; i++) {
         const childrenElement = children[i];
         if (back) {
            childrenArray.push(i);
         } else {
            //Исключая перенесенный элемент
            if (childrenElement.getAttribute('data-da') == null) {
               childrenArray.push(i);
            }
         }
      }
      return childrenArray;
   }
   //Сортировка объекта
   function dynamicAdaptSort(arr) {
      arr.sort(function (a, b) {
         if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
      });
      arr.sort(function (a, b) {
         if (a.place > b.place) { return 1 } else { return -1 }
      });
   }
   //Дополнительные сценарии адаптации
   function customAdapt() {
      //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
   }
}());

function outputUpdate(vol) {
   var output = document.querySelector('#volume');
   output.value = vol;
   output.style.left = vol - 20;
   if (output.value > 9) {
      output.style.left = vol - 30;
   }
   if (output.value > 99) {
      output.style.left = vol - 40;
   }
   if (output.value > 240) {
      output.style.left = vol - 45;
   }
   if (output.value > 430) {
      output.style.left = vol - 50;
   }
   if (output.value > 470) {
      output.style.left = vol - 55;
   }
}

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing,
   {
      def: 'easeOutQuad',
      swing: function (x, t, b, c, d) {
         //alert(jQuery.easing.default);
         return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
      },
      easeInQuad: function (x, t, b, c, d) {
         return c * (t /= d) * t + b;
      },
      easeOutQuad: function (x, t, b, c, d) {
         return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function (x, t, b, c, d) {
         if ((t /= d / 2) < 1) return c / 2 * t * t + b;
         return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInCubic: function (x, t, b, c, d) {
         return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function (x, t, b, c, d) {
         return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function (x, t, b, c, d) {
         if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
         return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function (x, t, b, c, d) {
         return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function (x, t, b, c, d) {
         return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function (x, t, b, c, d) {
         if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
         return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function (x, t, b, c, d) {
         return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function (x, t, b, c, d) {
         return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function (x, t, b, c, d) {
         if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
         return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function (x, t, b, c, d) {
         return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function (x, t, b, c, d) {
         return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function (x, t, b, c, d) {
         return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function (x, t, b, c, d) {
         return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function (x, t, b, c, d) {
         return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOutExpo: function (x, t, b, c, d) {
         if (t == 0) return b;
         if (t == d) return b + c;
         if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
         return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function (x, t, b, c, d) {
         return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function (x, t, b, c, d) {
         return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function (x, t, b, c, d) {
         if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
         return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function (x, t, b, c, d) {
         var s = 1.70158; var p = 0; var a = c;
         if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
         if (a < Math.abs(c)) { a = c; var s = p / 4; }
         else var s = p / (2 * Math.PI) * Math.asin(c / a);
         return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOutElastic: function (x, t, b, c, d) {
         var s = 1.70158; var p = 0; var a = c;
         if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
         if (a < Math.abs(c)) { a = c; var s = p / 4; }
         else var s = p / (2 * Math.PI) * Math.asin(c / a);
         return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function (x, t, b, c, d) {
         var s = 1.70158; var p = 0; var a = c;
         if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
         if (a < Math.abs(c)) { a = c; var s = p / 4; }
         else var s = p / (2 * Math.PI) * Math.asin(c / a);
         if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
         return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function (x, t, b, c, d, s) {
         if (s == undefined) s = 1.70158;
         return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function (x, t, b, c, d, s) {
         if (s == undefined) s = 1.70158;
         return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function (x, t, b, c, d, s) {
         if (s == undefined) s = 1.70158;
         if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
         return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      },
      easeInBounce: function (x, t, b, c, d) {
         return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
      },
      easeOutBounce: function (x, t, b, c, d) {
         if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
         } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
         } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
         } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
         }
      },
      easeInOutBounce: function (x, t, b, c, d) {
         if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
         return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
   });


$(document).ready(function () {
   $('.popup-with-form').magnificPopup({
      type: 'inline',
      preloader: false,
      focus: '#name',

      // When elemened is focused, some mobile browsers in some cases zoom in
      // It looks not nice, so we disable it:
      callbacks: {
         beforeOpen: function () {
            if ($(window).width() < 700) {
               this.st.focus = false;
            } else {
               this.st.focus = '#name';
            }
         }
      }
   });
});




$(function () {
   $('#form-popup').submit(function (e) {
      ;
      $('div.' + $(this).find('input[type="submit"]').attr("rel")).fadeIn(500);
      $("body").append("<div id='overlay'></div>");
      $('#overlay').show().css({ 'filter': 'alpha(opacity=80)' });
      e.preventDefault()
   });
   $('a.close').click(function () {
      $(this).parent().fadeOut(100);
      $('#overlay').remove('#overlay');
      return false;
   });
   $('button.close').click(function () {
      $(this).parent().fadeOut(100);
      $('#overlay').remove('#overlay');
      return false;
   });
});




//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function () {
   if (animating) return false;
   animating = true;

   current_fs = $(this).parent();
   next_fs = $(this).parent().next();

   //activate next step on progressbar using the index of next_fs
   $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

   //show the next fieldset
   next_fs.show();
   //hide the current fieldset with style
   current_fs.animate({ opacity: 0 }, {
      step: function (now, mx) {
         //as the opacity of current_fs reduces to 0 - stored in "now"
         //1. scale current_fs down to 80%
         scale = 1 - (1 - now) * 0.2;
         //2. bring next_fs from the right(50%)
         left = (now * 50) + "%";
         //3. increase opacity of next_fs to 1 as it moves in
         opacity = 1 - now;
         current_fs.css({
            'transform': 'scale(' + scale + ')',
            'position': 'absolute'
         });
         next_fs.css({ 'left': left, 'opacity': opacity });
      },
      duration: 800,
      complete: function () {
         current_fs.hide();
         animating = false;
      },
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
   });
});

$(".previous").click(function () {
   if (animating) return false;
   animating = true;

   current_fs = $(this).parent();
   previous_fs = $(this).parent().prev();

   //de-activate current step on progressbar
   $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

   //show the previous fieldset
   previous_fs.show();
   //hide the current fieldset with style
   current_fs.animate({ opacity: 0 }, {
      step: function (now, mx) {
         //as the opacity of current_fs reduces to 0 - stored in "now"
         //1. scale previous_fs from 80% to 100%
         scale = 0.8 + (1 - now) * 0.2;
         //2. take current_fs to the right(50%) - from 0%
         left = ((1 - now) * 50) + "%";
         //3. increase opacity of previous_fs to 1 as it moves in
         opacity = 1 - now;
         current_fs.css({ 'left': left });
         previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
      },
      duration: 800,
      complete: function () {
         current_fs.hide();
         animating = false;
      },
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
   });
});

$(".submit").click(function () {
   return false;
})
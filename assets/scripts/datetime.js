/* global moment */
! function() {
  var datetimes = document.querySelectorAll('.b-datetime_relative');

  for (var el, i = datetimes.length; i--;) {
    el = datetimes[i];
    el.textContent = moment(el.textContent, 'x').fromNow();
  }
}();

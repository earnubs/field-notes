import moment from 'moment';

const datetimes = document.querySelectorAll('.b-datetime_relative');

datetimes.forEach((node) => {
  node.textContent = moment(node.textContent, 'x').fromNow();
});

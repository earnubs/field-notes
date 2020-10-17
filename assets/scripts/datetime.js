import { parseISO, formatDistanceToNow } from "date-fns";

const datetimes = document.querySelectorAll('.b-datetime_relative');

datetimes.forEach((node) => {
  node.textContent = formatDistanceToNow(parseISO(node.textContent)) + ' ago';
});

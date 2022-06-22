import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

export const timestampToDateString = (
  ts?: number,
  format: string = 'YYYY-MM-DD'
): string => {
  if (ts == null) {
    return '';
  }
  return dayjs.unix(ts).format(format);
};

export const toUtcDateTimestamp = (dateTime: string): number => {
  const dt = dayjs(dateTime);
  const offset = dt.utcOffset();
  return dt.add(offset, 'minute').unix();
};

export default dayjs;

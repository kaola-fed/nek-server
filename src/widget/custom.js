/**
 * custom文件包含自定义的全局directive, filter等
 */
import moment from 'moment';

const datetimeFormat = (timestamp, format='YYYY-MM-DD HH:mm:ss') => {
  const placeholder = '-';
  if (!timestamp) {
    return placeholder;
  }
  const date = new Date(timestamp);
  const obj = moment(date);
  if (obj.isValid()) {
    return obj.format(format);
  }
  return placeholder;
};

export default {
  install(Vue) {
    Vue.directive('fullHeight', (el) => {
      const windowH = window.innerHeight;
      const headerH = 60;
      const bodyMargin = 30;
      const footH = 40;

      const minH = windowH - headerH - bodyMargin - footH;
      el.style.minHeight = `${minH}px`;
    });

    Vue.filter('fixed', (number, len=2) => {
      if (isNaN(number) || number == null || number === '') {
        return '--';
      }
      number = parseFloat(number);
      return number.toFixed(len);
    });

    Vue.filter('date', (timestamp, format='YYYY-MM-DD') => {
      return datetimeFormat(timestamp, format);
    });

    Vue.filter('datetime', (timestamp, format='YYYY-MM-DD HH:mm:ss') => {
      return datetimeFormat(timestamp, format);
    });

    Vue.mixin({
      methods: {
        async w(fn) {
          try {
            /* eslint-disable */
            return await fn.apply(this, arguments)
          } catch(e) {
            console.warn(e)
          }
        }
      }
    })
  }
}

// t = current time
// b = start value
// c = change in value
// d = duration
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;                             //eslint-disable-line
  if (t < 1) return c / 2 * t * t + b;    //eslint-disable-line
  t--;                                    //eslint-disable-line
	return -c / 2 * (t * (t - 2) - 1) + b;  //eslint-disable-line
};

const scrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);

    element.scrollTop = val; // eslint-disable-line no-param-reassign

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};

export default scrollTo;

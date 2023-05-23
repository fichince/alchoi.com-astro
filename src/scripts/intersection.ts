const DEFAULTS = {
  threshold: 0.1,
};
function handleScroll(entries : IntersectionObserverEntry[]) {

  entries.forEach((entry) => {
    let classList = entry.target.classList;
    if (entry.isIntersecting) {
      classList.add('show');
      classList.remove('hide');
    } else {
      classList.remove('show');
      classList.add('hide');
    }
  });
}

function createObserver(options : IntersectionObserverInit = DEFAULTS) {
  const observer = new IntersectionObserver(handleScroll, options);
  return observer;
}

export default createObserver;
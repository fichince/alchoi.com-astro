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
const observer = new IntersectionObserver(handleScroll, {
  threshold: 0.50
});

export default observer;
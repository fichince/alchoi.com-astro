import Alpine from 'alpinejs';

function alertMessage() {
  return {
    success: false,
    error: false,
    init() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      this.success = urlParams.get('success') === 'true';
      this.error = urlParams.get('success') === 'false';
    },
    clearAlert() {
      window.location.search = '';
    }
  };
}

function updateSearchQuery() {
  return {
    q: '',
    init() {
      console.log('init updateSearchQuery', window.htmx);
      const url = new URL(window.location.href);
      this.q = url.searchParams.get('q') ?? '';
      document.getElementById('q')?.setAttribute('value', this.q);
      window.htmx.trigger('#q', 'init-query');
    },
    updateQueryString(e : any) {
      this.q = e.target.value;
      const url = new URL(window.location.href);
      url.searchParams.set('q', this.q);
      window.history.replaceState(null, '', url.toString());
    }
  };
}

Alpine.data('alertMessage', alertMessage);
Alpine.data('updateSearchQuery', updateSearchQuery);
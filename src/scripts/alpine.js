import Alpine from 'alpinejs';
import EmblaCarousel from 'embla-carousel';

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

function searchQuery() {
  return {
    // when loading the page, take the query string from the URL
    // and trigger HTMX to request search results
    init() {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q') ?? '';
      document.getElementById('q')?.setAttribute('value', q);
      window.htmx.trigger('#q', 'init-query');
    },

    // when user types in the search box, update the query string
    // of the URL
    updateQueryString(e) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', e.target.value);
      window.history.replaceState(null, '', url.toString());
    }
  };
}

function spoiler() {
  return {
    revealed: false,

    attrs: {
      ['x-on:click']() {
        this.revealed = !this.revealed;
      },

      [':class']() {
        return {
          'revealed': this.revealed,
        };
      }
    }
  };
}

function carousel() {
  return {
    embla: null,
    init() {
      this.embla = EmblaCarousel(this.$refs.carouselNode, {
        loop: true,
      });
    }
  };
}

Alpine.data('alertMessage', alertMessage);
Alpine.data('searchQuery', searchQuery);
Alpine.data('spoiler', spoiler);
Alpine.data('carousel', carousel);

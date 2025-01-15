import Alpine from 'alpinejs';
import EmblaCarousel from 'embla-carousel';
import qs from 'query-string';

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
    q: '',
    includeBlog: true,
    includeQuotes: true,

    // when loading the page, take the query string from the URL
    // and trigger HTMX to request search results
    init() {
      const { query } = qs.parseUrl(window.location.href);

      this.q = query.q ?? '';
      this.includeBlog = Boolean(query.includeBlog);
      this.includeQuotes = Boolean(query.includeQuotes);

      // TODO need a way to run the search (e.g. when coming back using back button)
      //this.$refs.formRef.submit();
      //window.htmx.trigger(this.$refs.formRef, 'init-query');
    },

    updateQueryString() {
      const { url } = qs.parseUrl(window.location.href);

      console.log('updateQueryString', this.q, this.includeBlog, this.includeQuotes);

      const updated = qs.stringifyUrl(
        {
          url,
          query: {
            q: this.q,
            includeBlog: this.includeBlog ? 1 : null,
            includeQuotes: this.includeQuotes ? 1 : null,
          },
        },
        {
          skipNull: true,
          skipEmptyString: true,
        }
      );

      window.history.replaceState(null, '', updated);
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
    currentSlide: 1,
    init() {
      this.embla = EmblaCarousel(this.$refs.carouselNode, {
        loop: false,
      });

      this.embla.on('select', (embla) => {
        this.currentSlide = embla.selectedScrollSnap() + 1;
      });
    },
    destroy() {
      this.embla?.destroy();
    }
  };
}

function infiniteCarousel() {
  return {
    embla: null,
    currentSlide: 1,
    init() {
      this.embla = EmblaCarousel(this.$refs.carouselNode, {
        loop: false,
      });

      this.embla.on('select', (embla) => {
        this.currentSlide = embla.selectedScrollSnap() + 1;

        const isForward = embla.previousScrollSnap() < embla.selectedScrollSnap();
        const numSlides = embla.slideNodes().length;
        if (isForward && this.currentSlide === numSlides - 3) {
          const lastNode = embla.slideNodes()[numSlides - 1];
          window.htmx.trigger(lastNode, 'load-more');
        }
      });

      // this is needed because the first time we load the carousel
      // content, we're using a server island... the DOM nodes that
      // get loaded need to be initialized with HTMX so that the
      // load-more event can be triggered later
      this.embla.on('slidesChanged', () => {
        window.htmx.process(this.$refs.carouselNode);
      });
    },
    destroy() {
      this.embla?.destroy();
    }
  };
}

function bookChooser(defaultBook) {
  return {
    book: null,
    init() {
      const { query } = qs.parseUrl(window.location.href);
      this.book = query.book ?? defaultBook;
    }
  };
}

Alpine.data('alertMessage', alertMessage);
Alpine.data('searchQuery', searchQuery);
Alpine.data('spoiler', spoiler);
Alpine.data('carousel', carousel);
Alpine.data('infiniteCarousel', infiniteCarousel);
Alpine.data('bookChooser', bookChooser);

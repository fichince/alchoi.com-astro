import { LitElement, html } from 'lit';

export class BlogImage extends LitElement {
  static properties = {
    name: {},
  };

  constructor() {
    super();
    this.name = 'Albert';
  }

  render() {
    return html`
      <span>hello, ${this.name}</span>
    `;
  }
}
customElements.define('blog-image', BlogImage);
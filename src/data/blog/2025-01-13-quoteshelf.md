---
title: Quoteshelf
date: 2025-01-13
tags:
  - books
  - coding
  - tech
image: ../../images/blog/books.jpg
---

In case you couldn’t tell, [I enjoy reading a lot](/blog/tag/books). I also like to record my experiences, for example, by tracking the books I read on [The Storygraph](https://www.thestorygraph.com/), and tracking the movies I watch on [Letterboxd](https://letterboxd.com/).

There’s an app called [Readwise](https://readwise.io/) which is great for readers like myself. In the app, you can point your phone’s camera at the text on a page, and it will use [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) to save it as a quote. The app also allows you to review the quotes that you’ve saved in the past. It’s fun to revisit the favourite bits from books that I’ve read. The Readwise app implemented well, and I found it useful enough to pay for a subscription.

Having said that, I’m a firm believer in owning one’s data, so I decided to try to create my own solution. Introducing… [“Quoteshelf”](/quoteshelf)! This new section of the website contains all of the quotes that I’ve exported from Readwise. On the main page, I can swipe through a random selection of quotes, and I can browse the [author index](/quoteshelf/authors) to find specific books.

<!-- excerpt -->

Going forward, I’ll be capturing my reading highlights here instead of in Readwise. No offense to them, but my goal here was to remove a dependency on an external service.

Some technical lessons that I’ve learned:
- I didn’t know this before, but the iOS [Notes app has OCR built-in](https://support.apple.com/en-ca/guide/iphone/iph653f28965/ios).
- The quotes are stored in YAML files, and I’m using Astro’s new [content layer API](https://astro.build/blog/content-layer-deep-dive/) to work with the data.
- I don’t have a great way of automatically downloading the images for the book covers. I settled on a process of finding the covers on [Google Books](https://books.google.com) and [Goodreads](https://www.goodreads.com/), and either saving the images manually, or adding a URL to my data files.
- The scrolling carousel is implemented using the [Embla](https://www.embla-carousel.com/) library. It works pretty well and has decent documentation.

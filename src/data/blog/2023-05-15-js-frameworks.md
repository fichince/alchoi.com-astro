---
title: Web Framework Blues
description: Jekyll → Gatsby → SvelteKit → Astro
date: 2023-05-15
tags:
  - tech
  - coding
image: ../../images/blog/sad-coder.png
---

I’ve written before about the tools I’ve used for building this website. To recap, I started with [Jekyll][1], and I transitioned to [Gatsby][2] because of... [reasons][3].

I don’t have strong opinions about Gatsby. Being a React-based framework, it felt familiar because I had been working on several other React projects. Maybe a little _too_ familiar, as it turns out.

I started to hear about [Svelte][4] and [SvelteKit][5] early last year. Curiosity got the better of me, and I decided to port this site to SvelteKit. Recall that my primary motivation for switching to Gatsby was to allow me to use [Tailwind][6] as my styling solution, and I stuck with Tailwind for my SvelteKit rewrite.

![](../../images/blog/svelte.png)

Svelte is absolutely lovely. I love its syntax for expressing reactive UI state changes, and its use of _[stores][7]_ for cross-component shared state. SvelteKit, though, I still have some reservations about. I won’t get into specifics here, because I acknowledge that it’s a relative newcomer (still in beta when I first picked it up), and I have faith that as it matures, it will continue to address some of the quirks that I encountered. If I were to start a web application project, I would choose SvelteKit.

However, for a non-interactive blog website like this one, I don’t think that SvelteKit is the best fit. Its default mode is full-stack server-side rendering, not static site generation[^1]. In particular, it doesn’t have built-in support for content management (which Jekyll and Gatsby do), and I found myself writing a lot of custom code just to read Markdown text files from the filesystem and render it as HTML.

I’ve learned that my Kryptonite is getting bogged down in coding details and missing the big picture, and after stepping back from all of the SvelteKit and Tailwind tinkering, I had a painful realization: this website was kind of _ugly_. _**Design is a skill that I need to practice, just as much as coding.**_

## Jekyll → Gatsby → SvelteKit → Astro

![](../../images/blog/astro.png)

This is the part of the story where I wag my finger at myself and say, “Don’t tell me you rewrote it _again_.” I’ve had enough corporate software experience to instinctively recoil at the idea. Refactoring or rewriting a project even _once_ is _verboten_, let alone three times.

That’s right, _three_. I’m now building this site using [Astro][9].

In order to describe what I’m appreciating about Astro, I need to talk about a couple of mental shifts that I’ve had in recent months.

## Regarding Tailwind

I called Tailwind “[CSS without CSS][10]” and to many, that’s a good thing. I fell in love with it, too, but the longer I spent with it, the more uncomfortable I got.

The initial appeal came from the feeling of “moving fast”: there’s an almost Zen-like trance that comes from typing short, easy-to-remember nubbins in the class list of an HTML element. But as soon as I needed to change something, it became tedious to scan that same list, as it got longer and longer. Many Tailwind [detractors][11] [criticize][12] it on this [front][13].

More importantly,  I started to think that maybe it wasn’t such a good idea to try to do CSS without CSS. There’s value in accepting CSS for what it is, instead of trying to hide it behind shortcuts for the sake of “developer experience.” 

**_Tailwind is to CSS as Coles Notes[^2] are to Shakespeare._** Why not just study Shakespeare?

## Anti-JS sentiment

![](../../images/blog/angry-coder.png)

Recently, I read a couple of [blog][14] [posts][15] that angrily criticize the current state of web development. While their tone is too “conspiracy theory rant” for my tastes, they have a valid point. Namely, Javascript web frameworks (especially React) may have become dominant because of marketing and hype, not technical merit. And the consequence of putting Javascript first? A lot of extra load on browsers, and a lot of extra complexity in the development workflow.

I learned React by starting two projects at around the same time: one for an internal web tool at the software company where I was employed, and one for a small-business client with whom I was moonlighting as a freelancer. It didn’t feel like I had a choice. I felt pressure from my teammates at the software company to use React, probably because they hoped that their peripheral exposure to it would result in a line item on their résumé. Even my small-business client, who has little technical knowledge, wanted me to use React. It’s a brand, and it has brand recognition in the marketplace of web development.

React appears to be easy to learn. The basic idea of rendering the DOM as a function of state is cool. However, in my experience, the basic idea is not enough to create applications that perform well and are easy to maintain. There are layers and layers of extensions and techniques[^3] that I had to learn along the way, usually because I was reacting[^4] to a situation where something was broken or slow.

**_The best practices are not built in_**, and I feel like every project team needs to take a different journey towards making their application the best that it can be.

## Back to basics

The web started with HTML and CSS, and I have been feeling a desire to go back to basics, and really grasp the fundamentals again.

For the longest time, I’ve held onto the presumption that CSS doesn’t have the concept of variables. That’s why, in order to make your code reusable, you needed to use a [preprocessor][21], or [one][22] [of][23] [many][24] CSS-in-JS solutions. But in fact, browsers have supported CSS [_custom properties_][25] for several years now. Heavy reliance on Javascript frameworks has obfuscated my knowledge of these changes, and my understanding of web development became filtered through framework-specific concepts.

[Astro][26], then, is a breath of fresh air. Being focussed on static HTML generation first, it is most similar to [Jekyll][27] and [Hugo][28] (which I touched briefly to build a [small site][29]). Astro is friendlier than either of these for developers who are already used to Javascript and JSX, since it doesn’t require picking up another language (Ruby and Go, respectively).

In my experience so far, Astro provides the best of all worlds:
- content management and Markdown support, like Jekyll and Gatsby
- single file components with [scoped CSS][30], similar to [Svelte][31]
- if you need some interactive UI, you can plug in a framework component as an “[_island_][32]” - this can be created with React, Svelte, Vue, whatever. E.g., this site is largely Javascript-free, but I imported the interactive [search][33] functionality from my previous Svelte incarnation.

Most importantly, Astro forces me to think mainly in HTML and CSS, and consequently, to keep visual design decisions in the front of my mind, not buried underneath layers of Javascript libraries and optimizations.

It’s ironic that I started with an HTML-first static site generator and came all the way back around. The anti-JS sentiment that I’ve been seeing online might be a sign that the web community at large is taking a similar cyclical journey. Everything old is new again, it seems.

[^1]:	For a fun summary of these terms and more, see [this video][8].

[^2]:	CliffNotes or SparkNotes for non-Canadian readers

[^3]:	Just a list off the top of my head:
	- [Redux Saga][16]
	- [Code-splitting][17]
	- [useMemo][18]
	- [react-query][19]
	- [immer][20]

[^4]:	🥁😏

[1]:	https://jekyllrb.com/
[2]:	https://www.gatsbyjs.com/
[3]:	../blog/2022-02-13-jekyll-gatsby
[4]:	https://svelte.dev/
[5]:	https://kit.svelte.dev/
[6]:	https://tailwindcss.com/
[7]:	https://svelte.dev/tutorial/writable-stores
[8]:	https://www.youtube.com/watch?v=Dkx5ydvtpCA
[9]:	https://astro.build/
[10]:	../blog/2022-02-13-jekyll-gatsby#user-content-fn-1
[11]:	https://www.spicyweb.dev/why-tailwind-isnt-for-me/#reason-1-tailwind-promotes-ugly-ass-html
[12]:	https://www.aleksandrhovhannisyan.com/blog/why-i-dont-like-tailwind-css/#1-tailwind-makes-your-code-difficult-to-read
[13]:	https://javascript.plainenglish.io/tailwind-is-an-anti-pattern-ed3f64f565f0
[14]:	https://infrequently.org/2023/02/the-market-for-lemons/
[15]:	https://www.spicyweb.dev/the-great-gaslighting-of-the-js-age/
[16]:	https://redux-saga.js.org/
[17]:	https://webpack.js.org/guides/code-splitting/
[18]:	https://react.dev/reference/react/useMemo
[19]:	https://tanstack.com/query/latest
[20]:	https://immerjs.github.io/immer/
[21]:	https://sass-lang.com/
[22]:	https://emotion.sh/docs/introduction
[23]:	https://styled-components.com/
[24]:	https://stitches.dev/
[25]:	https://caniuse.com/css-variables
[26]:	https://astro.build
[27]:	https://jekyllrb.com/
[28]:	https://gohugo.io/
[29]:	https://jacob-rob.com
[30]:	https://docs.astro.build/en/guides/styling/#scoped-styles
[31]:	https://svelte.dev/docs#component-format-style
[32]:	https://docs.astro.build/en/concepts/islands/
[33]:	../blog/search
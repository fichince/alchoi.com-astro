---
layout: post
title: Battle of the audio players, conclusion
description: Ordeal
date: 2005-03-17
tags:
  - tech
  - music
---

As [promised](/blog/2005-03-12-battle-of-the-audio-players), I did a bit of research to find out what it would take to get LongPlayer to work together with amaroK. It turns out that amaroK supports a DCOP interface. DCOP is a protocol shared by KDE applications that allows you to control them via the command line. For example, you can add songs to the amaroK playlist by executing the following shell command:  
  
```
dcop amarok playlist addMedia  
```
  
It's definitely possible to modify LongPlayer to use these DCOP commands to control amaroK, instead of performing the equivalent operations with XMMS. And it's probably not even difficult.  
  
Unfortunately (or fortunately), while I was looking into this, I realized that everything I liked about amaroK were just gimmicks (e.g. lyrics lookup, album cover images). After initially being impressed with all these bells and whistles, I came to see that there's ultimately no real usefulness to any of it. On the other hand, LongPlayer really does perform a useful function, and changes the user's experience.  
  
Therefore, I declare the LongPlayer/XMMS combination to be the winner of this little competition. Somewhat anti-climactic, but I'm glad it turned out this way... saves me the trouble of actually going through with modifying LongPlayer code.  
  
(Aside: I think I learned a bit about myself through this little "ordeal." I may at first be impressed by superficial things, but I eventually tend to gravitate towards a more practical ideal. In general, this probably does describe my general outlook on things. So, there you go: self-discovery through software.)

---
layout: post
title: Battle of the audio players
description: No probability theory
date: 2005-03-12
tags:
  - tech
  - music
---

I've arrived at a bit of a crossroads concerning audio player software, and which one to use. I have a moderately large collection of music on my computer, and dumping everything onto a playlist and shuffling isn't quite good enough for me.  
  
I've narrowed it down to two candidates:  
  
## XMMS + LongPlayer  
  
[XMMS](http://xmms.org/) is pretty much the standard audio player on Linux (it's basically a clone of Winamp). However, its shuffle functionality (as with most audio players) is pretty rudimentary. In particular, it is susceptible to the so-called [birthday paradox](http://en.wikipedia.org/wiki/Birthday_paradox). I have no desire to start explaining probability theory here, but essentially, this means that it does not take long for the same song to be played twice, which quickly becomes annoying.  
  
[LongPlayer](http://lplayer.sourceforge.net/) is a program that runs alongside XMMS (it also works with Winamp on Windows, and iTunes on MacOS), which basically continually populates your playlist queue with "random" songs. It is not completely random, because that would lead to the birthday paradox; instead, it tries to play the songs in such a way as to maximize the average time between playing the same song twice. Also, it supports a rating system which causes the higher-rated songs to be played more often.  
  
The combination of XMMS and LongPlayer does a very good job of randomizing my playlist. On average, it takes about 4 weeks for a song to be played again (according to LongPlayer's statistics).  
  
## amaroK  
  
[amaroK](http://amarok.kde.org/) takes a completely different approach. This is the most full-featured music player I've seen. It places a strong emphasis on organizing a collection of music, and can group your tracks based on genre, artist, year, etc. It also uses this information to make suggestions as you're playing something; for example, it gives you a list of albums by the same artist, and other artists of a similar genre.  
  
I also like the fact that amaroK downloads album covers from Amazon.com and displays them as you're playing tracks. It even displays lyrics for the currently playing song. (How this works, I don't know--I should take a look at the source code.) Yes, I know that these are kind of frivolous features, but it gives the app a professional, polished feel.  
  
So, here's the dilemma. I really like the full-featuredness of amaroK, but its shuffling mechanism is pretty basic. There is a rating mechanism, but it doesn't seem to obviously affect the selection of tracks. Now, amaroK is a larger project than LongPlayer, so it is likely that future updates will have an improved shuffling function. In fact, many people have requested a smarter shuffle on the amaroK forums.  
  
The "best-of-both-worlds" solution would be if LongPlayer could interface with amaroK and feed songs into the amaroK playlist. I believe that this should be possible, because both apps are open-source. If I have time, I'll try to find out more about this... (to be continued...)

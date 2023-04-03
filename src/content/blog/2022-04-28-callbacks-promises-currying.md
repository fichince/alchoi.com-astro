---
layout: post
title:  From callbacks to promises via currying
description: Saucy code
date: 2022-04-28
tags:
  - tech
  - coding
---

Recently, I’ve been working on some social and gamification features in a web application. I decided to use a backend service called [brainCloud][1] instead of implementing all of the database stuff myself. The brainCloud service stores things like player statistics, leaderboards and social relationships (i.e. who’s friends with who?), and provides an HTTP API to read and write the data. They also provide a [Javascript client library][2] to make it easier to work with those APIs.

Without getting into too many specifics, the library follows a callback style for handling asynchronous behaviour. When you call one of their functions, it sends an HTTP request; when the server responds, it executes the code in the callback function that you pass as a parameter. For example,

	postScoreToLeaderboard(leaderboardId, score, (resp) => {
	  if (resp.successful) {
	    // do something with the data
	    console.log('We got data!', resp.data);
	  } else {
	    console.log('We got an error!', resp.error);
	  }
	});

Personally, I prefer to handle asynchronous code using promises in the `await`/`async` style.

A general pattern to follow to convert a callback interface to a promise-based one is to build a `Promise` object and return it.

_(N.B.: For the purposes of this post, I’ll follow the convention of prefixing a function name with an underscore to indicate that it’s a “wrapper” around a brainCloud API function.)_

	const _postScoreToLeaderboard = (leaderboardId, score) => {
	  return new Promise(resolve, reject) => {
	    postScoreToLeaderboard(leaderboardId, score, (resp) => {
	      if (resp.successful) {
	        resolve(resp.data);
	      } else {
	        reject(resp.error);
	      }
	    });
	  });
	};

Now, we can use this function without a callback:

	try {
	  const data = await _postScoreToLeaderboard(leaderboardId, score);
	  // do something with the data
	  console.log('We got data!', data);
	} catch (e) {
	  console.log('We got an error!', e);
	}

This works, but there are many functions in the brainCloud API. How can we extend this technique in a generic way?

To illustrate, here’s a couple of other brainCloud methods for gamification:

	getLeaderboardTop(leaderboardId, (resp) => {
	  // handle response
	});
	
	incrementUserStats(statId, value, (resp) => {
	  // handle response
	});

It would be a lot of repetitive code to wrap each of these in a function:

	// TOO MUCH CODE!
	
	const _getLeaderboardTop = (leaderboardId) => {
	  return new Promise(resolve, reject) => {
	    getLeaderboardTop(leaderboardId, (resp) => {
	      // handle response
	    })
	  });
	};
	
	const _incrementUserStats = (statId, value) => {
	  return new Promise(resolve, reject) => {
	    incrementUserStats(statId, value, (resp) => {
	      // handle response
	    })
	  });
	};

To reduce duplication, we can _curry_ the functions.

### A brief introduction to currying

If you’re not familiar with the term, [_currying_][3] a function creates a new function with parameters that can be called one by one.

The classic example is a function that adds three numbers together.

	const add = (a, b, c) => a + b + c;
	
	// create a curried function
	const curriedAdd = curry(add);
	
	const addOne = curriedAdd(1);
	
	// this is equivalent to calling add(1, 2, 3)
	const x = addOne(2, 3);
	
	// x is 6

Note that this only returns the final result of 6 if we “use up” all three parameters of the original function. If, instead, you leave the final parameter “unused,” it will return yet another function.

	// we have "used up" two out of three parameters
	const addSeven = addOne(6);
	
	// this is equivalent to calling add(1, 6, 10)
	const y = addSeven(10);
	
	// y is 17

### Back to our regularly scheduled programming

With this approach, we can curry the functions from the brainCloud API. For example,

	const _incrementUserStats = curry(incrementUserStats);

This particular function has two input parameters, and a third for a callback. If we call the curried version with the two input parameters, it will return a function that accepts a callback and executes the original function once it receives the callback.

	const fn = _incrementUserStats('statId', 15);
	
	const handleResponse = (resp) => {
	  // do something
	};
	
	// this is equivalent to calling 
	// incrementUserStats('statId', 15, handleResponse)
	fn(handleResponse);

I named the final function `fn` because this part can be generalized to any API call that takes a callback as its final parameter.

If we create a function that takes a function like `fn` and calls it, we can then use a Promise-based pattern for making these API calls.

	const makeAPICall = (fn) => {
	  return new Promise((resolve, reject) => {
	    fn((resp) => {
	      if (resp.successful) {
	        resolve(resp.data);
	      } else {
	        reject(resp.error);
	      }
	    });
	  });
	};

To use this, we call one of the curried functions with all of its parameters _except for the final callback parameter_, and pass the result to the `makeAPICall` function.

	try {
	  const data = await makeAPICall(_incrementUserStats('statId', 15));
	  // do something with the result
	  console.log('We got data!', data);
	} catch (e) {
	  console.log('We got an error!', e)
	}

Putting it all together:

	// curry all of the functions that we want to use
	const _postScoreToLeaderboard = curry(postScoreToLeaderboard);
	const _getLeaderboardTop = curry(getLeaderboardTop);
	const _incrementUserStats = curry(incrementUserStats);
	
	// define the function that receives a callback 
	// and executes the original function
	const makeAPICall = (fn) => {
	  return new Promise((resolve, reject) => {
	    fn((resp) => {
	      if (resp.successful) {
	        resolve(resp);
	      } else {
	        reject(resp);
	      }
	    });
	  });
	};
	
	// now we can make API calls like this
	const result1 = await makeAPICall(_postScoreToLeaderboard('id', 100));
	const result2 = await makeAPICall(_getLeaderboardTop('id'));
	const result3 = await makeAPICall(_incrementUserStats('statId', 15));

As a final note, the `curry` function itself is available in the popular [lodash][4] library of Javascript utilities.

[1]:	https://getbraincloud.com/
[2]:	https://github.com/getbraincloud/braincloud-js
[3]:	https://en.wikipedia.org/wiki/Currying
[4]:	https://lodash.com/docs/4.17.15#curry
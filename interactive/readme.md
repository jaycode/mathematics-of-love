# The Mathematics of Love - When to Settle Down
*Interactive version*

This project is available for viewing here: [http://mathoflove.teguhwijaya.com/](http://mathoflove.teguhwijaya.com/)

## How to Run

This section explains how to run this project in your local machine. Please do contact me
at te g u h w purw an to [at] gmail [dot] com if you have any question with installation.

This app needs following python modules:
- Flask (`pip install flask`)
- uJson (`pip install ujson`)

and Bower ([see installation here](http://bower.io/#install-bower)).

and Grunt for styling:

```
npm install -g grunt-cli
npm install load-grunt-tasks
```

`cd static` then `grunt` to compile css file.


Once you got them installed, do the following to run the app on your server:

- `bower install --allow-root` to install all the required javascript.
- `python server.py`

Then you should be able to access this app on `http://localhost` (make sure no other app
is using your port 80).

## Development Notes

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.
- Documentation is made with jsdoc with baseline plugin. To export documentation, run `jsdoc -t node_modules/jsdoc-baseline static/js/ readme.md` from /interactive directory.

## Design

To put it simply, in this project I generate a large number of random numbers and apply a Mathematical
concept to explain it. Regarding the eligibility of this project, it has been discussed [here in the Udacity forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823/6).

This app uses various types of visualizations to explain different aspects of the dataset, divided into three
major graphs:

 - **Histograms** to review the distribution of generated dataset.
 - **Line charts** to read the pattern produced by applying some strategies / Mathematical equations into our dataset.
 - **Bar chart with a twist** to explain the Mathematical concept.

Due to its size, it is inevitable that this project has experienced many design changes. They can be reviewed in detail from the [github page of this project](https://github.com/jaycode/mathematics-of-love/commits/master), here are the overview of the changes:

**3rd of July, 2015**

 Initially, the beginning for this project was me toying around in R, the project is still available [here](https://jaycode.github.io/mathematics-of-love/when-to-settle-down.html).

**23rd of August, 2015**

I asked if this project would be eligible [in the Udacity forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823/6).

**27 Aug 2015**

It was decided that the project was good to go, so I started doodling within the next 5 days.

**1 Sept 2015**

I finished drawing some doodles for this app. Doodles are available [here](https://drive.google.com/open?id=0B2ib3M3otvbDflM2RjJPTXZadU1VQUMwT0lTblJqNDlUVTNiRWM3VzVHYlVxSl9JZG9zOGM). As you can see from my post in that forum, at this stage I was still not even sure how I was going to build this application.

**5 Sept 2015**
And so I spent the next 4 days "binge learning" Udacity's Front-End development and introduction to Fullstack development courses. From the former I learned how to structure my javascript app with KnockoutJs, and from the latter I learned that I can quickly setup a Python webserver using Flask framework (later I found there's a more ideal way to do this).

**6 Sept 2015**

During the next two days (date 5 and 6), I focused on the structure and some initial design of the app, as well as re-learning the Theory again to put for content. I also tinkered with the d3-slider to see how it works.

**8 Sept 2015**

From then, up until date 8 I moved over the logic I used in R into Javascript. 

**9 Sept 2015**
Which was a terrible mistake since the loading time was too high that the app was practically useless. I spent the following day (date 9) on rewriting the code in Python. It was a huge success since Python has this Numpy array which made the calculation much faster.

**11 Sept 2015**

I then kept working on different parts of the app iteratively until date 11. I encountered another setback as I accidentally not including many files, including the whole javascript files in this app. It was terrible since turned out I needed to use that R analysis code I ported into Javascript. The problem was caused by the inclusion of `.git` directory inside of `static` dir which made that entire directory untraceable in Git. I removed that `.git` dir and rewrote the code.

At the middle of date 11, the app already looked really fine where all of the features are working quite well.

I shown this app to a couple of people in a social meetup called Hackteria (basically like Hackerspace, but for Biologists) and this idea turned out to be a good conversation starter.

I enjoyed the moment when their fear of anything Mathematics turned into little sparks of curiosity. That happened with me too months ago when watching the talk that inspired me to write this project.

**12 Sept 2015**

But then again, I noticed that while they enjoyed my explanation, they seemed kind of lost when I let them play with the simulation on their own. So I decided to incorporate a tour-like plugin into the simulation.

Now, as usual I had zero idea how this may work. I remember my colleagues at Trio Digital had been using similar system for one of our web projects, so I know that this was possible. So I searched around and found this plugin BootstrapTour.

The plugin was nearly perfect, but there were some additions I needed to make before it can be used for my project, so I hacked my way to add the following features:

 - When "next" and "prev" button clicked, the plugin used jQuery promise feature to wait for animation to finish, then move to respective page. Due to the number of various animation and threads I have in my project, this feature broke, and instead I "patched" the plugin to not assuming anything when onNext and onPrev events triggered. That way I can just wait until my animation completed and manually go to the right pages. Simple.
 - Sometimes I needed to have a slightly different tour panel position and page scrolling in my project, so I patched that feature to allow me adding some options to do manual scrolling.

At the end of date 12, I have completed the story for this tour feature.

**13 Sept 2015**

This day was reserved to setup the server for general public to see. So I quickly put together a basic web server, polished the content, and launched the site. Back then I have made a [docker environment for Python](https://hub.docker.com/r/jaycode/python2-scipy/) just for the fun of it, turned out to be very useful in this situation. I set up a server in record time of under 1 hour thanks to that.

Oh I also made a [Google Form](http://goo.gl/forms/5X3hO6CGFl) so I can gather even more feedback.

With everything set up I was ready to spread this app to the world.

**14 Sept 2015**

Except that they didn't. Someone notified me that he could not remove goals after creating them, turns out that was a feature I forgot to complete, so I quickly rushed to add that feature.

An even bigger problem came up. Another one complained the app was non-existent. As it turned out, Python's Flask is **really** not suitable for production. I've read that in its documentation, but I thought it should have been fine for under 100 clients or something. More like 1-client-at-a-time, it seems.

Luckily I only have distributed the link to my Facebook friends. So I browsed around, and found out [a couple of alternatives for the web server](http://stackoverflow.com/questions/14814201/can-i-serve-multiple-clients-using-just-flask-app-run-as-standalone). I ended up using [Tornado in tandem with Flask](http://stackoverflow.com/questions/8143141/using-flask-and-tornado-together/8247457#8247457), since it was super fast to set up.

**17 Sept 2015**
Improved the app based on feedback from the wonderful Udacity community:

- Fixed add and remove goals feature. Used to have many small glitches.
- Less colors.
- Updated mouse hover behavior in main visualization.
- Fixed edge case of rejecting 0 candidate.
- Corrected grammatical and spelling errors, and typos.
- Tiny cosmetic changes.

## Feedback

Some of the discussions were done verbally, but I have also gathered some feedback from other sources for this project.

For one, thanks to [Charlie and Sheng Kung in Udacity Forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823) I know that I could use this idea for the project.

In the early phase of this project, I mentioned I [made some doodles](https://drive.google.com/open?id=0B2ib3M3otvbDflM2RjJPTXZadU1VQUMwT0lTblJqNDlUVTNiRWM3VzVHYlVxSl9JZG9zOGM). I didn't include all the annotated scraps since they were too many of them, but I took a photo of a bunch of annotated doodle in file [assorted-annotations.jpg](https://lh3.googleusercontent.com/pi5eSemwZgcYtJxiZ2i2QwzzsSUO8AY3r8PxxSQww7TFGbG8KvS856jQs9I1TrP99crDBQ=w1342-h523).

I have created [a post in Udacity Google group forum](https://plus.google.com/100979599321722862352/posts/4N2BLggiAZD) and by the time I've done writing this readme file, I have gathered 4 anonymous comments.

The comments are recorded [in this publicly available spreadsheet document](https://docs.google.com/spreadsheets/d/1i14GTZp2z4G1HT2K1AtUlcOKGxhMZCOue6WZ96z1D8U/edit?usp=sharing). I enjoyed reading them, most of them had fun reading the article (at the time of writing, at least) and had some really constructive feedback to improve this project further. I will work on this project a bit further after submitting this into the review system, you can always see the latest update at its [Github page](https://github.com/jaycode/mathematics-of-love/tree/master/interactive).


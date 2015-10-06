# The Mathematics of Love - When to Settle Down
*Interactive version*

## Summary

This project attempts to explain a mathematical concept called "Optimal Stopping Theory" by picking a subject that all people (well, most anyway) can relate to, Love! That, and by utilizing an app users can do small experiments with so they can understand how the algorithm works in their own pace.

As a bonus objective, this app is (maybe) also helpful in deciding on a strategy to choose the best partner i.e. by dating how many people per year and deciding on an optimal rejection phase.

The app for this project is available here: 
[http://mathoflove.teguhwijaya.com/](http://mathoflove.teguhwijaya.com/)

A complete documentation of the project's code is available [here](http://mathoflove.teguhwijaya.com/static/docs/app.html).

## How to Run

This section explains how to run this project in your local machine.
Please do contact me
at te g u h w purw an to [at] gmail [dot] com if 
you have any question with installation.

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

Then you should be able to access this app on `http://localhost`
(make sure no other app
is using your port 80).

## Development Notes

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.
- Documentation is made with jsdoc with baseline plugin. To export documentation, run `jsdoc -t node_modules/jsdoc-baseline static/js/ readme.md` from /interactive directory.

## Design Decisions
To put it simply, in this project I generate a large number of random numbers and apply a Mathematical
concept to explain it. Regarding the eligibility of this project, it has been discussed [here in the Udacity forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823/6).

This app uses various types of visualizations to explain different aspects of the dataset, divided into three
major graphs:

 - **Histograms** to review the distribution of generated dataset.
 - **Line charts** to read the pattern produced by applying some strategies / Mathematical equations into our dataset.
 - **Bar chart with a twist** to explain the Mathematical concept.

### Reasoning behind the use of interactive line charts in Simulation Analysis page
The beginning of this project dated back in July 2015 when I, just for the fun of it, tried to duplicate the analysis done in a book called Mathematics of Love by Hannah Fry.

The work, which was done in R, is available [here](https://jaycode.github.io/mathematics-of-love/when-to-settle-down.html). The lines graph comparing different rejection phases is also available there:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/old_project-3.PNG)

As you can see with a static graph we can only show only a handful of goals, at best. It is also impossible to directly tell from the graph where exactly the highest points are for each goal.

Compare that to the version on this app:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/simulation_analysis.PNG)

With this new version, you can add new goals, and hovering on top of the visualization should show a window presenting detailed information of all the three lines, so you can compare them directly (for example, in the above, we can see that in rejection phase 22%, while "theory" line does not differ much with top 5%, it does a lot with top 15% line).

### Reasoning behind interactive bar chart in Detail page

This is arguably the most aesthetically appealing visualization in this project, in page "Simulating Single Lifetimes" due to the various animations it has.

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/detail.PNG)

The reason for adding this much animations here is to make sure readers can really understand what is exactly happening when we apply "Optimal Stopping Theory" strategy.

To do this, each decision marked by the small icons on top of the bars must be subsequently animated to bring out the perception of time i.e. the bars / candidates on the left are met earlier than the right ones.

There are also other interactivity in this page users can play with, such as adjusting lifetime to simulate, experimenting with different rejection phase, and showing different goals. All of them are there so users can understand the theory with their own pace by doing small experiments.

### Reasoning behind "Generate your own dataset" feature

It's quite obvious I think. An app is only good when it is useful to its user in a personal level. "Generate your own dataset" feature allows user to enter their own scenarios and future strategies e.g. If they want to settle down within the next 2-3 years of their lives, how many people should they start to date each year, and how big should their rejection phase to achieve optimum probability (while still getting a decent partner)?

We actually had fun with this app and we managed to use this app for a "dating consultation".

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/generate.PNG)

### Reasoning behind the two histograms displayed in generated dataset page.

These are the histograms showing distribution of generated dataset:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/generated.PNG)

In "Number of Candidates Distribution" histogram, I made sure the bars are center aligned to their respective x values, because they are distinct / categorical values (i.e. there is no age 19.338 in here, for example). As well, I added a small gap between each bar so readers can tell exactly which bar belongs to which value in scale.

On the contrary, "Candidate Score Distribution" combines the bars together since candidate scores are continuous.

## Summary of updates
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

**6 Oct 2015**
Added JSDoc and updated the app from feedback comments previously not completed. Also added much more documentation.

## Feedback

Some of the discussions were done verbally, but I have also gathered some feedback from other sources for this project.

For one, thanks to [Charlie and Sheng Kung in Udacity Forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823) I know that I could use this idea for the project.

In the early phase of this project, I mentioned I [made some doodles](https://drive.google.com/open?id=0B2ib3M3otvbDflM2RjJPTXZadU1VQUMwT0lTblJqNDlUVTNiRWM3VzVHYlVxSl9JZG9zOGM). I didn't include all the annotated scraps since they were too many of them, but I took a photo of a bunch of annotated doodle in file [assorted-annotations.jpg](https://lh3.googleusercontent.com/pi5eSemwZgcYtJxiZ2i2QwzzsSUO8AY3r8PxxSQww7TFGbG8KvS856jQs9I1TrP99crDBQ=w1342-h523).

I have created [a post in Udacity Google group forum](https://plus.google.com/100979599321722862352/posts/4N2BLggiAZD) and by the time I've done writing this readme file, I have gathered 4 anonymous comments.

The comments are recorded [in this publicly available spreadsheet document](https://docs.google.com/spreadsheets/d/1i14GTZp2z4G1HT2K1AtUlcOKGxhMZCOue6WZ96z1D8U/edit?usp=sharing). I enjoyed reading them, most of them had fun reading the article (at the time of writing, at least) and had some really constructive feedback to improve this project further. I will work on this project a bit further after submitting this into the review system, you can always see the latest update at its [Github page](https://github.com/jaycode/mathematics-of-love/tree/master/interactive).

I also recorded my friend's recommendation as an [audio file](https://drive.google.com/file/d/0B2ib3M3otvbDbkNLdnZTb0Q3OG85TjhwYkZLRHA1NHJvYnF3/view?usp=sharing) after presenting this project to him and a couple others.

### Changes from Feedback Comments

To summarize the changes, I stored past iterations in saved html archives:

- [version 0](http://mathoflove.teguhwijaya.com/static/archives/v0.html) - When the app has just launched and during the time it was gathering some feedback from community.
- [version 1](http://mathoflove.teguhwijaya.com/static/archives/v1.html) - After the feedback suggestions applied except for content related updates.

#### Design related feedback

Most design related feedback were targeted for Lifetime Simulation page.

The very first version of Design 

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design1-before.PNG)

Here are a couple of excellent feedback I received in Google+ discussion forum:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design1-f1.PNG) ![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design1-f2.PNG)

From Google Form:
> It just needs to be more intuitive. Less busy. I have a degree in math/stats & lot's of programming experience but the "busyness" of it loses me a bit. I'm not trying to be mean. I did read the entire article and clicked through the app. I think it is nice work but it could use some polishing to take it the next level.

This suggestion is quite abstract, but I take it maybe it would reduce the business if we can handle the coloring issue.

And following from project review:
> I have just a few comments on how you could improve this even further.
I found the navigation between the components of the interactive section quite confusing to use. I wasn't always sure that I could get back to where I'd come from! You could use some static buttons to select the different parts, helping the viewer to stay oriented in the visualisation...[another comment related to interaction - shown in next section]
>
> ...As mentioned in some of your feedback, for small numbers of lifetimes the 1% and 5% buttons yield similar information. Perhaps they are not both required?
>
> Sometimes the 'rejection zone' and Xs on bars look a little out-of-place as the bars go taller than the 'rejection zone' grey, and the writing interacts with the bars; I've included a screenshot. Making the 'rejection zone' taller might solve this; if it will fit on a reasonable-sized screen, that is.
> ![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design2-before.png)

##### Design related changes to Detail Page

Based on design related feedback comments above, the following changes to the Detail page were then made:

- Replaced the colors.
- Added Legends.
- Removed 5% goal.
- Added more area on top of bars

Here is a screenshot of the new version:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design1-after.PNG)

In theory, this new design makes it easier for readers to focus on the information behind the visualizations. The colors next to "Age Met" were useless since the age information has already been decoded in the larger number in X axis.

And screenshot of the fixed rejection zone section:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/design2-after.PNG)

##### Design related changes to links.

As suggested in the review, I added static links to different pages in this app:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/links_added.PNG)

#### Interaction related feedback

Assorted feedback comments from Google Form:

> ...You are suggesting to enter a bigger number for the lifetime, like 2000. But I couldn't enter more than a 1000.

I couldn't duplicate this issue so let's leave it until more reports are coming.


##### Cursor hover in Simulation Analysis page

From Google form, an anonymous user commented as follows:

> On the simulation analysis graph, you can look at the success rate vs. % rejected for any point on the line. I thought that was great, but I found it to be a bit unsmooth. In particular, I found that it was a little awkward that my cursor had to actually be in contact with one of the lines to change the numbers. For example, if I started at the rejection rate of 10% and wanted to see the success rate for a rejection rate of 20%, I would have to move my mouse onto the line at the 20% mark. I feel like I would have found it more natural if the numbers would change with my cursor's x position regardless of whether it's in contact with a line or not. 

I updated Simulation Analysis visualization so that the cursor don't have to be positioned exactly on top of a line to show the detail window. I did this by creating rectangles with 0 opacity that triggered detail window display when hovered over. Following is the visualization with hidden rectangles shown in semi transparent colors:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/interaction1-after.PNG)

##### Pop-up tour

Below is a comment regarding pop-up tour I got from the last project review (2015-09-21):

> ...The pop-up tour was a little difficult to use because it sat on top of the text or visualisation, obscuring some parts. Could it sit in the top-right-hand corner to avoid this problem?

This has also been mentioned in two of the replies in Google Form:

> One thing that bugged me was that while I was taking the tour of the app, the explanation was right in the center of the screen on top of the actual graphs and such. Finding a way to get the text off of the graphs would have been helpful in understanding your explanation better...

And another one:

> ...I was checking it out on a small laptop screen. When I was running visual presentation pop windows with explanation caused image to constantly jump up and down - it was distracting and annoying. Although I do understand it might be out of your hands...

And another one:

> The text overlapped the graph making is hard to understand the graph.

When there are two or more people requesting the same thing, that means it could be important, so I updated the tour section. Following is the screenshot:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/interaction2-after.PNG)

With this new version, the window stays on top right of the page. To help with the visualization, I highlighted the parts currently being explained.

##### Replaying the tour

In one of the Google Form replies I received this:
> ...Finally, I would have liked a button that would allow me to read the introduction for the app again after I've played with it a bit. 

Unfortunately this may take quite a bit of time to do. It gets quite complicated if you have generated your own dataset (although quite possible to do), anyway since this is possible to do by refreshing the page and only requested once, let's put this in Todo list.

#### Content related feedback

There are a couple of content related feedback from different people:

From Google+ group:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/content1-f1.PNG) ![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/content1-f2.PNG)

It seems like some information do need to be removed. There are also other comments regarding this matter, both verbally and written (and, well... implied, by some people for not actually trying out the app when I asked them to).

From Google Form replies:

> I think r should be defined as something like "number of candidates automatically rejected" or something, because you may end up rejecting many candidates after the rejection period.

`r` cannot be defined like that since the process requires you to record as well as rejecting.

---

> The simulation is fine but .  .  .  
When I'm faced with this sort of problem is use some actual numbers, maybe 5 applicants, then 10, then 20, etc., to gain some insight on where this is going. 

That is actually possible to do by generating own dataset.

---

> Maybe a short video (1-2 minutes) explaining the "science behind" the research.

Sorry but maybe not since I am not good with videos.

---

> Compatibility score on y axis is from from -1.5 to 2.0, but if I will hover over bars it will range from -150 to 200 ( give or take ) with no explanation of how compatibility score is calculated or mapped to the Y axis.

Nice catch! This was actually a bug. Here are before and after screenshots:

![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/content2-before.png) ![](https://raw.githubusercontent.com/jaycode/mathematics-of-love/master/interactive/static/images/docs/content2-after.png)

Thank you, anonymous!

---

> "you don't want to keep rejecting the next suitor" doesn't make sense, maybe "you don't want to keep hoping the next suitor will be better"
"to quick" should be "too quickly"
>
> The opening section has several awkward things.  For example, you can't reject the next suitor, only the present one.
> 
> The rest of it reads much better.

Corrected the article as suggested.

---

Another feedback came in [audio form](https://drive.google.com/file/d/0B2ib3M3otvbDbkNLdnZTb0Q3OG85TjhwYkZLRHA1NHJvYnF3/view?usp=sharing). The transcript as follows:

> Hi, my name is Eric, I'd like to comment on Jay's Udacity project, the mathematics of love. Back then Jay had shown me the app and applied it to real life situation.
> 
> I found the material quite interesting and the application of theory is very practical. However I find it really hard to digest the material if I have to read it on my own.
> 
> My suggestion is to remove the theory section and focus only on the practical parts.
> 
> Thank you.

This opinion seems to be shared among my other friends whom I've asked to try out this app.

And finally, a feedback from reviewer of this project, Charlotte Turner:

> You could do a clearer job of explaining the objective and the algorithm used here. My understanding is that the objective is to choose the very best possible candidate out of a set.
I thought this led to a rather depressing finding; only 37% chance of success?! You could comment on this finding and thus make your case for relaxing the success criterion to be the 'top x%', as shown later in the visualisation. I had to guess what was meant by these 'top x%' for myself, it would be nicer to introduce them and explain why you included them.

Added some explanation to the tour, and hopefully the new content structure makes this better.

> The fact that 1/e (37%) appears both in the strategy and in the result could be clarified. A mathematical formula is confusingly included without explanation (are you able to justify it?) and its link to 1/e is unclear. As always when presenting mathematics to a general audience, there is a balance to be struck in the level of detail. The example provided is a bit confusing. Why does it yield a value higher than 37%?

Back then I didn't want to include too much detail, but felt like I had to. I guess the solution for this is to place the deep and complete mathematical concept to a different page.

> I would prefer you to change references to 'proving' the rule to 'testing' or 'demonstrating' or 'showing' the rule; this is a mathematical concept and a simulation is not a mathematical proof!

Updated.

> There is quite a lot of text on the page, which provides a fun narrative voice. However, you should consider whether less text would be sufficient and hence allow the visualisations a little more room to shine.

##### Reducing the content

From these content-related feedback, including the ones from Eric and Charlotte, it was very clear that the amount of content needs to be reduced to eliminate the possibility of users quitting before even trying the app.

Instead of removing the content altogether, I created another page especially made to explain only the mathematically dense materials, while keeping the visualization as highlight of the main page.

The version before this update can be seen [here](http://mathoflove.teguhwijaya.com/static/archives/v0.html), while this last content update is available [live](http://mathoflove.teguhwijaya.com).
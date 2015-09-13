# The Mathematics of Love - When to Settle Down
*Interactive version*

## Use

To start this app on a web server, run `python server.py`.

Thi

## How to Run

This app needs following python modules:
- Flask (`pip install flask`)
- uJson (`pip install ujson`)

and Bower ([see installation here](http://bower.io/#install-bower)).

Once you got them installed, do the following to run the app on your server:

- `bower install --allow-root` to install all the required javascript.
- `python server.py`

## Development Notes

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.
- ViewModels are capitalized e.g.  `app.Goal`, `app.ViewModel`.
- For everything else use standard camelcase e.g. `app.simulationAnalysis`.
- ViewModel can be accessed using `app.vm`. Use this to get data e.g. app.vm.CurrentDetail.lifetime().
- All pages have their own instances:
  - `app.simulationAnalysis` for main analysis page.
  - `app.detail` for the page when you clicked on "View more detail".
  - `app.generate` for generate data page.
  - `app.generated` for 'review generated data' page.
- All these pages are stored inside templates within index.html.
- ViewModels used:
  - app.Goal: List of goals gathered from app.data.settings.goals.
  - app.CurrentDetail: All data inside detail page.
- Helper methods are stored in `app.helpers`.
- All data are prefixed with `data` e.g. `app.data.experiment`

## Design Decisions

To put it simply, in this project I generate a large number of random numbers and apply a Mathematical
concept to explain it. Regarding the eligibility of this project, it has been discussed [here in the Udacity forum](https://discussions.udacity.com/t/project-6-is-data-visualization-to-prove-a-mathematical-concept-eligible/29823/6).

This app uses various types of visualizations to explain different aspects of the dataset, divided into three
major graphs:
 - **Histograms** to review the distribution of generated dataset.
 - **Line charts** to read the pattern produced by applying some strategies / Mathematical equations into our dataset.
 - **Bar chart with a twist** to explain the Mathematical concept.

More explanations on design decisions are available within the project itself.
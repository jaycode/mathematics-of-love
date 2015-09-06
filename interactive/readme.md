# The Mathematics of Love - When to Settle Down
*Interactive version*

## Use

To start this app on a web server, run `python server.py`.

## How to Run

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.

## Development Notes

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
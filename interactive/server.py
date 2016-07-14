from tornado.wsgi import WSGIContainer
from tornado.ioloop import IOLoop
from tornado.web import FallbackHandler, RequestHandler, Application
from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html')

@app.route('/concept')
def concept():
  return render_template('concept.html')

@app.route('/data/intro')
def read_data_intro():
  import data
  return jsonify(data.get_intro())

@app.route('/data')
def read_data():
  import data
  # a1: age start
  # a2: age end
  # p1: potential partners per year min
  # p2: potential partners per year max
  # l: lifetimes
  # p: get processed data for main viz (boolean)
  # g: goals, comma-separated e.g. top-15%25,top-1,theory (%25 is a url encoded '%' sign).
  return jsonify(data.get(
    a1=request.args.get('a1', 18),
    a2=request.args.get('a2', 24),
    p1=request.args.get('p1', 0),
    p2=request.args.get('p2', 8),
    l=request.args.get('l', 10000),
    p=request.args.get('p', 0),
    g=request.args.get('g', 'top-1,top-10%25,top-15%25,theory')
  ))

tr = WSGIContainer(app)

application = Application([
(r".*", FallbackHandler, dict(fallback=tr)),
])

if __name__ == "__main__":
  application.listen(80)
  IOLoop.instance().start()

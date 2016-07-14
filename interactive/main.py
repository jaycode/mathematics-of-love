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


















# An attempt to create our own webserver (Flask was much better).
# 
# from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
# HOST_NAME = ''
# PORT_NUMBER = 8080

# class webserverHandler(BaseHTTPRequestHandler):
#   def do_GET(self):
#     try:
#       print "opening path %s" % self.path
#       if self.path.endswith("/data"):
#         self.send_response(200)
#         self.send_header('Content-type', 'text/json')
#         self.end_headers()

#         import data

#         output = "test"
#         self.wfile.write(output)
#         return
#       if self.path.endswith("/") or self.path.endswith("/index.html"):
#         f = open('index.html', 'r')
#         self.wfile.write(f.read())
#         f.close()
#         return
#     except IOError:
#       self.send_error(404, "File Not Found %s", self.path)

# def main():
#   try:
#     server = HTTPServer((HOST_NAME, PORT_NUMBER), webserverHandler)
#     print "Web server running on port %s" % PORT_NUMBER
#     server.serve_forever()

#   except KeyboardInterrupt:
#     print "Stopping web server..."
#     server.socket.close()

# if __name__ == '__main__':
#   main()

from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

@app.route('/')
@app.route('/index')
def run_index():
  return render_template('index.html')

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
  return jsonify(data.get(
    a1=request.args.get('a1', 18),
    a2=request.args.get('a2', 24),
    p1=request.args.get('p1', 0),
    p2=request.args.get('p2', 8),
    l=request.args.get('l', 10000)
  ))

if __name__ == '__main__':
  app.debug = True
  app.run(host = '0.0.0.0', port = 5000)



















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
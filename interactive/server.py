from flask import Flask, render_template, jsonify
app = Flask(__name__)

@app.route('/')
@app.route('/index')
def runIndex():
  return render_template('index.html')

@app.route('/data/intro')
def readDataIntro():
  import data
  return jsonify(data.getIntro())

@app.route('/data')
def readData():
  import data
  return jsonify(data.run())

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
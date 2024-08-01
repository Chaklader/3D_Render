import os

from flask import Flask, render_template, abort, send_file

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"


# @app.route('/splat_file')
# def serve_splat_file():
#     splat_file_path = 'iteration_30000_4.splat'
#     if os.path.exists(splat_file_path):
#         return send_file(splat_file_path, mimetype='application/octet-stream')
#     else:
#         return "Splat file not found", 404

@app.route('/myapp/public/api/scans/viewer/<int:scan_id>')
def index(scan_id):
    if not isinstance(scan_id, int):
        abort(400, description="Invalid scan_id. It must be an integer.")

    model_link = 'https://link.somelink.io/iteration_30000.splat'
    address = '5521 8TH AVENUE BROOKLYN NY 11220'
    room_name = 'Room 1'

    return render_template('index.html', model_link=model_link, address=address, room_name=room_name)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5015, debug=True)

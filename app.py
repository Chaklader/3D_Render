from flask import Flask, render_template, abort

app = Flask(__name__)


rooms = {
    9766: 'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/4869-regal-dr--bonita-springs--fl-34134--usa/no-unit/26/primary/above-grade/level-1/clones/pool/model/iteration_30000.splat',
    10606: 'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/584-banyan-blvd--naples--fl-34102--usa/no-unit/26/primary/above-grade/level-1/clones/living-room/model/iteration_30000.splat'
}

def get_room_url(id):
    if id in rooms:
        return rooms[id]
    else:
        # Get the last URL (which is the second one in this case)
        return list(rooms.values())[-1]


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/CubeSpace/public/api/scans/viewer/<int:scan_id>')
def index(scan_id):
    if not isinstance(scan_id, int):
        abort(400, description="Invalid scan_id. It must be an integer.")

    model_link = get_room_url(scan_id)
    address = '5521 8TH AVENUE BROOKLYN NY 11220'
    room_name = 'Room 1'

    return render_template('index.html', model_link=model_link, address=address, room_name=room_name)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5015, debug=True)

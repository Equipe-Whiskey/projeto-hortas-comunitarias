from flask import Flask, jsonify, request
from flask_cors import CORS # Importa o CORS

app = Flask(__name__)
CORS(app) # Habilita o CORS para o Flask
projects = []

@app.route('/projects', methods=['GET'])
def get_projects():
    return jsonify(projects), 200

@app.route('/projects', methods=['POST'])
def add_project():
    new_project = request.get_json()
    projects.append(new_project)
    return jsonify(new_project), 201

@app.route('/projects/<int:index>', methods=['PUT'])
def edit_project(index):   
    edited_data = request.get_json()
    projects[index].update(edited_data)
    return jsonify(projects[index]), 200

@app.route('/projects/<int:index>', methods=['DELETE'])
def delete_project(index):
    deleted_project = projects.pop(index)
    return jsonify(deleted_project), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

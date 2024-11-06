import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        name: '',
        description: ''
    });
    const [editingProject, setEditingProject] = useState(null);
    // Função para buscar projetos do backend
    useEffect(() => {
        axios.get('http://localhost:5000/projects')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Erro ao buscar projetos:', error));
    }, []);
    // Função para lidar com mudanças nos campos de formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    // Função para adicionar um novo projeto
    const handleAddProject = () => {
        axios.post('http://localhost:5000/projects', newProject)
            .then(response => {
                setProjects([...projects, { ...newProject, _id: response.data}]);
                setNewProject({ name: '', plantType: '', startDate : '',});
                scrollToSection('projectList'); // Rola para a lista de projetos
            })
            .catch(error => console.error('Erro ao adicionar projeto:', error));
    };
    // Função para deletar um projeto
    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:5000/projects/${projectId}`)
            .then(response => {
                setProjects(projects.filter(project => project._id !== projectId));
            })
            .catch(error => console.error('Erro ao deletar projeto:', error));
    };
    // Função para iniciar a edição de um projeto
    const handleEditProject = (project) => {
        setEditingProject(project._id);
        setNewProject({
            name: project.name, description: project.description
        });
        scrollToSection(`updateProject_${project._id}`); // Rola para o formulário de atualização
    };
    // Função para atualizar um projeto existente
    const handleUpdateProject = () => {
        axios.put(`http://localhost:5000/projects/${editingProject}`,
            newProject)
            .then(response => {
                setProjects(projects.map(project => (
                    project._id === editingProject ? {
                        ...project,
                        ...newProject
                    } : project
                )));
                setEditingProject(null);
                setNewProject({ name: '', description: '' });
            })
            .catch(error => console.error('Erro ao atualizar projeto:',
                error));
    };
    // Função para rolar a tela para uma seção específica
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div>

            {/* Menu superior */}
            <nav style={{
                backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px'
            }}>
                <button onClick={() => scrollToSection('projectList')}>Lista de Projetos</button>
                <button onClick={() => scrollToSection('addProject')}>Adicionar Projeto</button>
            </nav>
            {/* Seção de Lista de Projetos */}
            <section id="projectList">
                <h2>Lista de Projetos da ONG</h2>
                {projects.length === 0 ? (
                    <p>Nenhum projeto foi adicionado ainda.</p>
                ) : (
                    <ul>
                        {projects.map((project, index) => (
                            <li key={index}>

                                <strong>{index + 1}. Nome:</strong> {project.name}
                                <br />
                                <strong>Descrição:</strong> {project.description}
                                <br />
                                <button onClick={() =>
                                    handleDeleteProject(project._id)}>Deletar</button>
                                <button onClick={() =>
                                    handleEditProject(project)}>Editar</button>
                                {editingProject === project._id && (
                                    <section id={`updateProject_${project._id}`}
                                        style={{ marginTop: '20px' }}>
                                        <h3>Atualizar Projeto</h3>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newProject.name}
                                            onChange={handleInputChange}
                                            placeholder="Nome do Projeto"
                                        />
                                        <br />
                                        <select
                                            name="plantType"
                                            value={newProject.plantType}
                                            onChange={handleInputChange}>

                                            <option value="Alface">Alface</option>
                                            <option value="Tomate">Tomate</option>
                                            <option value="Pimentão">Pimentão</option>
                                            <option value="Hortelã">Hortelã</option>
                                            <option value="Ora-pró-nobis">Ora-pró-nobis</option>
                                            <option value="Cenoura">Cenoura</option>
                                            <option value="Brócolis">Brócolis</option>

                                        </select>
                                        <br />
                                        {displayPlantInstructions(newProject.plantType)}
                                        <br />
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newProject.startDate}
                                            onChange={handleInputChange}
                                            placeholder="Descrição do Projeto"
                                        />
                                        <br />
                                        <input
                                            type="text"
                                            name="description"
                                            value={newProject.description}
                                            onChange={handleInputChange}
                                            placeholder="Descrição do Projeto"
                                        />
                                        <br />
                                        <button onClick={handleUpdateProject}>Salvar Alterações</button>
                                    </section>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            {/* Seção para Adicionar Novo Projeto */}
            <section id="addProject" style={{ marginTop: '50px' }}>
                <h2>Adicionar Novo Projeto</h2>
                <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Nome do Projeto"
                />
                <br />
                <select
                    name="plantType"
                    value={newProject.plantType}
                    onChange={handleInputChange}>

                    <option value="Alface">Alface</option>
                    <option value="Tomate">Tomate</option>
                    <option value="Pimentão">Pimentão</option>
                    <option value="Hortelã">Hortelã</option>
                    <option value="Ora-pró-nobis">Ora-pró-nobis</option>
                    <option value="Cenoura">Cenoura</option>
                    <option value="Brócolis">Brócolis</option>

                </select>
                <br />
                {displayPlantInstructions(newProject.plantType)}
                <br />
                <input
                    type="date"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    placeholder="Descrição do Projeto"
                />
                <br />
                <input
                    type="text"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do Projeto"
                />
                <br /><br />
                <button onClick={handleAddProject}>Adicionar Projeto</button>
            </section>
        </div>

    );
}

function displayPlantInstructions(plantType) {
    switch(plantType){
        case "Alface":
            return "[Alface]"
            break;
        case "Tomate":
            return "[Tomate]"
            break;
        case "Pimentão":
            return "[Pimentão]"
            break;
        case "Hortelã":
            return "[Hortelã]"
            break;
        case "Ora-pró-nobis":
            return "[Ora-pró-nobis]"
            break;
        case "Cenoura":
            return "[Cenoura]"
            break;
        default:
            return "";
            break;
    }
}
export default App;
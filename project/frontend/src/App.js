import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        plantType: '',
        startDate: ''
    });

    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [plantFilter, setPlantFilter] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [expandedDescription, setExpandedDescription] = useState(null); // For expanding descriptions

    useEffect(() => {
        axios.get('http://localhost:5000/projects')
            .then(response => {
                setProjects(response.data);
                setFilteredProjects(response.data);
            })
            .catch(error => console.error('Erro ao buscar projetos:', error));
    }, []);

    useEffect(() => {
        let updatedProjects = [...projects];

        if (searchTerm) {
            updatedProjects = updatedProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (plantFilter) {
            updatedProjects = updatedProjects.filter(project => project.plantType === plantFilter);
        }

        updatedProjects.sort((a, b) => {
            switch (sortOption) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "date":
                    return new Date(a.startDate) - new Date(b.startDate);
                case "plantType":
                    return a.plantType.localeCompare(b.plantType);
                default:
                    return 0;
            }
        });

        setFilteredProjects(updatedProjects);
    }, [searchTerm, plantFilter, sortOption, projects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddProject = () => {
        if (editingProject) {
            handleUpdateProject();
        } else {
            axios.post('http://localhost:5000/projects', newProject)
                .then(response => {
                    const newProjectWithId = { ...newProject, _id: response.data };
                    setProjects([...projects, newProjectWithId]);
                    setNewProject({ name: '', plantType: '', startDate: '', description: '' });
                    scrollToSection('projectList');
                })
                .catch(error => console.error('Erro ao adicionar projeto:', error));
        }
    };

    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:5000/projects/${projectId}`)
            .then(response => {
                setProjects(projects.filter(project => project._id !== projectId));
            })
            .catch(error => console.error('Erro ao deletar projeto:', error));
    };

    const handleEditProject = (project) => {
        setEditingProject(project._id);
        setNewProject({
            name: project.name,
            description: project.description,
            plantType: project.plantType,
            startDate: project.startDate
        });
        scrollToSection('addProject');
    };

    const handleUpdateProject = () => {
        axios.put(`http://localhost:5000/projects/${editingProject}`, newProject)
            .then(response => {
                setProjects(projects.map(project =>
                    project._id === editingProject ? { ...project, ...newProject } : project
                ));
                setEditingProject(null);
                setNewProject({ name: '', description: '', plantType: '', startDate: '' });
            })
            .catch(error => console.error('Erro ao atualizar projeto:', error));
    };

    const handleCancelEdit = () => {
        setEditingProject(null);
        setNewProject({ name: '', description: '', plantType: '', startDate: '' });
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleDescription = (projectId) => {
        setExpandedDescription(expandedDescription === projectId ? null : projectId);
    };

    const truncateDescription = (description) => {
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', width: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Menu superior */}
            <nav style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => scrollToSection('addProject')}>{editingProject ? 'Salvar Projeto' : 'Adicionar Projeto'}</button>
                <button onClick={() => scrollToSection('projectList')}>Lista de Projetos</button>
            </nav>

            {/* Seção para Adicionar Novo Projeto */}
            <section id="addProject" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '30px' }}>
                <h2>{editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</h2>
                <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Nome do Projeto"
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                />
                <br />
                <select
                    name="plantType"
                    value={newProject.plantType}
                    onChange={handleInputChange}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                >
                    <option value="">Selecione o Tipo de Planta</option>
                    <option value="Alface">Alface</option>
                    <option value="Tomate">Tomate</option>
                    <option value="Pimentão">Pimentão</option>
                    <option value="Hortelã">Hortelã</option>
                    <option value="Ora-pró-nobis">Ora-pró-nobis</option>
                    <option value="Cenoura">Cenoura</option>
                    <option value="Brócolis">Brócolis</option>
                </select>
                <br />
                <input
                    type="date"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                />
                <br />
                <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do Projeto"
                    rows="4"
                    style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
                />
                <br />
                <button onClick={handleAddProject} style={{ marginTop: '10px' }}>{editingProject ? 'Salvar Projeto' : 'Adicionar Projeto'}</button>
                {editingProject && (
                    <button onClick={handleCancelEdit} style={{ marginTop: '10px', marginLeft: '10px' }}>Cancelar</button>
                )}
            </section>

            {/* Filtros e Ordenação */}
            <section style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', maxHeight: '250px', overflowY: 'auto' }}>
                <h2>Filtros e Ordenação</h2>
                <input
                    type="text"
                    placeholder="Buscar por palavra-chave"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select
                        value={plantFilter}
                        onChange={(e) => setPlantFilter(e.target.value)}
                        style={{ padding: '5px', flex: '1' }}
                    >
                        <option value="">Filtrar por Tipo de Planta</option>
                        <option value="Alface">Alface</option>
                        <option value="Tomate">Tomate</option>
                        <option value="Pimentão">Pimentão</option>
                        <option value="Hortelã">Hortelã</option>
                        <option value="Ora-pró-nobis">Ora-pró-nobis</option>
                        <option value="Cenoura">Cenoura</option>
                        <option value="Brócolis">Brócolis</option>
                    </select>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        style={{ padding: '5px', flex: '1' }}
                    >
                        <option value="name">Ordenar por Nome</option>
                        <option value="date">Ordenar por Data</option>
                        <option value="plantType">Ordenar por Tipo de Planta</option>
                    </select>
                </div>
            </section>

            {/* Lista de Projetos */}
            <section id="projectList" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <h2>Lista de Projetos da ONG</h2>
                {filteredProjects.length === 0 ? (
                    <p>Nenhum projeto encontrado.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nome</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Tipo de Planta</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Data de Criação</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Descrição</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project._id}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{project.name}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{project.plantType}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(project.startDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }} className="table-cell-description">
                                        {expandedDescription === project._id ? project.description : truncateDescription(project.description)}
                                        {project.description.length > 100 && (
                                            <button onClick={() => toggleDescription(project._id)} style={{ marginLeft: '10px' }}>
                                                {expandedDescription === project._id ? 'Ver Menos' : 'Ver Mais'}
                                            </button>
                                        )}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        <button onClick={() => handleEditProject(project)} style={{ marginRight: '10px' }}>Editar</button>
                                        <button onClick={() => handleDeleteProject(project._id)}>Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default App;

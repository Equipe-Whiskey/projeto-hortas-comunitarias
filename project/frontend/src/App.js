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
    
    /* Pega os projetos do backend para mostrar no frontend */
    useEffect(() => {
        axios.get('http://localhost:5000/projects')
            .then(response => {
                setProjects(response.data);
                setFilteredProjects(response.data);
            })
            .catch(error => console.error('Erro ao buscar projetos:', error));
    }, []);
    
    /* Implementação de vários filtros */
    useEffect(() => {
        let updatedProjects = [...projects];
        
        /* Mostra apenas os projetos cujos nomes da escola condizem com o filtro */
        if (searchTerm) {
            updatedProjects = updatedProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        /* Mostra os projetos com o tipo de planta selecionado como filtro */
        if (plantFilter) {
            updatedProjects = updatedProjects.filter(project => project.plantType === plantFilter);
        }

        /* Ordena os projetos por tipo de planta */
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
    
    /* Certifica-se de que os variaveis a ser inseridas no backend sejam iguais aos valores no formulário */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    /* Adiciona o projeto ao backend */
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
    
    /* Deleta o projeto pelo backend */
    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:5000/projects/${projectId}`)
            .then(response => {
                setProjects(projects.filter(project => project._id !== projectId));
            })
            .catch(error => console.error('Erro ao deletar projeto:', error));
    };

    /* Certifica-se de que os variaveis a ser inseridas no backend sejam iguais aos valores no formulário */
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
    
    /* Faz uma requisição PUT para atualizar o projeto*/
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
    
    /*Reseta as mudanças ao projeto caso o usuário cancele a edição*/
    const handleCancelEdit = () => {
        setEditingProject(null);
        setNewProject({ name: '', description: '', plantType: '', startDate: '' });
    };

    /* Rola a tela para a seção desejada */
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    /* Altera entre a descrição extendida e encurtada */
    const toggleDescription = (projectId) => {
        setExpandedDescription(expandedDescription === projectId ? null : projectId);
    };

    /* Encurta a descrição se esta for muito longa */
    const truncateDescription = (description) => {
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    /* Verifica se todos os campos, exceto a descrição do projeto, estão preenchidos. Usado para prevenir de que */
    const checkFieldsEmpty = (inputs) => {
        if ((inputs.name).length > 0 && (inputs.startDate).length > 0 && (inputs.plantType).length > 0) {
            return true
        } else {
            return false
        }
    };

    /* Mostra dicas de como cuidar das plantas na lista */
    const displayPlantAdvice = (plantType) => {
        switch (plantType) {
            case "Alecrim":
                return "Vive bem em climas quentes e não precisa de muita água para viver.";
            case "Hortelã":
                return "Prefere solo úmido, recomendado regar quase todos os dias, dependendo da umidade.";
            case "Ora-pró-nobis":
                return "Faz parte da familia dos cactos, então só é necessario regá-la, por aí, uma vez a cada dez dias.";
            case "Manjericão":
                return "Prefere climas quentes. Deve-se regar constantemente mas de forma moderada, as flores roubam um pouco da força da planta e devem ser cortadas.";
            case "Orégano":
                return "Prefere climas mais amenos, mas se lida bem com o sol. Recomendado regar moderadamente de uma forma constante.";
            case "Salsa":
                return "Gosta de climas amenos mas também suporta um pouco de sombra. Prefere solos com boa drenagem e também de irrigação, pode-se usar uma mangueira para isso.";
            case "Cebolinha":
                return "Recomendado regar a cada dois dias, mas verifique se realmente precisa de água, pois elas são delicadas.";
            default:
                return "";
        }
    }

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
                <label>Nome da escola</label>
                <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                />
                <br />
                <label>Tipo de planta</label>
                <select
                    name="plantType"
                    value={newProject.plantType}
                    onChange={handleInputChange}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                >
                    <option value="">Selecione o Tipo de Planta</option>
                    <option value="Oregano">Oregano</option>
                    <option value="Manjericão">Manjericão</option>
                    <option value="Alecrim">Alecrim</option>
                    <option value="Hortelã">Hortelã</option>
                    <option value="Ora-pró-nobis">Ora-pró-nobis</option>
                    <option value="Salsa">Salsa</option>
                    <option value="Cebolinha">Cebolinha</option>
                </select>
                {newProject.plantType != "" && (
                    <p style={{ fontSize:'75%' }}>Como cuidar: {displayPlantAdvice(newProject.plantType)}</p>
                )}
                <br />
                <label>Data de início do projeto</label>
                <input
                    type="date"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                />
                <br />
                <label>Descrição da horta</label>
                <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="(especifique coisas como tamanho da horta, e onde esta fica. Opcional)"
                    rows="4"
                    style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
                />
                <br />
                
                {checkFieldsEmpty(newProject) ?
                    <button onClick={handleAddProject} style={{ marginTop: '10px' }}>{editingProject ? 'Salvar Projeto' : 'Adicionar Projeto'}</button>
                    :
                    <div style={{ color:'#822', fontSize:'70%' }}>
                    <p>Preencha os campos a seguir antes de {editingProject? 'editar' : 'adicionar'} o projeto:</p>
                    {(newProject.name).length === 0 && (<p> - Nome da Escola</p>)}
                    {(newProject.plantType).length === 0 && (<p> - Tipo de planta</p>)}
                    {(newProject.startDate).length === 0 && (<p> - Data de início do projeto</p>)}
                    </div>
                    }
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
                <h2>Lista de Escolas e suas Hortas</h2>
                {filteredProjects.length === 0 ? (
                    <p>Nenhum projeto de horta encontrado.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nome da Escola</th>
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

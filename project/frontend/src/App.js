import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]); // Estado para armazenar os projetos
    const [editMode, setEditMode] = useState(false); // Estado do modo de edição
    const [selectedProject, setSelectedProject] = useState(-1); // Estado para mostrar os detalhes do projeto selecionado

    // useEffect é chamado quando o componente é montado
    useEffect(() => {
        // Fazendo uma requisição GET para o backend na rota /projects
        axios.get('http://localhost:5000/projects')
            .then(response => {
                setProjects(response.data); // Armazena os projetos no estado
            })
            .catch(error => {
                console.error("Houve um erro ao buscar os projetos!", error);
            });
    }, []); // [] garante que o useEffect seja executado apenas uma vez
    return (
        <div>
            <h1>Hortas Comunitárias da Equipe Whiskey</h1>

            {editMode ? (
                <EditForm />
            ):(
                <SubmitForm />
            )}
            <p>-----------------------------------------</p>

            {/* Exibindo os projetos apenas se houver algum */}
            <h2>Lista de Projetos da ONG</h2>
            {projects.length === 0 ? (
                <p>Nenhum projeto foi adicionado ainda.</p>
            ) : (
                <div>

                    {selectedProject >= 0 ? (
                        <div>
                            <h2>{projects[selectedProject].nome}</h2>
                            <strong>Descrição:</strong> {projects[selectedProject].descricao} <br />
                            <strong>Status:</strong> {projects[selectedProject].status ? "Completo" : "Incompleto"}
                            <p onClick={() => setEditMode(true)}>Editar Projeto</p>
                            <p onClick={DeleteForm()}>Deletar Projeto</p>
                        </div>
                    ) : (
                        <p>Selecione um projeto para ver seus detalhes!</p>
                    )}

                    <p>-----------------------------------------</p>

                    <ul>
                        {projects.map((project, index) => (
                            <div><li onClick={() => setSelectedProject(index)}>
                                <strong>Nome:</strong> {project.nome} <br />
                                <strong>Descrição:</strong> {project.descricao}
                            </li><br /></div>
                        ))}
                    </ul>

                </div>
            )}

        </div>
    );

    // Formulário para criar novos projetos
    function SubmitForm() {

        const [inputs, setInputs] = useState({ nome: "", descricao: "", status: false });

        const handleChange = (event) => {
            const name = event.target.name;
            let value;

            switch (event.target.type) {
                case 'checkbox':
                    value = event.target.checked;
                    break;
                default:
                    value = event.target.value;
                    break;
            }
            setInputs(values => ({ ...values, [name]: value }))
        }

        const handleSubmit = async (event) => {
            event.preventDefaults();

            try {
                const response = await axios.post('http://localhost:5000/projects', inputs);
                alert(JSON.stringify(inputs) + "\nProjeto enviado com sucesso!");
                setProjects(updateProjects => [...updateProjects, inputs]);
                setInputs({});
            } catch (error) {
                console.error("", error);
                alert(JSON.stringify(inputs) + "\nHouve um erro ao enviar os dados.\n" + error);
            }

        }

        return (
            <div>
                <h2>Formulário de Criação de Projetos</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome do projeto:
                        <input
                            type="text"
                            name="nome"
                            value={inputs.nome || ""}
                            onChange={handleChange}
                        /> <br />
                    </label>

                    <label>Descrição:
                        <br />
                        <textarea
                            type="text"
                            name="descricao"
                            value={inputs.descricao || ""}
                            onChange={handleChange}
                            rows="4"
                            cols="60"
                        /> <br />
                    </label>

                    <label>Completo?
                        <input
                            type="checkbox"
                            name="status"
                            checked={inputs.status || false}
                            onChange={handleChange}
                        /> <br />
                    </label>

                    {/* Apenas exibe o botão de envio caso o projeto a ser enviado tenha nome e descrição*/}
                    {
                        JSON.stringify(inputs.nome).length >= 3 && JSON.stringify(inputs.descricao).length >= 3 ?
                            <div>
                                <br /><input type="submit" value="Criar" />
                            </div>
                            :
                            <p style={{ color: "#f00" }}>Insira um título e uma descrição para criar um projeto!</p>
                    }
                </form>
            </div>
        )
    }

    // Formulário para editar projetos existentes
    function EditForm() {

        const [inputs, setInputs] = useState(projects[selectedProject]);

        const handleChange = (event) => {
            const name = event.target.name;
            let value;

            switch (event.target.type) {
                case 'checkbox':
                    value = event.target.checked;
                    break;
                default:
                    value = event.target.value;
                    break;
            }
            setInputs(values => ({ ...values, [name]: value }))
        }

        const handleSubmit = async (event) => {
            event.preventDefaults();

            try {
                const response = await axios.put('http://localhost:5000/projects/'+selectedProject, inputs);
                alert(JSON.stringify(inputs) + "\nProjeto editado com sucesso!");
                setEditMode(false);
                setInputs({});

                // Atualiza a lista de projetos, vendo se 
                setProjects(updateProjects => updateProjects.map((project, index) => 
                    index === selectedProject ? 
                        updateProjects[index] = inputs
                     : 
                        project
                    )
                );
            } catch (error) {
                console.error("", error);
                alert("Houve um erro ao editar os dados.\n" + error);
            }

        }


        return (
            <div>
                <h2 style={{ color: "#0a0" }}>Formulário de Edição de Projetos</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome do projeto:
                        <input
                            type="text"
                            name="nome"
                            value={inputs.nome || ""}
                            onChange={handleChange}
                        /> <br />
                    </label>

                    <label>Descrição:
                        <br />
                        <textarea
                            type="text"
                            name="descricao"
                            value={inputs.descricao || ""}
                            onChange={handleChange}
                            rows="4"
                            cols="60"
                        /> <br />
                    </label>

                    <label>Completo?
                        <input
                            type="checkbox"
                            name="status"
                            checked={inputs.status || false}
                            onChange={handleChange}
                        /> <br />
                    </label>

                    {/* Apenas exibe o botão de envio caso o projeto a ser enviado tenha nome e descrição*/}
                    {
                        JSON.stringify(inputs.nome).length >= 3 && JSON.stringify(inputs.descricao).length >= 3 ?
                            <div>
                                <br /><input type="submit" value="Editar" />
                            </div>
                            :
                            <p style={{ color: "#f00" }}>Insira um título e uma descrição para editar este projeto!</p>
                    }
                </form>
            </div>
        )
    }

    function DeleteForm() {
        return async (event) => {
            try {
                const response = await axios.delete('http://localhost:5000/projects/'+selectedProject);
                alert("Projeto '" + projects[selectedProject].nome + "' deletado com sucesso!");

                // Remove o projeto deletado da lista e sai do modo de edição
                                                        // Esse "_" representa todos os projetos individuais
                setProjects(updateProjects => updateProjects.filter((_, index) => index !== selectedProject));
                setEditMode(false);
                setSelectedProject(-1);
            } catch (error) {
                console.error("Houve um erro ao deletar o projeto: " , error);
                alert("Houve um erro ao deletar o projeto: " + error);
            }
        }
    }
}
export default App;
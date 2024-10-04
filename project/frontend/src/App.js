import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [projects, setProjects] = useState([]); // Estado para armazenar os projetos
    const [selectedProject, setSelectedProject] = useState(-1);

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

            <h2>Formulário de Criação de Projetos</h2>
            <Form />
            <p>-----------------------------------------</p>

            {/* Exibindo os projetos apenas se houver algum */}
            <h2>Lista de Projetos da ONG</h2>
            {projects.length === 0 ? (
                <p>Nenhum projeto foi adicionado ainda.</p>
            ) : (
                <div>
                    <ul>
                        {projects.map((project, index) => (
                            <div><li key={index} onClick={() => setSelectedProject(index)}>
                                <strong>Nome:</strong> {project.nome} <br />
                                <strong>Descrição:</strong> {project.descricao}
                            </li><br /></div>
                        ))}
                    </ul>

                    <p>-----------------------------------------</p>

                    {selectedProject >= 0 ? (
                        <div>
                            <h2>{projects[selectedProject].nome}</h2> <br />
                            <strong>Descrição:</strong> {projects[selectedProject].descricao} <br />
                            <strong>Status:</strong> {projects[selectedProject].status ? "Completo" : "Incompleto"}
                        </div>
                    ) : (
                        <p>Selecione um projeto para ver seus detalhes!</p>
                    )}
                </div>
            )}

            
        </div>
    );

    function Form() {

        const [inputs, setInputs] = useState({nome:"", descricao:"", status:false});

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
            event.preventDefault();

            try {
                const response = await axios.post('http://localhost:5000/projects', inputs);
                alert(JSON.stringify(inputs) + "\nProjeto enviado com sucesso!");
                setProjects(prevProjects => [inputs, ...prevProjects]);
                setInputs({});
            } catch (error) {
                console.error("", error);
                alert(JSON.stringify(inputs) + "\nHouve um erro ao enviar os dados.\n" + error);
            }

        }

        return (
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
                <p style={{color:"#f00"}}>Insira um título e uma descrição para criar um projeto!</p>
                }
            </form>
        )
    }
}
export default App;
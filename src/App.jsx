import { useState, useEffect } from 'react'
import { FiTrash, FiEdit } from 'react-icons/fi'
import axios from 'axios';
import './App.css'

function App() {
  const Todos = ({ todos }) => {
    return (
      <div>
        {todos.map((todo) => {
          return (
            <div key={todo.id}>

              <ul>
                <li className='item'>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input onClick={() => deleteTodo(todo)} className='circle' type='radio' />
                    <h3>{todo.title}</h3>
                  </div>

                  <div style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                    <button className='btn' onClick={() => handleWithEditButtonClick(todo)}><FiEdit color='#333' size={26} /></button>
                    <button className='btn' onClick={() => deleteTodo(todo)}><FiTrash color='red' size={26} /></button>
                  </div>
                </li>
              </ul>

            </div>
          );
        })}
      </div>
    );
  }

  const [tarefas, setTarefas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  async function getTodos() {
    const res = await axios.get("http://localhost:3333/todos");
    setTarefas(res.data);
  }

  useEffect(() => {
    getTodos();
  }, []);

  async function handleClick(todo) {
    setInputVisible(!inputVisible);
  }

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisible(true);
  }


  async function createTodo() {
    const res = await axios.post("http://localhost:3333/todos", {
      title: inputValue
    });
    if (inputValue !== '') {
      getTodos();
      setInputVisible(!inputVisible);
      setInputValue('');
      return;
    }

    alert('Por favor preencher o campo!');
  }


  async function editTodo() {
    const res = await axios.put("http://localhost:3333/todos/", {
      id: selectedTodo.id,
      title: inputValue,
    });
    setSelectedTodo();
    setInputVisible(false);
    getTodos();
    setInputValue('');
  }

  async function deleteTodo(todo) {
    const res = await axios.delete(
      `http://localhost:3333/todos/${todo.id}`
    );
    getTodos();
  }


  return (
    <div className='container'>

      <div className='todoContainer'>
        <h1>To-Do List</h1>
        <div className='todos'>
          {tarefas.length === 0 ? (
            <span>Nenhuma tarefa cadastrada</span>
          ) :
            (
              <Todos todos={tarefas} />
            )
          }
        </div>

        <div className='areaInputs'>
          <input
            value={inputValue}
            style={{ display: inputVisible ? "block" : "none" }}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Nova tarefa' />
          <button onClick={
            inputVisible
              ? selectedTodo
                ? editTodo
                : createTodo
              : handleClick
          }>{inputVisible ? "Salvar" : "+ Nova tarefa"}</button>

        </div>
      </div>




    </div >
  )
}

export default App

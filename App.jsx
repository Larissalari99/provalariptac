import { useEffect, useState } from 'react'
import FormularioAviso from './components/FormularioAviso.jsx'
import ListaAvisos from './components/ListaAvisos.jsx'
import './App.css'

const API_BASE = 'https://jsonplaceholder.typicode.com'
const USUARIO_ATUAL = 1

export default function App() {
  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [avisoEmEdicao, setAvisoEmEdicao] = useState(null)

  
  useEffect(() => {
    setCarregando(false)
    setErro(false)
  }, [])

  
  async function publicarAviso({ title, body }) {
    try {
      const resposta = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USUARIO_ATUAL, title, body }),
      })
      if (!resposta.ok) throw new Error('Falha ao publicar aviso')
      const novoAviso = await resposta.json()
   

      setAvisos((atual) => [novoAviso, ...atual])
    } catch {
      window.alert('Não foi possível publicar o aviso. Tente novamente.')
    }
  }


  async function salvarEdicao(id, { title, body }) {
    try {
      const resposta = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USUARIO_ATUAL, id, title, body }),
      })
      if (!resposta.ok) throw new Error('Falha ao atualizar aviso')
      setAvisos((atual) =>
        atual.map((aviso) => (aviso.id === id ? { ...aviso, title, body } : aviso))
      )
      setAvisoEmEdicao(null)
    } catch {
      window.alert('Não foi possível salvar as alterações. Tente novamente.')
    }
  }


  async function excluirAviso(id) {
    const avisoRemovido = avisos.find((aviso) => aviso.id === id)
    setAvisos((atual) => atual.filter((aviso) => aviso.id !== id))

    try {
      const resposta = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
      })
      if (!resposta.ok) throw new Error('Falha ao excluir aviso')
    } catch {
    
      if (avisoRemovido) {
        setAvisos((atual) => [...atual, avisoRemovido].sort((a, b) => a.id - b.id))
      }
      window.alert('Não foi possível excluir o aviso. Ele foi restaurado na lista.')
    }
  }

  function iniciarEdicao(aviso) {
    setAvisoEmEdicao(aviso)
  }

  function cancelarEdicao() {
    setAvisoEmEdicao(null)
  }

  return (
    <>
      <header className="cabecalho">
        <h1>Mural de Avisos da Turma</h1>
        <p>PTAC4 - IFMS - Semestre 2026/02</p>
      </header>

      <div className="layout">
        <FormularioAviso
          avisoEmEdicao={avisoEmEdicao}
          aoPublicar={publicarAviso}
          aoSalvarEdicao={salvarEdicao}
          aoCancelar={cancelarEdicao}
        />

        <ListaAvisos
          avisos={avisos}
          carregando={carregando}
          erro={erro}
          aoEditar={iniciarEdicao}
          aoExcluir={excluirAviso}
        />
      </div>
    </>
  )
}

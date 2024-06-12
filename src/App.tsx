import { useEffect, useState } from 'react'
import './App.css'
import { Box, Button, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import BackIcon from '@mui/icons-material/ArrowBack'
import SegmentSelector from './components/SegmentSelector'
import useApi from './hooks/request'
import { ApiResponse } from './components/SegmentSelector'

export interface Segmento {
  id: string
  descricao: string
}

function App() {
  const { sendRequest, isLoading } = useApi<ApiResponse>()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [selected, setSelected] = useState<Segmento>()

  useEffect(() => {
    const fetchInitialSegment = async () => {
      const response = await sendRequest(
        '/Segmento?Descricao=Serviços de Beleza'
      )
      if (response.data) {
        setSelected(
          response.data.list.find(
            (segment) => segment.descricao === 'Serviços de Beleza.'
          )
        )
      }
    }
    fetchInitialSegment()
  }, [sendRequest])

  const handleBackButton = () => {
    if (isEditing) {
      setIsEditing(false)
    }
  }

  isLoading && <p>Carregando...</p>
  return (
    <div className='container'>
      <Typography variant='h2' color='#3498db'>
        Segmento da empresa
      </Typography>
      <Typography color='#555'>
        {isEditing
          ? 'Selecione abaixo o segmento que mais se aproxima com o ramo de atividade de sua empresa'
          : 'Confirme o segmento que sua empresa atua para personalizarmos sua experiência com nosso aplicativo.'}
      </Typography>

      {!isEditing && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '60px',
            marginBottom: '60px',
          }}
        >
          <Typography color='#555'>Segmento Selecionado:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h2' color='#3498db'>
              {selected?.descricao}
            </Typography>
            <IconButton aria-label='delete' onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {isEditing && (
        <SegmentSelector
          setSelectedSegment={setSelected}
          closeSegment={setIsEditing}
        />
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          startIcon={<BackIcon />}
          variant='outlined'
          onClick={handleBackButton}
        >
          Voltar
        </Button>
        {!isEditing && (
          <Button startIcon={<CheckIcon />} variant='contained'>
            Finalizar Cadastro
          </Button>
        )}
      </Box>
    </div>
  )
}

export default App

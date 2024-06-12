import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { Segmento } from '../App'
import useApi from '../hooks/request'
import useDebounce from '../hooks/useDebounce'

export interface ApiResponse {
  list: Segmento[]
}

interface Props {
  setSelectedSegment: React.Dispatch<React.SetStateAction<Segmento | undefined>>
  closeSegment: React.Dispatch<React.SetStateAction<boolean>>
}

const SegmentSelector: React.FC<Props> = ({
  setSelectedSegment,
  closeSegment,
}) => {
  const { sendRequest } = useApi<ApiResponse>()

  const [segments, setSegments] = useState<Segmento[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const fetchSegments = async (query: string) => {
    const response = await sendRequest(`/Segmento?Descricao=${query}&Page=1`)
    if (response.data) {
      setSegments(response.data.list)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSegments(debouncedSearchTerm)
    } else {
      setSegments([])
    }
  }, [debouncedSearchTerm])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSelectSegment = (segment: Segmento) => {
    setSelectedSegment(segment)
    closeSegment(false)
  }

  return (
    <Container>
      <div>
        <TextField
          label='Buscar Segmento'
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          margin='normal'
        />

        <List>
          {searchTerm.length === 0 && (
            <ListItem>
              <ListItemText
                sx={{
                  background: '#f5f5f5',
                  borderRadius: '5px',
                  padding: '7.5px',
                  border: '1px solid #e1e1e1',
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                <Typography variant='h6'>
                  Informe acima o segmento para continuar.
                </Typography>
              </ListItemText>
            </ListItem>
          )}
          {segments.map((segment: Segmento) => (
            <ListItem
              key={segment.id}
              onClick={() => handleSelectSegment(segment)}
            >
              <ListItemText
                sx={{
                  background: '#f5f5f5',
                  borderRadius: '5px',
                  padding: '7.5px',
                  border: '1px solid #e1e1e1',
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                <Typography variant='h6'>{segment.descricao}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  )
}

export default SegmentSelector

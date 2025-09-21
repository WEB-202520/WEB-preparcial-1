'use client'

import {useEffect, useState} from 'react'
import {Author} from '@/model/Author.interface'

// api del back desplegado
const API = 'http://localhost:8080/api/authors'

export function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const getAuthors = async () => {
        try {
            setLoading(true)
            const response = await fetch(API, {cache: 'no-store'})
            const data: Author[] = await response.json()
            setAuthors(data)
            setLoading(false)
            setError(null)
        } catch {
            const error: Error = new Error('No pude cargar autores')
            setError( error )
        }
    }

    // Llamar a los autores una vez y guardarlos en `autores`
    useEffect(() => {
        getAuthors()
    }, [])

    const postAuthor = async (a: Omit<Author, 'id'>) => {
        const response = await fetch(API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(a),
        })
        if (!response.ok) {
            const error: Error = new Error('Error creando autor')
            setError( error )
            throw error
        }
        await getAuthors()
    }

    const updateAuthor = async (id: number, a: Omit<Author, 'id'>) => {
        const response = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(a),
        })
        if (!response.ok) {
            const error: Error = new Error('Error actualizando autor')
            setError( error )
        }
        await getAuthors()
    }

    const deleteAuthor = async (id: number) => {
        // asegurarnos de que es número, estaba causando errores lol
        const authorId = Number(id);
        const response = await fetch(`${API}/${authorId}`, {method: 'DELETE'});
        if (!response.ok) {
            const error: Error = new Error('Error eliminando autor')
            setError( error )
        }
        // ok → sacamos de la lista
        setAuthors(prev => prev.filter(a => a.id !== authorId));
    };

    return {authors, loading, error, getAuthors, postAuthor, updateAuthor, deleteAuthor}
}

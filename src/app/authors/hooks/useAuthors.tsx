'use client'

import {useEffect, useState} from 'react'
import {Author} from '@/model/Author.interface'

// api del back desplegado
const API = 'http://localhost:8080/api/authors'

export function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([])

    const getAuthors = async () => {
        try {
            const response = await fetch(API, {cache: 'no-store'})
            const data: Author[] = await response.json()
            setAuthors(data)
        } catch {
            throw new Error('No pude cargar autores')
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
        if (!response.ok) throw new Error('Error creando autor')
        await getAuthors()
    }

    const updateAuthor = async (id: number, a: Omit<Author, 'id'>) => {
        const response = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(a),
        })
        if (!response.ok) throw new Error('Error actualizando autor')
        await getAuthors()
    }

    const deleteAuthor = async (id: number) => {
        // asegurarnos de que es número, estaba causando errores lol
        const authorId = Number(id);
        const response = await fetch(`${API}/${authorId}`, {method: 'DELETE'});
        if (!response.ok) throw new Error('Error eliminando autor');
        // ok → sacamos de la lista
        setAuthors(prev => prev.filter(a => a.id !== authorId));
    };

    return {authors, getAuthors, postAuthor, updateAuthor, deleteAuthor}
}

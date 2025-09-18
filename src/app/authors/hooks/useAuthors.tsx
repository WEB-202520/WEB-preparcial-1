'use client'

import { useCallback, useEffect, useState } from 'react'
import { Author } from '@/app/model/Author.interface'

const API = 'http://localhost:8080/api/authors'

export function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetch(API, { cache: 'no-store' })
            const data: Author[] = await res.json()
            setAuthors(data)
            setError(null)
        } catch (e) {
            setError('No pude cargar autores')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const create = async (payload: Omit<Author,'id'>) => {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Error creando autor')
        await load()
    }

    const update = async (id: number, payload: Omit<Author,'id'>) => {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Error actualizando autor')
        await load()
    }

    const remove = async (id: number) => {
        // asegurarnos de que es número
        const authorId = Number(id);
        if (!Number.isFinite(authorId)) throw new Error('ID inválido');

        const res = await fetch(`${API}/${authorId}`, { method: 'DELETE' });

        if (res.status === 404) {
            // no existía → quitamos del estado para mantener UI coherente
            setAuthors(prev => prev.filter(a => a.id !== authorId));
            return;
        }

        if (res.status === 412) {
            // el backend rechaza por precondición: mostramos el motivo si viene en texto/JSON
            let msg = 'No se puede eliminar el autor (precondición fallida).';
            try {
                const ct = res.headers.get('content-type') || '';
                msg = ct.includes('application/json')
                    ? (await res.json())?.message ?? msg
                    : await res.text() || msg;
            } catch { /* noop */ }
            throw new Error(msg);
        }

        if (!res.ok) throw new Error('Error eliminando autor');

        // ok → sacamos de la lista
        setAuthors(prev => prev.filter(a => a.id !== authorId));
    };


    return { authors, loading, error, load, create, update, remove }
}

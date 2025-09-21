'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Author} from '@/model/Author.interface';
import {useAuthors} from '@/app/authors/hooks/useAuthors';

type Draft = Omit<Author, 'id'> // crear tipo para autores sin ID para el update

export const AuthorsGrid = () => {
    const {authors, loading, error, updateAuthor, deleteAuthor} = useAuthors()
    // useState para saber si se está editando algún autor. Solo se puede actualizar uno a la vez
    const [editingId, setEditingId] = useState<number | null>(null)
    const [draft, setDraft] = useState<Draft>({
        name: '', birthDate: '', description: '', image: ''
    })

    const startEdit = (a: Author) => {
        setEditingId(a.id)
        setDraft({
            name: a.name,
            birthDate: a.birthDate,
            description: a.description,
            image: a.image
        })
    }

    const deleteButton = async ( id: number ) => {
        await deleteAuthor( id )
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    /**
     * Cambiar los elementos del Draft cada vez que ocurra un cambio
     * @param e
     */
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target // se extrae el cambio
        setDraft(prev => ({...prev, [name]: value})) // se actualiza el draft, asegurándo que el cambio se vea reflejado
    }

    const onSave = async () => {
        if (editingId == null) return
        await updateAuthor(editingId, draft) // actualiza en el back
        setEditingId(null)
    }

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50/75 dark:bg-gray-900/75 z-50">
            <span className="text-gray-700 dark:text-gray-200 font-medium">Cargando...</span>
        </div>
    )

    if (error) return (
        <div className="fixed inset-0 flex items-center justify-center bg-red-50/75 dark:bg-red-900/75 z-50">
            <span className="text-red-700 dark:text-red-300 font-medium">
                    {typeof error === 'object' && error !== null && 'message' in error ? (error).message : String(error)}
            </span>
        </div>
    )

    return (
        <div className="grid flex-col md:grid-cols-3 gap-10 m-10 sm:grid-cols-1">
            {authors.map((author) => (
                <div key={author.id} className="flex border rounded-lg shadow-sm bg-gray-300 dark:bg-gray-700">
                    <div className="p-6 w-full">

                        {/*Aquí la idea es determinar cuál autor se está editando, para mostrar su formulario y actualizar el Draft*/}
                        {editingId === author.id ? (
                            // Si el autor está siendo editado, mostrar formulario
                            <div className="flex flex-col gap-2">
                                <input name="name" value={draft.name} onChange={onChange}
                                       className="border p-2 rounded"/>
                                <input name="birthDate" value={draft.birthDate} onChange={onChange}
                                       className="border p-2 rounded"/>
                                <input name="description" value={draft.description} onChange={onChange}
                                       className="border p-2 rounded"/>
                                <input name="image" value={draft.image} onChange={onChange}
                                       className="border p-2 rounded"/>
                                <div className="flex gap-2">
                                    <button onClick={onSave}
                                            className="border bg-blue-500 text-white rounded-xl px-4 py-1">Guardar
                                    </button>
                                    <button onClick={cancelEdit}
                                            className="border bg-gray-200 dark:bg-gray-800 rounded-xl px-4 py-1">Cancelar
                                    </button>
                                </div>
                            </div>


                        ) : (

                            // dlc, mostrar datos del autor
                            <div>
                                <h1 className="font-bold">{author.name}</h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-1 mt-1">{author.birthDate}</p>
                                <p className="mb-2">{author.description}</p>
                                <div className="mt-4 flex justify-center">
                                    <Image src={author.image} alt={author.name} width={300} height={300}
                                           className="rounded-2xl shadow-lg"/>
                                </div>
                                <div className="mt-6 flex justify-center gap-2">
                                    <button onClick={() => startEdit(author)}
                                            className="border bg-blue-200 dark:bg-blue-500 font-bold rounded-xl px-4 py-1">Editar
                                    </button>
                                    <button
                                        onClick={()=>deleteButton(author.id)}
                                        className="border bg-red-400 font-bold rounded-xl px-4 py-1">Eliminar
                                    </button>

                                </div>
                            </div>
                        )}


                    </div>
                </div>
            ))}
        </div>
    )
}

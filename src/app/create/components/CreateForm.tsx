'use client'

import z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {SubmitHandler, useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'

const schema = z.object({
    // se utiliza una expresión regular para validar el formato de la fecha y evitar problemas con el back
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Usa YYYY-MM-DD'),
    name: z.string().min(1, 'Nombre requerido'),
    description: z.string().min(1, 'Descripción requerida'),
    image: z.string().url('Debe ser una URL'),
})

type FormFields = z.infer<typeof schema>

export const CreateForm = () => {

    const router = useRouter() // se utiliza el router para llevar al usuario a la página de autores tras crear uno nuevo

    const {register, handleSubmit, setError, reset, formState: {errors, isSubmitting} } =
        useForm<FormFields>({
            defaultValues: {
                image: 'https://images-na.ssl-images-amazon.com/images/I/81-Q4oeHicL.jpg'
            },
            resolver: zodResolver(schema)
        })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const res = await fetch('http://localhost:8080/api/authors', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error('Autor ya existe')
            reset()
            router.push('/authors') // volver a la pagina de autores, donde se podrá ver el nuevo autor xd
        } catch {
            setError('root', {message: 'No se pudo crear'})
        }
    }

    return (
        <div className="flex flex-col m-4 items-center justify-center">
            <form className="flex flex-col gap-3 mt-4 w-100 bg-gray-300 dark:bg-gray-700 p-5 rounded-lg border shadow-sm" onSubmit={handleSubmit(onSubmit)}>

                <p>Nombre</p>
                <input {...register('name')} type="text" placeholder="Name" className="border p-2 rounded-lg"/>
                {errors.name && <span className='text-red-500'>{errors.name.message}</span>}

                <p className="mt-1">Fecha de nacimiento en formato YYYY-MM-DD</p>
                <input {...register('birthDate')} type="text" placeholder="Birth Date"
                       className="border p-2 rounded-lg"/>
                {errors.birthDate && <span className='text-red-500'>{errors.birthDate.message}</span>}

                <p className="mt-1">Descripción</p>
                <input {...register('description')} type="text" placeholder="Description"
                       className="border p-2 rounded-lg"/>
                {errors.description && <span className='text-red-500'>{errors.description.message}</span>}

                <p className="mt-1">Link a imagen</p>
                <input {...register('image')} type="text" placeholder="Image link" className="border p-2 rounded-lg"/>
                {errors.image && <span className='text-red-500'>{errors.image.message}</span>}

                <button disabled={isSubmitting} type="submit"
                        className="border mt-10 bg-blue-200 dark:bg-blue-800 font-bold rounded-2xl px-4 py-2">
                    {isSubmitting ? 'Guardando…' : 'Crear'}
                </button>
            </form>
        </div>
    )
}

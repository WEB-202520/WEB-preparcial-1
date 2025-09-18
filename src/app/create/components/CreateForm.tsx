'use client'

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

const schema = z.object({
    birthDate: z.string(),
    name: z.string().min(1, 'Nombre requerido'),
    description: z.string().min(1, 'Descripción requerida'),
    image: z.string().url('Debe ser una URL'),
})
type FormFields = z.infer<typeof schema>

export const CreateForm = () => {
    const router = useRouter()

    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } =
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error('Autor ya existe')
            reset()
            router.push('/authors')
        } catch {
            setError('root', { message: 'No se pudo crear' })
        }
    }

    return (
        <div className="flex flex-col m-2 items-center justify-center">
            <form className="flex flex-col gap-3 mt-4 w-100" onSubmit={handleSubmit(onSubmit)}>
                <input {...register('name')} type="text" placeholder="Name" className="border p-2 rounded-lg" />
                {errors.name && <span className='text-red-500'>{errors.name.message}</span>}

                <input {...register('birthDate')} type="text" placeholder="Birth Date" className="border p-2 rounded-lg" />
                {errors.birthDate && <span className='text-red-500'>{errors.birthDate.message}</span>}

                <input {...register('description')} type="text" placeholder="Description" className="border p-2 rounded-lg" />
                {errors.description && <span className='text-red-500'>{errors.description.message}</span>}

                <input {...register('image')} type="text" placeholder="Image link" className="border p-2 rounded-lg" />
                {errors.image && <span className='text-red-500'>{errors.image.message}</span>}

                <button disabled={isSubmitting} type="submit" className="border mt-10 bg-blue-200 font-bold rounded-2xl px-4 py-2">
                    {isSubmitting ? 'Guardando…' : 'Crear'}
                </button>
            </form>
        </div>
    )
}

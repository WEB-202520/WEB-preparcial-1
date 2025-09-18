import {AuthorsGrid} from "@/app/authors/components/AuthorsGrid";
import Link from "next/link";

export default function AuthorsPage() {

    return (
        <div>
            <div className="border bg-gray-300 rounded-xl shadow-sm grid-cols-2 grid m-5 p-2">
                <h1 className="font-bold pl-10">Preparcial 1 - Adrian Velasquez 202222737</h1>
                <nav className="justify-end gap-15 text-sm md:flex pr-10">
                    <Link href="/authors" className="text-xl font-bold">
                        Authors
                    </Link>
                    <Link href="/create" className="text-xl font-bold">
                        Create
                    </Link>
                </nav>
            </div>
            <AuthorsGrid/>
        </div>
    )
}
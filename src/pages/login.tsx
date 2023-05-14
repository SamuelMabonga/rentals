import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useState } from "react"

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(event: any) {
        event.preventDefault()

        const status = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password
        })
        console.log(status)

        if (status?.ok) {
            router.push("/")
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
                type="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
            />
            <label>Password</label>
            <input
                type="password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit">Login</button>
        </form>
    )
}
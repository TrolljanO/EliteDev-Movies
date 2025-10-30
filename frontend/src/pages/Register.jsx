import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../services/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!email || !password) {
            setError('Preencha email e senha.')
            return
        }
        if (password !== confirm) {
            setError('As senhas não coincidem.')
            return
        }

        setSubmitting(true)
        try {
            await AuthService.signup({ email, password })

            await AuthService.signin({ email, password })

            const { data } = await AuthService.session()
            setUser(data?.user ?? null)

            navigate('/')
        } catch (err) {
            console.error('Register failed:', err?.response?.data || err)
            const apiMsg = err?.response?.data?.message || err?.message
            setError(apiMsg || 'Falha no registro. Tente novamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
            <h1 className="text-2xl font-semibold">Criar conta</h1>
            {error && <div className="text-sm text-red-500">{error}</div>}

            <input
                className="w-full rounded border px-3 py-2"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="w-full rounded border px-3 py-2"
                placeholder="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                className="w-full rounded border px-3 py-2"
                placeholder="Confirmar senha"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
            />

            <button
                disabled={submitting}
                className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-500 disabled:opacity-50"
            >
                {submitting ? 'Registrando...' : 'Registrar'}
            </button>

            <div className="text-sm text-gray-600">
                Já tem conta? <Link className="text-blue-600 hover:underline" to="/login">Entrar</Link>
            </div>
        </form>
    )
}

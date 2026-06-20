import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { LogoutToast } from '../components/common/logout-toast'
import { Button } from '../components/ui/button'
import { useBear } from '../store/authStore'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export function AuthPage({ mode }: AuthPageProps) {
  const { postLogin, postRegister, clearMessage, error, message, isLoading } = useBear()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [logoutNotice, setLogoutNotice] = useState(() => {
    return sessionStorage.getItem('debtflow_logout') === '1'
  })
  const isLogin = mode === 'login'
  const logoutNoticeKey = logoutNotice ? 1 : 0

  const authForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (logoutNotice) {
      sessionStorage.removeItem('debtflow_logout')
    }
  }, [logoutNotice])

  useEffect(() => {
    if (logoutNotice) {
      const timer = window.setTimeout(() => {
        setLogoutNotice(false)
      }, 3500)

      return () => window.clearTimeout(timer)
    }
  }, [logoutNotice, logoutNoticeKey])

  const submitAuth = async (values: { name: string; email: string; password: string }) => {
    const success = isLogin
      ? await postLogin({
          email: values.email,
          password: values.password,
        })
      : await postRegister({
          name: values.name,
          email: values.email,
          password: values.password,
        })

    if (success) {
      authForm.reset({
        name: '',
        email: '',
        password: '',
      })
      setShowPassword(false)
      navigate('/dashboard')
    }
  }

  const resetBeforeMove = () => {
    clearMessage()
    authForm.clearErrors()
    authForm.reset({
      name: '',
      email: '',
      password: '',
    })
    setShowPassword(false)
  }

  return (
    <main className="min-h-screen bg-[#f9f9ff] font-sans text-[#111c2d]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-[#111c2d] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#4648d4]/40 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-[#6cf8bb]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-20 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#4648d4] shadow-lg">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">DebtFlow</h1>
                <p className="text-sm text-white/60">Personal debt tracker</p>
              </div>
            </div>

            <p className="mb-6 max-w-xl text-5xl font-bold leading-tight tracking-[-0.04em]">
              Simple debt tracking with contacts and payments.
            </p>
            <p className="max-w-lg text-lg leading-8 text-white/70">
              Add contacts, create debts, record payments, and check the balance from one dashboard.
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-white/60">DebtFlow keeps it clear:</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-white/10 p-4">Contacts</div>
              <div className="rounded-2xl bg-white/10 p-4">Debts</div>
              <div className="rounded-2xl bg-white/10 p-4">Payments</div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#e1e0ff] text-[#4648d4]">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.03em]">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {isLogin ? 'Sign in to manage your debts' : 'Start tracking your personal ledger'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={authForm.handleSubmit(submitAuth)}>
              {!isLogin && (
                <label className="block text-sm font-medium text-slate-700">
                  Full name
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                    maxLength={120}
                    placeholder="Jane Doe"
                    {...authForm.register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                  {authForm.formState.errors.name && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {authForm.formState.errors.name.message}
                    </p>
                  )}
                </label>
              )}

              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                  placeholder="you@example.com"
                  type="email"
                  {...authForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email is not valid',
                    },
                  })}
                />
                {authForm.formState.errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {authForm.formState.errors.email.message}
                  </p>
                )}
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Password
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                    maxLength={128}
                    placeholder="secret123"
                    type={showPassword ? 'text' : 'password'}
                    {...authForm.register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {authForm.formState.errors.password && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {authForm.formState.errors.password.message}
                  </p>
                )}
              </label>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input className="h-4 w-4 rounded border-slate-300" type="checkbox" />
                    Remember me
                  </label>
                  <button className="font-semibold text-[#4648d4]" type="button">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {message}
                </p>
              )}

              <Button
                className="w-full"
                disabled={isLoading || !authForm.formState.isValid}
                type="submit"
              >
                {isLoading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>

              <p className="text-center text-sm text-slate-500">
                {isLogin ? 'New here?' : 'Already have an account?'}{' '}
                <Link
                  className="font-semibold text-[#4648d4]"
                  to={isLogin ? '/register' : '/login'}
                  onClick={resetBeforeMove}
                >
                  {isLogin ? 'Create an account' : 'Sign in'}
                </Link>
              </p>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-400">
                <span className="material-symbols-outlined text-base">shield_lock</span>
                Secure token based authentication
              </div>
            </form>
          </div>
        </section>
      </div>

      <LogoutToast
        count={logoutNoticeKey}
        open={logoutNotice}
        onClose={() => setLogoutNotice(false)}
      />
    </main>
  )
}

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { LogoutToast } from '../components/common/logout-toast'
import { ThemeToggle } from '../components/theme/theme-toggle'
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
    <main className="auth-shell">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
        <section className="relative hidden overflow-hidden bg-[#101522] px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between xl:px-14 xl:py-11">
          <div className="absolute -left-28 top-20 h-96 w-96 rounded-full bg-[#5557d9]/35 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/15 blur-[110px]" />

          <div className="relative">
            <div className="mb-20 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-white text-[#4b4dce] shadow-lg">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                  <h1 className="text-xl font-bold tracking-[-0.025em]">DebtFlow</h1>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Personal finance</p>
              </div>
            </div>

              <p className="mb-5 max-w-xl text-4xl font-bold leading-[1.12] tracking-[-0.045em] xl:text-5xl">
                Keep every debt clear, calm and accounted for.
              </p>
              <p className="max-w-lg text-base leading-7 text-white/70 xl:text-lg xl:leading-8">
                Contacts, balances and payment history in one focused workspace.
            </p>
          </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">Everything connected</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {['Contacts', 'Debts', 'Payments'].map((item) => (
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm font-semibold" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center px-4 py-20 sm:px-8 lg:py-10">
            <div className="absolute right-4 top-4 sm:right-8 sm:top-7">
              <ThemeToggle />
            </div>

            <div className="surface-card w-full max-w-[440px] rounded-[1.5rem] p-6 sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-[14px] bg-[var(--primary-soft)] text-[var(--primary-text)]">
                  <span className="material-symbols-outlined text-[21px]">lock</span>
                </div>
                <h2 className="text-3xl font-bold tracking-[-0.035em] text-[var(--text)]">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                {isLogin ? 'Sign in to manage your debts' : 'Start tracking your personal ledger'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={authForm.handleSubmit(submitAuth)}>
              {!isLogin && (
                  <label className="block text-sm font-semibold text-[var(--text-soft)]">
                  Full name
                  <input
                    className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
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

                <label className="block text-sm font-semibold text-[var(--text-soft)]">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
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

                <label className="block text-sm font-semibold text-[var(--text-soft)]">
                Password
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 pr-12 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
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
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
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
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-2 text-[var(--muted)]">
                    <input className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--primary)]" type="checkbox" />
                    Remember me
                  </label>
                    <button className="font-bold text-[var(--primary-text)]" type="button">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_18%,transparent)] bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-xl border border-[color-mix(in_srgb,var(--success)_18%,transparent)] bg-[var(--success-soft)] px-4 py-3 text-sm font-semibold text-[var(--success)]">
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

                <p className="text-center text-sm text-[var(--muted)]">
                {isLogin ? 'New here?' : 'Already have an account?'}{' '}
                <Link
                    className="font-bold text-[var(--primary-text)] hover:underline"
                  to={isLogin ? '/register' : '/login'}
                  onClick={resetBeforeMove}
                >
                  {isLogin ? 'Create an account' : 'Sign in'}
                </Link>
              </p>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-[var(--faint)]">
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

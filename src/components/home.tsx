import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Debt, useBear } from '../store/authStore'
import { FeedbackMessages } from './common/feedback-messages'
import { LogoutToast } from './common/logout-toast'
import { BalanceCard, MetricCard } from './dashboard/dashboard-cards'
import { FolderCard } from './folders/folder-card'
import { AppHeader } from './layout/app-header'
import { AppSidebar } from './layout/app-sidebar'
import { MobileNav } from './layout/mobile-nav'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

const folderColors = ['#6366F1', '#10B981', '#F97316', '#0EA5E9', '#8B5CF6']

const getPageFromPath = (path: string) => {
  if (path.startsWith('/debts/') && path !== '/debts') {
    return 'detail'
  }

  if (path === '/debts') {
    return 'debts'
  }

  if (path === '/contacts') {
    return 'contacts'
  }

  if (path === '/folders') {
    return 'folders'
  }

  if (path === '/profile') {
    return 'profile'
  }

  return 'dashboard'
}

const formatMoney = (amount?: number, currency?: string) => {
  const value = Number(amount || 0)
  return `${currency || 'USD'} ${value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`
}

const formatDate = (value?: string) => {
  if (!value) {
    return 'No date'
  }

  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getInitials = (name: string) => {
  const words = name.trim().split(' ')
  const first = words[0]?.[0] || 'D'
  const second = words[1]?.[0] || ''
  return `${first}${second}`.toUpperCase()
}

const getDebtRemaining = (debt: Debt) => {
  if (typeof debt.remaining_amount === 'number') {
    return debt.remaining_amount
  }

  if (typeof debt.paid_amount === 'number') {
    return debt.amount - debt.paid_amount
  }

  return debt.amount
}

const directionText = (direction: string) => {
  if (direction === 'i_owe_them') {
    return 'I owe them'
  }

  return 'They owe me'
}

const statusClass = (status: string) => {
  if (status === 'paid') {
    return 'status-success'
  }

  if (status === 'partial') {
    return 'status-info'
  }

  return 'status-warning'
}

const directionClass = (direction: string) => {
  if (direction === 'i_owe_them') {
    return 'status-warning'
  }

  return 'status-success'
}

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const page = getPageFromPath(location.pathname)
  const routeDebtId = params.id || ''
  const {
    token,
    user,
    folders,
    contacts,
    debts,
    payments,
    summary,
    selectedDebt,
    isLoading,
    error,
    message,
    postLogout,
    getAllData,
    postDemoData,
    getDebts,
    getDebt,
    getPayments,
    patchUser,
    postFolder,
    patchFolder,
    deleteFolder,
    postContact,
    patchContact,
    deleteContact,
    postDebt,
    patchDebt,
    deleteDebt,
    postPayment,
    setSelectedDebt,
    clearMessage,
  } = useBear()

  const [search, setSearch] = useState('')

  const [folderModal, setFolderModal] = useState(false)
  const [folderId, setFolderId] = useState('')
  const [folderColor, setFolderColor] = useState(folderColors[0])

  const [contactModal, setContactModal] = useState(false)
  const [contactId, setContactId] = useState('')

  const [debtModal, setDebtModal] = useState(false)
  const [debtId, setDebtId] = useState('')

  const [profileModal, setProfileModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [logoutNotice, setLogoutNotice] = useState(false)
  const [logoutNoticeKey, setLogoutNoticeKey] = useState(0)

  const folderForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      color: folderColors[0],
    },
  })
  const contactForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      note: '',
      folder_id: '',
    },
  })
  const debtForm = useForm({
    mode: 'onChange',
    defaultValues: {
      contact_id: '',
      direction: 'they_owe_me',
      amount: '',
      currency: 'USD',
      due_date: '',
      description: '',
      status: 'pending',
    },
  })
  const paymentForm = useForm({
    mode: 'onChange',
    defaultValues: {
      amount: '',
      note: '',
      paid_at: '',
    },
  })
  const profileForm = useForm({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
    },
  })

  const getDebtTitle = (debt: Debt) => {
    const contact = contacts.find((item) => item.id === debt.contact_id)
    return debt.contact?.name || debt.contact_name || contact?.name || 'Unknown contact'
  }

  const getContactFolderName = (folderId?: string) => {
    const folder = folders.find((item) => item.id === folderId)
    return folder?.name || 'No folder'
  }

  const getFolderContactsCount = (folderId: string) => {
    return contacts.filter((contact) => contact.folder_id === folderId || contact.folder?.id === folderId).length
  }

  const getFolderIcon = (folderName: string) => {
    const value = folderName.toLowerCase()

    if (value.includes('family')) {
      return 'family_restroom'
    }

    if (value.includes('friend')) {
      return 'groups'
    }

    if (value.includes('work')) {
      return 'work'
    }

    return 'folder_special'
  }

  const getFolderBalance = (folderId: string) => {
    const contactIds = contacts
      .filter((contact) => contact.folder_id === folderId || contact.folder?.id === folderId)
      .map((contact) => contact.id)

    return debts
      .filter((debt) => contactIds.includes(debt.contact_id))
      .reduce((total, debt) => {
        const amount = getDebtRemaining(debt)

        if (debt.direction === 'i_owe_them') {
          return total - amount
        }

        return total + amount
      }, 0)
  }

  const formatSignedAmount = (amount: number) => {
    const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''

    return `${sign}$${Math.abs(amount).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`
  }

  useEffect(() => {
    if (token) {
      void getAllData()
    }
  }, [token, getAllData])

  useEffect(() => {
    if (token && page === 'detail' && routeDebtId) {
      void getDebt(routeDebtId)
    }
  }, [token, page, routeDebtId, getDebt])

  useEffect(() => {
    if (selectedDebt) {
      void getPayments(selectedDebt.id)
    }
  }, [selectedDebt, getPayments])

  useEffect(() => {
    if (logoutNotice) {
      const timer = window.setTimeout(() => {
        setLogoutNotice(false)
      }, 3500)

      return () => window.clearTimeout(timer)
    }
  }, [logoutNotice, logoutNoticeKey])

  const visibleDebts = debts.filter((debt) => {
    const name = getDebtTitle(debt).toLowerCase()
    const description = debt.description?.toLowerCase() || ''
    const value = search.toLowerCase()
    return name.includes(value) || description.includes(value)
  })

  const visibleContacts = contacts.filter((contact) => {
    const value = search.toLowerCase()
    return (
      contact.name.toLowerCase().includes(value) ||
      (contact.email || '').toLowerCase().includes(value) ||
      (contact.phone || '').toLowerCase().includes(value)
    )
  })

  const upcomingDebts = summary?.upcoming_due || debts.slice(0, 5)
  const hasNoData = !folders.length && !contacts.length && !debts.length
  const totalDebts = summary?.counts.total || debts.length
  const pendingCount = summary?.counts.pending || debts.filter((debt) => debt.status === 'pending').length
  const partialCount = summary?.counts.partial || debts.filter((debt) => debt.status === 'partial').length
  const paidCount = summary?.counts.paid || debts.filter((debt) => debt.status === 'paid').length
  const pendingPercent = totalDebts ? Math.round((pendingCount / totalDebts) * 100) : 0
  const partialPercent = totalDebts ? Math.round((partialCount / totalDebts) * 100) : 0
  const paidPercent = totalDebts ? Math.round((paidCount / totalDebts) * 100) : 0

  const selectedPaid = payments.reduce((total, payment) => {
    return total + Number(payment.amount || 0)
  }, 0)
  const selectedContact = selectedDebt
    ? contacts.find((contact) => contact.id === selectedDebt.contact_id)
    : null
  const selectedRemaining = selectedDebt ? selectedDebt.amount - selectedPaid : 0
  const safeSelectedRemaining = selectedRemaining < 0 ? 0 : selectedRemaining
  const rawSelectedProgress =
    selectedDebt && selectedDebt.amount ? Math.round((selectedPaid / selectedDebt.amount) * 100) : 0
  const selectedProgress =
    rawSelectedProgress > 100 ? 100 : rawSelectedProgress < 0 ? 0 : rawSelectedProgress

  const openPage = (nextPage: string) => {
    clearMessage()
    setSearch('')

    if (nextPage !== 'detail') {
      setSelectedDebt(null)
    }

    if (nextPage === 'debts') {
      navigate('/debts')
      return
    }

    if (nextPage === 'contacts') {
      navigate('/contacts')
      return
    }

    if (nextPage === 'folders') {
      navigate('/folders')
      return
    }

    if (nextPage === 'profile') {
      navigate('/profile')
      return
    }

    navigate('/dashboard')
  }

  const resetFolder = () => {
    setFolderId('')
    setFolderColor(folderColors[0])
    folderForm.reset({
      name: '',
      color: folderColors[0],
    })
  }

  const openFolderModal = () => {
    resetFolder()
    setFolderModal(true)
  }

  const editFolder = (folderIdValue: string, folderNameValue: string, color: string) => {
    setFolderId(folderIdValue)
    setFolderColor(color || folderColors[0])
    folderForm.reset({
      name: folderNameValue,
      color: color || folderColors[0],
    })
    setFolderModal(true)
  }

  const submitFolder = async (values: { name: string; color: string }) => {
    const payload = {
      name: values.name,
      color: values.color,
    }

    const success = folderId
      ? await patchFolder(folderId, payload)
      : await postFolder(payload)

    if (success) {
      resetFolder()
      setFolderModal(false)
      void getAllData()
    }
  }

  const resetContact = () => {
    setContactId('')
    contactForm.reset({
      name: '',
      email: '',
      phone: '',
      note: '',
      folder_id: '',
    })
  }

  const openContactModal = () => {
    resetContact()
    setContactModal(true)
  }

  const editContact = (id: string) => {
    const contact = contacts.find((item) => item.id === id)

    if (contact) {
      setContactId(contact.id)
      contactForm.reset({
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        note: contact.note || '',
        folder_id: contact.folder_id || contact.folder?.id || '',
      })
      setContactModal(true)
    }
  }

  const submitContact = async (values: {
    name: string
    phone: string
    email: string
    note: string
    folder_id: string
  }) => {
    const payload = {
      name: values.name,
      phone: values.phone || undefined,
      email: values.email || undefined,
      note: values.note || undefined,
      folder_id: values.folder_id || undefined,
    }

    const success = contactId
      ? await patchContact(contactId, payload)
      : await postContact(payload)

    if (success) {
      resetContact()
      setContactModal(false)
      void getAllData()
    }
  }

  const resetDebt = () => {
    setDebtId('')
    debtForm.reset({
      contact_id: '',
      direction: 'they_owe_me',
      amount: '',
      currency: 'USD',
      due_date: '',
      description: '',
      status: 'pending',
    })
  }

  const openDebtModal = () => {
    resetDebt()
    setDebtModal(true)
  }

  const fillDebtForm = (debt: Debt) => {
    setDebtId(debt.id)
    debtForm.reset({
      contact_id: debt.contact_id || '',
      direction: debt.direction,
      amount: String(debt.amount || ''),
      currency: debt.currency || 'USD',
      due_date: debt.due_date ? debt.due_date.slice(0, 10) : '',
      description: debt.description || '',
      status: debt.status || 'pending',
    })
    setDebtModal(true)
  }

  const editDebt = async (id: string) => {
    const debt = debts.find((item) => item.id === id)

    if (debt) {
      fillDebtForm(debt)
      return
    }

    const fullDebt = await getDebt(id)

    if (fullDebt) {
      fillDebtForm(fullDebt)
    }
  }

  const submitDebt = async (values: {
    contact_id: string
    direction: string
    amount: string
    currency: string
    due_date: string
    description: string
    status: string
  }) => {
    const payload = {
      contact_id: values.contact_id,
      direction: values.direction,
      amount: Number(values.amount || 0),
      currency: values.currency.trim().toUpperCase() || 'USD',
      description: values.description.trim(),
      due_date: values.due_date || undefined,
    }

    const success = debtId
      ? await patchDebt(debtId, { ...payload, status: values.status })
      : await postDebt(payload)

    if (success) {
      resetDebt()
      setDebtModal(false)
      void getAllData()
    }
  }

  const openDebtDetails = (debt: Debt) => {
    setSelectedDebt(debt)
    navigate(`/debts/${debt.id}`)
    void getDebt(debt.id)
  }

  const openContactDetails = (contactId: string) => {
    const debt = debts.find((item) => item.contact_id === contactId)

    if (debt) {
      openDebtDetails(debt)
      return
    }

    resetDebt()
    debtForm.setValue('contact_id', contactId, {
      shouldValidate: true,
    })
    setDebtModal(true)
  }

  const removeDebt = async (id: string) => {
    const success = await deleteDebt(id)

    if (success) {
      navigate('/debts')
    }
  }

  const submitPayment = async (values: { amount: string; note: string; paid_at: string }) => {
    if (!selectedDebt) {
      return
    }

    const success = await postPayment(selectedDebt.id, {
      amount: Number(values.amount || 0),
      note: values.note || undefined,
      paid_at: values.paid_at ? new Date(values.paid_at).toISOString() : undefined,
    })

    if (success) {
      paymentForm.reset({
        amount: '',
        note: '',
        paid_at: '',
      })
      setPaymentModal(false)
      void getAllData()
    }
  }

  const submitProfile = async (values: { name: string }) => {
    const success = await patchUser(values.name.trim())

    if (success) {
      setProfileModal(false)
      void getAllData()
    }
  }

  const addDemoData = async () => {
    await postDemoData()
  }

  const handleLogout = async () => {
    await postLogout()
    sessionStorage.setItem('debtflow_logout', '1')
    setLogoutNoticeKey((value) => value + 1)
    setLogoutNotice(true)
    navigate('/login')
  }

  const openPaymentModal = () => {
    paymentForm.reset({
      amount: '',
      note: '',
      paid_at: '',
    })
    setPaymentModal(true)
  }

  const logoutToast = (
    <LogoutToast
      count={logoutNoticeKey}
      open={logoutNotice}
      onClose={() => setLogoutNotice(false)}
    />
  )

  return (
    <main className="app-shell">
      <div className="flex min-h-screen">
        <AppSidebar openPage={openPage} page={page} />

        <section className="w-full px-4 py-5 pb-28 sm:px-6 lg:ml-[272px] lg:px-8 lg:py-7 lg:pb-12 xl:px-10">
          <AppHeader
            getAllData={getAllData}
            page={page}
            search={search}
            setSearch={setSearch}
            user={user}
          />

          <FeedbackMessages error={error} message={message} />

          {page === 'dashboard' && (
            <div className="space-y-6">
              {hasNoData && (
                <section className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[var(--primary-soft)] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="eyebrow">Quick start</p>
                      <h2 className="mt-2 text-xl font-bold tracking-[-0.03em]">Your workspace is ready</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Add a small demo set to preview folders, contacts, debts and payments.
                      </p>
                    </div>
                    <Button
                      disabled={isLoading}
                      onClick={() => {
                        void addDemoData()
                      }}
                    >
                      Add demo data
                    </Button>
                  </div>
                </section>
              )}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <BalanceCard value={formatMoney(summary?.outstanding.net_balance, 'USD')} />
                <MetricCard
                  icon="south_west"
                  label="They owe me"
                  tone="success"
                  value={formatMoney(summary?.outstanding.they_owe_me, 'USD')}
                />
                <MetricCard
                  icon="north_east"
                  label="I owe them"
                  tone="warning"
                  value={formatMoney(summary?.outstanding.i_owe_them, 'USD')}
                />
              </section>

              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard icon="receipt_long" label="Total debts" value={String(summary?.counts.total || debts.length)} />
                <MetricCard icon="schedule" label="Pending" tone="warning" value={String(summary?.counts.pending || 0)} />
                <MetricCard icon="timelapse" label="Partially paid" tone="primary" value={String(summary?.counts.partial || 0)} />
                <MetricCard icon="group" label="Contacts" value={String(summary?.contacts_count || contacts.length)} />
              </section>

              <section className="grid gap-4 lg:grid-cols-[0.8fr_1.7fr]">
                <div className="surface-card rounded-2xl p-5 sm:p-6">
                  <p className="eyebrow">Portfolio health</p>
                  <h2 className="mt-2 text-lg font-bold tracking-[-0.025em]">Debt status</h2>
                  <div className="mt-8 space-y-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Pending</span>
                        <span className="font-semibold">{pendingPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${pendingPercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Partially paid</span>
                        <span className="font-semibold">{partialPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${partialPercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Paid</span>
                        <span className="font-semibold">{paidPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${paidPercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="surface-card rounded-2xl p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="eyebrow">Next up</p>
                      <h2 className="mt-2 text-lg font-bold tracking-[-0.025em]">Upcoming payments</h2>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openPage('debts')}>
                      View all
                    </Button>
                  </div>

                <div className="space-y-4 md:hidden">
                  {upcomingDebts.map((debt) => (
                    <article className="surface-muted rounded-xl p-4" key={debt.id}>
                      <div className="flex items-start justify-between gap-3">
                        <button
                          className="min-w-0 text-left"
                          type="button"
                          onClick={() => openDebtDetails(debt)}
                        >
                          <p className="font-semibold text-[var(--text)]">{getDebtTitle(debt)}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{directionText(debt.direction)}</p>
                        </button>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(debt.status)}`}>
                          {debt.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-[var(--text-soft)]">
                        <p>Amount: <span className="font-semibold text-[var(--text)]">{formatMoney(getDebtRemaining(debt), debt.currency)}</span></p>
                        <p>Due: <span className="font-semibold text-[var(--text)]">{formatDate(debt.due_date)}</span></p>
                      </div>
                    </article>
                  ))}

                  {!upcomingDebts.length && (
                    <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
                      No upcoming payments yet.
                    </div>
                  )}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="data-table w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.12em] text-[var(--faint)]">
                        <th className="py-3 font-semibold">Contact</th>
                        <th className="py-3 font-semibold">Direction</th>
                        <th className="py-3 font-semibold">Amount</th>
                        <th className="py-3 font-semibold">Due date</th>
                        <th className="py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingDebts.map((debt) => (
                        <tr className="border-b border-[var(--border)] last:border-0" key={debt.id}>
                          <td className="py-4">
                            <button
                              className="flex items-center gap-3 text-left"
                              type="button"
                              onClick={() => openDebtDetails(debt)}
                            >
                              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-text)]">
                                {getInitials(getDebtTitle(debt))}
                              </span>
                              <span className="font-semibold">{getDebtTitle(debt)}</span>
                            </button>
                          </td>
                          <td className="py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${directionClass(debt.direction)}`}>
                              {directionText(debt.direction)}
                            </span>
                          </td>
                          <td className="py-4 font-semibold">{formatMoney(getDebtRemaining(debt), debt.currency)}</td>
                          <td className="py-4 text-[var(--muted)]">{formatDate(debt.due_date)}</td>
                          <td className="py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(debt.status)}`}>
                              {debt.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {!upcomingDebts.length && (
                        <tr>
                          <td className="py-10 text-center text-sm text-[var(--muted)]" colSpan={5}>
                            No upcoming payments yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                </div>
              </section>
            </div>
          )}

          {page === 'contacts' && (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[var(--muted)]">
                  {visibleContacts.length} contacts in your ledger
                </p>
                <Button onClick={openContactModal}>
                  Add contact
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleContacts.map((contact) => (
                  <article className="surface-card group rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]" key={contact.id}>
                    <div className="flex items-start justify-between gap-3">
                      <button
                        className="flex min-w-0 items-center gap-3.5 text-left"
                        type="button"
                        onClick={() => openContactDetails(contact.id)}
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-base font-bold text-[var(--primary-text)]">
                          {getInitials(contact.name)}
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-bold text-[var(--text)]">{contact.name}</h2>
                          <p className="truncate text-sm text-[var(--muted)]">{contact.email || 'No email'}</p>
                        </div>
                      </button>
                      <Button
                        className="rounded-full text-[var(--faint)]"
                        size="icon"
                        variant="ghost"
                        onClick={() => editContact(contact.id)}
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Button>
                    </div>

                    <div className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-soft)]">
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[var(--faint)]">call</span>
                        {contact.phone || 'No phone'}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[var(--faint)]">folder</span>
                        {contact.folder?.name || getContactFolderName(contact.folder_id)}
                      </p>
                      <p className="line-clamp-2 min-h-10 text-[var(--muted)]">
                        {contact.note || 'No notes yet.'}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-[var(--border)] pt-4">
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="outline"
                        onClick={() => openContactDetails(contact.id)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          void deleteContact(contact.id)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}

                {!visibleContacts.length && (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center md:col-span-2 xl:col-span-3">
                    <p className="text-sm text-[var(--muted)]">
                      No contacts yet. Add a contact first, then create debts.
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                      <Button size="sm" onClick={openContactModal}>
                        Add contact
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          void addDemoData()
                        }}
                      >
                        Add demo data
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {page === 'folders' && (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[var(--muted)]">
                  Organize contacts by relationship or context.
                </p>
                <Button onClick={openFolderModal}>
                  Create folder
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {folders.map((folder) => {
                  const balance = getFolderBalance(folder.id)
                  const cardColor = folder.color || folderColors[0]

                  return (
                    <FolderCard
                      amountText={formatSignedAmount(balance)}
                      balance={balance}
                      cardColor={cardColor}
                      contactsCount={getFolderContactsCount(folder.id)}
                      deleteFolder={deleteFolder}
                      editFolder={editFolder}
                      folder={folder}
                      icon={getFolderIcon(folder.name)}
                      key={folder.id}
                    />
                  )
                })}

                {!folders.length && (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center md:col-span-2 xl:col-span-4">
                    <p className="text-sm text-[var(--muted)]">
                      No folders yet. Create one if you want to group contacts.
                    </p>
                    <Button className="mt-4" size="sm" onClick={openFolderModal}>
                      Create folder
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {page === 'debts' && (
            <section className="surface-card rounded-2xl p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.03em]">All debts</h2>
                  <p className="text-sm text-[var(--muted)]">Create, edit, delete and open debt details.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text-soft)] outline-none"
                    onChange={(event) => {
                      void getDebts(event.target.value ? { status: event.target.value } : undefined)
                    }}
                  >
                    <option value="">All status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                  <Button onClick={openDebtModal}>
                    Add debt
                  </Button>
                </div>
              </div>

              <div className="space-y-4 md:hidden">
                {visibleDebts.map((debt) => (
                  <article className="surface-muted rounded-xl p-4" key={debt.id}>
                    <div className="flex items-start justify-between gap-3">
                      <button
                        className="min-w-0 text-left"
                        type="button"
                        onClick={() => openDebtDetails(debt)}
                      >
                        <p className="font-semibold text-[var(--text)]">{getDebtTitle(debt)}</p>
                        <p className="mt-1 truncate text-sm text-[var(--muted)]">{debt.description || 'No description'}</p>
                      </button>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${directionClass(debt.direction)}`}>
                        {directionText(debt.direction)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-[var(--text-soft)]">
                      <p>Amount: <span className="font-semibold text-[var(--text)]">{formatMoney(debt.amount, debt.currency)}</span></p>
                      <p>Remaining: <span className="font-semibold text-[var(--text)]">{formatMoney(getDebtRemaining(debt), debt.currency)}</span></p>
                      <p>Due: <span className="font-semibold text-[var(--text)]">{formatDate(debt.due_date)}</span></p>
                      <p>Status: <span className="font-semibold text-[var(--text)]">{debt.status}</span></p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => { void editDebt(debt.id) }}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => { void removeDebt(debt.id) }}>
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}

                {!visibleDebts.length && (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
                    <p>No debts yet. Add a contact and create your first debt.</p>
                    <div className="mt-4 flex justify-center gap-3">
                      <Button size="sm" variant="outline" onClick={() => { void addDemoData() }}>
                        Add demo data
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="data-table w-full min-w-[920px] text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.12em] text-[var(--faint)]">
                      <th className="py-3 font-semibold">Contact</th>
                      <th className="py-3 font-semibold">Direction</th>
                      <th className="py-3 font-semibold">Amount</th>
                      <th className="py-3 font-semibold">Remaining</th>
                      <th className="py-3 font-semibold">Due date</th>
                      <th className="py-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDebts.map((debt) => (
                      <tr className="border-b border-[var(--border)] last:border-0" key={debt.id}>
                        <td className="py-4">
                          <button
                            className="flex items-center gap-3 text-left"
                            type="button"
                            onClick={() => openDebtDetails(debt)}
                          >
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary-text)]">
                              {getInitials(getDebtTitle(debt))}
                            </span>
                            <span>
                              <span className="block font-semibold">{getDebtTitle(debt)}</span>
                              <span className="block max-w-[220px] truncate text-sm text-[var(--muted)]">
                                {debt.description || 'No description'}
                              </span>
                            </span>
                          </button>
                        </td>
                        <td className="py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${directionClass(debt.direction)}`}>
                            {directionText(debt.direction)}
                          </span>
                        </td>
                        <td className="py-4 font-semibold">{formatMoney(debt.amount, debt.currency)}</td>
                        <td className="py-4 font-semibold">{formatMoney(getDebtRemaining(debt), debt.currency)}</td>
                        <td className="py-4 text-[var(--muted)]">{formatDate(debt.due_date)}</td>
                        <td className="py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(debt.status)}`}>
                            {debt.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { void editDebt(debt.id) }}>
                              Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => { void removeDebt(debt.id) }}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!visibleDebts.length && (
                      <tr>
                        <td className="py-10 text-center" colSpan={7}>
                          <p className="text-sm text-[var(--muted)]">
                            No debts yet. Add a contact and create your first debt.
                          </p>
                          <div className="mt-4 flex justify-center gap-3">
                            <Button size="sm" variant="outline" onClick={() => { void addDemoData() }}>
                              Add demo data
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {page === 'detail' && selectedDebt && (
            <section className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[1fr_320px]">
              <div className="flex flex-col gap-4 xl:col-span-2 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="grid h-9 w-9 place-items-center rounded-xl text-[var(--text-soft)] transition hover:bg-[var(--surface-muted)]"
                    type="button"
                    onClick={() => openPage('debts')}
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </button>
                  <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-text)]">
                    {getInitials(getDebtTitle(selectedDebt))}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-[-0.04em]">{getDebtTitle(selectedDebt)}</h2>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${directionClass(selectedDebt.direction)}`}>
                        {directionText(selectedDebt.direction)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selectedDebt.status)}`}>
                        {selectedDebt.status}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    void editDebt(selectedDebt.id)
                  }}
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M13.5 6 18 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                  Edit
                </Button>
              </div>

              <div className="space-y-4">
                <div className="surface-card rounded-2xl p-5 sm:p-6">
                  <p className="eyebrow">Repayment progress</p>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-[var(--muted)]">Paid</p>
                      <p className="text-3xl font-bold text-[var(--primary-text)]">{formatMoney(selectedPaid, selectedDebt.currency)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[var(--muted)]">Total Amount</p>
                      <p className="text-2xl font-bold">{formatMoney(selectedDebt.amount, selectedDebt.currency)}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${selectedProgress}%` }} />
                  </div>
                  <p className="mt-2 text-right text-xs text-[var(--muted)]">{selectedProgress}% complete</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="surface-muted rounded-2xl p-5">
                    <p className="eyebrow !text-[10px]">Remaining</p>
                    <p className="mt-2 text-2xl font-bold">{formatMoney(safeSelectedRemaining, selectedDebt.currency)}</p>
                  </div>
                  <div className="surface-muted rounded-2xl p-5">
                    <p className="eyebrow !text-[10px]">Currency</p>
                    <p className="mt-2 text-2xl font-bold">{selectedDebt.currency}</p>
                  </div>
                </div>

                <div className="surface-card overflow-hidden rounded-2xl">
                  <div className="p-5">
                    <p className="eyebrow !text-[10px]">Due date</p>
                    <p className="mt-2 text-xl font-bold">{formatDate(selectedDebt.due_date)}</p>
                  </div>
                  <div className="border-t border-[var(--border)] p-5">
                    <p className="eyebrow !text-[10px]">Description</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{selectedDebt.description || 'No description'}</p>
                  </div>
                  <div className="border-t border-[var(--border)] p-5">
                    <p className="eyebrow !text-[10px]">Contact</p>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--text-soft)] sm:grid-cols-3">
                      <span className="truncate">{selectedContact?.email || 'No email'}</span>
                      <span>{selectedContact?.phone || 'No phone'}</span>
                      <span>{getContactFolderName(selectedContact?.folder_id)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <Button className="w-full" onClick={openPaymentModal}>
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Record payment
                </Button>

                <div className="surface-card rounded-2xl p-5">
                  <p className="eyebrow">Payment history</p>
                  <div className="mt-5 space-y-4 border-l border-[var(--border)] pl-4">
                    {payments.map((payment) => (
                      <div className="relative" key={payment.id}>
                        <span className="absolute -left-[25px] top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-400 text-white">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </span>
                        <p className="text-xs text-[var(--muted)]">{formatDate(payment.paid_at || payment.created_at)}</p>
                        <p className="text-2xl font-bold">{formatMoney(payment.amount, selectedDebt.currency)}</p>
                        <p className="text-sm text-[var(--muted)]">{payment.note || 'Payment recorded'}</p>
                      </div>
                    ))}

                    {!payments.length && (
                      <p className="py-6 text-center text-sm text-[var(--muted)]">No payments recorded yet.</p>
                    )}
                  </div>
                </div>
              </aside>
            </section>
          )}

          {page === 'detail' && !selectedDebt && (
            <section className="surface-card mx-auto max-w-xl rounded-2xl p-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-text)]">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <h2 className="mt-4 text-lg font-bold">{isLoading ? 'Loading debt...' : 'Debt not found'}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {isLoading ? 'Fetching the latest record from the API.' : 'This debt may have been deleted or is unavailable.'}
              </p>
              {!isLoading && (
                <Button className="mt-5" variant="outline" onClick={() => openPage('debts')}>
                  Back to debts
                </Button>
              )}
            </section>
          )}

          {page === 'profile' && (
            <section className="surface-card max-w-2xl rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--primary-soft)] text-xl font-bold text-[var(--primary-text)]">
                  {getInitials(user?.name || 'Debt User')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{user?.name || 'Debt User'}</h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        profileForm.reset({
                          name: user?.name || '',
                        })
                        setProfileModal(true)
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          d="M13.5 6 18 10.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </Button>
                  </div>
                  <p className="text-[var(--muted)]">{user?.email || 'No email'}</p>
                </div>
              </div>

              <Button
                className="mt-8"
                variant="dark"
                onClick={() => {
                  void handleLogout()
                }}
              >
                Logout
              </Button>
            </section>
          )}
        </section>
      </div>

      <MobileNav openPage={openPage} page={page} />

      {logoutToast}

      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
            <DialogDescription>Add a payment to this debt.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={paymentForm.handleSubmit(submitPayment)}>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Amount
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                max="1000000000"
                min="1"
                placeholder="250"
                type="number"
                {...paymentForm.register('amount', {
                  required: 'Amount is required',
                  validate: (value) => Number(value) > 0 || 'Amount must be greater than 0',
                })}
              />
              {paymentForm.formState.errors.amount && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {paymentForm.formState.errors.amount.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Paid at
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                type="datetime-local"
                {...paymentForm.register('paid_at')}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Note
              <textarea
                className="mt-2 min-h-28 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                maxLength={500}
                placeholder="Cash payment, bank transfer..."
                {...paymentForm.register('note')}
              />
            </label>
            <Button
              className="w-full"
              disabled={isLoading || !paymentForm.formState.isValid}
              type="submit"
            >
              Save payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={profileModal} onOpenChange={setProfileModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change name</DialogTitle>
            <DialogDescription>This updates your profile name from the users API.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={profileForm.handleSubmit(submitProfile)}>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Name
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="Your name"
                {...profileForm.register('name', {
                  required: 'Name is required',
                  validate: (value) =>
                    value.trim().length >= 2 || 'Name must be at least 2 characters',
                })}
              />
              {profileForm.formState.errors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </label>
            <Button
              className="w-full"
              disabled={isLoading || !profileForm.formState.isValid}
              type="submit"
            >
              Save name
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={folderModal} onOpenChange={setFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{folderId ? 'Edit folder' : 'Create folder'}</DialogTitle>
            <DialogDescription>Choose a name and color for this group.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={folderForm.handleSubmit(submitFolder)}>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Name
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="Family"
                {...folderForm.register('name', {
                  required: 'Folder name is required',
                  minLength: {
                    value: 2,
                    message: 'Folder name must be at least 2 characters',
                  },
                })}
              />
              {folderForm.formState.errors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {folderForm.formState.errors.name.message}
                </p>
              )}
            </label>
            <div>
              <p className="text-sm font-medium text-[var(--text-soft)]">Color</p>
              <input type="hidden" {...folderForm.register('color')} />
              <div className="mt-2 flex gap-2">
                {folderColors.map((color) => (
                  <button
                    className={`h-10 w-10 rounded-full ring-4 transition hover:-translate-y-0.5 ${
                      folderColor === color ? 'ring-slate-200' : 'ring-transparent'
                    }`}
                    key={color}
                    style={{ backgroundColor: color }}
                    type="button"
                    onClick={() => {
                      setFolderColor(color)
                      folderForm.setValue('color', color, { shouldValidate: true })
                    }}
                  />
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              disabled={isLoading || !folderForm.formState.isValid}
              type="submit"
            >
              {folderId ? 'Save folder' : 'Create folder'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={contactModal} onOpenChange={setContactModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{contactId ? 'Edit contact' : 'Add contact'}</DialogTitle>
            <DialogDescription>Save contact info for future debts.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={contactForm.handleSubmit(submitContact)}>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Name
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="Sarah Miller"
                {...contactForm.register('name', {
                  required: 'Contact name is required',
                  minLength: {
                    value: 2,
                    message: 'Contact name must be at least 2 characters',
                  },
                })}
              />
              {contactForm.formState.errors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {contactForm.formState.errors.name.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="sarah@mail.com"
                {...contactForm.register('email', {
                  validate: (value) =>
                    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email is not valid',
                })}
              />
              {contactForm.formState.errors.email && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {contactForm.formState.errors.email.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="+1 555 000"
                {...contactForm.register('phone')}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Folder
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                {...contactForm.register('folder_id')}
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Note
              <textarea
                className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                placeholder="Short note"
                {...contactForm.register('note')}
              />
            </label>
            <Button
              className="sm:col-span-2"
              disabled={isLoading || !contactForm.formState.isValid}
              type="submit"
            >
              {contactId ? 'Save contact' : 'Add contact'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={debtModal} onOpenChange={setDebtModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{debtId ? 'Edit debt' : 'Add debt'}</DialogTitle>
            <DialogDescription>Connect a contact with amount, direction and due date.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={debtForm.handleSubmit(submitDebt)}>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Contact
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                {...debtForm.register('contact_id', {
                  required: 'Contact is required',
                })}
              >
                <option value="">Choose contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
              {debtForm.formState.errors.contact_id && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {debtForm.formState.errors.contact_id.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Direction
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                {...debtForm.register('direction')}
              >
                <option value="they_owe_me">They owe me</option>
                <option value="i_owe_them">I owe them</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                {...debtForm.register('status')}
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Amount
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                max="1000000000"
                min="1"
                placeholder="1200"
                type="number"
                {...debtForm.register('amount', {
                  required: 'Amount is required',
                  validate: (value) => Number(value) > 0 || 'Amount must be greater than 0',
                })}
              />
              {debtForm.formState.errors.amount && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {debtForm.formState.errors.amount.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)]">
              Currency
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                maxLength={8}
                placeholder="USD"
                {...debtForm.register('currency', {
                  required: 'Currency is required',
                  maxLength: {
                    value: 8,
                    message: 'Currency is too long',
                  },
                })}
              />
              {debtForm.formState.errors.currency && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {debtForm.formState.errors.currency.message}
                </p>
              )}
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Due date
              <input
                className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                type="date"
                {...debtForm.register('due_date')}
              />
            </label>
            <label className="block text-sm font-medium text-[var(--text-soft)] sm:col-span-2">
              Description
              <textarea
                className="mt-2 min-h-24 w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[#5557d9]/10"
                maxLength={1000}
                placeholder="Rent split, equipment, cash loan..."
                {...debtForm.register('description')}
              />
            </label>
            <Button
              className="sm:col-span-2"
              disabled={isLoading || !debtForm.formState.isValid}
              type="submit"
            >
              {debtId ? 'Save debt' : 'Add debt'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default Home

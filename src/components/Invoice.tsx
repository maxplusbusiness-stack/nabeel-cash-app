'use client'
import { useRef } from 'react'

type Person = { id: string; name: string }
type Transaction = {
  id: string
  date: string
  description: string
  person_id: string | null
  persons: { name: string } | null
  category: string
  given_out: number
  spent_by_person: number
  returned: number
  settled: boolean
}

interface InvoiceProps {
  tx: Transaction
  allTransactions: Transaction[]
  openingCash: number
  onClose: () => void
}

const fmt = (n: number) => n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Invoice({ tx, allTransactions, openingCash, onClose }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Compute person stats across ALL transactions
  const personTxs = allTransactions.filter(t => t.person_id === tx.person_id)
  const totalGiven = personTxs.reduce((s, t) => s + (t.given_out || 0), 0)
  const totalSpent = personTxs.reduce((s, t) => s + (t.spent_by_person || 0), 0)
  const totalReturned = personTxs.reduce((s, t) => s + (t.returned || 0), 0)
  const outstanding = totalGiven - totalSpent - totalReturned

  // Overall cash balance
  const totalGivenAll = allTransactions.reduce((s, t) => s + (t.given_out || 0), 0)
  const totalReturnedAll = allTransactions.reduce((s, t) => s + (t.returned || 0), 0)
  const cashInHand = openingCash - totalGivenAll + totalReturnedAll

  // Invoice number from date + truncated id
  const invoiceNo = `INV-${tx.date.replace(/-/g, '')}-${tx.id.slice(0, 6).toUpperCase()}`

  const personName = tx.persons?.name || 'N/A'

  // Build WhatsApp message text
  const buildWhatsAppText = () => {
    const lines = [
      `*💰 PETTY CASH INVOICE*`,
      `Invoice No: ${invoiceNo}`,
      `Date: ${tx.date}`,
      ``,
      `*TRANSACTION DETAILS*`,
      `Description: ${tx.description}`,
      `Category: ${tx.category || 'General'}`,
      `Person: ${personName}`,
      ``,
    ]
    if (tx.given_out > 0) lines.push(`Given Out: AED ${fmt(tx.given_out)}`)
    if (tx.spent_by_person > 0) lines.push(`Spent by ${personName}: AED ${fmt(tx.spent_by_person)}`)
    if (tx.returned > 0) lines.push(`Returned: AED ${fmt(tx.returned)}`)
    lines.push(`Status: ${tx.settled ? '✅ Settled' : '⏳ Outstanding'}`)
    lines.push(``)
    lines.push(`*ACCOUNT SUMMARY — ${personName}*`)
    lines.push(`Total Given: AED ${fmt(totalGiven)}`)
    lines.push(`Total Spent: AED ${fmt(totalSpent)}`)
    lines.push(`Total Returned: AED ${fmt(totalReturned)}`)
    lines.push(`Balance Outstanding: AED ${fmt(outstanding)}`)
    lines.push(``)
    lines.push(`*OVERALL CASH POSITION*`)
    lines.push(`Cash in Hand: AED ${fmt(cashInHand)}`)
    lines.push(``)
    lines.push(`_Nabeel — Petty Cash Manager_`)
    return lines.join('\n')
  }

  const sendWhatsApp = (phone?: string) => {
    const text = encodeURIComponent(buildWhatsAppText())
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`
    window.open(url, '_blank')
  }

  const sendEmail = () => {
    const subject = encodeURIComponent(`Petty Cash Invoice — ${tx.description} — ${tx.date}`)
    const body = encodeURIComponent(buildWhatsAppText().replace(/\*/g, '').replace(/_/g, ''))
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const printInvoice = () => {
    const printContent = invoiceRef.current?.innerHTML
    if (!printContent) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoiceNo}</title>
          <meta charset="utf-8"/>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const copyText = () => {
    navigator.clipboard.writeText(buildWhatsAppText().replace(/\*/g, '').replace(/_/g, ''))
    alert('Invoice text copied!')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#f7f4ee', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 700, maxHeight: '95vh', overflowY: 'auto' }}>

        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 12px', background: '#1a2a1a', borderRadius: '20px 20px 0 0' }}>
          <div>
            <div style={{ color: '#c9a84c', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Invoice</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{invoiceNo}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 34, height: 34, fontSize: 20, color: '#fff', cursor: 'pointer' }}>×</button>
        </div>

        {/* ── INVOICE PRINT AREA ── */}
        <div ref={invoiceRef} style={{ padding: '0 16px 8px' }}>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', margin: '14px 0', border: '1px solid #e0d8c8' }}>

            {/* Invoice top header */}
            <div style={{ background: '#1a2a1a', padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: '#c9a84c', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>💰 NABEEL</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 3 }}>Petty Cash Manager</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700 }}>INVOICE</div>
                  <div style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>{invoiceNo}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 1 }}>{tx.date}</div>
                </div>
              </div>
            </div>

            {/* To section */}
            <div style={{ padding: '16px 24px', background: '#faf8f4', borderBottom: '1px solid #ede5d8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#8a7a5a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>To</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1a2a1a' }}>{personName}</div>
                  <div style={{ fontSize: 12, color: '#8a7a5a', marginTop: 2 }}>{tx.category || 'General'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: 12, padding: '5px 14px', borderRadius: 20, fontWeight: 700,
                    background: tx.settled ? '#d5f5e3' : '#fff3cd',
                    color: tx.settled ? '#1a7a3c' : '#856404',
                    border: `1px solid ${tx.settled ? '#a8e8c0' : '#f0d060'}`
                  }}>
                    {tx.settled ? '✅ SETTLED' : '⏳ OUTSTANDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction detail */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #ede5d8' }}>
              <div style={{ fontSize: 11, color: '#8a7a5a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Transaction Details</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2a1a', marginBottom: 12 }}>{tx.description}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Given Out', value: tx.given_out, bg: '#fff0f0', color: '#b83232', show: tx.given_out > 0 },
                  { label: 'Spent by Person', value: tx.spent_by_person, bg: '#fef9e7', color: '#856404', show: tx.spent_by_person > 0 },
                  { label: 'Returned', value: tx.returned, bg: '#eafaf1', color: '#1a7a3c', show: tx.returned > 0 },
                ].filter(i => i.show).map(item => (
                  <div key={item.label} style={{ background: item.bg, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: item.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>AED {fmt(item.value)}</div>
                  </div>
                ))}
                {!tx.given_out && !tx.spent_by_person && !tx.returned && (
                  <div style={{ gridColumn: '1 / -1', color: '#8a7a5a', fontSize: 13 }}>No amounts recorded.</div>
                )}
              </div>
            </div>

            {/* Person account summary */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #ede5d8' }}>
              <div style={{ fontSize: 11, color: '#8a7a5a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Account Summary — {personName}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                <tbody>
                  {[
                    { label: 'Total Given', value: totalGiven, color: '#1a2a1a' },
                    { label: 'Total Spent by Person', value: totalSpent, color: '#856404' },
                    { label: 'Total Returned', value: totalReturned, color: '#1a7a3c' },
                  ].map(row => (
                    <tr key={row.label}>
                      <td style={{ padding: '5px 0', color: '#8a7a5a' }}>{row.label}</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600, color: row.color }}>AED {fmt(row.value)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '10px 0 5px', borderTop: '2px solid #ede5d8', fontWeight: 700, color: '#1a2a1a', fontSize: 14 }}>Outstanding Balance</td>
                    <td style={{ padding: '10px 0 5px', borderTop: '2px solid #ede5d8', textAlign: 'right', fontWeight: 800, fontSize: 16, color: outstanding > 0 ? '#b83232' : '#1a7a3c' }}>
                      AED {fmt(outstanding)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Overall cash position */}
            <div style={{ padding: '14px 24px', background: '#1a2a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cash In Hand (Overall)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#c9a84c', marginTop: 2 }}>AED {fmt(cashInHand)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Opening Cash</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>AED {fmt(openingCash)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Share buttons */}
        <div style={{ padding: '0 16px 32px' }}>
          <div style={{ fontSize: 12, color: '#8a7a5a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Send Invoice</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <button
              onClick={() => sendWhatsApp()}
              style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📱</span> WhatsApp
            </button>
            <button
              onClick={sendEmail}
              style={{ background: '#4A6FA5', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>✉️</span> Email
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={printInvoice}
              style={{ background: '#fff', color: '#2d3a2d', border: '1px solid #e0d8c8', borderRadius: 10, padding: '13px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🖨️</span> Print / PDF
            </button>
            <button
              onClick={copyText}
              style={{ background: '#fff', color: '#2d3a2d', border: '1px solid #e0d8c8', borderRadius: 10, padding: '13px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📋</span> Copy Text
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

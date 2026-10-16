import { useEffect, useRef, useState } from 'react'
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

const currencies = ['USD', 'EUR', 'GBP', 'INR']

const initialInvoice = {
  businessName: 'Northstar Studio',
  businessEmail: 'hello@northstar.studio',
  businessAddress: '128 Market Street\nSan Francisco, CA 94105',
  clientName: 'Alex Morgan',
  clientEmail: 'alex@example.com',
  clientAddress: '42 Garden Lane\nBrooklyn, NY 11201',
  invoiceNumber: 'INV-2026-001',
  issueDate: '2026-10-16',
  dueDate: '2026-10-30',
  currency: 'USD',
  taxRate: '8',
  notes: 'Thank you for your business. Payment is due within 14 days.',
}

const pdfStyles = StyleSheet.create({
  page: {
    padding: 48,
    color: '#202b3c',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 42,
  },
  title: {
    color: '#253f79',
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
  },
  invoiceNumber: {
    marginTop: 8,
    color: '#68758a',
    fontSize: 10,
  },
  businessName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  mutedRight: {
    marginTop: 5,
    color: '#68758a',
    lineHeight: 1.5,
    textAlign: 'right',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  sectionLabel: {
    marginBottom: 9,
    color: '#818da0',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  clientName: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  muted: {
    color: '#68758a',
    lineHeight: 1.5,
  },
  dates: {
    alignItems: 'flex-end',
  },
  dateLine: {
    marginBottom: 7,
    color: '#68758a',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: '#f1f4f9',
    color: '#59677d',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8edf3',
  },
  description: {
    flex: 1,
  },
  qty: {
    width: 48,
    textAlign: 'right',
  },
  rate: {
    width: 90,
    textAlign: 'right',
  },
  amount: {
    width: 90,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  totals: {
    width: 220,
    alignSelf: 'flex-end',
    marginTop: 18,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
    color: '#68758a',
  },
  grandTotal: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dce3ed',
    color: '#253f79',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  notes: {
    marginTop: 44,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#e8edf3',
    color: '#68758a',
    lineHeight: 1.6,
  },
})

function formatMoney(value, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number.isFinite(value) ? value : 0)
}

function getInvoiceTotals(invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0,
  )
  const tax = subtotal * ((Number(invoice.taxRate) || 0) / 100)
  return { subtotal, tax, total: subtotal + tax }
}

function InvoicePdf({ invoice }) {
  const { subtotal, tax, total } = getInvoiceTotals(invoice)

  return (
    <Document title={`Invoice ${invoice.invoiceNumber}`}>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.topRow}>
          <View>
            <Text style={pdfStyles.title}>INVOICE</Text>
            <Text style={pdfStyles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={pdfStyles.businessName}>{invoice.businessName || 'Your business'}</Text>
            <Text style={pdfStyles.mutedRight}>{invoice.businessEmail}</Text>
            <Text style={pdfStyles.mutedRight}>{invoice.businessAddress}</Text>
          </View>
        </View>

        <View style={pdfStyles.details}>
          <View>
            <Text style={pdfStyles.sectionLabel}>BILL TO</Text>
            <Text style={pdfStyles.clientName}>{invoice.clientName || 'Client name'}</Text>
            <Text style={pdfStyles.muted}>{invoice.clientEmail}</Text>
            <Text style={pdfStyles.muted}>{invoice.clientAddress}</Text>
          </View>
          <View style={pdfStyles.dates}>
            <Text style={pdfStyles.dateLine}>Issue date: {invoice.issueDate}</Text>
            <Text style={pdfStyles.dateLine}>Due date: {invoice.dueDate}</Text>
          </View>
        </View>

        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.description}>DESCRIPTION</Text>
          <Text style={pdfStyles.qty}>QTY</Text>
          <Text style={pdfStyles.rate}>RATE</Text>
          <Text style={pdfStyles.amount}>AMOUNT</Text>
        </View>

        {invoice.items.map((item) => (
          <View style={pdfStyles.tableRow} key={item.id}>
            <Text style={pdfStyles.description}>{item.description || 'Item'}</Text>
            <Text style={pdfStyles.qty}>{Number(item.quantity) || 0}</Text>
            <Text style={pdfStyles.rate}>{formatMoney(Number(item.rate) || 0, invoice.currency)}</Text>
            <Text style={pdfStyles.amount}>
              {formatMoney((Number(item.quantity) || 0) * (Number(item.rate) || 0), invoice.currency)}
            </Text>
          </View>
        ))}

        <View style={pdfStyles.totals}>
          <View style={pdfStyles.totalLine}>
            <Text>Subtotal</Text>
            <Text>{formatMoney(subtotal, invoice.currency)}</Text>
          </View>
          <View style={pdfStyles.totalLine}>
            <Text>Tax ({Number(invoice.taxRate) || 0}%)</Text>
            <Text>{formatMoney(tax, invoice.currency)}</Text>
          </View>
          <View style={[pdfStyles.totalLine, pdfStyles.grandTotal]}>
            <Text>Total due</Text>
            <Text>{formatMoney(total, invoice.currency)}</Text>
          </View>
        </View>

        {invoice.notes ? (
          <View style={pdfStyles.notes}>
            <Text style={pdfStyles.sectionLabel}>NOTES</Text>
            <Text>{invoice.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}

function Field({ label, className = '', ...inputProps }) {
  return (
    <label className={`invoice-field ${className}`}>
      <span>{label}</span>
      <input {...inputProps} />
    </label>
  )
}

function TextAreaField({ label, className = '', ...inputProps }) {
  return (
    <label className={`invoice-field ${className}`}>
      <span>{label}</span>
      <textarea {...inputProps} />
    </label>
  )
}

function Form() {
  const [invoice, setInvoice] = useState({
    ...initialInvoice,
    items: [{ id: 1, description: 'Brand identity design', quantity: '1', rate: '2400' }],
  })

  console.log(invoice);
  
  const [mounted, setMounted] = useState(false)
  const nextItemId = useRef(2)
  const { subtotal, tax, total } = getInvoiceTotals(invoice)

  useEffect(() => {
    setMounted(true)
  }, [])

  function updateInvoice(field, value) {
    setInvoice((current) => ({ ...current, [field]: value }))
  }

  function updateItem(id, field, value) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (
        item.id === id ? { ...item, [field]: value } : item
      )),
    }))
  }

  function addItem() {
    const id = nextItemId.current
    nextItemId.current += 1
    setInvoice((current) => ({
      ...current,
      items: [...current.items, { id, description: '', quantity: '1', rate: '0' }],
    }))
  }

  function removeItem(id) {
    setInvoice((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }))
  }

  const downloadName = `${invoice.invoiceNumber || 'invoice'}.pdf`

  return (
    <main className="invoice-app">
      <header className="invoice-topbar">
        <a className="brand" href="/" aria-label="Invoice Studio home">
          <span className="brand-mark" aria-hidden="true">I</span>
          <span>paper<span className="brand-light">work</span></span>
        </a>
        <span className="topbar-note">Simple invoicing, beautifully done</span>
      </header>

      <div className="invoice-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR WORK, WELL PRESENTED</p>
            <h1>Create an invoice</h1>
            <p className="page-subtitle">Add your details and see your invoice take shape.</p>
          </div>
          <div className="download-area">
            {mounted ? (
              <PDFDownloadLink
                className="download-button"
                document={<InvoicePdf invoice={invoice} />}
                fileName={downloadName}
              >
                {({ loading, error }) => (
                  <>
                    <span aria-hidden="true">{loading ? '…' : '↓'}</span>
                    {loading ? 'Preparing PDF…' : 'Download PDF'}
                    {error ? ' — PDF unavailable' : ''}
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button className="download-button" type="button" disabled>
                <span aria-hidden="true">↓</span> Preparing PDF…
              </button>
            )}
          </div>
        </div>

        <div className="invoice-workspace">
          <section className="editor-panel" aria-label="Invoice details">
            <div className="editor-section">
              <div className="section-heading">
                <span className="step-number">01</span>
                <div>
                  <h2>Your business</h2>
                  <p>Who is sending this invoice?</p>
                </div>
              </div>
              <div className="field-grid">
                <Field label="Business name" value={invoice.businessName} onChange={(event) => updateInvoice('businessName', event.target.value)} />
                <Field label="Email address" type="email" value={invoice.businessEmail} onChange={(event) => updateInvoice('businessEmail', event.target.value)} />
                <TextAreaField className="field-full" label="Business address" rows="2" value={invoice.businessAddress} onChange={(event) => updateInvoice('businessAddress', event.target.value)} />
              </div>
            </div>

            <div className="editor-section">
              <div className="section-heading">
                <span className="step-number">02</span>
                <div>
                  <h2>Client details</h2>
                  <p>Who are you billing?</p>
                </div>
              </div>
              <div className="field-grid">
                <Field label="Client name" value={invoice.clientName} onChange={(event) => updateInvoice('clientName', event.target.value)} />
                <Field label="Email address" type="email" value={invoice.clientEmail} onChange={(event) => updateInvoice('clientEmail', event.target.value)} />
                <TextAreaField className="field-full" label="Client address" rows="2" value={invoice.clientAddress} onChange={(event) => updateInvoice('clientAddress', event.target.value)} />
              </div>
            </div>

            <div className="editor-section">
              <div className="section-heading">
                <span className="step-number">03</span>
                <div>
                  <h2>Invoice details</h2>
                  <p>Set the dates and currency.</p>
                </div>
              </div>
              <div className="field-grid">
                <Field label="Invoice number" value={invoice.invoiceNumber} onChange={(event) => updateInvoice('invoiceNumber', event.target.value)} />
                <label className="invoice-field">
                  <span>Currency</span>
                  <select value={invoice.currency} onChange={(event) => updateInvoice('currency', event.target.value)}>
                    {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                  </select>
                </label>
                <Field label="Issue date" type="date" value={invoice.issueDate} onChange={(event) => updateInvoice('issueDate', event.target.value)} />
                <Field label="Due date" type="date" value={invoice.dueDate} onChange={(event) => updateInvoice('dueDate', event.target.value)} />
              </div>
            </div>

            <div className="editor-section items-section">
              <div className="section-heading">
                <span className="step-number">04</span>
                <div>
                  <h2>Line items</h2>
                  <p>What are you charging for?</p>
                </div>
              </div>
              <div className="line-item-editor">
                <div className="line-item-labels">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span aria-hidden="true" />
                </div>
                {invoice.items.map((item) => (
                  <div className="line-item-inputs" key={item.id}>
                    <input aria-label="Item description" placeholder="Service or product" value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} />
                    <input aria-label="Quantity" type="number" min="0" step="any" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} />
                    <input aria-label="Rate" type="number" min="0" step="0.01" value={item.rate} onChange={(event) => updateItem(item.id, 'rate', event.target.value)} />
                    <button
                      className="remove-item"
                      type="button"
                      aria-label={`Remove ${item.description || 'line item'}`}
                      disabled={invoice.items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="add-item-button" type="button" onClick={addItem}>+ Add a line item</button>
              </div>
              <div className="field-grid tax-grid">
                <Field className="tax-field" label="Tax rate (%)" type="number" min="0" step="0.01" value={invoice.taxRate} onChange={(event) => updateInvoice('taxRate', event.target.value)} />
              </div>
            </div>

            <div className="editor-section notes-section">
              <div className="section-heading">
                <span className="step-number">05</span>
                <div>
                  <h2>Note to your client</h2>
                  <p>Add a personal message or payment terms.</p>
                </div>
              </div>
              <TextAreaField label="Notes" rows="3" value={invoice.notes} onChange={(event) => updateInvoice('notes', event.target.value)} />
            </div>
          </section>

          <aside className="preview-column" aria-label="Live invoice preview">
            <div className="preview-toolbar">
              <div>
                <span className="preview-dot" />
                <span>LIVE PREVIEW</span>
              </div>
              <span>A4 · Portrait</span>
            </div>
            <article className="invoice-paper">
              <div className="paper-top">
                <div>
                  <p className="paper-title">INVOICE</p>
                  <p className="paper-number">{invoice.invoiceNumber || 'Invoice number'}</p>
                </div>
                <div className="paper-business">
                  <strong>{invoice.businessName || 'Your business'}</strong>
                  {invoice.businessEmail && <span>{invoice.businessEmail}</span>}
                  {invoice.businessAddress && <span>{invoice.businessAddress}</span>}
                </div>
              </div>
              <div className="paper-details">
                <div className="bill-to">
                  <p className="paper-label">BILL TO</p>
                  <strong>{invoice.clientName || 'Client name'}</strong>
                  {invoice.clientEmail && <span>{invoice.clientEmail}</span>}
                  {invoice.clientAddress && <span>{invoice.clientAddress}</span>}
                </div>
                <div className="paper-dates">
                  <span><b>Issued</b>{invoice.issueDate || '—'}</span>
                  <span><b>Due</b>{invoice.dueDate || '—'}</span>
                </div>
              </div>
              <div className="preview-table">
                <div className="preview-table-head">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span>Amount</span>
                </div>
                {invoice.items.map((item) => {
                  const amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0)
                  return (
                    <div className="preview-table-row" key={item.id}>
                      <span>{item.description || 'Line item'}</span>
                      <span>{Number(item.quantity) || 0}</span>
                      <span>{formatMoney(Number(item.rate) || 0, invoice.currency)}</span>
                      <strong>{formatMoney(amount, invoice.currency)}</strong>
                    </div>
                  )
                })}
              </div>
              <div className="paper-totals">
                <div><span>Subtotal</span><span>{formatMoney(subtotal, invoice.currency)}</span></div>
                <div><span>Tax ({Number(invoice.taxRate) || 0}%)</span><span>{formatMoney(tax, invoice.currency)}</span></div>
                <div className="paper-total"><strong>Total due</strong><strong>{formatMoney(total, invoice.currency)}</strong></div>
              </div>
              {invoice.notes && (
                <div className="paper-notes">
                  <p className="paper-label">NOTE</p>
                  <p>{invoice.notes}</p>
                </div>
              )}
              <div className="paper-footer">We appreciate your business.</div>
            </article>
            <p className="preview-hint">Your PDF will match this preview.</p>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Form

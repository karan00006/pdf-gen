import { useEffect, useRef, useState } from "react";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";

const currencies = ["USD", "EUR", "GBP", "INR"];
const maxImages = 6;
const maxImageSize = 5 * 1024 * 1024;

const initialInvoice = {
  businessName: "Northstar Studio",
  businessEmail: "hello@northstar.studio",
  businessAddress: "128 Market Street\nSan Francisco, CA 94105",
  clientName: "Alex Morgan",
  clientEmail: "alex@example.com",
  clientAddress: "42 Garden Lane\nBrooklyn, NY 11201",
  invoiceNumber: "INV-2026-001",
  issueDate: "2026-10-16",
  dueDate: "2026-10-30",
  currency: "USD",
  taxRate: "8",
  notes: "Thank you for your business. Payment is due within 14 days.",
  images: [],
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 48,
    color: "#202b3c",
    fontFamily: "Helvetica",
    fontSize: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 42,
  },
  title: {
    color: "#253f79",
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
  },
  invoiceNumber: {
    marginTop: 8,
    color: "#68758a",
    fontSize: 10,
  },
  businessName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  mutedRight: {
    marginTop: 5,
    color: "#68758a",
    lineHeight: 1.5,
    textAlign: "right",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  sectionLabel: {
    marginBottom: 9,
    color: "#818da0",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  clientName: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  muted: {
    color: "#68758a",
    lineHeight: 1.5,
  },
  dates: {
    alignItems: "flex-end",
  },
  dateLine: {
    marginBottom: 7,
    color: "#68758a",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: "#f1f4f9",
    color: "#59677d",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e8edf3",
  },
  description: {
    flex: 1,
  },
  qty: {
    width: 48,
    textAlign: "right",
  },
  rate: {
    width: 90,
    textAlign: "right",
  },
  amount: {
    width: 90,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  totals: {
    width: 220,
    alignSelf: "flex-end",
    marginTop: 18,
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    color: "#68758a",
  },
  grandTotal: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#dce3ed",
    color: "#253f79",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  notes: {
    marginTop: 44,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#e8edf3",
    color: "#68758a",
    lineHeight: 1.6,
  },
  attachments: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e8edf3",
  },
  attachmentsTitle: {
    color: "#253f79",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
  },
  attachmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  attachmentCard: {
    width: "48%",
    marginBottom: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e8edf3",
    borderRadius: 5,
  },
  attachmentImage: {
    // width: "100%",
    // height: 125,
    objectFit: "cover",
  },
  attachmentName: {
    marginTop: 6,
    color: "#68758a",
    fontSize: 8,
  },
});

function formatMoney(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isFinite(value) ? value : 0);
}

function getInvoiceTotals(invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0,
  );
  const tax = subtotal * ((Number(invoice.taxRate) || 0) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

function InvoicePdf({ invoice }) {
  const { subtotal, tax, total } = getInvoiceTotals(invoice);

  return (
    <Document title={`Invoice ${invoice.invoiceNumber}`}>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.topRow}>
          <View>
            <Text style={pdfStyles.title}>INVOICE</Text>

            <Text style={pdfStyles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={pdfStyles.businessName}>
              {invoice.businessName || "Your business"}
            </Text>
            <Text style={pdfStyles.mutedRight}>{invoice.businessEmail}</Text>
            <Text style={pdfStyles.mutedRight}>{invoice.businessAddress}</Text>
          </View>
        </View>

        <View style={pdfStyles.details}>
          <View>
            <Text style={pdfStyles.sectionLabel}>BILL TO</Text>
            <Text style={pdfStyles.clientName}>
              {invoice.clientName || "Client name"}
            </Text>
            <Text style={pdfStyles.muted}>{invoice.clientEmail}</Text>
            <Text style={pdfStyles.muted}>{invoice.clientAddress}</Text>
          </View>
          <View style={pdfStyles.dates}>
            <Text style={pdfStyles.dateLine}>
              Issue date: {invoice.issueDate}
            </Text>
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
            <Text style={pdfStyles.description}>
              {item.description || "Item"}
            </Text>
            <Text style={pdfStyles.qty}>{Number(item.quantity) || 0}</Text>
            <Text style={pdfStyles.rate}>
              {formatMoney(Number(item.rate) || 0, invoice.currency)}
            </Text>
            <Text style={pdfStyles.amount}>
              {formatMoney(
                (Number(item.quantity) || 0) * (Number(item.rate) || 0),
                invoice.currency,
              )}
            </Text>
          </View>
        ))}
        {invoice.images.length > 0 ? (
          <View style={pdfStyles.attachments}>
            <Text style={pdfStyles.attachmentsTitle}>ATTACHMENTS</Text>
            <View style={pdfStyles.attachmentGrid}>
              {invoice.images.map((image) => (
                <View style={pdfStyles.attachmentCard} key={image.id}>
                  <Image src={image.src} style={pdfStyles.attachmentImage} />
                  {/* <Text style={pdfStyles.attachmentName}>{image.name}</Text> */}
                </View>
              ))}
            </View>
          </View>
        ) : null}
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
  );
}

function Field({ label, className = "", error, ...inputProps }) {
  return (
    <label className={`invoice-field ${className}`}>
      <span>{label}</span>
      <input {...inputProps} />
      {error ? (
        <span className="field-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextAreaField({ label, className = "", ...inputProps }) {
  return (
    <label className={`invoice-field ${className}`}>
      <span>{label}</span>
      <textarea {...inputProps} />
    </label>
  );
}

function Form() {
  const [invoice, setInvoice] = useState({
    ...initialInvoice,
    items: [
      {
        id: 1,
        description: "Brand identity design",
        quantity: "1",
        rate: "2400",
      },
    ],
  });

  const [mounted, setMounted] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const nextItemId = useRef(2);
  const nextImageId = useRef(1);
  const { subtotal, tax, total } = getInvoiceTotals(invoice);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateInvoice(field, value) {
    setInvoice((current) => ({ ...current, [field]: value }));
  }

  function updateItem(id, field, value) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function handleImageChange(event) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (files.length === 0) {
      return;
    }

    const errors = [];
    const validFiles = files.filter((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        errors.push(`${file.name}: choose a JPEG or PNG image.`);
        return false;
      }
      if (file.size > maxImageSize) {
        errors.push(`${file.name}: image must be 5 MB or smaller.`);
        return false;
      }
      return true;
    });
    const availableSlots = Math.max(0, maxImages - invoice.images.length);
    if (validFiles.length > availableSlots) {
      errors.push(`You can add up to ${maxImages} images.`);
    }
    const filesToRead = validFiles.slice(0, availableSlots);

    if (filesToRead.length === 0) {
      setImageUploadError(errors.join(" "));
      return;
    }

    setIsUploadingImages(true);
    try {
      const images = await Promise.all(
        filesToRead.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result !== "string") {
                  reject(new Error(`Could not read ${file.name}.`));
                  return;
                }
                resolve({
                  id: nextImageId.current++,
                  name: file.name,
                  src: reader.result,
                });
              };
              reader.onerror = () =>
                reject(new Error(`Could not read ${file.name}.`));
              reader.readAsDataURL(file);
            }),
        ),
      );

      setInvoice((current) => ({
        ...current,
        images: [...current.images, ...images],
      }));
      setImageUploadError(errors.join(" "));
    } catch (error) {
      setImageUploadError(
        error instanceof Error ? error.message : "The images could not be read.",
      );
    } finally {
      setIsUploadingImages(false);
    }
  }

  function removeImage(id) {
    setInvoice((current) => ({
      ...current,
      images: current.images.filter((image) => image.id !== id),
    }));
  }

  function addItem() {
    const id = nextItemId.current;
    nextItemId.current += 1;
    setInvoice((current) => ({
      ...current,
      items: [
        ...current.items,
        { id, description: "", quantity: "1", rate: "0" },
      ],
    }));
  }

  function removeItem(id) {
    setInvoice((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }

  const downloadName = `${invoice.invoiceNumber || "invoice"}.pdf`;

  return (
    <main className="invoice-app">
      <header className="invoice-topbar">
        <a className="brand" href="/" aria-label="Invoice Studio home">
          <span className="brand-mark" aria-hidden="true">
            <i className="fa-solid fa-file-invoice"></i>
          </span>
          <span>
            paper<span className="brand-light">work</span>
          </span>
        </a>
        <span className="topbar-note">Simple invoicing, beautifully done</span>
      </header>

      <div className="invoice-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR WORK, WELL PRESENTED</p>
            <h1>Create an invoice</h1>
            <p className="page-subtitle">
              Add your details and see your invoice take shape.
            </p>
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
                    <span aria-hidden="true">{loading ? "…" : "↓"}</span>
                    {loading ? "Preparing PDF…" : "Download PDF"}
                    {error ? " — PDF unavailable" : ""}
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
                <Field
                  label="Business name"
                  value={invoice.businessName}
                  onChange={(event) =>
                    updateInvoice("businessName", event.target.value)
                  }
                />
                <Field
                  label="Email address"
                  type="email"
                  value={invoice.businessEmail}
                  onChange={(event) =>
                    updateInvoice("businessEmail", event.target.value)
                  }
                />
                <TextAreaField
                  className="field-full"
                  label="Business address"
                  rows="2"
                  value={invoice.businessAddress}
                  onChange={(event) =>
                    updateInvoice("businessAddress", event.target.value)
                  }
                />
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
                <Field
                  label="Client name"
                  value={invoice.clientName}
                  onChange={(event) =>
                    updateInvoice("clientName", event.target.value)
                  }
                />
                <Field
                  label="Email address"
                  type="email"
                  value={invoice.clientEmail}
                  onChange={(event) =>
                    updateInvoice("clientEmail", event.target.value)
                  }
                />
                <div className="image-upload field-full">
                  <div className="image-upload-heading">
                    <div>
                      <h3>Project images <span>Optional</span></h3>
                      <p>Add up to {maxImages} images to your invoice.</p>
                    </div>
                    <span className="image-count">
                      {invoice.images.length}/{maxImages}
                    </span>
                  </div>
                  <label className="image-upload-dropzone">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      disabled={
                        isUploadingImages ||
                        invoice.images.length >= maxImages
                      }
                      onChange={handleImageChange}
                      aria-label="Add project images"
                    />
                    <span className="image-upload-icon" aria-hidden="true">
                      +
                    </span>
                    <span className="image-upload-copy">
                      <strong>
                        {isUploadingImages
                          ? "Adding images…"
                          : "Choose images"}
                      </strong>
                      <span>JPG or PNG · Up to 5 MB each</span>
                    </span>
                  </label>
                  {imageUploadError ? (
                    <p className="field-error" role="alert">
                      {imageUploadError}
                    </p>
                  ) : null}
                  {invoice.images.length > 0 ? (
                    <div className="image-upload-grid">
                      {invoice.images.map((image) => (
                        <figure className="image-upload-card" key={image.id}>
                          <img src={image.src} alt={image.name} />
                          <figcaption title={image.name}>
                            <span>{image.name}</span>
                            <button
                              type="button"
                              aria-label={`Remove ${image.name}`}
                              onClick={() => removeImage(image.id)}
                            >
                              ×
                            </button>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
                <TextAreaField
                  className="field-full"
                  label="Client address"
                  rows="2"
                  value={invoice.clientAddress}
                  onChange={(event) =>
                    updateInvoice("clientAddress", event.target.value)
                  }
                />
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
                <Field
                  label="Invoice number"
                  value={invoice.invoiceNumber}
                  onChange={(event) =>
                    updateInvoice("invoiceNumber", event.target.value)
                  }
                />
                <label className="invoice-field">
                  <span>Currency</span>
                  <select
                    value={invoice.currency}
                    onChange={(event) =>
                      updateInvoice("currency", event.target.value)
                    }
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Issue date"
                  type="date"
                  value={invoice.issueDate}
                  onChange={(event) =>
                    updateInvoice("issueDate", event.target.value)
                  }
                />
                <Field
                  label="Due date"
                  type="date"
                  value={invoice.dueDate}
                  onChange={(event) =>
                    updateInvoice("dueDate", event.target.value)
                  }
                />
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
                    <input
                      aria-label="Item description"
                      placeholder="Service or product"
                      value={item.description}
                      onChange={(event) =>
                        updateItem(item.id, "description", event.target.value)
                      }
                    />
                    <input
                      aria-label="Quantity"
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.id, "quantity", event.target.value)
                      }
                    />
                    <input
                      aria-label="Rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(event) =>
                        updateItem(item.id, "rate", event.target.value)
                      }
                    />
                    <button
                      className="remove-item"
                      type="button"
                      aria-label={`Remove ${item.description || "line item"}`}
                      disabled={invoice.items.length === 1}
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="add-item-button"
                  type="button"
                  onClick={addItem}
                >
                  + Add a line item
                </button>
              </div>
              <div className="field-grid tax-grid">
                <Field
                  className="tax-field"
                  label="Tax rate (%)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoice.taxRate}
                  onChange={(event) =>
                    updateInvoice("taxRate", event.target.value)
                  }
                />
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
              <TextAreaField
                label="Notes"
                rows="3"
                value={invoice.notes}
                onChange={(event) => updateInvoice("notes", event.target.value)}
              />
            </div>
          </section>
{/* preview =================================================================== */}
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
                  <p className="paper-number">
                    {invoice.invoiceNumber || "Invoice number"}
                  </p>
                </div>
                <div className="paper-business">
                  <strong>{invoice.businessName || "Your business"}</strong>
                  {invoice.businessEmail && (
                    <span>{invoice.businessEmail}</span>
                  )}
                  {invoice.businessAddress && (
                    <span>{invoice.businessAddress}</span>
                  )}
                </div>
              </div>
              <div className="paper-details">
                <div className="bill-to">
                  <p className="paper-label">BILL TO</p>
                  <strong>{invoice.clientName || "Client name"}</strong>
                  {invoice.clientEmail && <span>{invoice.clientEmail}</span>}
                  {invoice.clientAddress && (
                    <span>{invoice.clientAddress}</span>
                  )}
                </div>
                <div className="paper-dates">
                  <span>
                    <b>Issued</b>
                    {invoice.issueDate || "—"}
                  </span>
                  <span>
                    <b>Due</b>
                    {invoice.dueDate || "—"}
                  </span>
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
                  const amount =
                    (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                  return (
                    <div className="preview-table-row" key={item.id}>
                      <span>{item.description || "Line item"}</span>
                      <span>{Number(item.quantity) || 0}</span>
                      <span>
                        {formatMoney(Number(item.rate) || 0, invoice.currency)}
                      </span>
                      <strong>{formatMoney(amount, invoice.currency)}</strong>
                    </div>
                  );
                })}
              </div>
              {invoice.images.length > 0 ? (
                <div className="paper-attachments">
                  <p>ATTACHMENTS</p>
                  <div>
                    {invoice.images.map((image) => (
                      <figure key={image.id}>
                        <img src={image.src} alt={image.name} width={100} height="auto"/>
                        {/* <figcaption>{image.name}</figcaption> */}
                      </figure>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="paper-totals">
                <div>
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal, invoice.currency)}</span>
                </div>
                <div>
                  <span>Tax ({Number(invoice.taxRate) || 0}%)</span>
                  <span>{formatMoney(tax, invoice.currency)}</span>
                </div>
                <div className="paper-total">
                  <strong>Total due</strong>
                  <strong>{formatMoney(total, invoice.currency)}</strong>
                </div>
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
  );
}

export default Form;

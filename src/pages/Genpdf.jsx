
import { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 18,
  },
});

function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>My First Invoice</Text>
        <Text>Customer: Ali</Text>
        <Text>Total: Rs. 5,000</Text>
      </Page>
    </Document>
  );
}

function PDFClient() {
  return (
    <PDFDownloadLink
      document={<MyDocument />}
      fileName="invoice.pdf"
    >
      {({ loading }) =>
        loading ? "Preparing PDF..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
}

export default function Genpdf() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p>Loading PDF generator...</p>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>PDF Generator</h1>
      <PDFClient />
    </div>
  );
}

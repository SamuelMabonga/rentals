import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Import your logo image
import logo from './path-to-your-logo.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 80,
    height: 80
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333333'
  },
  value: {
    fontSize: 16,
    marginBottom: 10
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#666666'
  }
});

// Create Document Component
const RentalBillReceipt = ({
  customerName,
  rentalName,
  property,
  service,
  billDate,
  paidDate,
  startDate,
  endDate,
  billAmount,
  contactDetails
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* <Image source={logo} style={styles.logo} /> */}
        <Text style={styles.title}>Rent It - Rental Bill Receipt</Text>
      </View>
      <View>
        <Text style={styles.label}>Customer Name</Text>
        <Text style={styles.value}>{customerName}</Text>
      </View>
      <View>
        <Text style={styles.label}>Rental Name</Text>
        <Text style={styles.value}>{rentalName}</Text>
      </View>
      <View>
        <Text style={styles.label}>Property</Text>
        <Text style={styles.value}>{property}</Text>
      </View>
      <View>
        <Text style={styles.label}>Service</Text>
        <Text style={styles.value}>{service}</Text>
      </View>
      <View>
        <Text style={styles.label}>Bill Date</Text>
        <Text style={styles.value}>{billDate}</Text>
      </View>
      <View>
        <Text style={styles.label}>Paid Date</Text>
        <Text style={styles.value}>{paidDate}</Text>
      </View>
      <View>
        <Text style={styles.label}>Rental Period</Text>
        <Text style={styles.value}>{startDate} - {endDate}</Text>
      </View>
      <View>
        <Text style={styles.label}>Bill Amount</Text>
        <Text style={styles.value}>${billAmount?.toFixed(2)}</Text>
      </View>
      <View>
        <Text style={styles.label}>Contact Details</Text>
        <Text style={styles.value}>{contactDetails}</Text>
      </View>
      <Text style={styles.footer}>Thank you for choosing Rent It!</Text>
    </Page>
  </Document>
);

export default RentalBillReceipt;

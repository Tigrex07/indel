import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff', fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  meta: { fontSize: 9, marginTop: 4, color: '#444', flexDirection: 'row', justifyContent: 'space-between' },
  
  table: { marginTop: 15, borderWidth: 1, borderColor: '#000' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#000', alignItems: 'center', height: 25 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#666', alignItems: 'center', minHeight: 25 },
  
  colIndex: { width: '8%', fontSize: 8, textAlign: 'center', borderRightWidth: 0.5 },
  colMarbete: { width: '15%', fontSize: 8, fontWeight: 'bold', paddingLeft: 4, borderRightWidth: 0.5 },
  colNombre: { width: '42%', fontSize: 8, paddingLeft: 4, borderRightWidth: 0.5 },
  colUbicacion: { width: '20%', fontSize: 7, paddingLeft: 4, borderRightWidth: 0.5 },
  colCheck: { width: '15%', fontSize: 7, textAlign: 'center' },

  footer: { position: 'absolute', bottom: 50, left: 40, right: 40 },
  signatureArea: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#000', width: '45%', paddingTop: 5, textAlign: 'center', fontSize: 9 }
});

export const CicloCuentaPDF = ({ activos, titulo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{titulo || "HOJA DE CICLOCUENTO / AUDITORÍA"}</Text>
        <View style={styles.meta}>
          <Text>UNIVERSIDAD TECNOLÓGICA DE NOGALES</Text>
          <Text>FECHA: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colIndex}>#</Text>
          <Text style={styles.colMarbete}>MARBETE</Text>
          <Text style={styles.colNombre}>DESCRIPCIÓN DEL ACTIVO</Text>
          <Text style={styles.colUbicacion}>EDIFICIO/AULA</Text>
          <Text style={styles.colCheck}>ESTADO</Text>
        </View>

        {activos.map((act, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={styles.colIndex}>{i + 1}</Text>
            <Text style={styles.colMarbete}>{act.marbete}</Text>
            <Text style={styles.colNombre}>{act.nombre}</Text>
            <Text style={styles.colUbicacion}>{act.edificio} - {act.aula}</Text>
            <Text style={styles.colCheck}>[  ] OK  [  ] NO</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.signatureArea}>
          <Text style={styles.signatureLine}>AUDITOR / RESPONSABLE</Text>
          <Text style={styles.signatureLine}>SELLO DE DEPTO.</Text>
        </View>
      </View>
    </Page>
  </Document>
);
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos técnicos y minimalistas para el documento institucional
const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Helvetica' 
  },
  header: { 
    marginBottom: 30, 
    borderBottomWidth: 2, 
    borderBottomColor: '#f1f5f9', 
    paddingBottom: 15 
  },
  utnTag: { 
    fontSize: 10, 
    color: '#64748b', 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    letterSpacing: 1.5,
    marginBottom: 4
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    textTransform: 'uppercase' 
  },
  subTitle: { 
    fontSize: 12, 
    color: '#64748b', 
    marginTop: 4,
    fontStyle: 'italic'
  },
  // Secciones
  section: { 
    marginBottom: 25 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    gap: 10
  },
  numberCircle: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    paddingTop: 4
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  // Contenido de texto
  bodyText: { 
    fontSize: 10, 
    color: '#334155', 
    lineHeight: 1.6, 
    textAlign: 'justify',
    marginBottom: 8
  },
  highlightBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981', // Emerald para docente
    marginTop: 5
  },
  highlightBoxAdmin: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Blue para admin
    marginTop: 5
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: '#10b981'
  },
  // Footer
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 50, 
    right: 50, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: { 
    fontSize: 8, 
    color: '#94a3b8', 
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

export const GuiaPDF = ({ isDocente }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.utnTag}>Universidad Tecnológica de Nogales</Text>
        <Text style={styles.title}>
          {isDocente ? "Manual de Usuario Final" : "Guía Maestra de Administración"}
        </Text>
        <Text style={styles.subTitle}>
          {isDocente 
            ? "Protocolos de resguardo y gestión de activos para personal" 
            : "Control total de infraestructura, auditoría y seguridad de datos"}
        </Text>
      </View>

      {/* Sección 01: Introducción y Propósito */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.numberCircle}>01</Text>
          <Text style={styles.sectionTitle}>Introducción al Sistema</Text>
        </View>
        <Text style={styles.bodyText}>
          {isDocente 
            ? "Este documento constituye la normativa técnica para el manejo del inventario institucional. Como usuario, usted es responsable de la integridad física de los activos asignados. El sistema permite la transparencia total en la ubicación y estado de cada equipo bajo su cargo."
            : "La consola administrativa otorga facultades para la modificación estructural de la base de datos patrimonial. Es imperativo que cada movimiento de edificio o cambio de estatus de activo esté debidamente respaldado por un proceso de verificación física para mantener la salud de la auditoría."}
        </Text>
      </View>

      {/* Sección 02: Operaciones Críticas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.numberCircle}>02</Text>
          <Text style={styles.sectionTitle}>
            {isDocente ? "Proceso de Baja Técnica" : "Gestión de la Estructura"}
          </Text>
        </View>
        <View style={isDocente ? styles.highlightBox : styles.highlightBoxAdmin}>
          <Text style={[styles.bodyText, { fontWeight: 'bold', marginBottom: 5 }]}>
            {isDocente ? "Pasos para deslindar responsabilidad:" : "Jerarquía Institucional Obligatoria:"}
          </Text>
          {isDocente ? (
            <>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bodyText}>Identificar el marbete del equipo dañado u obsoleto en su panel.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bodyText}>Redactar el motivo detallado de la baja (evite descripciones genéricas).</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bodyText}>Descargar y firmar el documento PDF para validación de almacén.</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.bulletItem}>
                <Text style={[styles.bulletPoint, { color: '#3b82f6' }]}>•</Text>
                <Text style={styles.bodyText}>Edificios: Solo personal de planeación puede autorizar nuevos nombres.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={[styles.bulletPoint, { color: '#3b82f6' }]}>•</Text>
                <Text style={styles.bodyText}>Transferencias: Nunca borre usuarios; migre sus activos a un sucesor.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={[styles.bulletPoint, { color: '#3b82f6' }]}>•</Text>
                <Text style={styles.bodyText}>Marbetes: Verifique la calidad de impresión antes de pegar etiquetas.</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Sección 03: Seguridad y Soporte */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.numberCircle}>03</Text>
          <Text style={styles.sectionTitle}>Seguridad y Buenas Prácticas</Text>
        </View>
        <Text style={styles.bodyText}>
          {isDocente
            ? "No comparta sus credenciales de acceso. Cualquier movimiento realizado desde su cuenta se considera una acción oficial y vinculante. Si detecta un equipo en su área que no cuenta con marbete físico, repórtelo inmediatamente a Soporte Técnico."
            : "Como administrador, el uso de la herramienta de bajas 'Inactivas' es preferible sobre la eliminación física de registros. Esto permite generar reportes históricos de depreciación y ciclos de vida para futuras compras institucionales."}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sistema de Inventario — UTN v2.0</Text>
        <Text style={styles.footerText}>Página 1 de 1</Text>
      </View>
    </Page>
  </Document>
);

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// CORRECCIÓN DE ESTILOS: 
// 1. Eliminamos 'border: 1' y usamos borderWidth + borderColor
// 2. Cambiamos 'pb' y 'pt' por paddingBottom y paddingTop
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Helvetica' 
  },
  header: { 
    marginBottom: 20, 
    borderBottomWidth: 2, // Corregido: borderBottom -> borderBottomWidth
    borderBottomColor: '#f1f5f9', 
    borderBottomStyle: 'solid',
    paddingBottom: 10 // Corregido: pb -> paddingBottom
  },
  utnTag: { 
    fontSize: 9, 
    color: '#94a3b8', 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    letterSpacing: 2 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'black', 
    color: '#1e293b', 
    marginTop: 5, 
    textTransform: 'uppercase' 
  },
  subTitle: { 
    fontSize: 12, 
    color: '#64748b', 
    marginBottom: 20 
  },
  
  banner: { 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 25 
  },
  bannerTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    textTransform: 'uppercase' 
  },
  bannerText: { 
    fontSize: 10, 
    lineHeight: 1.5 
  },
  
  section: { 
    marginBottom: 20 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  numberCircle: { 
    backgroundColor: '#0f172a', 
    color: '#fff', 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    textAlign: 'center', 
    fontSize: 10, 
    lineHeight: 2, 
    marginRight: 8, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    textTransform: 'uppercase' 
  },
  
  cardContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    // Nota: 'gap' no es compatible con versiones antiguas de react-pdf, 
    // si falla el diseño, usaremos margin en las tarjetas.
    gap: 10 
  },
  card: { 
    padding: 15, 
    borderRadius: 10, 
    borderWidth: 1, // Corregido: border -> borderWidth
    borderStyle: 'solid',
    borderColor: '#f1f5f9', 
    width: '48%' 
  },
  cardTitle: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginBottom: 4 
  },
  cardText: { 
    fontSize: 9, 
    color: '#64748b', 
    lineHeight: 1.4 
  },
  
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 40, 
    right: 40, 
    borderTopWidth: 1, // Corregido: borderTop -> borderTopWidth
    borderTopColor: '#f1f5f9', 
    borderTopStyle: 'solid',
    paddingTop: 10, // Corregido: pt -> paddingTop
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  footerText: { 
    fontSize: 9, 
    color: '#94a3b8', 
    fontWeight: 'bold' 
  }
});

export const GuiaPDF = ({ id, data }) => {
  // Validación de seguridad por si data viene vacío
  if (!data) return null;

  const isDocente = id === 'usuario';
  const mainColor = isDocente ? '#ecfdf5' : '#eff6ff';
  const textColor = isDocente ? '#065f46' : '#1e40af';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.utnTag}>Sistema de Inventario • UTN 2026</Text>
          <Text style={styles.title}>{data.titulo || "Manual de Usuario"}</Text>
          <Text style={styles.subTitle}>{data.subtitulo || "Instrucciones generales"}</Text>
        </View>

        {/* Banner de Bienvenida */}
        <View style={[styles.banner, { backgroundColor: mainColor }]}>
          <Text style={[styles.bannerTitle, { color: textColor }]}>
            {isDocente ? "Bienvenido Usuario" : "Consola de Administración"}
          </Text>
          <Text style={[styles.bannerText, { color: textColor }]}>
            {isDocente 
              ? "Esta herramienta permite gestionar tus activos de forma transparente y eficiente para el control institucional."
              : "Tienes acceso a la gestión de usuarios, edición de activos y supervisión. Tu rol es vital para la veracidad del inventario."}
          </Text>
        </View>

        {/* Sección 01 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.numberCircle}>01</Text>
            <Text style={styles.sectionTitle}>
              {isDocente ? "Panel Principal" : "Gestión de Personal"}
            </Text>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{isDocente ? "Búsqueda" : "Control de Accesos"}</Text>
              <Text style={styles.cardText}>
                {isDocente ? "Encuentra equipos por nombre o marbete al instante usando el buscador superior." : "Crea, edita o inactiva cuentas de personal administrativo y docente."}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{isDocente ? "Copiado rápido" : "Historial Seguro"}</Text>
              <Text style={styles.cardText}>
                {isDocente ? "Usa el botón de copia para llevar el marbete a tus oficios oficiales sin errores." : "Inactiva cuentas en lugar de borrarlas para preservar el historial de movimientos."}
              </Text>
            </View>
          </View>
        </View>

        {/* Sección 02 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.numberCircle}>02</Text>
            <Text style={styles.sectionTitle}>
              {isDocente ? "Bajas Técnicas" : "Control de Ubicaciones"}
            </Text>
          </View>
          <View style={{ backgroundColor: '#f8fafc', padding: 15, borderRadius: 10 }}>
            <Text style={styles.cardText}>
              {isDocente 
                ? "1. Ubica el equipo • 2. Escribe el motivo • 3. Descarga el PDF • 4. Firma con tu jefe directo."
                : "Asegúrate de mantener actualizados los edificios y aulas para evitar confusiones en los resguardos físicos."}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SOPORTE TÉCNICO UTN</Text>
          <Text style={styles.footerText}>NIVEL: {id?.toUpperCase() || "S/N"}</Text>
        </View>
      </Page>
    </Document>
  );
};
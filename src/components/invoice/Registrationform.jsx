import React from 'react';
import { Page, Text, View, Document, PDFViewer} from '@react-pdf/renderer';
import styles from './style';
import { Table, TD, TH, TR,  } from '@ag-media/react-pdf-table';
// Create Document Component





const Registrationform = () => {
    const RegisterPDF = () => (
  <Document>
    <Page size="A4" orientation='portrait' style={styles.page}>
      <View style={styles.header}>
     <View>
      <Text style={[styles.title, styles.fontBold]} >Receipt</Text>
      <Text>Receipt No- #jdijoiweiuh</Text>
     </View>
      <View style={styles.spaceY}>
      <Text style={styles.fontBold}>ICE COMPUTER INSTITUTE</Text>
      <Text>MOB- +916388939189</Text>
      <Text>Mundera Bazar Chauri Chaura Gorakhpur</Text>
     </View>
      </View>
      <View style={[styles.spaceY]}>
      <Text style={[styles.billTo, styles.fontBold]}>Bill To:</Text>

      <Text>Student ID -ICE202626</Text>
      <Text>Student name- Suhel Ali</Text>
     </View>
    <View style={styles.margintop}>
        <Table style={styles.table} >
        <TH style={styles.tableHeader} >
            <TD style={styles.tdpadding}>Course Name</TD>
            <TD style={[styles.tdpadding, styles.w]}>Installment No</TD>
            <TD style={styles.tdpadding}>Installment Date</TD>
               <TD style={styles.tdpadding}>Fee Amount</TD>
             <TD style={styles.tdpadding}>GST(10%)</TD>
        </TH>
        <TR className = "h-[40px]">
            <TD style={styles.tdpadding}>ADCA</TD>
            <TD style={styles.tdpadding}>INST-6566</TD>
            <TD style={styles.tdpadding}>9/06/2026</TD>
            <TD style={styles.tdpadding}>$ 15,000</TD>
              <TD style={styles.tdpadding}>GST</TD>
        </TR>

    </Table>
    </View>

    <View style={ styles.total}>

      <View style={styles.spaceY}>
        <Text >Subtotal:</Text>
        <Text >Gst(10%):</Text>
        <Text style={styles.fontBold}>Total:</Text>
      </View>

      <View style={styles.spaceY}>
        <Text>$15,000</Text>
        <Text>$1,500</Text>
        <Text style={styles.fontBold}>$16,500</Text>
      </View>

    </View>
     
    </Page>
  </Document>
);
    return (
        <div>
            <div className='w-full h-[800px]'>
                <PDFViewer width={'100%'} height={"100%"}>
                    <RegisterPDF/>
                </PDFViewer>
            </div>
        </div>
    );
}

export default Registrationform;

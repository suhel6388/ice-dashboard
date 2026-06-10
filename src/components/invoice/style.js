// Create styles
import {StyleSheet } from '@react-pdf/renderer';


 const styles = StyleSheet.create({
  page: { 
    backgroundColor:"#fff",
    color:"#262626",
    fontFamily:"Helvetica",
    fontSize:"12px",
    padding:"30px 50px"

  },
  
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    fontSize:14,
    marginBottom:40

  },

  title:{
    fontSize:20,

  },
  
  fontBold:{
    fontFamily:"Helvetica-Bold"

  },
  spaceY:{
    display:"flex",
    flexDirection:"column",
    gap:"8px"
  },
  margintop:{
marginTop:20
  },
 billTo:{
  marginBottom:5
    

  },
  table:{
    width:"100%",
    borderColor:"1px solid #f3f4f6",
    margin:"2px 0"

  },
  tableHeader:{
    backgroundColor:"#e5e5e5"
  },
  tdpadding:{
    padding:"6px"
  },
  w:{
    width:20
  },
  total:{
    marginTop:20,
    
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-end",
    gap:"40"
  },
});

   export default styles
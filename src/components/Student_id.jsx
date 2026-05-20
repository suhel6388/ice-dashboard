
import { supabase_client} from "../utils/supabaseClient";



const generateStudentID = async () => {



  const year = new Date().getFullYear();

  let srNo = 1;
  let newID = "";
  let exists = true;

  while (exists) {

    newID = `ICE${year}${srNo}`;

    // Check ID in Supabase
    const { data, error } = await supabase_client 
      .from("register_students")
      .select("student_id")
      .eq("student_id", newID);

    if (error) {
      console.log(error);
      return;
    }

    // If ID not exists
    if (data.length === 0) {
      exists = false;
    } else {
      srNo++;
    }
  }

  return newID;
};

export default generateStudentID;
import toast from "react-hot-toast";
import { supabase_client } from "../supabaseClient";

async function generateInstallments(studentId,studentName, installmentCount) {
  try {
    const { data: student, error } = await supabase_client
      .from("register_students")
      .select("student_id, course_fee, admision_date")
      .eq("student_id", studentId)
      .single();

    if (error || !student) {
      console.error(error);
      toast.error("Student not found");
      return;
    }

    const totalFee = Number(student.course_fee);
    if (!totalFee) {
      toast.error("Course fee not found");
      return;
    }

    // ✅ CHECK — if installments already exist, skip insert
    const { data: existing } = await supabase_client
      .from("installments")
      .select("id")
      .eq("student_id", studentId)
      .limit(1);

    if (existing && existing.length > 0) {
      console.warn("Installments already exist for this student, skipping...");
      toast.error("Installments already exist for this student, skipping...")
      return; // silent skip — no error shown to user
    }

    const amount = Math.round(totalFee / Number(installmentCount));
    const startDate = new Date(student.admision_date);
    const installments = [];

    for (let i = 1; i <= installmentCount; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));

      installments.push({
      
        student_id: studentId,
        s_name:studentName,
        installment_no: i,
        due_date: dueDate.toISOString().split("T")[0],
        amount: amount,
     
      });
    }

    const { error: insertError } = await supabase_client
      .from("installments")
      .insert(installments);

    if (insertError) {
      console.error(insertError);
      toast.error(insertError.message);
      return;
    }

    toast.success(`${installmentCount} installments created successfully`);
    return installments;

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
}

export default generateInstallments;
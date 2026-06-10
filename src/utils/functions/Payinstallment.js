import toast from "react-hot-toast";
import { supabase_client } from "../supabaseClient";
async function Installmentupdate(




  studentId,
  fee_amt
) {
  // Get all installments of student
  const { data: installments, error } =
    await supabase_client
      .from("installments")
      .select("*")
      .eq("student_id", studentId)
      .order("installment_no", {
        ascending: true,
      });

  if (error) {
    console.error(error);
    toast.error(error.message)
    return;
  }

  let balance = Number(fee_amt);

  for (const inst of installments) {
    const remainingAmount =
      Number(inst.amount) -
      Number(inst.paid_amount || 0);

    // Skip fully paid installments
    if (remainingAmount <= 0) continue;

    const payment = Math.min(
      balance,
      remainingAmount
    );

    const { error: updateError } =
      await supabase_client
        .from("installments")
        .update({
          paid_amount:
            Number(inst.paid_amount || 0) +
            payment,
          paid_date: new Date()
            .toISOString()
            .split("T")[0],
        })
        .eq("sr_no", inst.sr_no)
        .eq("student_id", studentId);

    if (updateError) {
      console.error(updateError);
      toast.error(updateError.message)
      return;
    }

    balance -= payment;

    if (balance <= 0) break;
  }

  console.log(
    `Payment distributed successfully`
  );
  toast.success( `Payment distributed successfully`)
}

export default Installmentupdate;
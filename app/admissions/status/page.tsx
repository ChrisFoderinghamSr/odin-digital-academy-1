// File introduced 2026-08-17 (fe05ed4).
import { redirect } from "next/navigation";

export default function AdmissionsStatusPage() {
  // The family portal verifies the guardian before displaying an application number or decision.
  redirect("/norse-one/admissions");
}

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

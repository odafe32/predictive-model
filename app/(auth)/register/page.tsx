import AuthForm from "@/components/forms/AuthForm";

export default function RegisterPage() {
  return (
    <div className="container py-5">
      <AuthForm mode="register" />
    </div>
  );
}

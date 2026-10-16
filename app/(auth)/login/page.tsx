import AuthForm from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <div className="container py-5">
      <AuthForm mode="login" />
    </div>
  );
}

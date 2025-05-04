
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <LoginForm />
      </div>
    </Layout>
  );
}

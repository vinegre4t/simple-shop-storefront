
import Layout from "@/components/layout/Layout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
}

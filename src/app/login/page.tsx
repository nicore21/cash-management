import LoginForm from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Neelam Enterprises</h1>
        <p className="text-center text-muted-foreground mb-6">Admin Login</p>
        <LoginForm />
      </div>
    </div>
  );
}

// app/(auth)/layout.tsx

// This layout applies ONLY to routes in the (auth) group
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The `auth-theme` class here activates the new styles from globals.css
    <div className="auth-theme">
      {children}
    </div>
  );
}
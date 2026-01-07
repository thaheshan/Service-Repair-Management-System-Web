export default function AdminLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6"><h2>SRM Admin</h2></aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}

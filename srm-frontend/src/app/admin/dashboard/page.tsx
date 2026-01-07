export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow"><h3>Total Shops</h3><p className="text-3xl font-bold">0</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3>Active Repairs</h3><p className="text-3xl font-bold">0</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3>Total Users</h3><p className="text-3xl font-bold">0</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3>Revenue</h3><p className="text-3xl font-bold">Rs. 0</p></div>
      </div>
    </div>
  );
}

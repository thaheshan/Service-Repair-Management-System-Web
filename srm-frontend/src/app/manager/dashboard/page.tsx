export default function ManagerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow"><h3>Pending</h3><p className="text-3xl font-bold">0</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3>In Progress</h3><p className="text-3xl font-bold">0</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><h3>Ready</h3><p className="text-3xl font-bold">0</p></div>
      </div>
    </div>
  );
}

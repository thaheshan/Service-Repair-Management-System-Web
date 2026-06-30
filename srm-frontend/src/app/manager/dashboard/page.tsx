export default function ManagerDashboard() {
  return (
    <div className="p-6 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground font-medium">Pending</h3>
          <p className="text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground font-medium">In Progress</h3>
          <p className="text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-muted-foreground font-medium">Ready</h3>
          <p className="text-3xl font-bold text-foreground">0</p>
        </div>
      </div>
    </div>
  );
}

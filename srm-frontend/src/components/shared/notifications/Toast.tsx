export default function Toast({ message, type }: any) {
  return <div className="fixed top-4 right-4 p-4 rounded shadow">{message}</div>;
}

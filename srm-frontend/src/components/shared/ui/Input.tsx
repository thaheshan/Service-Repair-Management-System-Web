export default function Input({ type = 'text', placeholder, value, onChange }: any) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="px-4 py-2 border rounded" />;
}

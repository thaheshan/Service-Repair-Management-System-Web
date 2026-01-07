export default function Button({ children, onClick, variant = 'primary' }: any) {
  return <button onClick={onClick} className="px-4 py-2 rounded">{children}</button>;
}

export default function SignupPage() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ffffff',
      zIndex: 9999,
      padding: '50px',
      overflow: 'auto'
    }}>
      <h1 style={{ 
        color: '#000000', 
        fontSize: '60px',
        fontWeight: 'bold',
        marginBottom: '30px',
        border: '3px solid red'
      }}>
        HELLO SIGNUP - BIG TEXT
      </h1>
      <p style={{
        color: '#000000',
        fontSize: '30px',
        backgroundColor: '#ffff00',
        padding: '20px'
      }}>
        This is a test paragraph with yellow background
      </p>
    </div>
  )
}
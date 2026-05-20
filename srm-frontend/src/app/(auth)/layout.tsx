/**
 * Auth Layout — forces light mode for all login, signup, and
 * password-reset pages regardless of the user's system/dashboard
 * theme preference.  The `.force-light` CSS class defined in
 * globals.css overrides all CSS variables back to their light
 * values, so the dark class on <html> has no effect here.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="force-light min-h-screen w-full bg-[#F9FAFB]">
      {children}
    </div>
  )
}

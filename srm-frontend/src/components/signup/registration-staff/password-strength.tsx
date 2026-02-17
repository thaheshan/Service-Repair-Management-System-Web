"use client"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getStrength(password)

  if (!password) return null

  return (
    <div className="mt-2 flex gap-1">
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={`h-1 flex-1 rounded-full transition-colors ${
            level <= strength
              ? strength <= 1
                ? "bg-[#EF4444]"
                : strength <= 2
                ? "bg-[#F59E0B]"
                : strength <= 3
                ? "bg-[#3B82F6]"
                : "bg-[#10B981]"
              : "bg-[#E5E7EB]"
          }`}
        />
      ))}
    </div>
  )
}

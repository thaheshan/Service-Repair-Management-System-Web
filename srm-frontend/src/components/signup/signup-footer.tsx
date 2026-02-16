'use client'

export function SignupFooter() {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

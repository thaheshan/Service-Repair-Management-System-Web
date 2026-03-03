'use client';


import { useState } from 'react';
import './Registration.scss';

const Registration = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPasswordStrength = (): { label: string; percent: number; color: string } => {
        const { password } = formData;
        if (!password) return { label: '', percent: 0, color: 'transparent' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { label: 'Weak', percent: 20, color: '#e74c3c' };
        if (score === 2) return { label: 'Fair', percent: 40, color: '#e67e22' };
        if (score === 3) return { label: 'Good', percent: 60, color: '#f1c40f' };
        if (score === 4) return { label: 'Strong', percent: 80, color: '#2ecc71' };
        return { label: 'Very Strong', percent: 100, color: '#27ae60' };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const strength = getPasswordStrength();

    return (
        <div className="registration">
            {/* Left Sidebar */}
            <aside className="registration__sidebar">
                <div className="registration__stepper">
                    <div className="registration__step registration__step--active">
                        <div className="registration__step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white" />
                            </svg>
                        </div>
                        <span className="registration__step-label">Account</span>
                    </div>

                    <div className="registration__step-line" />

                    <div className="registration__step">
                        <div className="registration__step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z" fill="white" />
                            </svg>
                        </div>
                        <span className="registration__step-label">Shop Details</span>
                    </div>

                    <div className="registration__step-line" />

                    <div className="registration__step">
                        <div className="registration__step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM6 20V4h5v7h7v9H6z" fill="white" />
                                <path d="M8 15h8v2H8v-2zm0-3h8v2H8v-2z" fill="white" />
                            </svg>
                        </div>
                        <span className="registration__step-label">Choose Plan</span>
                    </div>
                </div>

                <div className="registration__sidebar-illustration">
                    <div className="registration__illustration-card">
                        <div className="registration__illustration-image">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="30" r="14" fill="#5b6abf" />
                                <path d="M25 55c0-8.28 6.72-15 15-15s15 6.72 15 15" stroke="#5b6abf" strokeWidth="3" fill="none" />
                                <rect x="50" y="35" width="18" height="14" rx="3" fill="#7c8bef" stroke="white" strokeWidth="2" />
                                <line x1="54" y1="40" x2="64" y2="40" stroke="white" strokeWidth="2" />
                                <line x1="54" y1="44" x2="60" y2="44" stroke="white" strokeWidth="2" />
                            </svg>
                            <span className="registration__illustration-text">Signing Up</span>
                        </div>
                        <div className="registration__illustration-progress">
                            <div className="registration__illustration-progress-bar" />
                        </div>
                    </div>
                    <p className="registration__sidebar-tagline">
                        Create your free account in under 2 minutes
                    </p>
                </div>
            </aside>

            {/* Right Form Section */}
            <main className="registration__main">
                <form className="registration__form" onSubmit={handleSubmit}>
                    <span className="registration__step-indicator">Step 1 of 3</span>
                    <h1 className="registration__title">Create your account</h1>
                    <p className="registration__subtitle">Let's get started with basic information</p>

                    {/* Shop Name */}
                    <div className="registration__field">
                        <label className="registration__label">
                            Shop Name <span className="registration__required">*</span>
                        </label>
                        <div className="registration__input-wrapper">
                            <span className="registration__input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" fill="#9e9e9e" />
                                    <path d="M6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z" fill="#9e9e9e" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                name="shopName"
                                placeholder="TechFix Mobile Repairs"
                                value={formData.shopName}
                                onChange={handleChange}
                                className="registration__input"
                            />
                        </div>
                        <span className="registration__helper">This will be displayed to your customers</span>
                    </div>

                    {/* Email Address */}
                    <div className="registration__field">
                        <label className="registration__label">
                            Email Address <span className="registration__required">*</span>
                        </label>
                        <div className="registration__input-wrapper">
                            <span className="registration__input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="#9e9e9e" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="techfix09@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="registration__input"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="registration__field">
                        <label className="registration__label">
                            Phone Number <span className="registration__required">*</span>
                        </label>
                        <div className="registration__input-wrapper">
                            <span className="registration__input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" fill="#9e9e9e" />
                                </svg>
                            </span>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+94 77 123 4567"
                                value={formData.phone}
                                onChange={handleChange}
                                className="registration__input"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="registration__field">
                        <label className="registration__label">
                            Password <span className="registration__required">*</span>
                        </label>
                        <div className="registration__input-wrapper">
                            <span className="registration__input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" fill="#9e9e9e" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="registration__input"
                            />
                            <button
                                type="button"
                                className="registration__toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    {showPassword ? (
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#9e9e9e" />
                                    ) : (
                                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28C2.79 7.79 1.61 9.41.89 11.25a11.83 11.83 0 0013.22 6.93l2.02 2.02L19.73 22l1.27-1.27L3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#9e9e9e" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="registration__field">
                        <label className="registration__label">
                            Confirm Password <span className="registration__required">*</span>
                        </label>
                        <div className="registration__input-wrapper">
                            <span className="registration__input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" fill="#9e9e9e" />
                                </svg>
                            </span>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="registration__input"
                            />
                            <button
                                type="button"
                                className="registration__toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    {showConfirmPassword ? (
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#9e9e9e" />
                                    ) : (
                                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28C2.79 7.79 1.61 9.41.89 11.25a11.83 11.83 0 0013.22 6.93l2.02 2.02L19.73 22l1.27-1.27L3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#9e9e9e" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Password Strength */}
                    <div className="registration__strength">
                        <span className="registration__strength-label">Password strength</span>
                        <div className="registration__strength-bar">
                            <div
                                className="registration__strength-fill"
                                style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="registration__submit">
                        Continue
                    </button>

                    <p className="registration__login-link">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </form>
            </main>
        </div>
    );
};

export default Registration;

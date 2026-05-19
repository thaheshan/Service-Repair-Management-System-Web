import React, { useState } from 'react';
import './RoleSelection.scss';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: Role[] = [
    { id: 'admin', title: 'Administrator', description: 'Full system access and management', icon: '👨‍💼' },
    { id: 'technician', title: 'Technician', description: 'Manage repairs and service orders', icon: '🔧' },
    { id: 'customer', title: 'Customer', description: 'Track repairs and view history', icon: '👤' },
    { id: 'manager', title: 'Manager', description: 'Oversee operations and reports', icon: '📊' }
  ];

  const handleRoleClick = (roleId: string) => setSelectedRole(roleId);
  const handleContinue = () => selectedRole && onRoleSelect(selectedRole);

  return (
    <div className="role-selection">
      <div className="role-selection__container">
        <div className="role-selection__header">
          <img src="/all-fix-logo.png" alt="All Fix Logo" className="mx-auto mb-4" style={{ maxHeight: '130px', width: 'auto' }} />
          <h1 className="role-selection__title">Welcome to All Fix</h1>
          <p className="role-selection__subtitle">Select your role to continue</p>
        </div>

        <div className="role-selection__grid">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'role-card--selected' : ''}`}
              onClick={() => handleRoleClick(role.id)}
            >
              <div className="role-card__icon">{role.icon}</div>
              <h3 className="role-card__title">{role.title}</h3>
              <p className="role-card__description">{role.description}</p>
              {selectedRole === role.id && <div className="role-card__check">✓</div>}
            </div>
          ))}
        </div>

        <div className="role-selection__actions">
          <button className="role-selection__button" onClick={handleContinue} disabled={!selectedRole}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

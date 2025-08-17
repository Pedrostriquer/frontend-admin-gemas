import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import style from './UserProfileStyle';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  if (!user) {
    return <div>Carregando informações do usuário...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ name: user.name, email: user.email, phone: user.phone });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    console.log("Salvando dados:", formData);
    setIsEditing(false);
  };

  return (
    <div style={style.profileContainer}>
      <div style={style.profileCard}>
        <div style={style.cardHeader}>
          <div style={style.avatar}>
            <span>{formData.name ? formData.name.charAt(0).toUpperCase() : '?'}</span>
          </div>
          <div style={style.userInfo}>
            <h2 style={style.userName}>{formData.name}</h2>
            <p style={style.userRole}>{user.role}</p>
          </div>
          {!isEditing && (
            <button onClick={handleEditToggle} style={style.editButton}>
              <i className="fa-solid fa-pencil" style={{ marginRight: '8px' }}></i>
              Editar Perfil
            </button>
          )}
        </div>
        <div style={style.cardBody}>
          <div style={style.infoGrid}>
            <div style={style.infoItem}>
              <strong style={style.infoLabel}>Nome Completo:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{...style.inputBase, ...(!isEditing && style.inputReadOnly)}}
              />
            </div>
            <div style={style.infoItem}>
              <strong style={style.infoLabel}>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{...style.inputBase, ...(!isEditing && style.inputReadOnly)}}
              />
            </div>
            <div style={style.infoItem}>
              <strong style={style.infoLabel}>Telefone:</strong>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{...style.inputBase, ...(!isEditing && style.inputReadOnly)}}
              />
            </div>
            <div style={style.infoItem}>
              <strong style={style.infoLabel}>Status:</strong>
              <span style={{...style.statusBadge, ...(user.status === 1 ? style.statusActive : style.statusInactive)}}>
                {user.status === 1 ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
        {isEditing && (
          <div style={style.cardFooter}>
            <button onClick={handleEditToggle} style={style.cancelButton}>Cancelar</button>
            <button onClick={handleSaveChanges} style={style.saveButton}>Salvar Alterações</button>
          </div>
        )}
      </div>
    </div>
  );
}
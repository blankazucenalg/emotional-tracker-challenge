import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #34495e;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #3CABDB;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #3498db;
    text-decoration: underline;
  }
`;

export default function Profile() {
  const { user, updateProfile, updatePassword } = useContext(AuthContext);
  const router = useRouter();
  const [formDataProfile, setFormDataProfile] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : ''
  });
  const [formDataPassword, setFormDataPassword] = useState({
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    setFormDataProfile({
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: user ? user.phone : ''
    });
  }, [user])

  const handleChangeProfile = (e) => {
    const { name, value } = e.target;
    setFormDataProfile({ ...formDataProfile, [name]: value });
  };
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormDataPassword({ ...formDataPassword, [name]: value });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (formDataProfile.name.trim() === '') {
      alert('User name cannot be empty or spaces only');
      return;
    }
    if (formDataProfile.email.trim() === '') {
      alert('Email cannot be empty or spaces only');
      return;
    }

    try {
      await updateProfile({
        _id: user._id,
        name: formDataProfile.name,
        email: formDataProfile.email,
        phone: formDataProfile.phone
      });
      alert('Profile was updated');
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || 'Unknown error');
      alert(error.response?.data?.message || 'Failed to update');
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (formDataPassword.oldPassword !== '' && formDataPassword.newPassword !== '' && formDataPassword.oldPassword === formDataPassword.newPassword) {
      alert('Password cannot be the same as before');
      return;
    }

    try {
      await updatePassword({
        _id: user._id,
        oldPassword: formDataPassword.oldPassword,
        newPassword: formDataPassword.newPassword
      });
      alert('Password was updated');
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || 'Unknown error');
      alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <Layout title="Registro - Terapia Emocional">
      <FormContainer>
        <Title>Actualizar mi información</Title>

        <Form onSubmit={handleSubmitProfile}>
          <FormGroup>
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formDataProfile.name}
              onChange={handleChangeProfile}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formDataProfile.email}
              onChange={handleChangeProfile}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Teléfono</Label>
            <Input
              type="phone"
              id="phone"
              name="phone"
              value={formDataProfile.phone}
              onChange={handleChangeProfile}
              required
            />
          </FormGroup>
          <Button type="submit">Actualizar datos</Button>
        </Form>
      </FormContainer>

      <FormContainer>
        <Title>Actualizar contraseña</Title>

        <Form onSubmit={handleSubmitPassword}>
          <FormGroup>
            <Label htmlFor="oldPassword">Contraseña actual</Label>
            <Input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formDataPassword.password}
              onChange={handleChangePassword}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formDataPassword.newPassword}
              onChange={handleChangePassword}
              required
            />
          </FormGroup>

          <Button type="submit">Actualizar contraseña</Button>
        </Form>

      </FormContainer>
    </Layout>
  );
}
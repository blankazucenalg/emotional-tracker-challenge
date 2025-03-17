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
  const { user, updateProfile } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    setFormData({
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: user ? user.phone : '',
      oldPassword: '',
      newPassword: ''
    });
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.oldPassword !== '' && formData.newPassword !== '' && formData.oldPassword === formData.newPassword) {
      alert('Password cannot be the same as before');
      return;
    }

    try {
      await updateProfile({
        _id: user._id,
        name: formData.name,
        email: formData.email,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || 'Unknown error');
      alert('Failed to update');
    }
  };

  return (
    <Layout title="Registro - Terapia Emocional">
      <FormContainer>
        <Title>Crear una Cuenta</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nombre</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Teléfono</Label>
            <Input
              type="phone"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit">Actualizar datos</Button>
        </Form>

        <Title>Actualizar contraseña</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">Contraseña actual</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button type="submit">Actualizar contraseña</Button>
        </Form>

      </FormContainer>
    </Layout>
  );
}
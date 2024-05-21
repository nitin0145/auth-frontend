import React from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import { IconCheck, IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Center,
  Box,
  Progress,
} from '@mantine/core';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Contains at least 1 number.' },
  { re: /[a-z]/, label: 'Contains at least 1 letter.' },
  { re: /[$&+,:;=?@#|\'<>.^*()%!-]/, label: 'Contains at least 1 special character.' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const Authentication = (props: PaperProps) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const strength = getStrength(form.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(form.values.password)} />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={form.values.password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  const handleSubmit = async (values: typeof form.values) => {
    try {
      let response;
      console.log('Form submitted:', values); // Log form submission values

      if (type === 'register') {
        // Replace this with your actual signup API call
        response = await fetch('http://localhost:3000/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Signup failed');
        }
        alert('Signup successful!'); // Alert the user about successful signup

        toggle(); // Switch to login view after successful signup
      } else {
        // Replace this with your actual login API call
        response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        console.log('response',response)
        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);

        alert('Login successful!'); // Alert the user about successful login

        navigate('/dashboard'); // Redirect to dashboard after successful login
      }
    } catch (error:any) {
      console.error('Error during submission:', error); // Log the error
      alert(error.message); // Alert the user about the error
      
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Portal, {type} with
      </Text>

      <Divider labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Enter your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="Enter your email Id"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            placeholder="Enter your password"
            label="Password"
            required
          />

          {type === 'register' && (
            <Group gap={5} grow mt="xs" mb="md">
              {bars}
            </Group>
          )}

          {type === 'register' && (
            <PasswordRequirement label="Minimum length of 8 characters" meets={form.values.password.length > 7} />
          )}
          {type === 'register' && checks}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            <h3>
              {type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
            </h3>
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default Authentication;

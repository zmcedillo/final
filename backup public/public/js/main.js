
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); 

      // Obtén los valores de los campos
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      

      // Verifica si los campos están vacíos
      if (!username || !password) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      try {
        // Envía la solicitud de inicio de sesión al servidor
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          const { token,userId, role } = await response.json();
          localStorage.setItem('token', token); // Guarda el token en localStorage
          localStorage.setItem('userId', userId);
          localStorage.setItem('userRole', role);
          window.location.href = '/home.html'; // Redirige a la página principal
        } else {
          // Si la respuesta no es exitosa, muestra un mensaje de error
          const errorData = await response.json();
          alert(errorData.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
        }
      } catch (err) {
        console.error('Error durante el inicio de sesión:', err);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
      }
    });
  }
});
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware'); // Ajusta la ruta si es necesario
const jwt = require('jsonwebtoken');

// Simulamos la librería jsonwebtoken para no depender de tokens reales
jest.mock('jsonwebtoken');

describe('Pruebas de Middlewares de Autenticación', () => {
  let req, res, next;

  // Antes de cada prueba, reiniciamos los objetos req y res
  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    // Limpiamos los mocks
    jest.clearAllMocks(); 
  });

  describe('authMiddleware', () => {
    it('Debe retornar 401 si no se envía ningún token', () => {
      // Simulamos que el header no trae token
      req.header.mockReturnValue(undefined);

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No se encontro tu token de sesion, acceso denegado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('Debe llamar a next() y asignar el usuario si el token es válido', () => {
      // Simulamos un token válido en el header
      req.header.mockReturnValue('Bearer token_valido');
      
      // Simulamos que jwt.verify devuelve un objeto decodificado correcto
      const decodedMock = { userId: '123', role: 'user' };
      jwt.verify.mockReturnValue(decodedMock);

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(req.userId).toBe('123');
      expect(req.userRole).toBe('user');
      expect(next).toHaveBeenCalled(); // El middleware dejó pasar la petición
    });
  });

  describe('adminMiddleware', () => {
    it('Debe retornar 403 si el rol no es admin', () => {
      req.userRole = 'user'; // Simulamos un usuario normal

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('Debe llamar a next() si el rol es admin', () => {
      req.userRole = 'admin'; // Simulamos un administrador

      adminMiddleware(req, res, next);

      expect(next).toHaveBeenCalled(); // El middleware dejó pasar la petición
    });
  });
});
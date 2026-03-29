import { HttpStatus, type ArgumentsHost } from '@nestjs/common';
import { CartDomainExceptionFilter } from './cart-domain-exception.filter';
import { CartDomainError } from './cart.domain-error';

function createMockHost(): {
  host: ArgumentsHost;
  status: jest.Mock;
  json: jest.Mock;
} {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('CartDomainExceptionFilter', () => {
  const filter = new CartDomainExceptionFilter();

  it('STOCK_INSUFFICIENT -> 400 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'No hay stock suficiente para la cantidad solicitada';
    filter.catch(new CartDomainError('STOCK_INSUFFICIENT', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msg,
    });
  });

  it('INVALID_QUANTITY -> 400 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'La cantidad debe ser un entero mayor a cero';
    filter.catch(new CartDomainError('INVALID_QUANTITY', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msg,
    });
  });

  it('PRODUCT_NOT_FOUND -> 404 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'Producto no encontrado';
    filter.catch(new CartDomainError('PRODUCT_NOT_FOUND', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: msg,
    });
  });

  it('CART_NOT_FOUND -> 404 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'Carrito no encontrado';
    filter.catch(new CartDomainError('CART_NOT_FOUND', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: msg,
    });
  });

  it('CART_ITEM_NOT_FOUND -> 404 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'Línea de carrito no encontrada';
    filter.catch(new CartDomainError('CART_ITEM_NOT_FOUND', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: msg,
    });
  });

  it('CART_EMPTY -> 400 y { statusCode, message }', () => {
    const { host, status, json } = createMockHost();
    const msg = 'El carrito está vacío';
    filter.catch(new CartDomainError('CART_EMPTY', msg), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: msg,
    });
  });
});

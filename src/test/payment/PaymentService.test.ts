import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: 200,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '11111111',
    };
    const mockProcessPaymentResponse = {
      status: 'success',
      transactionId: 'txn_1234567890',
    };

    paymentAdapterMock.processPayment.mockImplementation(() => mockProcessPaymentResponse);

    // Act
    const result = paymentService.makePayment(mockPaymentDetails);

    // Assert
    expect(result).toEqual(`Payment successful. Transaction ID: ${mockProcessPaymentResponse.transactionId}`);
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(mockPaymentDetails);
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    const mockPaymentDetails: PaymentDetails = {
      amount: 200,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '11111111',
    };
    const mockProcessPaymentResponse = {
      status: 'failure',
      transactionId: null,
    };

    paymentAdapterMock.processPayment.mockImplementation(() => mockProcessPaymentResponse);

    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange
    const mockPaymentDetailsNegative: PaymentDetails = {
      amount: -200,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '11111111',
    };
    const mockPaymentDetailsUndefined: PaymentDetails = {
      amount: undefined,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '11111111',
    };

    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetailsNegative)).toThrow('Invalid payment amount');
    expect(() => paymentService.makePayment(mockPaymentDetailsUndefined)).toThrow('Invalid payment amount');
  });
});

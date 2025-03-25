module.exports = {
    initialiseTransaction: jest.fn().mockResolvedValue({
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: 'https://paystack.com/test_checkout',
        access_code: 'test_access_code',
        reference: 'test_ref_123'
      }
    })
  };
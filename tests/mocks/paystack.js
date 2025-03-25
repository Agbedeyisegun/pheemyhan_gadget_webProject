module.exports = {
    initialiseTransaction: jest.fn().mockResolvedValue({
      data: {
        authorization_url: 'https://paystack.com/test',
        reference: 'test_ref_123'
      }
    })
  };
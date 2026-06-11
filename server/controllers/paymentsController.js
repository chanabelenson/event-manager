import * as PaymentService from '../services/paymentService.js';

export const addPayment = async (req, res) => {
  const { id } = await PaymentService.addPayment(req.params.itemId, req.user.id, req.body);
  res.status(201).json({ id });
};

export const deletePayment = async (req, res) => {
  await PaymentService.deletePayment(req.params.id, req.user.id);
  res.json({ message: 'נמחק' });
};

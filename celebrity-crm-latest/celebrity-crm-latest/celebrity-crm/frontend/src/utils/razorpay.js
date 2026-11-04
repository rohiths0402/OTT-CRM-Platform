import {
  createRazorpayOrder,
  createSentRazorpayOrder,
  verifyRazorpayPayment,
  verifySentRazorpay,
} from "../api/paymentApi";

const loadCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load Razorpay."));
    document.body.appendChild(script);
  });

const openCheckout = (order, description, onSuccess) =>
  new Promise((resolve, reject) => {
    const box = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Celebrity CRM",
      description,
      handler: (response) => {
        onSuccess({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        })
          .then(resolve)
          .catch(reject);
      },
      modal: { ondismiss: () => resolve(null) },
    });
    box.open();
  });

export async function payWithRazorpay(payment, amount) {
  await loadCheckout();
  const order = await createRazorpayOrder(payment.id, amount);
  return openCheckout(
    order,
    `${payment.project} - ${payment.kind}`,
    (details) => verifyRazorpayPayment(payment.id, details),
  );
}

export async function payOutWithRazorpay(details) {
  await loadCheckout();
  const order = await createSentRazorpayOrder(details.amount);
  return openCheckout(
    order,
    `Payment to ${details.recipient}`,
    (razorpay) =>
      verifySentRazorpay({
        ...razorpay,
        recipient: details.recipient,
        upiId: details.upiId,
        note: details.note,
      }),
  );
}
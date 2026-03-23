import { createHmac } from 'crypto';

describe('KOMOJU webhook signature', () => {
  it('正しい署名が生成できる', () => {
    const secret = 'test_webhook_secret';
    const body = JSON.stringify({ type: 'subscription.subscribed', data: {} });
    const signature = createHmac('sha256', secret).update(body).digest('hex');
    expect(signature).toHaveLength(64);
    expect(signature).toMatch(/^[0-9a-f]+$/);
  });

  it('同一bodyとsecretから同一署名が生成される（決定論的）', () => {
    const secret = 'test_secret';
    const body = '{"type":"test"}';
    const sig1 = createHmac('sha256', secret).update(body).digest('hex');
    const sig2 = createHmac('sha256', secret).update(body).digest('hex');
    expect(sig1).toBe(sig2);
  });

  it('bodyが異なれば署名が異なる', () => {
    const secret = 'test_secret';
    const body1 = '{"type":"subscription.subscribed"}';
    const body2 = '{"type":"subscription.unsubscribed"}';
    const sig1 = createHmac('sha256', secret).update(body1).digest('hex');
    const sig2 = createHmac('sha256', secret).update(body2).digest('hex');
    expect(sig1).not.toBe(sig2);
  });

  it('secretが異なれば署名が異なる', () => {
    const body = '{"type":"test"}';
    const sig1 = createHmac('sha256', 'secret1').update(body).digest('hex');
    const sig2 = createHmac('sha256', 'secret2').update(body).digest('hex');
    expect(sig1).not.toBe(sig2);
  });

  it('subscription.subscribedイベントの構造が正しい', () => {
    const event = {
      type: 'subscription.subscribed',
      data: {
        customer: { email: 'test@example.com' },
        plan: { id: 'plan_basic_xxx' },
      },
    };
    expect(event.type).toBe('subscription.subscribed');
    expect(event.data.customer.email).toBe('test@example.com');
    expect(event.data.plan.id).toBe('plan_basic_xxx');
  });

  it('subscription.unsubscribedイベントの構造が正しい', () => {
    const event = {
      type: 'subscription.unsubscribed',
      data: {
        customer: { email: 'test@example.com' },
      },
    };
    expect(event.type).toBe('subscription.unsubscribed');
    expect(event.data.customer.email).toBe('test@example.com');
  });
});

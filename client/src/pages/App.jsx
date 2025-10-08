import React, { useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function App() {
  const [token, setToken] = useState('')
  const [amount, setAmount] = useState('200')
  const [coinPricing, setCoinPricing] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token])

  async function createWalletOrder() {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/male-user/payment/wallet/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount: Number(amount) })
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to create order')
      await openRazorpayCheckout(json.data, 'wallet')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCoinPricing() {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/male-user/payment/packages`, { headers })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to load pricing')
      setCoinPricing(json.data)
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function createCoinOrder(packageId) {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/male-user/payment/coin/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ packageId })
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to create coin order')
      await openRazorpayCheckout(json.data, 'coin')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function openRazorpayCheckout(orderData, type) {
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dating App',
        description: type === 'wallet' ? 'Wallet Recharge' : `Buy Coins`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/male-user/payment/verify`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })
            const verifyJson = await verifyRes.json()
            if (!verifyJson.success) throw new Error(verifyJson.message || 'Verification failed')
            setMessage(`${type === 'wallet' ? 'Wallet recharged' : 'Coins added'} successfully!`)
            resolve()
          } catch (e) {
            setMessage(e.message)
            reject(e)
          }
        },
        theme: { color: '#6C63FF' },
        modal: { ondismiss: () => setMessage('Payment cancelled') }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  }

  return (
    <div className="container">
      <header>
        <h1>Razorpay Payments</h1>
        <p>Wallet recharge and coin purchase (Test Mode)</p>
      </header>

      <section className="card">
        <h2>1) Set Auth Token</h2>
        <input
          placeholder="Paste JWT token"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <small>Get token via /male-user/login</small>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Wallet Recharge</h3>
          <div className="row">
            <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
            <button disabled={loading || !token} onClick={createWalletOrder}>Recharge</button>
          </div>
          <p className="hint">Amount is in rupees</p>
        </div>

        <div className="card">
          <h3>Buy Coins</h3>
          <button disabled={loading || !token} onClick={fetchCoinPricing}>Load Packages</button>
          <div className="pricing-list">
            {coinPricing.map(pkg => (
              <div key={pkg._id} className="pricing-item">
                <div>
                  <strong>{pkg.coin} Coins</strong>
                  <div>₹ {pkg.amount}</div>
                </div>
                <button disabled={loading} onClick={() => createCoinOrder(pkg._id)}>Buy</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {message && <div className="toast">{message}</div>}
    </div>
  )
}



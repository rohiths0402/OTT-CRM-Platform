
import { useEffect, useState } from 'react'
import { api } from '../../../../services/api/apiClient'
import './RevenueIntelligence.css'

const formatCurrency = (value) => {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatCompactCurrency = (value) => {
  const amount = Number(value || 0)

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`
  }

  return formatCurrency(amount)
}

export default function RevenueIntelligence() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    api.get('/admin/analytics/revenue/?days=30')
      .then((response) => {
        if (active) setData(response)
      })
      .catch((err) => {
        if (active) {
          setError(
            err.message || 'Unable to load revenue intelligence.'
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="sa-panel">
        Loading revenue intelligence...
      </div>
    )
  }

  if (error) {
    return (
      <div className="sa-panel" role="alert">
        {error}
      </div>
    )
  }

  if (!data) return null

  const metrics = [
    {
      label: 'Total recorded revenue',
      value: formatCompactCurrency(data.total_revenue),
      note: 'Subscriptions + advertising',
    },
    {
      label: 'Subscription purchases',
      value: formatCompactCurrency(data.subscription_revenue),
      note: `${data.subscription_transactions} transactions`,
    },
    {
      label: 'Advertising revenue',
      value: formatCompactCurrency(data.advertising_revenue),
      note: `${data.advertising_events} recorded events`,
    },
    {
      label: 'Recorded transactions',
      value: Number(
        data.subscription_transactions || 0
      ).toLocaleString('en-IN'),
      note: 'Subscription purchases only',
    },
  ]

  const trend = data.monthly_trend || []

  const maxRevenue = Math.max(
    1,
    ...trend.map((item) =>
      Number(item.total_revenue || 0)
    )
  )

  return (
    <div className="sa-revenue">

      <div className="sa-revenue-grid">
        {metrics.map((metric) => (
          <div className="sa-revenue-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </div>
        ))}
      </div>

      <div className="sa-revenue-chart">
        <div className="sa-revenue-heading">
          <div>
            <h4>Monthly revenue trend</h4>
            <p>Recorded revenue by month</p>
          </div>

          <span>Last {data.period_days} days</span>
        </div>

        {trend.length === 0 ? (
          <p className="sa-revenue-empty">
            No revenue records found for this period.
          </p>
        ) : (
          <div className="sa-revenue-bars">
            {trend.map((item) => {
              const subscription = Number(
                item.subscription_revenue || 0
              )

              const advertising = Number(
                item.advertising_revenue || 0
              )

              const total = subscription + advertising

              return (
                <div className="sa-revenue-month" key={item.month}>
                  <div className="sa-revenue-bar-value">
                    {formatCompactCurrency(total)}
                  </div>

                  <div
                    className="sa-revenue-bar"
                    title={`Subscriptions: ${formatCurrency(subscription)} | Advertising: ${formatCurrency(advertising)}`}
                  >
                    <div
                      className="sa-revenue-bar-subscription"
                      style={{
                        height: `${(subscription / maxRevenue) * 100}%`,
                      }}
                    />

                    <div
                      className="sa-revenue-bar-advertising"
                      style={{
                        height: `${(advertising / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>

                  <span>{item.month}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="sa-revenue-legend">
          <span>
            <i className="sa-legend-subscription" />
            Subscription purchases
          </span>

          <span>
            <i className="sa-legend-advertising" />
            Advertising revenue
          </span>
        </div>
      </div>

      <p className="sa-revenue-disclaimer">
        Subscription figures represent wallet-funded purchases,
        not independently verified external payment settlements.
        Advertising figures represent revenue recorded against
        advertising events, not verified advertiser settlements.
      </p>

    </div>
  )
}

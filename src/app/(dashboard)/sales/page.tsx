import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SalesHistoryPage() {
  const supabase = await createClient()
  
  const { data: sales, error } = await supabase
    .from('sales')
    .select(`
      id,
      receipt_no,
      total,
      payment_method,
      status,
      created_at,
      sale_items (
        product_name,
        quantity,
        unit_price
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-500 p-8">Error loading sales: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          Sales History
        </h2>
        <Link 
          href="/pos" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
        >
          + New Sale
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-50/50 border-b border-purple-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Receipt No</th>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Items</th>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Total</th>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-purple-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {sales && sales.length > 0 ? (
                sales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-purple-700">
                      {sale.receipt_no}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString()} <br/>
                      <span className="text-xs text-gray-400">
                        {new Date(sale.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sale.sale_items?.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          {item.quantity}x {item.product_name}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${Number(sale.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/sales/${sale.id}`}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-sm bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View & Print
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No sales found. Go to POS Terminal to make your first sale!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
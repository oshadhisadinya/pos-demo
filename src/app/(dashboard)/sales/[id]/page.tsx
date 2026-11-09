import { createClient } from '@/lib/supabase/server'
import PrintReceiptButton from './PrintReceiptButton'

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: sale, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (*)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (error) {
    return (
      <div className="p-10 bg-red-50 border-2 border-red-200 rounded-xl">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Database Error Found!</h1>
        <p className="text-red-600 mb-2">Message: {error.message}</p>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="p-10 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <h1 className="text-2xl font-bold text-yellow-700 mb-4">No Sale Found</h1>
      </div>
    )
  }

  let cashierName = 'Unknown'
  if (sale.cashier_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', sale.cashier_id)
      .single()
    
    if (profile?.full_name) {
      cashierName = profile.full_name
    }
  }

  return (
    // Added print:max-w-none print:m-0 to make it full width when printing
    <div className="max-w-3xl mx-auto space-y-6 p-8 print:max-w-none print:m-0 print:p-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          Receipt Details
        </h2>
        <PrintReceiptButton saleId={sale.id} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 overflow-hidden print:border-0 print:shadow-none">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center text-white">
          <h1 className="text-3xl font-bold">Roy&Joy</h1>
          <p className="text-purple-100 mt-1">Fabric Store</p>
        </div>

        <div className="p-8">
          <div className="mb-6 grid grid-cols-2 gap-4 border-b border-purple-100 pb-6">
            <div>
              <p className="text-gray-500 text-sm">Receipt No:</p>
              <p className="font-bold text-purple-700">{sale.receipt_no}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date:</p>
              <p className="font-bold">{new Date(sale.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cashier:</p>
              <p className="font-bold">{cashierName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Method:</p>
              <p className="font-bold capitalize">{sale.payment_method}</p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead className="border-b-2 border-purple-200">
              <tr>
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.sale_items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3">{item.product_name}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right font-bold">${Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-2xl font-bold text-right text-purple-800 border-t-2 border-purple-200 pt-4">
            Total: ${Number(sale.total).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
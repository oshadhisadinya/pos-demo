'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  price: number
  stock_qty: number
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

function useCartStore() {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((currentItem) => currentItem.id === item.id)

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem
        )
      }

      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  return { items, addItem, removeItem, updateQuantity, total, clearCart: () => setItems([]) }
}

export default function POSTerminal() {
  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock_qty')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (data) setProducts(data)
      setLoadingProducts(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCheckout = async () => {
    if (items.length === 0) return
    setIsCheckingOut(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Generate a simple receipt number
      const randomNum = Math.floor(100000 + Math.random() * 900000)
      const receiptNo = `RJ-${randomNum}`

      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          receipt_no: receiptNo,
          cashier_id: user.id,
          subtotal: total,
          discount: 0,
          total: total,
          payment_method: 'cash',
          status: 'completed'
        })
        .select()
        .single()

      if (saleError) throw saleError

      const saleItems = items.map(item => ({
        sale_id: saleData.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      alert(`✅ Sale completed successfully!\nReceipt: ${receiptNo}\nTotal: $${total.toFixed(2)}`)
      clearCart()
      router.push('/')
      
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert('❌ Checkout failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* LEFT: Product Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <div className="p-4 border-b border-purple-100 bg-purple-50/50">
          <input
            type="text"
            placeholder="🔍 Search fabrics, tools, or accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          {loadingProducts ? (
            <div className="col-span-full text-center py-12 text-purple-600">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                className="flex flex-col items-start p-4 bg-white border border-purple-100 rounded-xl hover:border-purple-400 hover:shadow-md transition-all text-left group"
              >
                <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                  <span className="text-3xl">🧵</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</p>
                <p className="text-xs text-purple-600 font-medium mt-1">Stock: {product.stock_qty}</p>
                <p className="text-lg font-bold text-purple-700 mt-2">${product.price.toFixed(2)}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Cart Summary */}
      <div className="w-96 bg-white rounded-2xl shadow-lg border border-purple-100 flex flex-col">
        <div className="p-4 border-b border-purple-100 bg-purple-50/50 rounded-t-2xl">
          <h3 className="font-bold text-gray-800 text-lg">Current Order</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-4xl mb-2">🛒</p>
              <p>Cart is empty</p>
              <p className="text-sm">Click products to add them</p>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white border border-purple-200 rounded-md text-purple-700 hover:bg-purple-50">-</button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white border border-purple-200 rounded-md text-purple-700 hover:bg-purple-50">+</button>
                  <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center bg-red-50 border border-red-200 rounded-md text-red-600 hover:bg-red-100 ml-1">×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-purple-100 bg-purple-50/30 rounded-b-2xl">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-purple-800 pt-2 border-t border-purple-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isCheckingOut ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              '💳 Process Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
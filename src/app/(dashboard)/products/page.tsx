'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  name: string
  sku: string
  price: number
  stock_qty: number
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')

  const supabase = createClient()

  // Fetch Products
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add Product
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('products')
      .insert([{ name, sku, price: parseFloat(price), stock_qty: parseInt(stock), is_active: true }])

    if (error) alert('Error adding product: ' + error.message)
    else {
      alert('Product added!')
      setShowForm(false)
      setName(''); setSku(''); setPrice(''); setStock('')
      fetchProducts() // Refresh list
    }
  }

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Error deleting: ' + error.message)
    else fetchProducts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          Products Inventory
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
        >
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <h3 className="font-bold text-gray-800 mb-4">New Product Details</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Product Name (e.g. Silk Fabric)" value={name} onChange={e => setName(e.target.value)} className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            <input required placeholder="SKU (e.g. FAB-009)" value={sku} onChange={e => setSku(e.target.value)} className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            <input required type="number" step="0.01" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            <input required type="number" placeholder="Stock Quantity" value={stock} onChange={e => setStock(e.target.value)} className="p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
            <button type="submit" className="md:col-span-2 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">Save Product</button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50/50 border-b border-purple-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">SKU</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{p.sku}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-sm font-bold text-purple-700">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.stock_qty}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
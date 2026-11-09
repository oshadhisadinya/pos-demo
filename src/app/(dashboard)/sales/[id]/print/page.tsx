'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PrintReceiptPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    // Auto print when page loads
    setTimeout(() => {
      window.print()
    }, 500)
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <button 
          onClick={() => window.print()}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        >
          Print Receipt
        </button>
      </div>
      
      {/* Same receipt content as detail page */}
      <div id="receipt-content" className="border-2 border-gray-300 p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Roy&Joy Fabric Store</h1>
        <p className="text-center text-gray-600 mb-6">Receipt #{params.id}</p>
        <p className="text-center">Loading receipt...</p>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
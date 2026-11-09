'use client'

export default function PrintReceiptButton({ saleId }: { saleId: string }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
    >
      Print Receipt
    </button>
  )
}
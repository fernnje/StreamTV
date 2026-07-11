import React, { useState } from 'react';
import { Heart, CreditCard, ArrowRight } from 'lucide-react';

export default function Donate() {
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Daftar nominal donasi cepat dalam Rupiah
  const presetAmounts = [10000, 50000, 100000, 500000];

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) setAmount(Number(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ganti URL di bawah ini dengan API pembayaran Anda (misal: Midtrans, Saweria, Trakteer)
    alert(`Terima kasih ${name}! Anda akan donasi sebesar Rp ${amount.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-red-50 rounded-full mb-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Dukung Karya Kami</h1>
          <p className="text-gray-500 mt-2">Berapapun donasi Anda sangat berarti untuk kelangsungan proyek ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilihan Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Nominal</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handlePresetClick(val)}
                  className={`py-3 rounded-xl font-semibold border text-center transition-all ${
                    amount === val && !customAmount
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Rp {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Input Nominal Khusus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Atau Masukkan Nominal Lain</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="Contoh: 250000"
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Form Data Diri */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Anda (Opsional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap atau Anonim"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Dukungan (Opsional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan penyemangat untuk kreator..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          >
            <span>Donasi Rp {amount.toLocaleString()}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Footer Keamanan */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <CreditCard className="w-4 h-4" />
          <span>Pembayaran aman dan terenkripsi.</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center px-4">
      <div className="flex flex-col items-center mb-6">
        <img
          src="/logo-banayenisanaeski.png"
          alt="Logo"
          style={{ width: '400px', height: 'auto', marginBottom: '0.5rem' }}
        />
        <h1 className="text-4xl md:text-6xl font-bold text-green-800">Banayenisanaeski</h1>
      </div>
      <p className="text-xl text-gray-700">Senin için eski olan benim işime yarayabilir</p>
      <p className="mt-2 text-md text-gray-500 max-w-xl">
        Türkiye’nin sürdürülebilir online hurdalığına hoş geldiniz. Aradığımız parçayı bularak veya elimizdekini satarak sürdürülebilir ekonomiye can veriyoruz.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md">
          Parça Ara
        </button>
        <button className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded-xl shadow-md">
          Parça Sat
        </button>
      </div>
      <footer className="mt-20 text-sm text-gray-400">
        © 2025 Banayenisanaeski | Gizlilik | Hakkımızda | İletişim
      </footer>
    </main>
  );
}
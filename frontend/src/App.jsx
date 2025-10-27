import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

function App() {  
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-96 w-96 animate-pulse rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 h-96 w-96 animate-pulse rounded-full bg-indigo-500 opacity-10 blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
        {/* Icon with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20"></div>
          <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-2xl">
            <GraduationCap className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Title with gradient */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-300 uppercase tracking-wider">
              Portal Pendidikan
            </span>
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            Selamat Datang
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-blue-200">
            di Portal Beasiswa
          </p>
          <p className="text-gray-400 max-w-md mt-4">
            Wujudkan impian pendidikan Anda dengan berbagai pilihan beasiswa yang tersedia
          </p>
        </div>

        {/* CTA Button with hover effects */}
        <a
          href="/register"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60"
        >
          <span className="relative z-10 flex items-center gap-2">
            Mulai Registrasi
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </a>

        {/* Additional info
        <div className="flex gap-8 mt-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-sm text-gray-400">Beasiswa Tersedia</p>
          </div>
          <div className="h-12 w-px bg-gray-700"></div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white">10k+</p>
            <p className="text-sm text-gray-400">Penerima Beasiswa</p>
          </div>
          <div className="h-12 w-px bg-gray-700"></div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-white">95%</p>
            <p className="text-sm text-gray-400">Tingkat Kepuasan</p>
          </div>
        </div> */}
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}

export default App;
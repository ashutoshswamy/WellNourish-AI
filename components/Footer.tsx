import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-16 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">WellNourish AI</span>
            <p className="text-slate-500 mt-4 max-w-xs leading-relaxed">
              Empowering your health journey with cutting-edge artificial intelligence. Personalized, scientific, and simple.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/#features" className="hover:text-emerald-600 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-sm text-slate-400">
             © {new Date().getFullYear()} WellNourish AI. All rights reserved.
           </div>
           <div className="flex space-x-6 text-sm text-slate-400">
             <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-200">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-200">Terms of Service</Link>
             <Link href="/cookies" className="hover:text-slate-600 dark:hover:text-slate-200">Cookies Policy</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}


import Link from "next/link";
import { CheckCircle2, ChevronLeft, Shield, Mail, Phone, Globe } from "lucide-react";

export default function TermsSubscription() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#001F3F] transition-colors font-bold text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2">
                 <img src="/umutulo_small_logo_120.png" alt="Umutulo Logo" className="w-8 h-8 rounded-full" />
                 <span className="text-xl font-black text-[#001F3F] tracking-tight">Umutulo</span>
            </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16">
        
        {/* Header */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-[#001F3F]">Terms & Subscription</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Transparent pricing and clear terms for your church's growth.
          </p>
        </section>

        {/* Overview & Trial */}
        <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-[#001F3F] mb-4">Overview</h2>
                <p className="text-slate-600 leading-relaxed theme-text">
                    Umutulo is a specialized SaaS platform designed to empower churches with modern financial tracking tools. We provide a secure, multi-tenant environment where churches can manage tithes, offerings, and member contributions effectively.
                </p>
            </div>
            <div className="bg-[#001F3F] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-[#FFD700]">🆓</span> 3-Month Free Trial
                </h2>
                <p className="text-blue-100 leading-relaxed mb-6">
                    Experience the full power of Umutulo completely free for your first 3 months. No credit card required to start.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD700]" /> Full access to all features
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD700]" /> Unlimited members
                    </li>
                </ul>
            </div>
        </section>

        {/* Pricing Table */}
        <section>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-[#001F3F] mb-4">Subscription Plans</h2>
                <p className="text-slate-500">Choose the plan that fits your congregation size.</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-6 text-sm font-black text-[#001F3F] uppercase tracking-wider">Plan</th>
                            <th className="p-6 text-sm font-black text-[#001F3F] uppercase tracking-wider">Ideal For</th>
                            <th className="p-6 text-sm font-black text-[#001F3F] uppercase tracking-wider">Monthly Price</th>
                            <th className="p-6 text-sm font-black text-[#001F3F] uppercase tracking-wider">Features</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-6 font-bold text-[#001F3F]">Small Church</td>
                            <td className="p-6 text-slate-600">Up to 100 members</td>
                            <td className="p-6 font-bold text-[#001F3F]">ZMW 150</td>
                            <td className="p-6 text-slate-600 text-sm">Tithe, Offering, Partnership tracking, Reports</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-6 font-bold text-[#001F3F]">Medium Church</td>
                            <td className="p-6 text-slate-600">Up to 300 members</td>
                            <td className="p-6 font-bold text-[#001F3F]">ZMW 300</td>
                            <td className="p-6 text-slate-600 text-sm">All in Small + Priority support</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-6 font-bold text-[#001F3F]">Large Church</td>
                            <td className="p-6 text-slate-600">300+ members</td>
                            <td className="p-6 font-bold text-[#001F3F]">ZMW 500</td>
                            <td className="p-6 text-slate-600 text-sm">All in Medium + Dedicated onboarding</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="text-center mt-6 text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                All plans include secure data storage and multi-user access.
            </p>
        </section>

        {/* Legal Terms */}
        <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-10">
            <div>
                <h3 className="text-xl font-bold text-[#001F3F] mb-4">Church Rights & Responsibilities</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Churches retain full ownership of their financial data. You are responsible for maintaining the confidentiality of your login credentials. Umutulo guarantees 99.9% uptime and daily backups of all contribution records.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-xl font-bold text-[#001F3F] mb-4">Data Ownership & Privacy</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Your data belongs to you. We do not sell, share, or analyze your church's financial data for third-party marketing. All data is encrypted at rest and in transit.
                    </p>
                </div>
                <div>
                     <h3 className="text-xl font-bold text-[#001F3F] mb-4">Confidentiality Clause</h3>
                     <p className="text-slate-600 leading-relaxed text-sm">
                        Umutulo employees and contractors are bound by strict non-disclosure agreements. We will never access your specific financial records unless explicitly requested by you for support purposes.
                     </p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-[#001F3F] mb-4">Subscription Termination</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                    You may cancel your subscription at any time. Upon cancellation, you will have a 30-day grace period to export your data before it is permanently archived. There are no cancellation fees.
                </p>
            </div>
        </section>

        {/* Contact Info */}
        <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-black mb-8 border-b border-slate-800 pb-4">Service Provider Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="font-bold text-[#FFD700] uppercase tracking-widest text-xs">Provider</p>
                    <p className="text-xl font-bold">Umutulo Digital Solutions</p>
                </div>
                <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#FFD700]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                            <a href="mailto:mpundumaloba23@gmail.com" className="hover:text-[#FFD700] transition-colors">mpundumaloba23@gmail.com</a>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#FFD700]">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                            <a href="tel:+260771584925" className="hover:text-[#FFD700] transition-colors">+260 771 584 925</a>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#FFD700]">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Website</p>
                            <a href="https://umutulo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors">https://umutulo.vercel.app</a>
                        </div>
                     </div>
                </div>
            </div>
        </section>

      </main>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm font-medium border-t border-slate-200">
        &copy; {new Date().getFullYear()} Umutulo Digital Solutions.
      </footer>
    </div>
  );
}

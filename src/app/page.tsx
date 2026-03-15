"use client";
import { useState, useEffect, useRef } from 'react';

import ubigeoData from '@/data/ubigeo.json';

const INTEREST_RATE_MONTHLY = 0.10;
const ADMIN_PHONE = "51922100353"; // Reemplaza con el número real del administrador

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function sliderBg(value: number, min: number, max: number) {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #00D289 0%, #00D289 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
}

interface UbigeoDistrict {
  name: string;
}

interface UbigeoProvince {
  name: string;
  distritos: string[];
}

interface UbigeoDepartment {
  name: string;
  provincias: UbigeoProvince[];
}

export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const [principal, setPrincipal] = useState(1000);
  const [months, setMonths] = useState(3);
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);
  const [form, setForm] = useState({
    fullName: '', dni: '', phone: '', email: '',
    department: '', province: '', district: '', address: '',
    job: '', incomeFreq: '', personalIncome: '', householdIncome: '',
    pep1: false, pep2: false, terms: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);

  // Ubigeo Options
  const [provinces, setProvinces] = useState<UbigeoProvince[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    const total = principal + (principal * INTEREST_RATE_MONTHLY * months);
    setTotalToPay(total);
    setMonthlyFee(total / months);
  }, [principal, months]);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        fullNameRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [step]);

  // Update provinces when department changes
  useEffect(() => {
    if (form.department) {
      const selectedDept = (ubigeoData as UbigeoDepartment[]).find(d => d.name === form.department);
      setProvinces(selectedDept ? selectedDept.provincias : []);
    } else {
      setProvinces([]);
    }
  }, [form.department]);

  // Update districts when province changes
  useEffect(() => {
    if (form.province) {
      const selectedProv = provinces.find(p => p.name === form.province);
      setDistricts(selectedProv ? selectedProv.distritos : []);
    } else {
      setDistricts([]);
    }
  }, [form.province, provinces]);

  const scheduleDates = Array.from({ length: months }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + 30 * (i + 1));
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola PrestaFácil 👋,\n\nSolicito mi préstamo:\n\n*Préstamo:*\n- Monto: S/ ${principal}\n- Plazo: ${months} meses\n- Cuota: S/ ${formatCurrency(monthlyFee)}\n- Total: S/ ${formatCurrency(totalToPay)}\n\n*Mis datos:*\n- Nombre: ${form.fullName}\n- DNI: ${form.dni}\n- Celular: ${form.phone}\n- Email: ${form.email}\n- Ubicación: ${form.department}, ${form.province}, ${form.district}\n- Domicilio: ${form.address}\n- Trabajo: ${form.job} | Frec: ${form.incomeFreq}\n- Ing. Personal: S/ ${form.personalIncome}\n- Ing. Hogar: S/ ${form.householdIncome}\n\n✅ Declaro no ser PEP ni familiar\n✅ Acepto Términos y Condiciones\n\n¡Gracias!`;
    window.open(`https://api.whatsapp.com/send?phone=${ADMIN_PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-800";
  const selectClass = inputClass + " appearance-none";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar omitted for brevity but remains the same */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <span className="text-3xl">💸</span>
            <span>Presta<span className="text-secondary">Fácil</span></span>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#como-funciona" className="hover:text-secondary transition-colors">¿Cómo funciona?</a>
            <a href="#beneficios" className="hover:text-secondary transition-colors">Beneficios</a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold shadow-sm"
            >
              Cotizar AHORA
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <a href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-lg font-bold text-slate-700">¿Cómo funciona?</a>
            <a href="#beneficios" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-lg font-bold text-slate-700">Beneficios</a>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
              className="w-full py-4 rounded-xl bg-primary text-white font-black text-center shadow-lg"
            >
              Cotizar AHORA
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0D1B2A] via-primary to-[#1B263B] pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-400/10 rounded-full blur-[100px] -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

            {/* Left Content */}
            <div className="flex-1 text-white text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold tracking-wide uppercase mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                100% Online y Seguro
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Créditos Online <br />
                <span className="bg-gradient-to-r from-teal-300 to-secondary bg-clip-text text-transparent">al Instante</span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Olvídate de las colas. Recibe el dinero que necesitas hoy mismo con un proceso transparente y sin papeleos.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                {[
                  'Respuesta en 5 min',
                  'Sin trámites físicos',
                  'Tasa competitiva',
                  'Dinero 24/7'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Calculator */}
            <div className="w-full max-w-lg">
              <div className="bg-white rounded-[2.5rem] shadow-xl-soft border border-slate-100 overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                {step === 1 ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-50/80 p-8 border-b border-slate-100 text-center">
                      <h2 className="text-2xl font-black text-primary mb-1">Cotiza tu Préstamo</h2>
                      <p className="text-sm font-medium text-slate-500 italic">"Elige cuánto necesitas y en cuánto tiempo"</p>
                    </div>

                    <div className="p-8 lg:p-10 space-y-10">
                      {/* Amount */}
                      <div>
                        <div className="flex justify-between items-center mb-5">
                          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Monto Solicitado</label>
                          <div className="text-3xl font-black text-primary">S/ {principal.toLocaleString('es-PE')}</div>
                        </div>
                        <input
                          type="range" className="styled-slider"
                          min={100} max={5000} step={100}
                          value={principal} onChange={e => setPrincipal(+e.target.value)}
                          style={{ background: sliderBg(principal, 100, 5000) }}
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
                          <span>S/ 100</span><span>S/ 5,000</span>
                        </div>
                      </div>

                      {/* Term */}
                      <div>
                        <div className="flex justify-between items-center mb-5">
                          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Meses a pagar</label>
                          <div className="text-3xl font-black text-primary">{months} <span className="text-lg text-slate-400 font-bold">meses</span></div>
                        </div>
                        <input
                          type="range" className="styled-slider"
                          min={1} max={12} step={1}
                          value={months} onChange={e => setMonths(+e.target.value)}
                          style={{ background: sliderBg(months, 1, 12) }}
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
                          <span>1 mes</span><span>12 meses</span>
                        </div>
                      </div>

                      {/* Summary Box */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 border border-slate-200">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-4 px-1">
                          <span>Cuota Mensual</span>
                          <span className="text-xl text-slate-800">S/ {formatCurrency(monthlyFee)}</span>
                        </div>
                        <div className="pt-5 border-t border-slate-200 flex justify-between items-end px-1">
                          <span className="text-sm font-black text-primary uppercase tracking-widest">Total a Pagar</span>
                          <div className="text-3xl font-black text-secondary leading-none">S/ {formatCurrency(totalToPay)}</div>
                        </div>

                        {/* Scrollable Schedule */}
                        <div className="mt-6 pt-5 border-t border-dashed border-slate-300">
                          <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] mb-4">Cronograma Referencial</div>
                          <ul className="schedule-list max-h-44 overflow-y-auto pr-2 space-y-2">
                            {scheduleDates.map((date, i) => (
                              <li key={i} className="bg-white px-4 py-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs shadow-sm">
                                <span className="font-bold text-slate-700">Cuota {i + 1}</span>
                                <span className="font-semibold text-slate-400">{date}</span>
                                <span className="font-black text-slate-800 tracking-tight">S/ {formatCurrency(monthlyFee)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-5 rounded-[1.5rem] bg-secondary text-white font-black text-xl shadow-glow hover:shadow-glow-hover hover:-translate-y-1 active:translate-y-0 transition-all duration-300 uppercase tracking-wider"
                      >
                        ¡Solicitar Préstamo!
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-50/80 p-8 border-b border-slate-100 text-center">
                      <h2 className="text-2xl font-black text-primary mb-1">Tus Datos</h2>
                      <p className="text-sm font-medium text-slate-500">Completa para recibir tu evaluación.</p>
                    </div>
                    <div className="p-8 lg:p-10">
                      <div className="flex justify-between items-center mb-8 px-4 py-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                        <span className="text-sm font-bold text-slate-500 uppercase">Monto</span>
                        <span className="text-2xl font-black text-secondary">S/ {principal.toLocaleString('es-PE')}</span>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Nombres Completos</label>
                          <input
                            ref={fullNameRef}
                            type="text" className={inputClass} required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Ej: Juan Pérez"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">DNI</label>
                            <input type="text" className={inputClass} pattern="[0-9]{8}" maxLength={8} required value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Celular</label>
                            <input type="tel" className={inputClass} pattern="[0-9]{9}" maxLength={9} required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="987..." />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Correo</label>
                          <input type="email" className={inputClass} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="hola@ejemplo.com" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Departamento</label>
                            <div className="relative">
                              <select
                                className={selectClass}
                                required
                                value={form.department}
                                onChange={e => setForm({ ...form, department: e.target.value, province: '', district: '' })}
                              >
                                <option value="" disabled>Elegir...</option>
                                {(ubigeoData as UbigeoDepartment[]).map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Provincia</label>
                            <div className="relative">
                              <select
                                className={selectClass}
                                required
                                disabled={!form.department}
                                value={form.province}
                                onChange={e => setForm({ ...form, province: e.target.value, district: '' })}
                              >
                                <option value="" disabled>Elegir...</option>
                                {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Distrito</label>
                            <div className="relative">
                              <select
                                className={selectClass}
                                required
                                disabled={!form.province}
                                value={form.district}
                                onChange={e => setForm({ ...form, district: e.target.value })}
                              >
                                <option value="" disabled>Elegir...</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Domicilio Actual</label>
                            <input type="text" className={inputClass} required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Ocupación / Trabajo</label>
                            <input type="text" className={inputClass} required value={form.job} onChange={e => setForm({ ...form, job: e.target.value })} placeholder="Ej: Vendedor" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Frecuencia de Ingresos</label>
                            <div className="relative">
                              <select className={selectClass} required value={form.incomeFreq} onChange={e => setForm({ ...form, incomeFreq: e.target.value })}>
                                <option value="" disabled>Elegir...</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Quincenal">Quincenal</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Diario">Diario</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Ingreso Personal S/</label>
                            <input type="number" className={inputClass} required value={form.personalIncome} onChange={e => setForm({ ...form, personalIncome: e.target.value })} placeholder="0.00" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase ml-2 mb-1 block">Ingreso Hogar S/</label>
                            <input type="number" className={inputClass} required value={form.householdIncome} onChange={e => setForm({ ...form, householdIncome: e.target.value })} placeholder="0.00" />
                          </div>
                        </div>

                        {/* PEP Checks */}
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 accent-primary" required checked={form.pep1} onChange={e => setForm({ ...form, pep1: e.target.checked })} />
                            <span className="text-[11px] font-bold text-slate-600 leading-tight">NO soy Persona Expuesta Políticamente (PEP)</span>
                          </label>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 accent-primary" required checked={form.pep2} onChange={e => setForm({ ...form, pep2: e.target.checked })} />
                            <span className="text-[11px] font-bold text-slate-600 leading-tight">NO soy pariente de PEP hasta 2do grado</span>
                          </label>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer px-1">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-secondary" required checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} />
                          <span className="text-[11px] font-semibold text-slate-400 italic">He leído y acepto los términos y condiciones.</span>
                        </label>

                        <div className="flex flex-col gap-3 pt-4">
                          <button type="submit" className="w-full py-4 rounded-2xl bg-secondary text-white font-black text-lg shadow-glow hover:shadow-glow-hover transition-all">
                            Enviar Solicitud
                          </button>
                          <button type="button" onClick={() => setStep(1)} className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-200 transition-all">
                            ← Regresar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Icons Grid */}
      <section id="beneficios" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-primary mb-6">¿Por qué elegir PrestaFácil?</h2>
            <p className="text-lg text-slate-500 font-medium">Hemos digitalizado el crédito para que sea justo, rápido y seguro para todos los peruanos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '⚡',
                title: 'Transferencia Directa',
                desc: 'Sin intermediarios. Una vez aprobado, el dinero se deposita en tu cuenta bancaria de inmediato.'
              },
              {
                emoji: '🔒',
                title: 'Privacidad Total',
                desc: 'Tu información está protegida con los estándares más altos de seguridad digital. No vendemos tus datos.'
              },
              {
                emoji: '📈',
                title: 'Tasa Referencial Plana',
                desc: 'Calcula tu cuota y paga lo justo. Sin cobros sorpresa, seguros obligatorios o letras pequeñas.'
              }
            ].map(b => (
              <div key={b.title} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl-soft transition-all duration-500 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-sm group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  {b.emoji}
                </div>
                <h3 className="text-xl font-black text-primary mb-4">{b.title}</h3>
                <p className="text-slate-500 font-semibold leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary pt-20 pb-10 text-slate-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-12 mb-12 gap-8">
            <div className="flex items-center gap-2 text-3xl font-extrabold text-white">
              <span>💸</span>
              <span>Presta<span className="text-secondary">Fácil</span></span>
            </div>
            <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-white/60">
              <a href="#" className="hover:text-secondary transition-colors">Legal</a>
              <a href="#" className="hover:text-secondary transition-colors">Privacidad</a>
              <a href="#" className="hover:text-secondary transition-colors">Cookies</a>
            </div>
          </div>
          <div className="text-center text-xs font-bold uppercase tracking-widest opacity-30">
            &copy; 2026 PrestaFácil Soluciones Financieras SAC. Hecho con ❤️ para Perú.
          </div>
        </div>
      </footer>

      {/* Custom Styles for Slider */}
      <style jsx global>{`
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-emerald-50">
      <div 
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden"
        style={{ border: "0.5px solid #d4c5b0" }}
      >
        <div className="w-24 h-24 mb-6 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide text-emerald-900">
          Paiement Réussi !
        </h1>
        <p className="text-emerald-700 font-medium mb-6 leading-relaxed">
          Merci pour votre commande. Votre paiement a bien été reçu et votre colis est en cours de préparation.
        </p>

        <div className="w-full bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-8">
          <p className="text-sm text-emerald-800">
            Un e-mail / message de confirmation supplémentaire vous parviendra d'ici quelques minutes.
          </p>
        </div>

        <Link 
          href="/"
          className="w-full py-4 bg-emerald-800 text-white rounded-xl uppercase tracking-[0.2em] text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}

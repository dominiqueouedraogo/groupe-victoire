import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Star, Lock } from "lucide-react";
import { Link } from "wouter";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-gray-100 shadow-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-orange-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl font-bold font-serif">Contenu Premium</DialogTitle>
              <p className="text-white/80 text-xs">Accès réservé aux membres</p>
            </div>
          </div>
          <DialogDescription className="text-white/80 text-sm">
            Ce contenu est réservé aux membres Premium. Débloquez toutes les annales corrigées et ressources exclusives.
          </DialogDescription>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
            <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">OM</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Orange Money</p>
              <p className="text-xs text-gray-500">Envoyez le montant au <strong>0504763249</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">W</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Wave</p>
              <p className="text-xs text-gray-500">Envoyez le montant au <strong>0798625467</strong></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild variant="outline" className="flex-1 rounded-xl border-gray-200 h-11" onClick={onClose}>
              <a href="https://wa.me/2250504763249" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                Contacter sur WhatsApp
              </a>
            </Button>
            <Button asChild className="flex-1 bg-primary hover:bg-orange-600 text-white rounded-xl h-11 shadow-sm shadow-orange-200" onClick={onClose}>
              <Link href="/premium">
                <Star className="mr-2 h-4 w-4" /> Voir les tarifs
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

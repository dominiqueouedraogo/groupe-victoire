import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Contenu Premium</DialogTitle>
          <DialogDescription className="text-base">
            Ce contenu est réservé aux membres Premium. Débloquez toutes les annales corrigées et ressources exclusives.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-orange-900 dark:text-orange-400">Orange Money</p>
              <p className="text-sm text-muted-foreground">Envoyez le montant à +221 77 XXX XXXX via Orange Money</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-400">Wave</p>
              <p className="text-sm text-muted-foreground">Envoyez le montant à +221 77 XXX XXXX via Wave</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button asChild variant="outline" className="flex-1" onClick={onClose}>
            <a href="https://wa.me/221XXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
              Contacter sur WhatsApp
            </a>
          </Button>
          <Button asChild className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white" onClick={onClose}>
            <Link href="/premium">Devenir Premium</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

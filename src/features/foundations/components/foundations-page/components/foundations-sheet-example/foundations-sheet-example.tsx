"use client";

import { Button } from "@fradelli/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@fradelli/ui/sheet";

export function FoundationsSheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir painel</Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel="Fechar painel">
        <SheetHeader>
          <SheetTitle>Painel de exemplo</SheetTitle>
          <SheetDescription>
            Conteúdo neutro para validar foco, teclado e sobreposição.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Concluir</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

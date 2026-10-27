import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Notificacao {
  readonly mensagem = signal<string | null>(null);

  mostrarSucesso(mensagem: string): void {
    this.mensagem.set(mensagem);
  }

  fechar(): void {
    this.mensagem.set(null);
  }
}
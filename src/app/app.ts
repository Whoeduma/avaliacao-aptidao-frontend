
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy
} from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { InscricaoService } from './core/services/inscricao';
import { Notificacao } from './core/services/notificacao';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  private readonly inscricaoService = inject(InscricaoService);
  readonly avisoArmazenamento = this.inscricaoService.avisoArmazenamento.asReadonly();
  private readonly notificacao = inject(Notificacao);

  readonly mensagemSucesso = this.notificacao.mensagem;

  readonly totalInscritos = computed(
    () => this.inscricaoService.inscricoes().length
  );

  private temporizador?: ReturnType<typeof setTimeout>;

  constructor() {
    effect((onCleanup) => {
      const mensagem = this.mensagemSucesso();

      if (!mensagem) {
        return;
      }

      const temporizador = setTimeout(() => {
        this.notificacao.fechar();
      }, 2500);

      this.temporizador = temporizador;

      onCleanup(() => {
        clearTimeout(temporizador);
      });
    });
  }

  fecharNotificacao(): void {
    this.notificacao.fechar();
  }

  ngOnDestroy(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }
  }
}

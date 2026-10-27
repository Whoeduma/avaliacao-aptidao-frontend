import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InscricaoService } from './core/services/inscricao';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly inscricaoService = inject(InscricaoService);

  readonly totalInscritos = computed(
    () => this.inscricaoService.inscricoes().length
  );
}
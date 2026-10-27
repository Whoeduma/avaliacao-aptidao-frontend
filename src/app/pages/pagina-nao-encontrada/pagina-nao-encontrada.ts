import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [RouterLink],
  template: `<section class="pagina-nao-encontrada">
    <h1>Página não encontrada</h1>
    <p>O endereço acessado não existe.</p>
    <a routerLink="/inscricoes">Voltar às inscrições</a>
  </section>`,
  styles: [`.pagina-nao-encontrada { max-width: 72rem; margin: 3rem auto; padding: 1rem; text-align: center; }
    .pagina-nao-encontrada a { color: #174ea6; }`]
})
export class PaginaNaoEncontrada {}

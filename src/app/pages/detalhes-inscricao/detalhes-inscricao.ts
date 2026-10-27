
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { InscricaoService } from '../../core/services/inscricao';

@Component({
  selector: 'app-detalhes-inscricao',
  imports: [RouterLink],
  templateUrl: './detalhes-inscricao.html',
  styleUrl: './detalhes-inscricao.css'
})
export class DetalhesInscricao {
  private readonly route = inject(ActivatedRoute);
  private readonly inscricaoService = inject(InscricaoService);

  readonly email = this.route.snapshot.paramMap.get('email') ?? '';

  readonly inscricao = computed(() =>
    this.inscricaoService.inscricoes().find(
      inscricao => inscricao.email === this.email
    )
  );

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}

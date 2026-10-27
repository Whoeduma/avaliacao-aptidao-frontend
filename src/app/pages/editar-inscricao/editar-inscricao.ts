import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InscricaoService } from '../../core/services/inscricao';
import { Distancia } from '../../dominio/inscricao.regras';
import { Notificacao } from '../../core/services/notificacao';

@Component({
  selector: 'app-editar-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar-inscricao.html',
  styleUrl: './editar-inscricao.css'
})
export class EditarInscricao {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inscricaoService = inject(InscricaoService);
  private readonly notificacao = inject(Notificacao);

  readonly email = this.route.snapshot.paramMap.get('email') ?? '';
  readonly inscricao = this.inscricaoService.obterPorEmail(this.email);

  nome = this.inscricao?.nome ?? '';
  nascimento = this.inscricao?.nascimento ?? '';
  distancia: Distancia = this.inscricao?.distancia ?? 'KM_5';

  erro = '';

  salvar(): void {
    this.erro = '';

    const resultado = this.inscricaoService.editar(this.email, {
      nome: this.nome,
      nascimento: this.nascimento,
      distancia: this.distancia
    });

    if (!resultado.sucesso) {
      const mensagens: Record<string, string> = {
        NOME_INVALIDO: 'Informe um nome válido, entre 3 e 100 caracteres.',
        DATA_INVALIDA: 'Informe uma data de nascimento válida.',
        IDADE_MINIMA: 'O participante precisa ter pelo menos 14 anos na data da prova.',
        DISTANCIA_NAO_PERMITIDA: 'Menores de 18 anos só podem participar dos 5 km.',
        INSCRICAO_NAO_ENCONTRADA: 'Inscrição não encontrada.',
        ERRO_ARMAZENAMENTO: 'Não foi possível salvar. Tente novamente.'
      };

      this.erro = mensagens[resultado.erro] ?? 'Não foi possível salvar a inscrição.';
      return;
    }

    
      this.notificacao.mostrarSucesso(
        'Inscrição atualizada com sucesso!'
      );

      this.router.navigate(['/inscricoes']);

  }
}

import { routes } from './app.routes';
import { PaginaNaoEncontrada } from './pages/pagina-nao-encontrada/pagina-nao-encontrada';

describe('Rotas', () => {
  it('exibe página não encontrada para endereço desconhecido', () => {
    expect(routes.at(-1)).toMatchObject({ path: '**', component: PaginaNaoEncontrada });
  });

  it('mantém detalhes e edição acessíveis por e-mail', () => {
    const inscricoes = routes.find(rota => rota.path === 'inscricoes');
    expect(inscricoes?.children?.map(rota => rota.path)).toContain(':email');
    expect(inscricoes?.children?.map(rota => rota.path)).toContain(':email/editar');
  });
});

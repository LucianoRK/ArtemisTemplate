// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
}

// ─── Usuario ──────────────────────────────────────────────────────────────────

export type UsuarioRole = "admin" | "membro";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: UsuarioRole;
  empresa_id: number;
  empresa?: Empresa;
  ativo: boolean;
  deleted_at?: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CriarUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  role: UsuarioRole;
}

export interface AtualizarUsuarioRequest {
  nome?: string;
  email?: string;
  senha?: string;
  role?: UsuarioRole;
}

// ─── Empresa ──────────────────────────────────────────────────────────────────

export interface Empresa {
  id: number;
  nome: string | null;
  documento: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  deleted_at?: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CriarEmpresaRequest {
  nome?: string;
  documento?: string;
  email?: string;
  telefone?: string;
}

export interface AtualizarEmpresaRequest {
  nome?: string;
  documento?: string;
  email?: string;
  telefone?: string;
}

// ─── Plano ────────────────────────────────────────────────────────────────────

export type PlanoIntervalo = "mensal" | "anual";

export interface Plano {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  valor?: string;
  intervalo: PlanoIntervalo;
  mp_preference_id?: string;
  recursos: string[];
  ativo?: boolean;
  criado_em?: string;
}

// ─── Assinatura ───────────────────────────────────────────────────────────────

export interface Assinatura {
  id: number;
  empresa_id: number;
  plano_id: number;
  plano?: Plano;
  data_inicio: string;
  data_fim: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CriarAssinaturaRequest {
  planoId: number;
  data_inicio: string;
  data_fim: string;
}

// ─── Pagamento ────────────────────────────────────────────────────────────────

export type PagamentoStatus = "pago" | "pendente" | "falhou" | "reembolsado";

export interface Pagamento {
  id: number;
  assinatura_id: number;
  assinatura?: Assinatura;
  valor: number;
  status: PagamentoStatus;
  transaction_id: string;
  data_pagamento: string;
  criado_em: string;
}

export interface RegistrarPagamentoRequest {
  assinaturaId: number;
  valor: number;
  status: PagamentoStatus;
  transaction_id: string;
  data_pagamento: string;
}

// ─── Configuracao ─────────────────────────────────────────────────────────────

export interface Configuracao {
  id: number;
  chave: string;
  valor: string;
  criado_em: string;
  atualizado_em: string;
}

export interface CriarConfiguracaoRequest {
  chave: string;
  valor: string;
}

export interface AtualizarConfiguracaoRequest {
  valor: string;
}

// ─── Log ──────────────────────────────────────────────────────────────────────

export interface Log {
  id: number;
  entidade: string;
  entidade_id: number | null;
  acao: string;
  usuario?: Pick<Usuario, "id" | "nome" | "email">;
  criado_em: string;
}

// ─── Notificacao ──────────────────────────────────────────────────────────────

export type NotificacaoTipo = "info" | "sucesso" | "aviso" | "erro";

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: NotificacaoTipo;
  lida: boolean;
  usuario_id: number;
  criado_em: string;
}

export interface NotificacoesNaoLidasResponse {
  total: number;
}

// ─── Chamado ──────────────────────────────────────────────────────────────────

export type ChamadoStatus = "aberto" | "respondido" | "fechado";
export type ChamadoPrioridade = "baixa" | "media" | "alta";

export interface ChamadoMensagem {
  id: number;
  chamado_id: number;
  usuario_id: number;
  usuario?: Pick<Usuario, "id" | "nome" | "email">;
  mensagem: string;
  interno: boolean;
  criado_em: string;
}

export interface Chamado {
  id: number;
  assunto: string;
  status: ChamadoStatus;
  prioridade: ChamadoPrioridade;
  usuario_id: number;
  usuario?: Pick<Usuario, "id" | "nome" | "email">;
  empresa_id: number;
  mensagens?: ChamadoMensagem[];
  criado_em: string;
  atualizado_em: string;
}

export interface CriarChamadoRequest {
  assunto: string;
  prioridade: ChamadoPrioridade;
}

export interface AdicionarMensagemRequest {
  mensagem: string;
  interno: boolean;
}

export interface AtualizarChamadoRequest {
  status?: ChamadoStatus;
  prioridade?: ChamadoPrioridade;
}

// ─── Paginação ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

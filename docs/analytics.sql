-- Consultas de acompanhamento (rodar no SQL Editor do Neon).
-- Tabelas: leads (lead completo) e quiz_sessions (progresso/abandono).

-- 1. Visão geral (conclusão x abandono)
select
  count(*) filter (where completed)     as concluidos,
  count(*) filter (where not completed) as abandonados,
  count(*)                              as sessoes_total,
  round(100.0 * count(*) filter (where completed) / nullif(count(*), 0), 1)
    as taxa_conclusao_pct
from quiz_sessions;

-- 2. Leads por perfil (A/B/C)
select profile, count(*) as leads
from leads
group by profile
order by leads desc;

-- 3. Leads recentes
select name, email, profile, created_at
from leads
order by created_at desc
limit 20;

-- 4. Funil de abandono: em qual pergunta as pessoas param
with perguntas(id, ordem, rotulo) as (
  values
    ('name', 1, 'Nome'),
    ('experience', 2, 'Experiência'),
    ('moment', 3, 'Momento atual'),
    ('area', 4, 'Área de atuação'),
    ('obstacles', 5, 'Obstáculos'),
    ('clarity', 6, 'Clareza de oferta'),
    ('phone', 7, 'Telefone'),
    ('clients', 8, 'Carteira de clientes'),
    ('expected-result', 9, 'Resultado esperado'),
    ('main-question', 10, 'Pergunta principal'),
    ('timeline', 11, 'Horizonte de tempo'),
    ('sector', 12, 'Setor'),
    ('additional', 13, 'Adicional'),
    ('email', 14, 'E-mail')
)
select
  coalesce(p.ordem, 99)                  as ordem,
  coalesce(p.rotulo, s.last_question_id) as pergunta,
  count(*)                               as abandonos
from quiz_sessions s
left join perguntas p on p.id = s.last_question_id
where s.completed = false
group by 1, 2
order by abandonos desc;

-- 5. Leads por dia
select date_trunc('day', created_at)::date as dia, count(*) as leads
from leads
group by 1
order by 1 desc;

-- 6. Profundidade média antes de abandonar
select round(avg(answered_count), 1) as media_respostas_antes_de_sair
from quiz_sessions
where completed = false;

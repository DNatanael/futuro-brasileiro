import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowRight, BookOpen, Check, ChevronDown, ChevronLeft, Edit3,
  Eye, Home as HomeIcon, Info, LogIn, LogOut, Menu, Plus,
  Save, Search, Shield, Trash2, X
} from "lucide-react";

/* =========================================================
   CONFIGURAÇÕES RÁPIDAS
   Você pode alterar cores, textos e dados sem mexer na lógica.
========================================================= */

export const siteContent = {
  brand: "FUTURO BRASILEIRO",
  heroEyebrow: "INFORMAÇÃO • DEMOCRACIA • ELEIÇÕES",
  heroTitle: "CONHEÇA QUEM PODE DEFINIR O FUTURO DO BRASIL.",
  heroDescription:
    "Um espaço visual para conhecer trajetórias, posicionamentos e temas apresentados por diferentes figuras políticas.",
  awarenessTitle: "SEU VOTO TEM CONSEQUÊNCIAS.",
  candidatesTitle: "FICHAS DOS CANDIDATOS"
};

/*
  IDENTIDADE VISUAL — altere aqui as imagens de fundo do projeto.
  Os arquivos podem ficar em public/backgrounds/.
  Ex.: heroBackground: "/backgrounds/hero.jpg"
  Se deixar vazio, o site usa apenas o fundo em CSS.
*/
export const siteTheme = {
  heroBackground: "",
  awarenessBackground: "",
  historyBackground: "",
  candidatesBackground: "/backgrounds/backgroundscandidatos2.jpg",
  pageBackground: "",
  profileBackground: "/backgrounds/backgroundscandidatos2.jpg",
  backgroundOpacity: 0.72
};

const PARTY_THEMES = {
  PT: ["#e7193b", "#b50f2d", "#ffffff"],
  PL: ["#138a4b", "#f1cf20", "#ffffff"],
  PSOL: ["#f4a300", "#e7352c", "#111111"],
  PSB: ["#f28c28", "#e8b51f", "#ffffff"],
  PDT: ["#d71920", "#b30f18", "#ffffff"],
  MDB: ["#2b65b1", "#1e4c88", "#ffffff"],
  PSD: ["#f58220", "#e8a51b", "#111111"],
  UNIÃO: ["#1756a9", "#2d8fd5", "#ffffff"],
  "UNIÃO BRASIL": ["#1756a9", "#2d8fd5", "#ffffff"],
  PP: ["#1c5ca8", "#2f7fc3", "#ffffff"],
  REPUBLICANOS: ["#174c9c", "#2e7ad1", "#ffffff"],
  NOVO: ["#f36b21", "#e74a17", "#ffffff"]
};

const STORAGE_KEY = "futuro-brasileiro-candidates-v6";
const ADMIN_SESSION_KEY = "fb-admin-v2";
const ADMIN_PASSWORD = "admin123"; // DEMONSTRAÇÃO ESCOLAR — não é segurança real.

/*
  Os candidatos agora ficam em /public/candidatos.json.
  O App apenas carrega o arquivo e mantém alterações do Admin no localStorage.
*/
const CANDIDATES_DATA_URL = `${import.meta.env.BASE_URL}candidatos.json`;
const LOGO_PATH = `${import.meta.env.BASE_URL}logo-futuro-brasileiro.png`;

async function fetchCandidatesFromFile() {
  const response = await fetch(CANDIDATES_DATA_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar candidatos.json (${response.status}).`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("O arquivo candidatos.json precisa conter uma lista de candidatos.");
  }

  return data.map(normalizeCandidate);
}


const awarenessItems = [
  {
    number: "01",
    icon: Search,
    title: "PESQUISE ANTES DE VOTAR",
    text: "Conheça a trajetória, as propostas e o posicionamento dos candidatos antes de tomar sua decisão."
  },
  {
    number: "02",
    icon: AlertTriangle,
    title: "DESCONFIE DE PROMESSAS FÁCEIS",
    text: "Avalie o que está sendo proposto, como poderia ser colocado em prática e quais informações sustentam a promessa."
  },
  {
    number: "03",
    icon: Shield,
    title: "NÃO VENDA SEU VOTO",
    text: "O voto deve representar uma escolha consciente. Conheça as regras eleitorais e não permita que favores determinem sua decisão."
  },
  {
    number: "04",
    icon: BookOpen,
    title: "CUIDADO COM A DESINFORMAÇÃO",
    text: "Antes de compartilhar uma informação política, procure verificar sua origem, data e contexto."
  }
];

const historyItems = [
  {
    year: "1932",
    title: "JUSTIÇA ELEITORAL",
    text: "O primeiro Código Eleitoral criou a Justiça Eleitoral e trouxe regras para organizar o alistamento, a votação e a apuração.",
    detail: "O Código Eleitoral de 1932 foi um marco na organização das eleições brasileiras. Entre suas inovações estavam a criação da Justiça Eleitoral, o voto secreto e a representação proporcional.",
    sourceLabel: "TSE — Primeiro Código Eleitoral",
    source: "https://www.tse.jus.br/comunicacao/noticias/2016/Fevereiro/justica-eleitoral-completa-84-anos-nesta-quarta-feira-24"
  },
  {
    year: "1932",
    title: "VOTO FEMININO",
    text: "O Código Eleitoral passou a reconhecer às mulheres os direitos de votar e de serem votadas, marco importante da cidadania eleitoral.",
    detail: "O direito foi previsto no Código Eleitoral de 1932. A legislação posterior ampliou e consolidou a participação política das mulheres no país.",
    sourceLabel: "TSE — História do voto feminino",
    source: "https://www.tse.jus.br/comunicacao/radio/2023/marco/confira-a-historia-do-voto-feminino-no-brasil"
  },
  {
    year: "1988",
    title: "CONSTITUIÇÃO FEDERAL",
    text: "A Constituição de 1988 estabeleceu que a soberania popular é exercida pelo sufrágio universal e pelo voto direto e secreto.",
    detail: "O artigo 14 da Constituição de 1988 estabelece o sufrágio universal e o voto direto e secreto, com valor igual para todos, além de prever plebiscito, referendo e iniciativa popular.",
    sourceLabel: "TSE — Constituição Federal",
    source: "https://www.tse.jus.br/legislacao/compilada/constituicao-federal/1988/constituicao-federal-de-1988"
  },
  {
    year: "1989",
    title: "ELEIÇÃO PRESIDENCIAL DIRETA",
    text: "Em 15 de novembro de 1989, o Brasil realizou eleição direta para presidente, retomando o voto popular para esse cargo após quase três décadas.",
    detail: "A eleição presidencial de 1989 marcou o retorno do voto direto para a Presidência da República. O pleito utilizou pela primeira vez a regra dos dois turnos para a escolha do Executivo federal.",
    sourceLabel: "TSE — Volta da eleição direta",
    source: "https://www.tse.jus.br/institucional/catalogo-de-publicacoes/arquivos/portfolio-da-exposicao-o-voto-no-brasil/@@download/file/Expo-Voto-Brasil-Portifolio2.pdf"
  },
  {
    year: "1996",
    title: "PRIMEIRA ELEIÇÃO COM URNA ELETRÔNICA",
    text: "A votação eletrônica começou a ser utilizada em 57 cidades, alcançando mais de 32 milhões de eleitoras e eleitores.",
    detail: "A primeira eleição informatizada ocorreu em 1996. O sistema foi usado em 57 municípios com mais de 200 mil eleitores e marcou uma nova etapa tecnológica do processo eleitoral brasileiro.",
    sourceLabel: "TSE — História da urna eletrônica",
    source: "https://www.tse.jus.br/comunicacao/noticias/2016/Janeiro/serie-urna-eletronica-conheca-a-historia-da-informatizacao-do-voto-no-brasil"
  },
  {
    year: "2000",
    title: "ELEIÇÃO 100% INFORMATIZADA",
    text: "A votação eletrônica passou a ser utilizada em todos os municípios brasileiros, tornando o pleito totalmente informatizado.",
    detail: "Nas eleições municipais de 2000, todos os municípios utilizaram votação eletrônica. O modelo daquele período também incorporou recursos de acessibilidade, como áudio para eleitores com deficiência visual.",
    sourceLabel: "TSE — Urna eletrônica de 2000",
    source: "https://www.tse.jus.br/comunicacao/noticias/2023/Janeiro/urna-eletronica-de-2000-permitiu-a-primeira-eleicao-100-informatizada"
  }
];

function normalizeCandidate(candidate) {
  const proposals = Array.isArray(candidate.proposals) && candidate.proposals.length
    ? candidate.proposals.map((proposal) => ({
        title: proposal.title || "Proposta",
        summary: proposal.summary || "",
        details: proposal.details || "",
        source: proposal.source || ""
      }))
    : (candidate.themes || []).map((theme) => ({
        title: theme,
        summary: "",
        details: "",
        source: ""
      }));

  const rawVice = candidate.vice;
  const vice = typeof rawVice === "string"
    ? { name: rawVice, party: "", summary: "", source: "" }
    : rawVice && typeof rawVice === "object"
      ? {
          name: rawVice.name || "",
          fullName: rawVice.fullName || "",
          party: rawVice.party || "",
          summary: rawVice.summary || "",
          source: rawVice.source || ""
        }
      : null;

  return {
    ...candidate,
    number: candidate.number != null ? String(candidate.number) : "",
    vice,
    proposals,
    themes: proposals.map((proposal) => proposal.title).filter(Boolean)
  };
}




async function loadCandidates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.map(normalizeCandidate);
    }

    return await fetchCandidatesFromFile();
  } catch (error) {
    console.error("Erro ao carregar candidatos:", error);
    throw error;
  }
}

function imageSrc(photo) {
  if (!photo) return "";

  if (
    photo.startsWith("data:") ||
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    return photo;
  }

  const cleanPath = String(photo).replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

function getPartyTheme(candidate) {
  const key = String(candidate.party || "").trim().toUpperCase();
  const fallback = PARTY_THEMES[key] || ["#20c879", "#0d6b47", "#04120c"];
  return {
    color1: candidate.partyColor || fallback[0],
    color2: candidate.partyColor2 || fallback[1],
    text: candidate.partyTextColor || fallback[2]
  };
}

function themeStyle(candidate) {
  const theme = getPartyTheme(candidate);
  return {
    "--party-color": theme.color1,
    "--party-color-2": theme.color2,
    "--party-text": theme.text
  };
}

function backgroundStyle(value, fallback = "none") {
  const image = value || fallback;
  return image ? { "--custom-background": `url("${image}")` } : {};
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  return null;
}

function App() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    loadCandidates()
      .then((data) => {
        if (!mounted) return;
        setCandidates(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoadError(
          "Não foi possível carregar os candidatos. Verifique se o arquivo public/candidatos.json existe e tente novamente."
        );
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !loadError) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    }
  }, [candidates, isLoading, loadError]);

  const addCandidate = (candidate) => {
    setCandidates((prev) => [
      ...prev,
      { ...candidate, id: crypto.randomUUID() }
    ]);
  };

  const updateCandidate = (candidate) => {
    setCandidates((prev) =>
      prev.map((item) => (item.id === candidate.id ? candidate : item))
    );
  };

  const deleteCandidate = (id) => {
    setCandidates((prev) => prev.filter((item) => item.id !== id));
  };

  const resetCandidates = async () => {
    try {
      const data = await fetchCandidatesFromFile();
      setCandidates(data);
      setLoadError("");
    } catch (error) {
      console.error("Erro ao restaurar candidatos:", error);
      alert("Não foi possível restaurar os dados de candidatos.json.");
    }
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand"><img src={LOGO_PATH} alt="Futuro Brasileiro" className="brand-logo" /></div>
          <div className="section-kicker">CARREGANDO DADOS</div>
          <h1>CARREGANDO CANDIDATOS...</h1>
          <p>Buscando as informações em <strong>candidatos.json</strong>.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand"><img src={LOGO_PATH} alt="Futuro Brasileiro" className="brand-logo" /></div>
          <div className="section-kicker">ERRO DE DADOS</div>
          <h1>NÃO FOI POSSÍVEL CARREGAR</h1>
          <p>{loadError}</p>
          <button className="primary-btn" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes>
      <Route path="/" element={<Home candidates={candidates} />} />
      <Route path="/candidatos" element={<Candidates candidates={candidates} />} />
      <Route path="/candidatos/:id" element={<CandidateDetail candidates={candidates} />} />
      <Route path="/sobre-o-voto" element={<AboutVote />} />
      <Route path="/historia" element={<History />} />
      <Route
        path="/admin"
        element={
          <Admin
            candidates={candidates}
            onAdd={addCandidate}
            onUpdate={updateCandidate}
            onDelete={deleteCandidate}
            onReset={resetCandidates}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={LOGO_PATH} alt="Futuro Brasileiro" className="brand-logo" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav open" : "nav"}>
          <Link to="/" onClick={closeMenu}>Início</Link>
          <Link to="/candidatos" onClick={closeMenu}>Candidatos</Link>
          <Link to="/sobre-o-voto" onClick={closeMenu}>Sobre o voto</Link>
          <Link to="/historia" onClick={closeMenu}>História</Link>
          <Link to="/admin" className="nav-admin" onClick={closeMenu}>
            <Shield size={15} /> Admin
          </Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>FUTURO BRASILEIRO</span>
        <span>Projeto informativo • Consulte fontes oficiais</span>
      </footer>
    </div>
  );
}

function Home({ candidates }) {
  return (
    <Layout>
      <section className="hero" style={backgroundStyle(siteTheme.heroBackground)}>
        <div className="section-custom-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="eyebrow">{siteContent.heroEyebrow}</div>
          <h1>{renderHeroTitle(siteContent.heroTitle)}</h1>
          <p>{siteContent.heroDescription}</p>
          <Link className="primary-btn" to="/candidatos">
            Conhecer candidatos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-lines" aria-hidden="true">
          <span>01</span><span>BR</span><span>2026</span>
        </div>
      </section>

      <section className="section awareness-section" style={backgroundStyle(siteTheme.awarenessBackground)}>
        <div className="section-custom-bg" />
        <div className="section-kicker">01 / CONSCIÊNCIA DO VOTO</div>
        <div className="awareness-heading">
          <h2>SEU VOTO TEM<br /><span>CONSEQUÊNCIAS.</span></h2>
          <div className="awareness-intro">
            <p>Votar vai além de escolher um nome. É uma decisão que participa da construção dos próximos anos do país.</p>
            <p className="muted">Antes de escolher, informe-se, questione e compare. O projeto organiza informações de maneira simples, visual e neutra.</p>
          </div>
        </div>

        <div className="awareness-grid">
          {awarenessItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="awareness-card" key={item.number}>
                <div className="awareness-card-top">
                  <span>{item.number}</span>
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="awareness-callout">
          <div>
            <span>PRINCÍPIO DO PROJETO</span>
            <strong>Não escolha apenas um candidato.<br /><em>Escolha com consciência.</em></strong>
          </div>
          <Shield size={42} strokeWidth={1.4} />
        </div>
      </section>

      <section className="section timeline" style={backgroundStyle(siteTheme.historyBackground)}>
        <div className="section-custom-bg" />
        <div className="section-kicker">02 / CONTEXTO</div>
        <div className="section-heading timeline-heading">
          <h2>COMO O VOTO MUDOU<br /><span>NO BRASIL.</span></h2>
          <Link to="/historia" className="text-link">Ver história <ArrowRight size={16} /></Link>
        </div>
        <div className="timeline-track">
          {historyItems.map((item) => (
            <div className="timeline-item" key={`${item.year}-${item.title}`}>
              <strong>{item.year}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <HistoricalContexts />

      <section className="section candidates-preview">
        <div className="section-heading">
          <div>
            <div className="section-kicker">04 / PERFIS</div>
            <h2>{siteContent.candidatesTitle}</h2>
          </div>
          <Link to="/candidatos" className="text-link">Ver todos <ArrowRight size={16} /></Link>
        </div>
        <div className="candidate-grid">
          {candidates.slice(0, 4).map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function renderHeroTitle(title) {
  const words = title.split(" ");
  const breakAt = Math.ceil(words.length / 3);
  const first = words.slice(0, breakAt).join(" ");
  const middle = words.slice(breakAt, breakAt * 2).join(" ");
  const last = words.slice(breakAt * 2).join(" ");
  return <>{first}<br /><em>{middle}</em><br />{last}</>;
}



function HistoricalContexts() {
  const [open, setOpen] = useState(null);

  const contexts = [
    {
      id: 1,
      title: "CORONELISMO",
      subtitle: "Poder local e influência política",
      text: "Durante a Primeira República, grandes proprietários rurais exerciam forte influência política em determinadas regiões. O fenômeno esteve associado ao poder local, ao controle eleitoral e às relações de troca de favores.",
      today: "Hoje, o coronelismo histórico não existe da mesma forma, mas conceitos como clientelismo, dependência política e concentração de poder local continuam sendo estudados para compreender determinadas relações políticas."
    },
    {
      id: 2,
      title: "PATRIMONIALISMO",
      subtitle: "A relação entre o público e o privado",
      text: "Patrimonialismo é um conceito utilizado para estudar situações em que os limites entre interesses públicos e privados se tornam pouco definidos. Ele aparece em estudos sobre a formação histórica do Estado e da administração pública brasileira.",
      today: "A discussão ajuda a compreender problemas relacionados ao favorecimento pessoal, conflitos de interesse e utilização inadequada de estruturas ou recursos públicos. Cada caso concreto, porém, deve ser analisado com base em evidências e nas regras aplicáveis."
    },
    {
      id: 3,
      title: "NEPOTISMO",
      subtitle: "Família e administração pública",
      text: "Nepotismo envolve o favorecimento de parentes em determinadas nomeações públicas. No Brasil, a questão está relacionada aos princípios da administração pública, especialmente a impessoalidade.",
      today: "A Súmula Vinculante 13 do STF estabelece restrições a determinadas nomeações de parentes para cargos em comissão, funções de confiança e funções gratificadas. A aplicação depende das características de cada situação."
    }
  ];

  return (
    <section className="section historical-contexts">
      <div className="section-kicker">03 / CONTEXTOS HISTÓRICOS</div>

      <div className="context-title">
        <h2>
          PODER, ESTADO E<br />
          <span>SOCIEDADE.</span>
        </h2>

        <p>
          Entenda como estruturas e práticas históricas ajudam a
          compreender relações entre o poder público e a sociedade.
        </p>
      </div>

      <div className="context-grid">
        {contexts.map((context) => (
          <div
            className={`context-card ${
              open === context.id ? "active" : ""
            }`}
            key={context.id}
          >
            <button
              className="context-button"
              onClick={() =>
                setOpen(open === context.id ? null : context.id)
              }
            >
              <span>0{context.id}</span>

              <div>
                <h3>{context.title}</h3>
                <small>{context.subtitle}</small>
              </div>

              <strong>
                {open === context.id ? "−" : "+"}
              </strong>
            </button>

            {open === context.id && (
              <div className="context-content">
                <p>{context.text}</p>

                <h4>RELAÇÃO COM O PRESENTE</h4>

                <p>{context.today}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}


function CandidateCard({ candidate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/candidatos/${candidate.id}`} className="candidate-card" style={themeStyle(candidate)}>
      <div className="card-noise" />
      <div className="card-top">
        <span className="party-tag">{candidate.party}</span>
        <span className="card-number">{candidate.number || "—"}</span>
      </div>
      <div className="card-image">
        {!imageError && candidate.photo ? (
          <img src={imageSrc(candidate.photo)} alt="" onError={() => setImageError(true)} />
        ) : null}
        <div className="image-fallback"><span>{candidate.name.slice(0, 1)}</span></div>
        <div className="image-overlay" />
      </div>
      <div className="card-bottom">
        <div className="card-position">{candidate.position}</div>
        <h3>{candidate.name}</h3>
        <p>{candidate.fullName}</p>
        {candidate.vice?.name && <span className="card-vice">Vice: {candidate.vice.name}</span>}
        <span className="card-action">ABRIR PERFIL <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

function Candidates({ candidates }) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState("Todos");
  const [position, setPosition] = useState("Todos");

  const parties = useMemo(
    () => ["Todos", ...new Set(candidates.map((c) => c.party))],
    [candidates]
  );

  const positions = useMemo(
    () => ["Todos", ...new Set(candidates.map((c) => c.position))],
    [candidates]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesQuery =
        !term ||
        [
          candidate.name,
          candidate.fullName,
          candidate.party,
          candidate.position
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesParty =
        party === "Todos" || candidate.party === party;

      const matchesPosition =
        position === "Todos" || candidate.position === position;

      return matchesQuery && matchesParty && matchesPosition;
    });
  }, [candidates, query, party, position]);

  return (
    <Layout>
      <div
        className="candidates-page"
        style={backgroundStyle(siteTheme.candidatesBackground)}
      >
        <div className="candidates-background-overlay" />

        <section className="page-hero candidates-hero">
          <div className="section-kicker">
            FUTURO BRASILEIRO / 03
          </div>

          <h1>CANDIDATOS</h1>

          <p>
            Consulte perfis organizados em um mesmo formato para
            facilitar a leitura e a comparação de informações.
          </p>
        </section>

        <section className="section candidates-content">
          <div className="filters">
            <label className="search-field">
              <Search size={17} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar candidato..."
              />
            </label>

            <select
              value={party}
              onChange={(e) => setParty(e.target.value)}
              aria-label="Filtrar por partido"
            >
              {parties.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              aria-label="Filtrar por posicionamento"
            >
              {positions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="results-note">
            {filtered.length} perfil(is) encontrado(s)
          </div>

          <div className="candidate-grid candidate-grid-large">
            {filtered.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <EmptyState text="Nenhum candidato encontrado com esses filtros." />
          )}
        </section>
      </div>
    </Layout>
  );
}


function CandidateDetail({ candidates }) {
  const { id } = useParams();
  const candidate = candidates.find((c) => c.id === id);
  const [imageError, setImageError] = useState(false);

  if (!candidate) return <NotFound />;

  return (
    <Layout>
      <section className="profile-page" style={{ ...themeStyle(candidate), ...backgroundStyle(candidate.profileBackground || siteTheme.profileBackground) }}>
        <div className="profile-custom-bg" />
        <div className="profile-bg-grid" />
        <Link to="/candidatos" className="back-link"><ChevronLeft size={17} /> Voltar aos candidatos</Link>
        <div className="profile-layout">
          <div className="profile-info">
            <div className="profile-party">{candidate.party}</div>
            <div className="profile-code">POLITICAL PROFILE / BR</div>
            <h1>{candidate.name}</h1>
            <div className="profile-fullname">{candidate.fullName}</div>

            <div className="profile-ticket">
              <div className="ticket-number-card">
                <span>NÚMERO</span>
                <strong>{candidate.number || "—"}</strong>
                <small>DE URNA</small>
              </div>

              <div className="vice-card">
                <div className="vice-card-kicker">CHAPA PRESIDENCIAL</div>
                <div className="vice-card-title">VICE-PRESIDENTE</div>
                {candidate.vice?.name ? (
                  <>
                    <h3>{candidate.vice.name}</h3>
                    {candidate.vice.fullName && candidate.vice.fullName !== candidate.vice.name && (
                      <div className="vice-full-name">{candidate.vice.fullName}</div>
                    )}
                    {candidate.vice.party && <span className="vice-party">{candidate.vice.party}</span>}
                    {candidate.vice.summary && <p>{candidate.vice.summary}</p>}
                    {candidate.vice.source && (
                      <a href={candidate.vice.source} target="_blank" rel="noreferrer" className="vice-source">
                        Fonte biográfica <ArrowRight size={14} />
                      </a>
                    )}
                  </>
                ) : (
                  <p>Vice-presidente não informado.</p>
                )}
              </div>
            </div>

            <div className="info-grid">
              <InfoBlock label="ATUAÇÃO POLÍTICA" value={candidate.activity || "Não informado"} />
              <InfoBlock label="POSICIONAMENTO" value={candidate.position || "Não informado"} />
            </div>

            <div className="profile-block">
              <span className="block-label">SOBRE</span>
              <p>{candidate.bio}</p>
            </div>

            <ProposalAccordion proposals={candidate.proposals || (candidate.themes || []).map((theme) => ({ title: theme, summary: "", details: "", source: "" }))} />

            <div className="profile-block sources-block">
              <span className="block-label">FONTES</span>
              {(candidate.sources || []).filter(Boolean).map((source) => (
                <a key={source} href={source.startsWith("http") ? source : undefined} target={source.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {source}
                </a>
              ))}
            </div>

            <div className="source-note">
              <Shield size={15} />
              <span>As informações devem ser verificadas e atualizadas com fontes oficiais.</span>
            </div>
          </div>

          <div className="profile-portrait">
            <div className="portrait-frame">
              {!imageError && candidate.photo ? (
                <img src={imageSrc(candidate.photo)} alt="" onError={() => setImageError(true)} />
              ) : null}
              <div className="portrait-fallback"><span>{candidate.name.slice(0, 1)}</span></div>
              <div className="portrait-gradient" />
              <div className="portrait-corner top-left" />
              <div className="portrait-corner bottom-right" />
              <div className="portrait-label">FUTURO<br />BRASILEIRO</div>
              <div className="portrait-index">ID / {candidate.id.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ProposalAccordion({ proposals }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="profile-block proposals-block">
      <span className="block-label">PROPOSTAS / TEMAS</span>
      <div className="proposals-list">
        {proposals.map((proposal, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`proposal-item ${isOpen ? "is-open" : ""}`} key={`${proposal.title}-${i}`}>
              <button className="proposal-trigger" type="button" onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}>
                <span className="proposal-number">{String(i + 1).padStart(2, "0")}</span>
                <span className="proposal-heading">
                  <strong>{proposal.title}</strong>
                  {proposal.summary && <small>{proposal.summary}</small>}
                </span>
                <ChevronDown size={19} className="proposal-chevron" />
              </button>
              {isOpen && (
                <div className="proposal-content">
                  {proposal.details ? <p>{proposal.details}</p> : <p>Detalhamento desta proposta ainda não informado.</p>}
                  {proposal.source && (
                    <a href={proposal.source.startsWith("http") ? proposal.source : undefined} target={proposal.source.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="proposal-source">
                      Fonte da proposta <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return <div className="info-block"><span>{label}</span><strong>{value}</strong></div>;
}

function AboutVote() {
  const articles = [
    { number: "01", title: "O QUE É UM VOTO CONSCIENTE?", text: "É uma decisão baseada em informação. Isso envolve conhecer as funções do cargo em disputa, pesquisar a trajetória dos candidatos, observar suas propostas e verificar as fontes utilizadas para apresentar essas informações." },
    { number: "02", title: "ENTENDA O CARGO ANTES DO CANDIDATO", text: "Presidente, governador, senador, deputado, prefeito e vereador possuem atribuições diferentes. Saber o que cada cargo pode fazer ajuda a avaliar propostas com mais contexto e evita atribuir a uma pessoa responsabilidades que pertencem a outra instituição." },
    { number: "03", title: "OLHE TAMBÉM PARA O PARTIDO", text: "Candidaturas estão inseridas em partidos e coligações. Conhecer o partido, suas ideias e a atuação da legenda pode complementar a análise individual do candidato." },
    { number: "04", title: "COMPARE FONTES", text: "Uma publicação isolada não precisa ser suficiente para formar uma conclusão. Compare documentos, programas, entrevistas e informações oficiais e observe quando cada conteúdo foi publicado." },
    { number: "05", title: "DESINFORMAÇÃO PRECISA DE CONTEXTO", text: "Uma informação pode ser verdadeira, falsa ou apresentada fora de contexto. Antes de compartilhar, procure a origem, a data, o material completo e outras fontes que permitam conferir a afirmação." },
    { number: "06", title: "O VOTO NÃO TERMINA NA URNA", text: "Participação cidadã também envolve acompanhar decisões, cobrar informações públicas, conhecer instituições e observar o cumprimento de compromissos ao longo do mandato." },
    { number: "07", title: "CADA VOTO TEM O MESMO VALOR", text: "A Constituição de 1988 estabelece que o voto é direto e secreto e tem valor igual para todos. A escolha individual faz parte de um processo coletivo de representação política." },
    { number: "08", title: "A DECISÃO É SUA", text: "O papel do Futuro Brasileiro é organizar informações, não indicar uma escolha. Depois de pesquisar e comparar, cada eleitor deve formar sua própria decisão." }
  ];

  return (
    <Layout>
      <section className="page-hero about-hero" style={backgroundStyle(siteTheme.pageBackground)}>
        <div className="section-kicker">FUTURO BRASILEIRO / 04</div>
        <h1>VOTO<br /><span>CONSCIENTE</span></h1>
        <p>Informação não determina sua escolha. Ela ajuda você a construir a sua própria decisão.</p>
      </section>
      <section className="section content-page">
        <div className="awareness-lead">
          <div className="section-kicker">ANTES DE DECIDIR</div>
          <h2>INFORMAR-SE É PARTE DO <span>VOTO.</span></h2>
          <p>O TSE mantém um Guia do Voto Consciente com orientações sobre funções dos cargos, atribuições dos Poderes e formas de fiscalização do processo eleitoral. O conteúdo desta página segue essa lógica educativa e foi organizado para um projeto escolar.</p>
        </div>
        <div className="article-grid">
          {articles.map((article) => <InfoArticle key={article.number} {...article} />)}
        </div>
        <div className="official-source-card">
          <div><span>FONTE OFICIAL</span><h3>Guia do Voto Consciente — TSE</h3><p>Publicação de 2024 com orientações sobre escolha de representantes, funções dos cargos e fiscalização do processo eleitoral.</p></div>
          <a className="text-link" href="https://www.tse.jus.br/institucional/catalogo-de-publicacoes/lista-do-catalogo-de-publicacoes/publicacoes/g/guia-do-voto-consciente" target="_blank" rel="noreferrer">Consultar no TSE <ArrowRight size={16} /></a>
        </div>
      </section>
    </Layout>
  );
}

function InfoArticle({ number, title, text }) {
  return (
    <article className="info-article">
      <span>{number}</span>
      <div><h2>{title}</h2><p>{text}</p></div>
    </article>
  );
}

function History() {
  return (
    <Layout>
      <section className="page-hero history-hero" style={backgroundStyle(siteTheme.pageBackground)}>
        <div className="section-kicker">FUTURO BRASILEIRO / 05</div>
        <h1>HISTÓRIA<br /><span>DO VOTO</span></h1>
        <p>Conhecer como o processo eleitoral brasileiro mudou ajuda a entender por que direitos, instituições e regras importam.</p>
      </section>
      <section className="section history-page">
        <div className="history-intro">
          <div className="section-kicker">ARQUIVO ELEITORAL</div>
          <h2>SEIS MARCOS PARA <span>ENTENDER.</span></h2>
          <p>Os textos abaixo são resumos introdutórios. Cada bloco traz um link para a fonte oficial utilizada como referência.</p>
        </div>
        <div className="history-cards">
          {historyItems.map((item, index) => (
            <article className="history-card" key={`${item.year}-${item.title}`}>
              <div className="history-card-year">{item.year}</div>
              <div className="history-card-index">0{index + 1}</div>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
              <a href={item.source} target="_blank" rel="noreferrer" className="history-source-link">{item.sourceLabel} <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
        <div className="history-source"><Info size={16} /> As páginas históricas e normas podem ser atualizadas; consulte sempre a fonte oficial para detalhes.</div>
      </section>
    </Layout>
  );
}

function Admin({ candidates, onAdd, onUpdate, onDelete, onReset }) {
  const [logged, setLogged] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  if (!logged) {
    return <AdminLogin onLogin={() => { sessionStorage.setItem(ADMIN_SESSION_KEY, "1"); setLogged(true); }} />;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link to="/" className="brand"><img src={LOGO_PATH} alt="Futuro Brasileiro" className="brand-logo" /></Link>
        <button className="ghost-btn" onClick={() => { sessionStorage.removeItem(ADMIN_SESSION_KEY); setLogged(false); }}><LogOut size={16} /> Sair</button>
      </header>

      <div className="admin-content">
        <div className="admin-title">
          <div><div className="section-kicker">ADMIN / CONTENT</div><h1>GERENCIAR CANDIDATOS</h1></div>
          <button className="primary-btn" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={17} /> Novo candidato</button>
        </div>

        <div className="admin-list">
          {candidates.map((candidate) => (
            <div className="admin-row" key={candidate.id}>
              <div className="admin-avatar">{candidate.number || candidate.name.slice(0, 1)}</div>
              <div className="admin-main"><strong>{candidate.name}</strong><span>{candidate.party} • {candidate.position}{candidate.vice?.name ? ` • Vice: ${candidate.vice.name}` : ""}</span></div>
              <div className="admin-actions">
                <Link className="icon-btn" to={`/candidatos/${candidate.id}`} title="Visualizar"><Eye size={17} /></Link>
                <button className="icon-btn" onClick={() => { setEditing(candidate); setShowForm(true); }} title="Editar"><Edit3 size={17} /></button>
                <button className="icon-btn danger" onClick={() => { if (confirm(`Excluir ${candidate.name}?`)) onDelete(candidate.id); }} title="Excluir"><Trash2 size={17} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-warning">
          <Shield size={18} />
          <div>
            <strong>Modo escolar / demonstração</strong>
            <p>Os dados iniciais vêm do arquivo <strong>public/candidatos.json</strong>. As alterações feitas pelo Admin ficam salvas no localStorage deste navegador.</p>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                if (confirm("Restaurar os candidatos para os dados do arquivo candidatos.json? Isso apagará as alterações salvas neste navegador.")) {
                  onReset();
                }
              }}
            >
              Restaurar dados do JSON
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <CandidateForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            if (editing) onUpdate({ ...data, id: editing.id });
            else onAdd(data);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) onLogin();
    else setError("Senha incorreta.");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand"><img src={LOGO_PATH} alt="Futuro Brasileiro" className="brand-logo" /></div>
        <div className="section-kicker">ADMIN / LOGIN</div>
        <h1>ÁREA ADMINISTRATIVA</h1>
        <p>Entre para editar os perfis cadastrados neste MVP.</p>
        <form onSubmit={submit}>
          <label>Senha de demonstração<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn" type="submit"><LogIn size={17} /> Entrar</button>
        </form>
        <div className="demo-password"><Info size={14} /> Projeto escolar: senha atual <strong>admin123</strong>.</div>
        <Link to="/" className="back-link"><ChevronLeft size={16} /> Voltar ao site</Link>
      </div>
    </div>
  );
}

function CandidateForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {
    name: "", fullName: "", party: "", number: "", position: "", activity: "",
    vice: { name: "", fullName: "", party: "", summary: "", source: "" },
    bio: "", themes: ["", "", "", "", ""], proposals: [
      { title: "", summary: "", details: "", source: "" },
      { title: "", summary: "", details: "", source: "" },
      { title: "", summary: "", details: "", source: "" },
      { title: "", summary: "", details: "", source: "" },
      { title: "", summary: "", details: "", source: "" }
    ], photo: "", profileBackground: "", partyColor: "", partyColor2: "", partyTextColor: "#ffffff", sources: [""]
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateVice = (field, value) => setForm((prev) => ({
    ...prev,
    vice: { ...(prev.vice || {}), [field]: value }
  }));

  function submit(e) {
    e.preventDefault();
    onSave({
      ...form,
      number: String(form.number || "").trim(),
      name: form.name.trim().toUpperCase(),
      vice: form.vice?.name?.trim()
        ? {
            name: form.vice.name.trim(),
            fullName: (form.vice.fullName || "").trim(),
            party: (form.vice.party || "").trim(),
            summary: (form.vice.summary || "").trim(),
            source: (form.vice.source || "").trim()
          }
        : null,
      proposals: (form.proposals || []).map((proposal) => ({
        title: (proposal.title || "").trim(),
        summary: (proposal.summary || "").trim(),
        details: (proposal.details || "").trim(),
        source: (proposal.source || "").trim()
      })).filter((proposal) => proposal.title),
      themes: (form.proposals || []).map((proposal) => (proposal.title || "").trim()).filter(Boolean),
      sources: (form.sources || []).map((s) => s.trim()).filter(Boolean)
    });
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Para este MVP, use uma imagem de até 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result);
    reader.readAsDataURL(file);
  }

  function handleBackground(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Para este MVP, use um fundo de até 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("profileBackground", reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div><div className="section-kicker">PROFILE EDITOR</div><h2>{initial ? "EDITAR PERFIL" : "NOVO PERFIL"}</h2></div>
          <button className="icon-btn" onClick={onClose}><X /></button>
        </div>

        <form className="candidate-form" onSubmit={submit}>
          <div className="form-grid">
            <label>Nome de exibição<input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
            <label>Nome completo<input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></label>
            <label>Número de urna<input inputMode="numeric" value={form.number || ""} onChange={(e) => update("number", e.target.value.replace(/\D/g, ""))} placeholder="Ex.: 13" /></label>
            <label>Partido<input required value={form.party} onChange={(e) => update("party", e.target.value)} /></label>
            <label>Posicionamento<input required value={form.position} onChange={(e) => update("position", e.target.value)} /></label>
            <label>Atuação política<input value={form.activity} onChange={(e) => update("activity", e.target.value)} /></label>
            <label>Foto do computador<input type="file" accept="image/*" onChange={handlePhoto} /></label>
          </div>

          {form.photo && <img className="photo-preview" src={imageSrc(form.photo)} alt="Pré-visualização" />}

          <label>Caminho ou URL da foto<input value={form.photo?.startsWith("data:") ? "Imagem carregada do computador" : form.photo} onChange={(e) => update("photo", e.target.value)} placeholder="candidates/nome.jpg ou URL" /></label>

          <div className="form-section-title">IDENTIDADE VISUAL DO PARTIDO</div>
          <div className="form-grid color-fields">
            <label>Cor principal<input type="color" value={form.partyColor || "#20c879"} onChange={(e) => update("partyColor", e.target.value)} /></label>
            <label>Cor secundária<input type="color" value={form.partyColor2 || "#0d6b47"} onChange={(e) => update("partyColor2", e.target.value)} /></label>
            <label>Cor do texto<input type="color" value={form.partyTextColor || "#ffffff"} onChange={(e) => update("partyTextColor", e.target.value)} /></label>
          </div>

          <div className="form-section-title">FUNDO DO PERFIL</div>
          <label>Imagem de fundo do perfil<input type="file" accept="image/*" onChange={handleBackground} /></label>
          {form.profileBackground && <img className="background-preview" src={imageSrc(form.profileBackground)} alt="Pré-visualização do fundo" />}
          <label>Caminho ou URL do fundo<input value={form.profileBackground?.startsWith("data:") ? "Imagem carregada do computador" : form.profileBackground} onChange={(e) => update("profileBackground", e.target.value)} placeholder="backgrounds/perfil.jpg ou URL" /></label>

          <div className="form-section-title">CHAPA PRESIDENCIAL / VICE</div>
          <div className="form-grid">
            <label>Nome do vice<input value={form.vice?.name || ""} onChange={(e) => updateVice("name", e.target.value)} placeholder="Ex.: Geraldo Alckmin" /></label>
            <label>Nome completo do vice<input value={form.vice?.fullName || ""} onChange={(e) => updateVice("fullName", e.target.value)} /></label>
            <label>Partido do vice<input value={form.vice?.party || ""} onChange={(e) => updateVice("party", e.target.value)} /></label>
            <label>Fonte biográfica do vice<input value={form.vice?.source || ""} onChange={(e) => updateVice("source", e.target.value)} placeholder="Fonte oficial ou jornalística" /></label>
          </div>
          <label>Resumo breve do vice<textarea rows="4" value={form.vice?.summary || ""} onChange={(e) => updateVice("summary", e.target.value)} placeholder="Resumo factual da trajetória do vice-presidente." /></label>

          <label>Biografia / sobre<textarea required rows="5" value={form.bio} onChange={(e) => update("bio", e.target.value)} /></label>

          <div>
            <div className="form-section-title proposal-editor-title">PROPOSTAS / TEMAS</div>
            <p className="form-help">Cada proposta aparece como um dropdown no perfil público. Edite o título, o resumo e o detalhamento de cada seção.</p>
            <div className="proposal-editor-list">
              {(form.proposals || []).map((proposal, i) => (
                <div className="proposal-editor-card" key={i}>
                  <div className="proposal-editor-head"><span>{String(i + 1).padStart(2, "0")}</span><strong>PROPOSTA {i + 1}</strong></div>
                  <div className="form-grid">
                    <label>Título<input required value={proposal.title} onChange={(e) => {
                      const next = [...form.proposals]; next[i] = { ...next[i], title: e.target.value }; update("proposals", next);
                    }} placeholder="Ex.: Saúde pública" /></label>
                    <label>Resumo curto<input value={proposal.summary} onChange={(e) => {
                      const next = [...form.proposals]; next[i] = { ...next[i], summary: e.target.value }; update("proposals", next);
                    }} placeholder="Resumo que aparece fechado" /></label>
                  </div>
                  <label>Detalhamento<textarea rows="5" value={proposal.details} onChange={(e) => {
                    const next = [...form.proposals]; next[i] = { ...next[i], details: e.target.value }; update("proposals", next);
                  }} placeholder="Explique a proposta de forma detalhada..." /></label>
                  <label>Fonte da proposta (opcional)<input value={proposal.source} onChange={(e) => {
                    const next = [...form.proposals]; next[i] = { ...next[i], source: e.target.value }; update("proposals", next);
                  }} placeholder="https://..." /></label>
                </div>
              ))}
              <button type="button" className="ghost-btn add-proposal-btn" onClick={() => update("proposals", [...(form.proposals || []), { title: "", summary: "", details: "", source: "" }])}><Plus size={16} /> Adicionar proposta</button>
            </div>
          </div>

          <div>
            <label>Fontes</label>
            <div className="source-inputs">
              {(form.sources || [""]).map((source, i) => (
                <input key={i} value={source} onChange={(e) => {
                  const next = [...(form.sources || [""])];
                  next[i] = e.target.value;
                  update("sources", next);
                }} placeholder="https://..." />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>Cancelar</button>
            <button className="primary-btn" type="submit"><Save size={17} /> Salvar perfil</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state"><Info size={22} /><p>{text}</p></div>;
}

function NotFound() {
  return (
    <Layout>
      <section className="not-found">
        <HomeIcon size={35} />
        <h1>PÁGINA NÃO ENCONTRADA</h1>
        <Link className="primary-btn" to="/">Voltar ao início</Link>
      </section>
    </Layout>
  );
}

export default App;

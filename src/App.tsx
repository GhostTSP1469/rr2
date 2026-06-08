import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { StoreContext } from './components/store'

type IconName =
  | 'arrow'
  | 'bag'
  | 'bolt'
  | 'chevron'
  | 'heart'
  | 'menu'
  | 'play'
  | 'search'
  | 'shield'
  | 'spark'
  | 'star'
  | 'user'
  | 'x'

type GameCard = {
  id: number
  title: string
  faction: string
  type: string
  price: string
  attack: number
  health: number
  level: string
  variant: string
  icon: string
}

const cards: GameCard[] = [
  {
    id: 1,
    title: 'Astra Noctis',
    faction: 'Орден затмения',
    type: 'Легендарная',
    price: '2 490 ₽',
    attack: 9,
    health: 7,
    level: 'S-01',
    variant: 'violet',
    icon: '✦',
  },
  {
    id: 2,
    title: 'Iron Warden',
    faction: 'Стальной легион',
    type: 'Эпическая',
    price: '1 890 ₽',
    attack: 7,
    health: 10,
    level: 'E-12',
    variant: 'cyan',
    icon: '◇',
  },
  {
    id: 3,
    title: 'Ember Fox',
    faction: 'Дикая искра',
    type: 'Редкая',
    price: '990 ₽',
    attack: 8,
    health: 5,
    level: 'R-07',
    variant: 'orange',
    icon: '⌁',
  },
  {
    id: 4,
    title: 'Void Oracle',
    faction: 'Бездна',
    type: 'Мифическая',
    price: '3 190 ₽',
    attack: 6,
    health: 9,
    level: 'M-00',
    variant: 'pink',
    icon: '◉',
  },
]

const categories = ['Все карты', 'Легендарные', 'Эпические', 'Редкие']

const categoryTypes: Record<string, string> = {
  Легендарные: 'Легендарная',
  Эпические: 'Эпическая',
  Редкие: 'Редкая',
}

function Icon({ name }: { name: IconName }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    bag: <><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    spark: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    star: <path d="m12 2 3 6.3 7 .9-5 4.8 1.3 7-6.3-3.4L5.7 21 7 14 2 9.2l7-.9L12 2Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
    x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function ProductCard({
  card,
}: {
  card: GameCard
}) {
  const { state, dispatch } = useContext(StoreContext)
  const liked = state.favoriteIds.includes(card.id)
  const isInDeck = state.deckIds.includes(card.id)

  return (
    <article className="product-card">
      <div className={`card-shell card-shell--${card.variant}`}>
        <div className="card-shell__shine" />
        <div className="card-shell__topline">
          <span>{card.level}</span>
          <span>{card.type}</span>
        </div>
        <div className="card-shell__art">
          <div className="card-shell__orbit card-shell__orbit--one" />
          <div className="card-shell__orbit card-shell__orbit--two" />
          <span>{card.icon}</span>
        </div>
        <div className="card-shell__name">
          <small>{card.faction}</small>
          <strong>{card.title}</strong>
        </div>
        <div className="card-shell__stats">
          <span><Icon name="bolt" /> {card.attack}</span>
          <span><Icon name="shield" /> {card.health}</span>
        </div>
      </div>

      <div className="product-card__details">
        <div>
          <span>{card.type}</span>
          <h3>{card.title}</h3>
        </div>
        <button
          className={`icon-button ${liked ? 'is-liked' : ''}`}
          type="button"
          aria-label={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: card.id })}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="product-card__buy">
        <strong>{card.price}</strong>
        <button
          type="button"
          disabled={isInDeck}
          onClick={() => dispatch({ type: 'ADD_TO_DECK', payload: card.id })}
        >
          {isInDeck ? 'В колоде' : 'В колоду'} <Icon name="arrow" />
        </button>
      </div>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { state, dispatch } = useContext(StoreContext)

  const visibleCards =
    state.activeCategory === categories[0]
      ? cards
      : cards.filter((card) => card.type === categoryTypes[state.activeCategory])

  const deckCards = state.deckIds
    .map((id) => cards.find((card) => card.id === id))
    .filter((card): card is GameCard => Boolean(card))

  return (
    <div className="site-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="topbar">
        <Link className="brand" to="/" aria-label="Arcana home">
          <span className="brand__mark"><Icon name="spark" /></span>
          <span>ARCANA</span>
          <small>cards</small>
        </Link>

        <nav className={menuOpen ? 'is-open' : ''}>
          <a href="#cards" onClick={() => setMenuOpen(false)}>Карты</a>
          <a href="#sets" onClick={() => setMenuOpen(false)}>Наборы</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>Как играть</a>
          <a href="#club" onClick={() => setMenuOpen(false)}>Клуб</a>
          <Link to="/lab" onClick={() => setMenuOpen(false)}>Lab</Link>
        </nav>

        <div className="topbar__actions">
          <button className="icon-button desktop-action" type="button" aria-label="Поиск">
            <Icon name="search" />
          </button>
          <button className="icon-button desktop-action" type="button" aria-label="Профиль">
            <Icon name="user" />
          </button>
          <button className="bag-button" type="button" aria-label={`Карт в колоде: ${state.deckIds.length}`}>
            <Icon name="bag" />
            <span>{state.deckIds.length}</span>
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-section__copy">
            <div className="eyebrow"><span /> Новая глава уже здесь</div>
            <h1>Собери колоду.<br /><em>Измени исход.</em></h1>
            <p>
              Коллекционные карты нового поколения. Собирай редкие артефакты,
              создавай уникальные комбинации и выходи на арену.
            </p>
            <div className="hero-section__actions">
              <a className="primary-button" href="#cards">Смотреть карты <Icon name="arrow" /></a>
              <button className="play-button" type="button"><span><Icon name="play" /></span> Смотреть трейлер</button>
            </div>
            <div className="hero-section__meta">
              <div><strong>120+</strong><span>уникальных карт</span></div>
              <div><strong>8</strong><span>игровых фракций</span></div>
              <div><strong>24K</strong><span>игроков онлайн</span></div>
            </div>
          </div>

          <div className="hero-deck" aria-label="Коллекционные карты Arcana">
            <div className="hero-deck__halo" />
            <div className="hero-card hero-card--back">
              <span className="hero-card__rune">✦</span>
              <span>ARCANA</span>
            </div>
            <div className="hero-card hero-card--left">
              <div className="hero-card__number">07</div>
              <div className="hero-card__figure hero-card__figure--moon">◈</div>
              <div className="hero-card__label"><small>Эпическая</small><strong>Moon Keeper</strong></div>
            </div>
            <div className="hero-card hero-card--right">
              <div className="hero-card__number">11</div>
              <div className="hero-card__figure hero-card__figure--fire">⌁</div>
              <div className="hero-card__label"><small>Редкая</small><strong>Solar Wraith</strong></div>
            </div>
            <div className="hero-card hero-card--main">
              <div className="hero-card__number">01</div>
              <span className="hero-card__badge">Легендарная</span>
              <div className="hero-card__figure hero-card__figure--main">✦</div>
              <div className="hero-card__label"><small>Орден затмения</small><strong>Astra Noctis</strong></div>
              <div className="hero-card__stats"><span>⚡ 9</span><span>◇ 7</span></div>
            </div>
            <div className="hero-deck__float hero-deck__float--one"><Icon name="star" /> редкость S+</div>
            <div className="hero-deck__float hero-deck__float--two"><span /> лимитированный дроп</div>
          </div>
        </section>

        <section className="ticker" aria-label="Преимущества">
          <div>
            <span>✦ Уникальный арт</span>
            <span>✦ Честный дроп</span>
            <span>✦ Турниры каждую неделю</span>
            <span>✦ Доставка по всей России</span>
            <span>✦ Уникальный арт</span>
            <span>✦ Честный дроп</span>
          </div>
        </section>

        <section className="cards-section" id="cards">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / Витрина</span>
              <h2>Карты, которые<br /><em>решают исход</em></h2>
            </div>
            <p>Каждая карта создана для ярких комбинаций, неожиданных ходов и красивых побед.</p>
          </div>

          <div className="filter-row">
            <div className="filters">
              {categories.map((category) => (
                <button
                  className={state.activeCategory === category ? 'is-active' : ''}
                  key={category}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
                >
                  {category}
                </button>
              ))}
            </div>
            <a href="#collection">Вся коллекция <Icon name="arrow" /></a>
          </div>

          <div className="product-grid">
            {visibleCards.map((card) => (
              <ProductCard card={card} key={card.id} />
            ))}
          </div>
        </section>

        <section className="collection-section" id="collection">
          <div className="collection-section__copy">
            <span className="section-index">02 / Твоя колода</span>
            <h2>Оставь место<br />для <em>сильного хода</em></h2>
            <p>
              Собери свой стартовый набор из шести карт. Комбинируй фракции,
              усиливай героев и сохрани место для той самой легендарной карты.
            </p>
            <div className="progress-label"><span>Готовность колоды</span><strong>{deckCards.length} / 6</strong></div>
            <div className="progress-bar"><span style={{ width: `${(deckCards.length / 6) * 100}%` }} /></div>
            <a className="secondary-button" href="#cards">Добавить карты <Icon name="arrow" /></a>
          </div>

          <div className="deck-slots" id="sets">
            {deckCards.map((card, index) => (
              <button
                className={`mini-card mini-card--${card.variant}`}
                key={card.id}
                type="button"
                title="Убрать карту из колоды"
                onClick={() => dispatch({ type: 'REMOVE_FROM_DECK', payload: card.id })}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <b>{card.icon}</b>
                <strong>{card.title}</strong>
                <small>{card.faction}</small>
              </button>
            ))}
            {Array.from({ length: 6 - deckCards.length }, (_, index) => (
              <button
                className="empty-slot"
                key={`empty-${index}`}
                type="button"
                onClick={() => document.getElementById('cards')?.scrollIntoView()}
              >
                <span>+</span>
                <strong>Место для карты</strong>
                <small>Выбрать в витрине</small>
              </button>
            ))}
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="section-index">03 / Правила просты</span>
              <h2>От первой карты<br />до <em>первой победы</em></h2>
            </div>
          </div>
          <div className="steps-grid">
            <article><span>01</span><Icon name="search" /><h3>Выбери фракцию</h3><p>Найди стиль игры, который подходит именно тебе.</p></article>
            <article><span>02</span><Icon name="spark" /><h3>Собери колоду</h3><p>Комбинируй навыки и создавай неожиданные связки.</p></article>
            <article><span>03</span><Icon name="bolt" /><h3>Выйди на арену</h3><p>Брось вызов игрокам и забери награды сезона.</p></article>
          </div>
        </section>

        <section className="cta-section" id="club">
          <div className="cta-section__rune">✦</div>
          <span className="section-index">Закрытый клуб Arcana</span>
          <h2>Первый дроп уже близко</h2>
          <p>Подпишись и получи доступ к секретной карте до официального релиза.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Твой email" aria-label="Email" />
            <button type="submit">Получить доступ <Icon name="arrow" /></button>
          </form>
        </section>
      </main>

      <footer>
        <Link className="brand" to="/" aria-label="Arcana home">
          <span className="brand__mark"><Icon name="spark" /></span>
          <span>ARCANA</span>
          <small>cards</small>
        </Link>
        <p>Коллекционные карты для тех, кто меняет правила.</p>
        <div><a href="#">Telegram</a><a href="#">Discord</a><a href="#">VK</a></div>
        <small>© 2026 Arcana Cards</small>
      </footer>
    </div>
  )
}

export default App

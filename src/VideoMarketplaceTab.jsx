import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import DirectMessagePanel from "./DirectMessagePanel";
import CommentsPanel from "./CommentsPanel";
import { supabase } from "./supabaseClient";
import {
  fetchFavorites, toggleFavorite, fetchCart, toggleCart, submitOrder, fetchThreads,
  fetchLikes, toggleLike, formatCount,
  isDemoVideo, parsePrice, formatPrice,
} from "./utils/marketplaceCommerce";

// ─── Demo UGC videos shown alongside real creator uploads so the marketplace
// never looks empty before creators start publishing (see "sellvideos" tab
// in TalentAgencyTab.jsx for the real publish flow, backed by the
// "marketplace_videos" Supabase table + "marketplace-videos" storage bucket).
const DEMO_VIDEOS = [
  { id: "v1", username: "diariatou_sow", niche: "Beauté", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", product: "Sérum Éclat Vitamine C", price: "34,90 €", likes: "12.4k", comments: "284" },
  { id: "v2", username: "skincare_goddess", niche: "Beauté", src: "https://www.w3schools.com/html/mov_bbb.mp4", product: "Crème Nuit Anti-Âge", price: "42,00 €", likes: "8.9k", comments: "156" },
  { id: "v3", username: "fashion_nova", niche: "Mode", src: "https://media.w3.org/2010/05/sintel/trailer.mp4", product: "Sac Cabas Cuir Végan", price: "59,90 €", likes: "21.1k", comments: "412" },
  { id: "v4", username: "fitfluencer.co", niche: "Fitness", src: "https://media.w3.org/2010/05/bunny/trailer.mp4", product: "Résistance Bands Pro Set", price: "24,90 €", likes: "6.2k", comments: "98" },
  { id: "v5", username: "lena.situations", niche: "Lifestyle", src: "https://media.w3.org/2010/05/video/movie_300.mp4", product: "Bougie Parfumée Signature", price: "18,50 €", likes: "34.7k", comments: "521" },
  { id: "v6", username: "marie.lopez", niche: "Beauté", src: "https://www.w3schools.com/html/movie.mp4", product: "Palette Yeux 12 Teintes", price: "29,90 €", likes: "15.8k", comments: "203" },
];

const T = {
  fr: {
    title: "Marketplace Vidéo", subtitle: "L'UGC de vos créateurs, en scroll infini — repérez, swipez, achetez.", buy: "Acheter", soon: "🛒 Paiement en un clic — bientôt disponible !", dm: "Message", searchPlaceholder: "Rechercher par créateur, produit, mot-clé...", allNiches: "Toutes niches", noResults: "Aucune vidéo ne correspond à votre recherche.", soundOn: "Activer le son", soundOff: "Couper le son", seek: "Naviguer dans la vidéo",
    mediaKindLabel: "Format de la publication", kindVideo: "🎬 Vidéo", kindCarousel: "🖼️ Carrousel photo",
    imagesFileLabel: "Photos (jusqu'à {n})", imagesHint: "{n} photos maximum, glissées dans l'ordre d'affichage.",
    imagesSelected: "photo sélectionnée", imagesSelectedPlural: "photos sélectionnées",
    tooManyImages: "Un carrousel accepte {n} photos au maximum.",
    browseTab: "Parcourir 🎬", sellTab: "Vendre ma Vidéo 🎥",
    sellTitle: "🎥 Vendez vos Vidéos UGC aux Marques",
    sellDesc: "Publiez le fichier brut de votre vidéo (jamais posté publiquement) et fixez votre prix. Les marques l'achètent pour l'utiliser dans leurs publicités — vous touchez le prix que vous avez fixé.",
    videoProductLabel: "Produit mis en avant", videoPriceLabel: "Prix de vente (€)", videoNicheLabel: "Niche", videoFileLabel: "Fichier vidéo (MP4, max 50 Mo)",
    publishVideoBtn: "Publier la vidéo", publishingVideo: "Publication en cours...",
    myVideosTitle: "Mes vidéos publiées", noVideosYet: "Vous n'avez encore publié aucune vidéo.",
    videoPublishedToast: "Vidéo publiée avec succès sur le Marketplace !", deleteVideoBtn: "Retirer",
    favorites: "Favoris", cart: "Panier", cartEmpty: "Votre panier est vide.",
    addedToCart: "Ajouté au panier ✓", removedFromCart: "Retiré du panier",
    orderBtn: "Envoyer la commande", ordering: "Envoi en cours...",
    orderSent: "Commande envoyée au créateur ✓", total: "Total",
    demoAction: "Vidéo d'exemple — aucun créateur réel derrière. Action indisponible.",
    demoBadge: "Exemple",
    inboxTab: "Messages 💬", inboxEmpty: "Aucune conversation pour l'instant.", inboxLoading: "Chargement...", inboxRetry: "Réessayer", like: "J'aime", comments: "Commentaires",
  },
  en: {
    title: "Video Marketplace", subtitle: "Your creators' UGC, in infinite scroll — spot it, swipe it, buy it.", buy: "Buy", soon: "🛒 One-click checkout — coming soon!", dm: "Message", searchPlaceholder: "Search by creator, product, keyword...", allNiches: "All niches", noResults: "No videos match your search.", soundOn: "Turn sound on", soundOff: "Mute", seek: "Seek in video",
    mediaKindLabel: "Post format", kindVideo: "🎬 Video", kindCarousel: "🖼️ Photo carousel",
    imagesFileLabel: "Photos (up to {n})", imagesHint: "Up to {n} photos, shown in the order you pick them.",
    imagesSelected: "photo selected", imagesSelectedPlural: "photos selected",
    tooManyImages: "A carousel takes {n} photos at most.",
    browseTab: "Browse 🎬", sellTab: "Sell my Video 🎥",
    sellTitle: "🎥 Sell your UGC Videos to Brands",
    sellDesc: "Upload the raw file of your video (never posted publicly) and set your price. Brands buy it to use in their ads — you keep the price you set.",
    videoProductLabel: "Featured product", videoPriceLabel: "Sale price (€)", videoNicheLabel: "Niche", videoFileLabel: "Video file (MP4, max 50MB)",
    publishVideoBtn: "Publish video", publishingVideo: "Publishing...",
    myVideosTitle: "My published videos", noVideosYet: "You haven't published any video yet.",
    videoPublishedToast: "Video successfully published to the Marketplace!", deleteVideoBtn: "Remove",
    favorites: "Favourites", cart: "Cart", cartEmpty: "Your cart is empty.",
    addedToCart: "Added to cart ✓", removedFromCart: "Removed from cart",
    orderBtn: "Send order", ordering: "Sending...",
    orderSent: "Order sent to the creator ✓", total: "Total",
    demoAction: "Sample video — no real creator behind it. Action unavailable.",
    demoBadge: "Sample",
    inboxTab: "Messages 💬", inboxEmpty: "No conversation yet.", inboxLoading: "Loading...", inboxRetry: "Retry", like: "Like", comments: "Comments",
  },
  it: {
    title: "Marketplace Video", subtitle: "L'UGC dei tuoi creator, a scorrimento infinito — scopri, swipa, acquista.", buy: "Acquista", soon: "🛒 Pagamento in un clic — disponibile a breve!", dm: "Messaggio", searchPlaceholder: "Cerca per creator, prodotto, parola chiave...", allNiches: "Tutte le nicchie", noResults: "Nessun video corrisponde alla tua ricerca.", soundOn: "Attiva l'audio", soundOff: "Disattiva l'audio", seek: "Scorri il video",
    mediaKindLabel: "Formato della pubblicazione", kindVideo: "🎬 Video", kindCarousel: "🖼️ Carosello foto",
    imagesFileLabel: "Foto (fino a {n})", imagesHint: "Massimo {n} foto, nell'ordine in cui le selezioni.",
    imagesSelected: "foto selezionata", imagesSelectedPlural: "foto selezionate",
    tooManyImages: "Un carosello accetta al massimo {n} foto.",
    browseTab: "Sfoglia 🎬", sellTab: "Vendi il mio Video 🎥",
    sellTitle: "🎥 Vendi i tuoi Video UGC ai Brand",
    sellDesc: "Carica il file grezzo del tuo video (mai pubblicato pubblicamente) e fissa il tuo prezzo. I brand lo acquistano per le loro pubblicità — tu incassi il prezzo che hai fissato.",
    videoProductLabel: "Prodotto in evidenza", videoPriceLabel: "Prezzo di vendita (€)", videoNicheLabel: "Nicchia", videoFileLabel: "File video (MP4, max 50MB)",
    publishVideoBtn: "Pubblica il video", publishingVideo: "Pubblicazione in corso...",
    myVideosTitle: "I miei video pubblicati", noVideosYet: "Non hai ancora pubblicato nessun video.",
    videoPublishedToast: "Video pubblicato con successo sul Marketplace!", deleteVideoBtn: "Rimuovi",
    favorites: "Preferiti", cart: "Carrello", cartEmpty: "Il tuo carrello è vuoto.",
    addedToCart: "Aggiunto al carrello ✓", removedFromCart: "Rimosso dal carrello",
    orderBtn: "Invia l'ordine", ordering: "Invio in corso...",
    orderSent: "Ordine inviato al creator ✓", total: "Totale",
    demoAction: "Video di esempio — nessun creator reale dietro. Azione non disponibile.",
    demoBadge: "Esempio",
    inboxTab: "Messaggi 💬", inboxEmpty: "Nessuna conversazione per ora.", inboxLoading: "Caricamento...", inboxRetry: "Riprova", like: "Mi piace", comments: "Commenti",
  },
};

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

// ─── Lecteur vidéo du feed ──────────────────────────────────────────────────
// Un <video> nu ne se met ni en pause ni en avance rapide : sur TikTok, toucher
// l'image met en pause et la barre du bas permet de se déplacer dans la vidéo.
// On reproduit ces deux gestes sans afficher les contrôles natifs, qui
// casseraient complètement l'esthétique plein écran.
function FeedVideo({ video, soundOn, setSoundOn, registerRef, t, isPausedByUser, setPausedByUser }) {
  const localRef = useRef(null);
  const barRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  // Éclair visuel au tap : sans retour immédiat, on ne sait pas si le geste a
  // été pris en compte, et on tape une deuxième fois.
  const [flash, setFlash] = useState(null);

  const attach = (el) => { localRef.current = el; registerRef(video.id, el); };

  const seekToClientX = (clientX) => {
    const bar = barRef.current, v = localRef.current;
    if (!bar || !v || !v.duration || !Number.isFinite(v.duration)) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    v.currentTime = ratio * v.duration;
    setProgress(ratio);
  };

  const togglePlay = () => {
    const v = localRef.current;
    if (!v) return;
    if (v.paused) {
      setPausedByUser(video.id, false);
      v.play().catch(() => {});
      setFlash("play");
    } else {
      // Mémorisé : sinon l'IntersectionObserver relancerait aussitôt la lecture
      // et la pause serait impossible à obtenir.
      setPausedByUser(video.id, true);
      v.pause();
      setFlash("pause");
    }
    setTimeout(() => setFlash(null), 450);
  };

  const pct = duration > 0 ? progress * 100 : 0;

  return (
    <>
      <video
        ref={attach}
        src={video.src}
        loop
        muted={!soundOn}
        playsInline
        // Supprime les boutons flottants ajoutés par certains navigateurs
        // (image dans l'image, lecture à distance) qui se superposaient au feed.
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate noremoteplayback"
        onLoadedMetadata={e => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={e => {
          if (dragging) return; // ne pas lutter contre le doigt de l'utilisateur
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
        }}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Surface de tap : couvre l'image mais s'arrête au-dessus de la barre de
          progression et de la zone d'informations, pour ne pas voler leurs clics. */}
      <div
        onClick={togglePlay}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 96, cursor: "pointer" }}
      />

      {/* Indicateur de pause persistant : sans lui, une vidéo arrêtée ressemble
          à une vidéo qui n'a pas chargé. */}
      {(flash || isPausedByUser) && (
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 68, height: 68, borderRadius: "50%", background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", opacity: flash ? 1 : 0.75,
          transition: "opacity 0.25s", zIndex: 2,
        }}>
          {(flash === "play" && !isPausedByUser) ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          )}
        </div>
      )}

      {/* Bouton son. Le son ne peut PAS être actif au chargement : tous les
          navigateurs bloquent la lecture automatique non muette et la vidéo ne
          démarrerait pas. On démarre en silence, comme TikTok, et le geste de
          l'utilisateur vaut autorisation pour toute la session. */}
      <button
        onClick={(e) => { e.stopPropagation(); setSoundOn(v => !v); }}
        aria-label={soundOn ? t.soundOff : t.soundOn}
        title={soundOn ? t.soundOff : t.soundOn}
        className="feed-top-control"
        style={{
          position: "absolute", top: 14, left: 14, width: 40, height: 40, borderRadius: "50%",
          border: "none", cursor: "pointer", color: "#fff", background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3,
        }}
      >
        {soundOn ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        )}
      </button>

      {/* Barre de progression. La zone tactile fait 22 px de haut alors que le
          trait n'en fait que 3 : viser un trait de 3 px au doigt est impossible. */}
      <div
        ref={barRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          seekToClientX(e.clientX);
        }}
        onPointerMove={(e) => { if (dragging) seekToClientX(e.clientX); }}
        onPointerUp={(e) => {
          setDragging(false);
          try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* pointeur déjà relâché */ }
        }}
        onPointerCancel={() => setDragging(false)}
        onClick={(e) => e.stopPropagation()}
        role="slider"
        aria-label={t.seek}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        tabIndex={0}
        onKeyDown={(e) => {
          const v = localRef.current;
          if (!v || !v.duration) return;
          if (e.key === "ArrowRight") { v.currentTime = Math.min(v.duration, v.currentTime + 5); e.preventDefault(); }
          if (e.key === "ArrowLeft")  { v.currentTime = Math.max(0, v.currentTime - 5); e.preventDefault(); }
          if (e.key === " ")          { togglePlay(); e.preventDefault(); }
        }}
        style={{
          position: "absolute",
          // ⚠️ Marges latérales volontaires : les bords de l'écran sont réservés
          // aux gestes du système (retour Android, changement d'app iOS). Une
          // barre collée au bord se faisait voler le doigt avant l'application.
          left: 12, right: 12,
          // Idem en bas : la zone du trait d'accueil intercepte le glissement.
          // On remonte au-dessus, en tenant compte de l'encoche via env().
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
          // Cible tactile de 44 px, la taille minimale utilisable au doigt,
          // alors que le trait n'en fait que 4 : c'est ce décalage qui rendait
          // la barre « à peine attrapable ».
          height: 44,
          display: "flex", alignItems: "flex-end", cursor: "pointer",
          touchAction: "none", zIndex: 6,
        }}
      >
        <div style={{
          position: "relative", width: "100%", height: dragging ? 8 : 4, borderRadius: 4,
          background: "rgba(255,255,255,0.3)", transition: "height 0.15s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.5)", // détache le trait des images claires
        }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, borderRadius: 4,
            background: "#fff", transition: dragging ? "none" : "width 0.15s linear",
          }} />
          {/* Poignée toujours visible : sans repère, rien n'indique que la barre
              se saisit — elle passait pour une simple jauge décorative. */}
          <div style={{
            position: "absolute", top: "50%", left: `${pct}%`,
            width: dragging ? 18 : 12, height: dragging ? 18 : 12,
            marginLeft: dragging ? -9 : -6, transform: "translateY(-50%)",
            borderRadius: "50%", background: "#fff",
            boxShadow: "0 1px 6px rgba(0,0,0,0.7)",
            transition: "width 0.15s, height 0.15s, margin-left 0.15s",
          }} />
        </div>

        {/* Position chiffrée pendant le déplacement : sans elle, on navigue à
            l'aveugle dans une vidéo dont on ne voit pas l'image sous le doigt. */}
        {dragging && duration > 0 && (
          <div style={{
            position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
            padding: "4px 10px", borderRadius: 10, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)", color: "#fff", fontSize: 12, fontWeight: 700,
            whiteSpace: "nowrap", pointerEvents: "none",
          }}>
            {formatTime(progress * duration)} / {formatTime(duration)}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Carrousel photo ────────────────────────────────────────────────────────
// Défilement horizontal magnétique, comme un carrousel Instagram. Volontairement
// sans lecture automatique : c'est l'utilisateur qui avance.
function FeedCarousel({ images, product }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="carousel-track"
        style={{
          width: "100%", height: "100%", display: "flex", overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", scrollBehavior: "smooth",
        }}
      >
        {images.map((url, i) => (
          <img
            key={url + i}
            src={url}
            alt={`${product} — ${i + 1}/${images.length}`}
            loading={i === 0 ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover", flex: "0 0 100%", scrollSnapAlign: "start" }}
          />
        ))}
      </div>

      {/* Points de progression : sans eux, rien n'indique qu'il y a d'autres
          photos à droite — le carrousel passe pour une simple image fixe. */}
      {images.length > 1 && (
        <div className="feed-top-control" style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 5, zIndex: 3, padding: "5px 9px", borderRadius: 12,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              aria-label={`Photo ${i + 1}`}
              style={{
                width: i === index ? 16 : 6, height: 6, borderRadius: 3, border: "none", padding: 0,
                background: i === index ? "#fff" : "rgba(255,255,255,0.45)",
                cursor: "pointer", transition: "width 0.2s, background 0.2s",
              }}
            />
          ))}
        </div>
      )}

      <div className="feed-top-control" style={{
        position: "absolute", top: 14, right: 14, zIndex: 3, padding: "4px 9px", borderRadius: 10,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", color: "#fff",
        fontSize: 11, fontWeight: 700,
      }}>
        {index + 1}/{images.length}
      </div>
    </>
  );
}

export default function VideoMarketplaceTab({ c, mono, uiLang, userId, API_URL }) {
  const [toast, setToast] = useState(null);
  const [dmVideo, setDmVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Son du feed. Coupé au départ par obligation technique (voir le bouton dans
  // le rendu), puis conservé pour toute la session dès que l'utilisateur l'active.
  const [soundOn, setSoundOn] = useState(false);
  const [activeNiche, setActiveNiche] = useState("all");
  const [realVideos, setRealVideos] = useState([]);
  const [viewMode, setViewMode] = useState("browse"); // browse | sell
  const [myVideos, setMyVideos] = useState([]);
  const [loadingMyVideos, setLoadingMyVideos] = useState(false);
  const [newVideo, setNewVideo] = useState({ username: "", product: "", price: "", niche: "beauty" });
  const [videoFile, setVideoFile] = useState(null);
  // Forme de la publication : une vidéo, ou un carrousel de photos.
  const [mediaKind, setMediaKind] = useState("video");
  const [imageFiles, setImageFiles] = useState([]);
  const MAX_CAROUSEL_IMAGES = 10; // aligné sur la contrainte SQL
  // ⚠️ Les URLs d'aperçu sont créées UNE fois par sélection, pas à chaque
  // rendu : appeler createObjectURL pendant le rendu en fabriquerait une
  // nouvelle à chaque passe, sans jamais libérer les précédentes — l'onglet
  // garderait les images en mémoire jusqu'à sa fermeture.
  const imagePreviews = useMemo(() => imageFiles.map(f => URL.createObjectURL(f)), [imageFiles]);
  useEffect(() => () => imagePreviews.forEach(URL.revokeObjectURL), [imagePreviews]);
  const [isPublishingVideo, setIsPublishingVideo] = useState(false);
  const [sellToast, setSellToast] = useState(null);
  // Commerce (chantier #18) : favoris et panier persistés par utilisateur.
  const [favorites, setFavorites] = useState([]);
  // Likes : geste public distinct du favori. `likeCounts` garde le compteur
  // affiché à jour sans recharger tout le feed après un clic.
  const [likes, setLikes] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  // Commentaires : le compteur sous l'icône bulle était décoratif et le clic
  // ne faisait rien.
  const [commentsVideo, setCommentsVideo] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // Boîte de réception : sans elle, un créateur recevait l'email « Répondre
  // dans Acquisition Pro » sans aucun écran pour le faire.
  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState(null);
  const t = T[uiLang] || T.fr;

  const showSellToast = (message, type = "success") => {
    setSellToast({ message, type });
    setTimeout(() => setSellToast(null), 4000);
  };

  const fetchMyVideos = async () => {
    if (!supabase || !userId) return;
    setLoadingMyVideos(true);
    const { data, error } = await supabase
      .from("marketplace_videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setMyVideos(data || []);
    setLoadingMyVideos(false);
  };

  useEffect(() => {
    if (viewMode === "sell") fetchMyVideos();
  }, [viewMode, userId]);

  // Real creator uploads (published via the "Vendre ma Vidéo" tab) shown first,
  // demo videos fill out the feed underneath.
  const fetchRealVideos = () => {
    if (!supabase) return;
    supabase
      .from("marketplace_videos")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        // Sans ce log, un marketplace vide pouvait aussi bien signifier
        // « aucune vidéo publiée » qu'une erreur de lecture Supabase.
        if (error) { console.error("❌ Marketplace : chargement des vidéos:", error.message); return; }
        if (!data) return;
        setRealVideos(data.map(v => ({
          id: v.id,
          username: v.username,
          niche: v.niche,
          src: v.video_url,
          // Une publication peut être une vidéo ou un carrousel de photos.
          // `media_type` est absent des lignes créées avant cette évolution :
          // on retombe sur 'video', ce qui décrit exactement ces lignes.
          mediaType: v.media_type === "carousel" ? "carousel" : "video",
          images: Array.isArray(v.media_urls) ? v.media_urls.filter(Boolean) : [],
          product: v.product,
          price: `${Number(v.price).toFixed(2)} €`,
          likes: v.likes_count ?? 0,
          comments: v.comments_count ?? 0,
          ownerId: v.user_id, // sert à la modération des commentaires
        })));
        // Compteurs servis par les colonnes dénormalisées (triggers SQL).
        setLikeCounts(Object.fromEntries(data.map(v => [v.id, v.likes_count ?? 0])));
        setCommentCounts(Object.fromEntries(data.map(v => [v.id, v.comments_count ?? 0])));
      });
  };

  useEffect(() => { fetchRealVideos(); }, []);

  // Envoie un fichier dans le bucket et renvoie son URL publique.
  const uploadToBucket = async (file) => {
    // Le nom d'origine peut contenir accents, espaces ou caractères que le
    // stockage refuse dans une clé. On le normalise plutôt que de laisser
    // l'envoi échouer sur un nom de fichier.
    const safeName = file.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error } = await supabase.storage.from("marketplace-videos").upload(path, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("marketplace-videos").getPublicUrl(path);
    return publicUrl;
  };

  const handlePublishVideo = async (e) => {
    e.preventDefault();
    if (!supabase || !userId || !newVideo.product || !newVideo.price) return;
    const isCarousel = mediaKind === "carousel";
    if (isCarousel ? imageFiles.length === 0 : !videoFile) return;
    if (isCarousel && imageFiles.length > MAX_CAROUSEL_IMAGES) {
      showSellToast(t.tooManyImages.replace("{n}", MAX_CAROUSEL_IMAGES), "error");
      return;
    }
    setIsPublishingVideo(true);
    try {
      const cleanUsername = (newVideo.username || "créateur").replace("@", "").trim();
      const base = {
        user_id: userId,
        username: cleanUsername,
        niche: newVideo.niche,
        product: newVideo.product,
        price: parseFloat(newVideo.price),
      };

      let payload;
      if (isCarousel) {
        // Envois en parallèle : à la vitesse d'une connexion mobile, dix photos
        // à la suite feraient patienter bien trop longtemps.
        const urls = await Promise.all(imageFiles.map(uploadToBucket));
        payload = { ...base, media_type: "carousel", media_urls: urls };
      } else {
        payload = { ...base, media_type: "video", video_url: await uploadToBucket(videoFile) };
      }

      const { error: insertError } = await supabase.from("marketplace_videos").insert(payload);
      if (insertError) throw insertError;
      showSellToast(t.videoPublishedToast, "success");
      setNewVideo({ username: cleanUsername, product: "", price: "", niche: newVideo.niche });
      setVideoFile(null);
      setImageFiles([]);
      fetchMyVideos();
      fetchRealVideos();
    } catch (err) {
      showSellToast(err.message || "Erreur lors de la publication.", "error");
    } finally {
      setIsPublishingVideo(false);
    }
  };

  const handleDeleteVideo = async (video) => {
    if (!supabase) return;
    const { error } = await supabase.from("marketplace_videos").delete().eq("id", video.id);
    // Une suppression refusée par la RLS renvoyait un succès apparent : la
    // vidéo disparaissait de l'écran puis revenait au rechargement.
    if (error) {
      console.error("❌ Suppression vidéo:", error.message);
      showSellToast("Cette vidéo n'a pas pu être retirée.", "error");
      return;
    }
    setMyVideos(prev => prev.filter(v => v.id !== video.id));
    fetchRealVideos();
  };

  const VIDEOS = [...realVideos, ...DEMO_VIDEOS];
  // ⚠️ Les vidéos de démonstration portent un libellé français ("Beauté",
  // "Mode") alors que le formulaire de publication enregistre la valeur brute
  // du <select> ("beauty", "fashion"). Sans normalisation, la barre de filtres
  // affichait DEUX pastilles pour la même niche, chacune ne montrant que la
  // moitié du catalogue. On ramène tout à une clé canonique.
  const nicheKey = (raw) => {
    const s = String(raw || "").trim().toLowerCase();
    if (["beauty", "beauté", "beaute", "skincare", "bellezza"].includes(s)) return "beauty";
    if (["fashion", "mode", "moda"].includes(s)) return "fashion";
    if (["fitness", "wellness", "sport"].includes(s)) return "fitness";
    if (["food", "nutrition", "cuisine", "cibo"].includes(s)) return "food";
    if (["lifestyle", "life", "style di vita"].includes(s)) return "lifestyle";
    return s || "autre";
  };
  const NICHE_LABELS = {
    fr: { beauty: "Beauté", fashion: "Mode", fitness: "Fitness", food: "Food", lifestyle: "Lifestyle" },
    en: { beauty: "Beauty", fashion: "Fashion", fitness: "Fitness", food: "Food", lifestyle: "Lifestyle" },
    it: { beauty: "Bellezza", fashion: "Moda", fitness: "Fitness", food: "Food", lifestyle: "Lifestyle" },
  };
  const nicheLabel = (raw) => {
    const k = nicheKey(raw);
    return (NICHE_LABELS[uiLang] || NICHE_LABELS.fr)[k] || raw;
  };
  const niches = ["all", ...new Set(VIDEOS.map(v => nicheKey(v.niche)))];
  const filteredVideos = VIDEOS.filter(video => {
    const matchesNiche = activeNiche === "all" || nicheKey(video.niche) === activeNiche;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || [video.username, video.product, video.niche].some(field => String(field || "").toLowerCase().includes(q));
    const matchesFavorite = !showFavoritesOnly || favorites.includes(video.id);
    return matchesNiche && matchesQuery && matchesFavorite;
  });

  // Only the slide actually in view should decode/play — with autoPlay on every
  // <video>, all of them streamed and decoded concurrently regardless of scroll
  // position. An IntersectionObserver plays the visible slide and pauses the rest.
  const scrollRef = useRef(null);
  const videoRefs = useRef({});
  // Pauses volontaires. Deux représentations de la MÊME donnée, et c'est
  // délibéré : le state sert au rendu (l'icône de pause), la ref sert à
  // l'observateur d'intersection, dont le callback capturerait sinon la valeur
  // initiale du state pour toujours. La ref est mise à jour de façon synchrone
  // avant le setState, pour qu'aucun des deux ne soit jamais en retard.
  // ⚠️ Ne PAS lire la ref pendant le rendu : React l'interdit et l'icône
  // pourrait alors se désynchroniser de l'état réel de la vidéo.
  const [pausedIds, setPausedIds] = useState({});
  const pausedByUserRef = useRef({});
  const setPausedByUser = (id, paused) => {
    const next = { ...pausedByUserRef.current };
    if (paused) next[id] = true;
    else delete next[id];
    pausedByUserRef.current = next;
    setPausedIds(next);
  };
  const registerVideoRef = (id, el) => {
    if (el) { el.dataset.videoId = id; videoRefs.current[id] = el; }
    else delete videoRefs.current[id];
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          // ⚠️ Ne PAS relancer une vidéo que l'utilisateur vient de mettre en
          // pause : l'observateur se déclenche aussi sur de micro-variations de
          // défilement, et la pause redevenait alors impossible à obtenir.
          if (pausedByUserRef.current[video.dataset.videoId]) return;
          // Si la lecture avec son est refusée (iOS en mode économie d'énergie,
          // geste utilisateur jugé expiré…), on ne laisse PAS la vidéo figée :
          // on repasse en silencieux, ce qui est toujours autorisé, et on
          // reflète l'état réel dans le bouton.
          video.play().catch(() => {
            video.muted = true;
            setSoundOn(false);
            video.play().catch(() => {});
          });
        } else {
          video.pause();
          // La pause volontaire ne vaut que pour la vidéo à l'écran : en
          // revenant dessus plus tard, on s'attend à ce qu'elle reparte.
          if (pausedByUserRef.current[video.dataset.videoId]) {
            setPausedByUser(video.dataset.videoId, false);
          }
        }
      });
    }, { root: container, threshold: [0, 0.6] });

    Object.values(videoRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filteredVideos]);

  // ─── Favoris / panier (chantier #18) ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetchFavorites(userId).then(setFavorites);
    fetchCart(userId).then(setCart);
    fetchLikes(userId).then(setLikes);
  }, [userId]);

  const notify = useCallback((message, type = "success") => {
    setSellToast({ message, type });
    setTimeout(() => setSellToast(null), 3500);
  }, []);

  const loadThreads = useCallback(async () => {
    setThreadsLoading(true);
    setThreadsError(null);
    try {
      setThreads(await fetchThreads(API_URL));
    } catch (err) {
      setThreadsError(String(err.message || err));
    } finally {
      setThreadsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { if (viewMode === "inbox") loadThreads(); }, [viewMode, loadThreads]);

  const handleToggleLike = async (video) => {
    if (isDemoVideo(video)) return notify(t.demoAction, "error");
    const active = likes.includes(video.id);
    // ⚠️ `Number(x) ?? 0` ne protège de rien : Number() renvoie NaN, pas null,
    // et NaN traverse le ?? — le compteur affichait alors « NaN ». On teste
    // donc explicitement que le résultat est un nombre exploitable.
    const parsed = Number(video.likes);
    const base = likeCounts[video.id] ?? (Number.isFinite(parsed) ? parsed : 0);
    // Mise à jour optimiste du bouton ET du compteur : le like doit répondre
    // instantanément, comme sur TikTok.
    setLikes((prev) => (active ? prev.filter((id) => id !== video.id) : [...prev, video.id]));
    setLikeCounts((prev) => ({ ...prev, [video.id]: Math.max(0, base + (active ? -1 : 1)) }));
    const r = await toggleLike(userId, video.id, active);
    if (!r.ok) {
      setLikes((prev) => (active ? [...prev, video.id] : prev.filter((id) => id !== video.id)));
      setLikeCounts((prev) => ({ ...prev, [video.id]: base }));
      notify(r.error, "error");
    }
  };

  const handleToggleFavorite = async (video) => {
    if (isDemoVideo(video)) return notify(t.demoAction, "error");
    const active = favorites.includes(video.id);
    // Mise à jour optimiste : le cœur réagit au clic, on corrige si l'écriture échoue.
    setFavorites((prev) => (active ? prev.filter((id) => id !== video.id) : [...prev, video.id]));
    const r = await toggleFavorite(userId, video.id, active);
    if (!r.ok) {
      setFavorites((prev) => (active ? [...prev, video.id] : prev.filter((id) => id !== video.id)));
      notify(r.error, "error");
    }
  };

  const handleToggleCart = async (video) => {
    if (isDemoVideo(video)) return notify(t.demoAction, "error");
    const inCart = cart.includes(video.id);
    setCart((prev) => (inCart ? prev.filter((id) => id !== video.id) : [...prev, video.id]));
    const r = await toggleCart(userId, video.id, inCart);
    if (!r.ok) {
      setCart((prev) => (inCart ? [...prev, video.id] : prev.filter((id) => id !== video.id)));
      notify(r.error, "error");
      return;
    }
    notify(inCart ? t.removedFromCart : t.addedToCart);
  };

  const cartVideos = [...realVideos, ...DEMO_VIDEOS].filter((v) => cart.includes(v.id));
  const cartTotal = cartVideos.reduce((s, v) => s + parsePrice(v.price), 0);

  const handleSubmitOrder = async () => {
    if (cartVideos.length === 0) return;
    setOrdering(true);
    const r = await submitOrder(API_URL, cartVideos.map((v) => v.id));
    setOrdering(false);
    if (!r.ok) return notify(r.error, "error");
    // On ne retire que ce que le serveur a réellement commandé : une vidéo
    // devenue indisponible reste au panier, avec un message qui l'explique.
    const ordered = r.orderedIds || cartVideos.map((v) => v.id);
    setCart((prev) => prev.filter((id) => !ordered.includes(id)));
    setCartOpen(false);
    notify(r.message || t.orderSent);
  };

  const handleBuy = (video) => {
    // "Acheter" = ajouter au panier puis l'ouvrir : un achat UGC se négocie
    // avec le créateur, il n'y a pas de paiement immédiat.
    if (isDemoVideo(video)) {
      setToast(video.id);
      setTimeout(() => setToast(null), 2500);
      return;
    }
    if (!cart.includes(video.id)) handleToggleCart(video);
    setCartOpen(true);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="video-feed-header" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #EC4899, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(236,72,153,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"/></svg>
          </div>
          {t.title}
        </h2>
        <p className="video-feed-subtitle" style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>{t.subtitle}</p>
      </div>

      {/* Accès favoris + panier (chantier #18) — visibles seulement en mode
          navigation, un créateur qui vend n'a rien à y faire. */}
      {viewMode === "browse" && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14 }}>
          <button
            onClick={() => setShowFavoritesOnly(v => !v)}
            className="hover-lift"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 30, cursor: "pointer",
              border: `1.5px solid ${showFavoritesOnly ? "transparent" : c.border}`,
              background: showFavoritesOnly ? "linear-gradient(135deg, #EC4899, #8B5CF6)" : "transparent",
              color: showFavoritesOnly ? "#fff" : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono, transition: "all 0.2s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={showFavoritesOnly ? "#fff" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 21s-6.7-4.35-9.3-8.1C.6 10 1.4 6 5 4.6 7.2 3.7 9.6 4.6 12 7.3c2.4-2.7 4.8-3.6 7-2.7 3.6 1.4 4.4 5.4 2.3 8.3C18.7 16.65 12 21 12 21z"/></svg>
            {t.favorites}{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="hover-lift"
            style={{
              position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 30,
              border: "none", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff",
              fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
            }}
          >
            🛒 {t.cart}
            {cart.length > 0 && (
              <span style={{
                minWidth: 20, height: 20, borderRadius: 10, background: "#fff", color: "#059669",
                fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px",
              }}>{cart.length}</span>
            )}
          </button>
        </div>
      )}

      {/* Browse / Sell toggle — creators sell where they (and brands) already browse */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {["browse", "sell", "inbox"].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: "9px 20px", borderRadius: 30, border: `1.5px solid ${viewMode === mode ? "transparent" : c.border}`,
              background: viewMode === mode ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "transparent",
              color: viewMode === mode ? "#fff" : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {mode === "browse" ? t.browseTab : mode === "sell" ? t.sellTab : t.inboxTab}
          </button>
        ))}
      </div>

      {/* Toast global : il n'était rendu que dans l'onglet « Vendre », si bien
          qu'en navigation un clic refusé (vidéo d'exemple, erreur réseau) ne
          produisait AUCUN retour visible. */}
      {sellToast && viewMode !== "sell" && (
        <div style={{
          position: "fixed", top: 22, left: "50%", transform: "translateX(-50%)", zIndex: 4000,
          background: sellToast.type === "error" ? "#EF4444" : "#10B981", color: "#fff",
          padding: "11px 20px", borderRadius: 30, fontSize: 13.5, fontWeight: 700,
          maxWidth: "min(90vw, 460px)", textAlign: "center", lineHeight: 1.45,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)", animation: "fadeIn 0.2s ease-out",
        }}>
          {sellToast.message}
        </div>
      )}

      {viewMode === "inbox" ? (
        /* Boîte de réception commune aux deux rôles : la marque y retrouve ses
           échanges, le créateur y répond aux marques qui l'ont contacté. */
        <div style={{ maxWidth: 640, margin: "0 auto", animation: "fadeIn 0.3s" }}>
          {threadsLoading && (
            <p style={{ textAlign: "center", color: c.textMuted, fontSize: 14 }}>{t.inboxLoading}</p>
          )}
          {threadsError && (
            <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ flex: 1, minWidth: 0 }}>{threadsError}</span>
              <button onClick={loadThreads} style={{ border: "none", background: "transparent", color: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}>{t.inboxRetry}</button>
            </div>
          )}
          {!threadsLoading && !threadsError && threads.length === 0 && (
            <p style={{ textAlign: "center", color: c.textMuted, fontSize: 14, marginTop: 40 }}>{t.inboxEmpty}</p>
          )}
          {threads.map((th) => {
            const v = th.marketplace_videos || {};
            return (
              <button
                key={th.id}
                onClick={() => setDmVideo({
                  id: th.video_id,
                  username: v.username || "créateur",
                  product: v.product || "—",
                  price: v.price != null ? `${Number(v.price).toFixed(2)} €` : "—",
                  src: v.video_url,
                })}
                className="hover-lift"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                  padding: 14, marginBottom: 10, borderRadius: 14, cursor: "pointer",
                  background: c.card, border: `1px solid ${c.border}`, transition: "all 0.2s",
                }}
              >
                <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>
                  {(v.username || "?").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>@{v.username || "créateur"}</div>
                  <div style={{ fontSize: 12.5, color: c.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.product || "—"}</div>
                </div>
                <div style={{ fontSize: 11.5, color: c.textDim, flexShrink: 0 }}>
                  {th.last_message_at ? new Date(th.last_message_at).toLocaleDateString(uiLang === "fr" ? "fr-FR" : uiLang === "it" ? "it-IT" : "en-US", { day: "numeric", month: "short" }) : ""}
                </div>
              </button>
            );
          })}
        </div>
      ) : viewMode === "sell" ? (
        <div style={{ maxWidth: 640, margin: "0 auto", animation: "fadeIn 0.3s" }}>
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, padding: 26, marginBottom: 24, position: "relative" }}>
            {sellToast && (
              <div style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap",
                background: sellToast.type === "error" ? "#EF4444" : "#10B981", color: "#fff", padding: "8px 18px",
                borderRadius: 20, fontSize: 12.5, fontWeight: 700, boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
              }}>
                {sellToast.message}
              </div>
            )}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: c.text, margin: "0 0 6px 0" }}>{t.sellTitle}</h3>
              <p style={{ color: c.textMuted, fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>{t.sellDesc}</p>
            </div>

            <form onSubmit={handlePublishVideo}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Handle Profil (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: @diariatou__sow"
                  value={newVideo.username}
                  onChange={e => setNewVideo({ ...newVideo, username: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                />
              </div>

              <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>{t.videoProductLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Sérum Éclat Vitamine C"
                    value={newVideo.product}
                    onChange={e => setNewVideo({ ...newVideo, product: e.target.value })}
                    style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>{t.videoPriceLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="ex: 34.90"
                    value={newVideo.price}
                    onChange={e => setNewVideo({ ...newVideo, price: e.target.value })}
                    style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>{t.videoNicheLabel}</label>
                <select
                  value={newVideo.niche}
                  onChange={e => setNewVideo({ ...newVideo, niche: e.target.value })}
                  style={{ width: "100%", padding: "10.5px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13.5 }}
                >
                  <option value="beauty">Beauty / Skincare</option>
                  <option value="food">Food / Nutrition</option>
                  <option value="fitness">Fitness / Wellness</option>
                  <option value="fashion">Fashion / Mode</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Choix de la forme. Deux onglets plutôt qu'un menu déroulant :
                  il faut que la possibilité de publier des photos se voie, sinon
                  personne ne la découvre. */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>{t.mediaKindLabel}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { id: "video", label: t.kindVideo },
                    { id: "carousel", label: t.kindCarousel },
                  ].map(k => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setMediaKind(k.id)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
                        border: `1.5px solid ${mediaKind === k.id ? "transparent" : c.border}`,
                        background: mediaKind === k.id ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : c.bg,
                        color: mediaKind === k.id ? "#fff" : c.textMuted,
                      }}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 10.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>
                  {mediaKind === "carousel" ? t.imagesFileLabel : t.videoFileLabel}
                </label>
                {mediaKind === "carousel" ? (
                  <>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      required={imageFiles.length === 0}
                      onChange={e => setImageFiles(Array.from(e.target.files || []).slice(0, MAX_CAROUSEL_IMAGES))}
                      style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                    />
                    <div style={{ fontSize: 11.5, color: c.textDim, marginTop: 6 }}>
                      {t.imagesHint.replace("{n}", MAX_CAROUSEL_IMAGES)}
                      {imageFiles.length > 0 && ` — ${imageFiles.length} ${imageFiles.length > 1 ? t.imagesSelectedPlural : t.imagesSelected}`}
                    </div>
                    {/* Aperçu : l'ordre des photos est celui du carrousel, il faut
                        pouvoir le constater avant de publier. */}
                    {imageFiles.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                        {imageFiles.map((file, i) => (
                          <div key={`${file.name}-${i}`} style={{ position: "relative", flex: "0 0 auto" }}>
                            <img
                              src={imagePreviews[i]}
                              alt={file.name}
                              style={{ width: 56, height: 74, objectFit: "cover", borderRadius: 6, border: `1px solid ${c.border}` }}
                            />
                            <span style={{
                              position: "absolute", top: 3, left: 3, fontSize: 9, fontWeight: 800, color: "#fff",
                              background: "rgba(0,0,0,0.6)", borderRadius: 4, padding: "1px 4px",
                            }}>{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    required
                    onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    style={{ width: "100%", padding: "11px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13 }}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isPublishingVideo}
                style={{
                  width: "100%", padding: "14px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg, #8B5CF6, #EC4899)`, color: "#fff",
                  fontWeight: 700, fontSize: 14, cursor: isPublishingVideo ? "not-allowed" : "pointer", fontFamily: mono,
                  boxShadow: "0 4px 16px rgba(139,92,246,0.3)", opacity: isPublishingVideo ? 0.7 : 1
                }}
              >
                {isPublishingVideo ? t.publishingVideo : t.publishVideoBtn}
              </button>
            </form>
          </div>

          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, padding: 26 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: c.text, margin: "0 0 16px 0" }}>{t.myVideosTitle}</h4>
            {loadingMyVideos ? (
              <p style={{ color: c.textDim, fontSize: 13 }}>...</p>
            ) : myVideos.length === 0 ? (
              <p style={{ color: c.textDim, fontSize: 13 }}>{t.noVideosYet}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myVideos.map(video => (
                  <div key={video.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: c.bg, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    {/* Une publication photo n'a pas de video_url : un <video>
                        n'afficherait qu'un rectangle noir sans expliquer pourquoi. */}
                    {video.media_type === "carousel" ? (
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={Array.isArray(video.media_urls) ? video.media_urls[0] : ""}
                          alt=""
                          style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 6, display: "block" }}
                        />
                        <span style={{
                          position: "absolute", bottom: 3, right: 3, fontSize: 9, fontWeight: 800, color: "#fff",
                          background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "1px 4px",
                        }}>
                          {Array.isArray(video.media_urls) ? video.media_urls.length : 0}
                        </span>
                      </div>
                    ) : (
                      <video src={video.video_url} muted style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{video.product}</div>
                      <div style={{ fontSize: 11.5, color: c.textDim }}>{nicheLabel(video.niche)} · {Number(video.price).toFixed(2)} €</div>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video)}
                      style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.error}55`, background: "transparent", color: c.error, fontSize: 11.5, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                    >
                      {t.deleteVideoBtn}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <>
      {/* Pile contrôles + feed. Sur mobile, les contrôles se superposent à la
          vidéo au lieu de l'écraser vers le bas : empilés, ils mangeaient près
          d'un cinquième de la hauteur d'écran. */}
      <div className="feed-stack">
      {/* Search & niche filters — lets brands find specific creator UGC by keyword */}
      <div className="feed-controls" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.textDim} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="input-premium"
            style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, border: `1px solid ${c.border}`, background: c.card, color: c.text, fontSize: 13.5, outline: "none" }}
          />
        </div>
        <div className="niche-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {niches.map(niche => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className={`niche-pill${activeNiche === niche ? " is-active" : ""}`}
              style={{
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${activeNiche === niche ? "transparent" : c.border}`,
                background: activeNiche === niche ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "transparent",
                color: activeNiche === niche ? "#fff" : c.textMuted, fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {niche === "all" ? t.allNiches : nicheLabel(niche)}
            </button>
          ))}
        </div>
      </div>

      <div className="video-feed-outer" style={{ display: "flex", justifyContent: "center" }}>
        <div ref={scrollRef} className="video-feed-scroll" style={{
          width: "100%", maxWidth: 420, height: "var(--feed-h, 78vh)", borderRadius: "var(--feed-radius, 24px)", overflowY: "scroll",
          scrollSnapType: "y mandatory", background: "#000", border: `1px solid ${c.border}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)", position: "relative",
          // ⚠️ Sans cela, arriver en haut ou en bas du feed transmet le
          // défilement à la page entière : l'écran « bougeait » sous le doigt
          // au lieu de rester stable sur la vidéo.
          overscrollBehavior: "contain",
        }}>
          {filteredVideos.length === 0 && (
            <div className="video-slide" style={{ height: "var(--feed-h, 78vh)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A1A1AA", fontSize: 14, textAlign: "center", padding: 24 }}>
              {t.noResults}
            </div>
          )}
          {filteredVideos.map(video => (
            <div key={video.id} className="video-slide" style={{ height: "var(--feed-h, 78vh)", scrollSnapAlign: "start", scrollSnapStop: "always", position: "relative", overflow: "hidden" }}>
              {video.mediaType === "carousel" ? (
                <FeedCarousel images={video.images} product={video.product} />
              ) : (
                <FeedVideo
                  video={video}
                  soundOn={soundOn}
                  setSoundOn={setSoundOn}
                  registerRef={registerVideoRef}
                  t={t}
                  isPausedByUser={!!pausedIds[video.id]}
                  setPausedByUser={setPausedByUser}
                />
              )}
              {/* Dégradé de lisibilité. `pointerEvents: none` est indispensable :
                  sinon il intercepterait le tap de pause et la barre de progression. */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.9) 100%)", pointerEvents: "none" }} />

              {/* Informations créateur + produit.
                  `pointerEvents: none` : ce bloc n'est que du texte, et il
                  couvrait toute la largeur au-dessus de la barre de progression.
                  Il absorbait donc les glissements destinés à celle-ci, ce qui
                  faisait défiler le feed au lieu de naviguer dans la vidéo.
                  Le bas est calé sur l'encoche pour ne jamais chevaucher la
                  barre, quelle que soit la hauteur du trait d'accueil. */}
              <div style={{
                position: "absolute", bottom: "calc(env(safe-area-inset-bottom, 0px) + 62px)",
                left: 16, right: 90, color: "#fff", pointerEvents: "none",
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  @{video.username}
                  <span style={{ fontSize: 10, background: "rgba(139,92,246,0.4)", padding: "2px 8px", borderRadius: 10, fontWeight: 700, textTransform: "uppercase" }}>{nicheLabel(video.niche)}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>
                  {video.product}
                  {/* Dire explicitement qu'une vidéo est un exemple : sans ça,
                      l'utilisateur ne comprend pas pourquoi l'action échoue. */}
                  {isDemoVideo(video) && (
                    <span style={{ marginLeft: 8, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 800, letterSpacing: 0.4 }}>
                      {t.demoBadge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#10B981", fontFamily: mono }}>{video.price}</div>
              </div>

              {/* Right-side action rail (TikTok-style) */}
              {/* Remonté de 24 à 64 px : à 24, le dernier bouton tombait dans la
                  zone tactile de la barre de progression. */}
              <div className="video-action-rail" style={{ position: "absolute", bottom: 64, right: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                {/* LIKE — geste public, avec compteur visible de tous. */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <button
                    onClick={() => handleToggleLike(video)}
                    className="hover-lift"
                    aria-pressed={likes.includes(video.id)}
                    title={t.like}
                    style={{
                      width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: likes.includes(video.id) ? "linear-gradient(135deg, #EF4444, #EC4899)" : "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", opacity: isDemoVideo(video) ? 0.55 : 1,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={likes.includes(video.id) ? "#fff" : "none"} stroke="#fff" strokeWidth="2"><path d="M12 21s-6.7-4.35-9.3-8.1C.6 10 1.4 6 5 4.6 7.2 3.7 9.6 4.6 12 7.3c2.4-2.7 4.8-3.6 7-2.7 3.6 1.4 4.4 5.4 2.3 8.3C18.7 16.65 12 21 12 21z"/></svg>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>
                    {/* Les vidéos d'exemple gardent leur compteur d'illustration. */}
                    {isDemoVideo(video) ? video.likes : formatCount(likeCounts[video.id] ?? video.likes ?? 0)}
                  </span>
                </div>

                {/* FAVORI — marque-page privé, sans compteur : c'est ce qui le
                    distingue du like, exactement comme sur TikTok. */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <button
                    onClick={() => handleToggleFavorite(video)}
                    className="hover-lift"
                    aria-pressed={favorites.includes(video.id)}
                    title={t.favorites}
                    style={{
                      width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: favorites.includes(video.id) ? "linear-gradient(135deg, #F59E0B, #EAB308)" : "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", opacity: isDemoVideo(video) ? 0.55 : 1,
                    }}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill={favorites.includes(video.id) ? "#fff" : "none"} stroke="#fff" strokeWidth="2" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{t.favorites}</span>
                </div>
                {/* COMMENTAIRES — ouvre le vrai fil (le compteur était
                    auparavant décoratif et le clic sans effet). */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <button
                    onClick={() => (isDemoVideo(video) ? notify(t.demoAction, "error") : setCommentsVideo(video))}
                    className="hover-lift"
                    title={t.comments}
                    style={{
                      width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", opacity: isDemoVideo(video) ? 0.55 : 1, color: "#fff",
                    }}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>
                    {isDemoVideo(video) ? video.comments : formatCount(commentCounts[video.id] ?? video.comments ?? 0)}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff" }}>
                  <button onClick={() => setDmVideo(video)} className="hover-lift" style={{
                    width: 42, height: 42, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff"
                  }} title={t.dm}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{t.dm}</span>
                </div>
                {/* Panier : coche verte quand la vidéo y est déjà. */}
                <button onClick={() => handleBuy(video)} className="hover-lift" style={{
                  width: 52, height: 52, borderRadius: "50%", border: "none",
                  background: cart.includes(video.id)
                    ? "linear-gradient(135deg, #059669, #047857)"
                    : "linear-gradient(135deg, #10B981, #059669)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(16,185,129,0.5)", fontSize: 22,
                  opacity: isDemoVideo(video) ? 0.55 : 1,
                }} title={cart.includes(video.id) ? t.cart : t.buy}>
                  {cart.includes(video.id) ? "✓" : "🛒"}
                </button>
              </div>

              {toast === video.id && (
                <div className="feed-top-control" style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 30, background: "rgba(0,0,0,0.85)", color: "#fff", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", animation: "fadeIn 0.2s ease-out" }}>
                  {t.soon}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
      </>
      )}

      {/* ─── Tiroir panier (chantier #18) ────────────────────────────────── */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "flex-end" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, 100%)", height: "100%", background: c.card, borderLeft: `1px solid ${c.border}`,
              display: "flex", flexDirection: "column", animation: "slideInRight 0.25s ease-out",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className="outfit" style={{ margin: 0, fontSize: 19, fontWeight: 800, color: c.text }}>🛒 {t.cart}</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Fermer" style={{ border: "none", background: "transparent", color: c.textMuted, cursor: "pointer", padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
              {cartVideos.length === 0 ? (
                <p style={{ color: c.textMuted, fontSize: 14, textAlign: "center", marginTop: 40 }}>{t.cartEmpty}</p>
              ) : cartVideos.map((v) => (
                <div key={v.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 12, border: `1px solid ${c.border}`, marginBottom: 10, background: c.surface }}>
                  <video src={v.src} muted preload="metadata" style={{ width: 54, height: 72, objectFit: "cover", borderRadius: 8, background: "#000", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.product}</div>
                    <div style={{ fontSize: 12, color: c.textMuted }}>@{v.username}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#10B981", fontFamily: mono }}>{v.price}</div>
                  </div>
                  <button onClick={() => handleToggleCart(v)} aria-label="Retirer du panier" style={{ border: "none", background: "transparent", color: c.textMuted, cursor: "pointer", padding: 6, flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {cartVideos.length > 0 && (
              <div style={{ padding: 20, borderTop: `1px solid ${c.border}`, background: c.surface }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 15 }}>
                  <span style={{ color: c.textMuted, fontWeight: 600 }}>{t.total}</span>
                  <span style={{ color: c.text, fontWeight: 900, fontFamily: mono }}>{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={ordering}
                  className="hover-lift"
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                    background: ordering ? c.border : "linear-gradient(90deg, #8B5CF6, #EC4899)",
                    color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: ordering ? "not-allowed" : "pointer",
                    boxShadow: ordering ? "none" : "0 8px 20px rgba(139,92,246,0.35)",
                  }}
                >
                  {ordering ? t.ordering : t.orderBtn}
                </button>
                {/* Le paiement n'existe pas encore : on le dit clairement plutôt
                    que de laisser croire à une transaction. */}
                <p style={{ fontSize: 11.5, color: c.textDim, textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
                  {uiLang === "it" ? "Il creator riceve la tua richiesta e conferma la disponibilità. Il pagamento si concorda tra voi."
                    : uiLang === "en" ? "The creator receives your request and confirms availability. Payment is agreed between you."
                    : "Le créateur reçoit ta demande et confirme sa disponibilité. Le règlement se convient entre vous."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {commentsVideo && (
        <CommentsPanel
          video={commentsVideo}
          uiLang={uiLang}
          API_URL={API_URL}
          userId={userId}
          isDemo={isDemoVideo(commentsVideo)}
          onCountChange={(delta) => setCommentCounts((prev) => ({
            ...prev,
            [commentsVideo.id]: Math.max(0, (prev[commentsVideo.id] ?? 0) + delta),
          }))}
          onClose={() => setCommentsVideo(null)}
        />
      )}

      {dmVideo && (
        <DirectMessagePanel
          video={dmVideo}
          uiLang={uiLang}
          API_URL={API_URL}
          userId={userId}
          isDemo={isDemoVideo(dmVideo)}
          onClose={() => setDmVideo(null)}
        />
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .video-feed-scroll::-webkit-scrollbar { display: none; }
        .video-feed-scroll { scrollbar-width: none; }
        /* Idem pour le carrousel horizontal : une barre de défilement visible
           en travers d'une photo plein écran ruine l'effet. */
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-track { scrollbar-width: none; -webkit-overflow-scrolling: touch; }

        /* ─── Mobile : feed plein écran façon TikTok ────────────────────────
           Les contrôles du haut (onglets, favoris/panier, recherche, niches)
           restent en place et défilent normalement : on ne les superpose PAS
           à la vidéo, ils la précèdent. Le feed occupe ensuite toute la
           hauteur utile, avec défilement magnétique d'une vidéo à l'autre.
           On utilise 100dvh et non 100vh : la première tient compte de la
           barre d'adresse mobile, qui sinon rogne le bas de chaque vidéo. */
        @media (max-width: 768px) {
          .video-feed-header { margin-bottom: 10px !important; }
          .video-feed-subtitle { display: none !important; }

          /* ⚠️ Bande blanche latérale : index.css impose un max-width de 100%
             à TOUS les descendants de .main-content (filet anti-débordement).
             ⚠️ Ne jamais mettre d'accent grave dans ce bloc : il est écrit
             dans un template literal JS et couperait le fichier en deux.
             Une marge négative décale bien le bloc vers la gauche, mais sa
             largeur reste plafonnée à celle du parent — il manquait donc
             exactement la marge à droite. On repart de la largeur du viewport
             et on relève le plafond, sinon la correction est annulée. */
          /* ─── Contrôles superposés à la vidéo ────────────────────────────
             Empilés au-dessus du feed, la recherche et les niches occupaient
             près d'un cinquième de la hauteur d'écran, et les niches passaient
             sur deux lignes. On les superpose comme TikTok, sur un dégradé qui
             garde le texte lisible quelle que soit l'image dessous.
             ⚠️ Pour revenir en arrière : supprimer ce bloc .feed-controls et
             remettre --feed-h a calc(100dvh - 130px). Rien d'autre a defaire. */
          .feed-stack { position: relative; }
          .feed-controls {
            position: absolute; top: 0; left: 0; right: 0; z-index: 20;
            margin-bottom: 0 !important;
            padding: 10px 12px 30px;
            background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 55%, transparent 100%);
            /* Le dégradé couvre le haut de la vidéo : sans cela il volerait le
               tap de pause et le bouton du son sur toute cette bande. */
            pointer-events: none;
          }
          .feed-controls input, .feed-controls button { pointer-events: auto; }

          /* Les champs étaient stylés pour un fond de page clair ; sur une
             vidéo ils devenaient illisibles. */
          .feed-controls .input-premium {
            background: rgba(0,0,0,0.45) !important;
            border-color: rgba(255,255,255,0.28) !important;
            color: #fff !important;
            backdrop-filter: blur(10px);
          }
          .feed-controls .input-premium::placeholder { color: rgba(255,255,255,0.65); }
          .feed-controls svg { stroke: rgba(255,255,255,0.75); }

          /* Une seule ligne défilante au lieu de deux lignes qui se replient :
             c'est ce repli qui doublait la hauteur du bandeau. */
          .niche-row {
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            overflow-x: auto;
            width: 100%;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .niche-row::-webkit-scrollbar { display: none; }

          /* ⚠️ Le bandeau superposé recouvre exactement l'emplacement du bouton
             du son, des points de carrousel et du toast. Sans ce décalage, le
             champ de recherche se posait dessus et les rendait incliquables. */
          .feed-top-control { top: 138px !important; }
          .niche-pill { flex: 0 0 auto; }
          .feed-controls .niche-pill {
            background: rgba(0,0,0,0.45) !important;
            border-color: rgba(255,255,255,0.28) !important;
            color: #fff !important;
            backdrop-filter: blur(10px);
          }
          .feed-controls .niche-pill.is-active {
            background: linear-gradient(135deg, #8B5CF6, #EC4899) !important;
            border-color: transparent !important;
          }

          .video-feed-outer {
            /* Les contrôles ne poussent plus rien : le feed récupère leur
               hauteur et occupe presque tout l'écran. */
            --feed-h: calc(100dvh - 20px);
            --feed-radius: 0px;
            width: 100vw !important;
            max-width: 100vw !important;
            margin-left: 50% !important;
            margin-right: 0 !important;
            transform: translateX(-50%);
          }
          .video-feed-scroll {
            width: 100% !important;
            max-width: 100vw !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
            box-shadow: none !important;
          }
          /* La colonne d'actions remonte : sans cela, le bouton panier passait
             sous le bouton flottant du Coach IA, en bas à droite. */
          .video-action-rail { bottom: 96px !important; }
        }
        /* Très petits écrans : la barre d'onglets du navigateur prend moins de
           place, on récupère la hauteur correspondante. */
        @media (max-width: 400px) {
          .video-feed-outer { --feed-h: calc(100dvh - 12px); }
        }
      `}</style>
    </div>
  );
}

# Le vainqueur reste — Édition Équipe de France

Jeu de duels entre joueurs de l'Équipe de France. À chaque tour deux joueurs sont proposés, l'utilisateur choisit son préféré, le vainqueur reste en place et affronte un nouvel adversaire jusqu'à ne laisser qu'un seul gagnant.

## Fonctionnalités

- 45 joueurs (44 duels par partie)
- Cartes avec photo et nom, animation winner / loser
- Historique en 4 colonnes
- Téléchargement du récap en **image PNG** ou **texte**
- Partage Twitter / Facebook / WhatsApp / copie de lien
- **Intégration en iframe** : hauteur adaptative + URL hôte propagée pour les partages

## Lancement local

Servir le dossier en HTTP (les photos sont en `france/` et ne se chargeront pas en `file://`) :

```bash
python3 -m http.server
```

Puis ouvrir <http://localhost:8000>.

## Intégration sur un site

```html
<iframe id="duel-frame"
        src="https://ton-domaine.com/jeu/index.html"
        style="width:100%;border:0;display:block"
        scrolling="no"></iframe>

<script>
  const frame = document.getElementById("duel-frame");

  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "duel-height") {
      frame.style.height = e.data.height + "px";
    }
  });

  frame.addEventListener("load", () => {
    frame.contentWindow.postMessage(
      { type: "host-url", url: location.href },
      "*"
    );
  });
</script>
```

L'iframe communique sa hauteur en continu via `postMessage` et utilise l'URL de la page hôte pour les boutons de partage.

## Structure

- [index.html](index.html) — structure du jeu
- [style.css](style.css) — design (bleu France, cartes, grille historique)
- [script.js](script.js) — logique de duel, historique, partage, capture image
- [france/](france/) — 45 photos `.jpg`

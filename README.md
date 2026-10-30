git # Application Web de Gestion - TP4 Full Stack

## Description
Application web frontend développée dans le cadre du TP4 de Développement Web Full Stack. Elle permet de gérer et de lier dynamiquement des données issues de plusieurs fichiers JSON (`customers.json`, `products.json`, `orders.json`).

## Structure Générale
tp4/
|-- index.html
|-- css/
|   `-- style.css
|-- data/
|   |-- customers.json
|   |-- products.json
|   `-- orders.json
|-- js/
    |-- app.js
    |-- state.js
    |-- dataService.js
    |-- selectors.js
    `-- view.js

## Fonctionnalités Principales
- Chargement asynchrone des données via `fetch` et `async/await` avec gestion des erreurs.
- Stockage des données et des filtres dans un état central (`state`).
- Calculs dynamiques (montant par ligne, montant total des commandes, indicateurs clés).
- Recherche de commandes par nom de client et filtres croisés par statut et catégorie.
- Affichage détaillé des commandes et mise à jour dynamique de l'interface (`render`).

## Instructions pour Lancer le Projet
1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone [https://github.com/CompileOrCry/tp4-web-dev.git](https://github.com/CompileOrCry/tp4-web-dev.git)
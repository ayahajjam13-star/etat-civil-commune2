# 🏛️ Système de Gestion d'État Civil - Commune Marocaine

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple.svg)](https://getbootstrap.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://mongodb.com)

## 📝 Description du Projet

Application web complète pour la gestion de l'état civil d'une commune marocaine. Ce système permet aux administrateurs de gérer les citoyens et leurs demandes administratives de manière efficace et moderne.

## 🎯 Objectifs du Projet

- ✅ Digitaliser la gestion des citoyens
- ✅ Simplifier le processus des demandes administratives
- ✅ Offrir une interface moderne et intuitive
- ✅ Assurer un suivi en temps réel des demandes

## 🚀 Technologies Utilisées

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Laravel** | 12.x | API REST Backend |
| **React.js** | 18.x | Frontend moderne |
| **Bootstrap 5** | 5.3 | Interface responsive |
| **MongoDB** | 8.x | Base de données |
| **Axios** | - | Communication API |
| **React Router** | 6.x | Navigation |
| **React Toastify** | - | Notifications |
| **Recharts** | - | Graphiques Dashboard |

## ✨ Fonctionnalités Implémentées

### 🔐 Authentification

- Login sécurisé avec Laravel Sanctum
- Session persistante
- Logout

### 📊 Dashboard

- Statistiques en temps réel
- Graphiques interactifs (Pie Chart, Line Chart)
- Cartes animées
- Mode clair/sombre (Dark Mode)

### 👥 Gestion des Citoyens (CRUD complet)

- Ajouter un citoyen
- Modifier un citoyen
- Supprimer un citoyen
- Consulter les détails
- Recherche par nom, prénom ou CIN
- Upload de photo personnelle
- Ajout de documents (attestations, certificats)
- Export Excel (.xlsx)
- Export PDF (Carte d'identité)

### 📋 Gestion des Demandes (CRUD complet)

- Ajouter une demande
- Modifier une demande
- Supprimer une demande
- Changer le statut (En attente, Validée, Refusée)
- Filtrage par statut

#### Types de demandes disponibles (10 types):

| Type | Icône |
|------|-------|
| شهادة الميلاد | 📄 |
| نسخة كاملة | 📑 |
| شهادة الإقامة | 🏠 |
| شهادة الوفاة | ⚰️ |
| شهادة الزواج | 💍 |
| بطاقة التعريف الوطنية | 🪪 |
| جواز السفر | 🛂 |
| شهادة السكنى | 🏘️ |
| شهادة العمل | 💼 |
| شهادة التسجيل | 📝 |

#### Statuts des demandes:

- ⏳ **En attente** - Demande en cours de traitement
- ✅ **Validée** - Demande acceptée
- ❌ **Refusée** - Demande rejetée

### 🎨 Interface Utilisateur

- Sidebar moderne avec animations
- Navbar responsive
- Cartes statistiques animées
- Tableaux interactifs avec pagination
- Badges colorés pour les statuts
- Tooltips pour les actions
- Notifications toast (succès, erreur, info)
- Dark Mode / Light Mode avec sauvegarde

### 📤 Export de données

- ✅ Export Excel pour les citoyens
- ✅ Export Excel pour les demandes
- ✅ Export PDF pour les cartes citoyens

## 🔧 Installation

### Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- MongoDB >= 8.0

### Étapes d'installation

#### 1. Cloner le projet

```bash
git clone https://github.com/ayahajjam13-star/etat-civil-commune2.git
cd etat-civil-commune2
```

#### 2. Configuration Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

#### 3. Configuration Base de données

Modifier le fichier `.env`:

```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=etat_civil
DB_USERNAME=
DB_PASSWORD=
```

#### 4. Migrations et Seeders

```bash
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link
```

#### 5. Configuration Frontend (React)

```bash
cd ../frontend
npm install
```

#### 6. Démarrer l'application

**Terminal 1 - Backend:**

```bash
cd backend
php artisan serve --port=8001
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

## 🔑 Compte de test

| Champ | Valeur |
|-------|--------|
| **Email** | admin@commune.ma |
| **Mot de passe** | admin123 |

## 📱 Accès à l'application

| Service | URL |
|---------|-----|
| **Frontend** | http://127.0.0.1:3000 |
| **API Backend** | http://127.0.0.1:8001/api |

## 🗂️ Structure du projet

```
etat-civil-commune/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── AuthController.php
│   │   │       ├── CitizenController.php
│   │   │       ├── DemandeController.php
│   │   │       └── DashboardController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Citizen.php
│   │       └── Demande.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── public/uploads/
│       ├── photos/
│       └── documents/
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Login.js
        │   ├── Layout.js
        │   ├── Dashboard.js
        │   ├── Citizens.js
        │   ├── Demandes.js
        │   └── PrivateRoute.js
        ├── App.js
        ├── index.js
        └── index.css
```

## 📊 Structure de la base de données

### Tables principales:

**users** - Gestion des administrateurs

- id, name, email, password, remember_token, created_at, updated_at

**citizens** - Informations des citoyens

- id, cin, nom, prenom, date_naissance, lieu_naissance, adresse, telephone, photo, documents, created_at, updated_at

**demandes** - Demandes administratives

- id, citoyen_id, type_demande, date_demande, statut, created_at, updated_at

## 🛠️ Commandes utiles

### Backend:

```bash
php artisan serve --port=8001      # Démarrer le serveur
php artisan migrate:refresh        # Réinitialiser la DB
php artisan tinker                 # Console interactive
php artisan config:clear           # Vider le cache
```

### Frontend:

```bash
npm start        # Démarrer le serveur de développement
npm run build    # Construire pour production
```

## 🎨 Fonctionnalités avancées

### Dark Mode 🌙

- Bascule automatique entre mode clair/sombre
- Sauvegarde de la préférence dans localStorage
- Bouton flottant pour mobile

### Notifications 🔔

- Alertes toast pour toutes les actions
- Confirmations avant suppression
- Messages d'erreur explicites

### Responsive Design 📱

- Interface adaptée à tous les écrans
- Sidebar rétractable sur mobile
- Tableaux scrollables

## 👨‍💻 Auteur

**Ayah Hajjam**

Étudiante en développement web

## 📅 Année

2026

## 📄 Licence

Ce projet est développé pour usage éducatif et professionnel.

## 🙏 Remerciements

- Encadrant de stage
- Équipe pédagogique
- Communauté Laravel et React

## ✅ Conclusion

Cette application constitue une solution complète et professionnelle pour la gestion de l'état civil d'une commune marocaine. Elle répond aux besoins réels des administrations communales en matière de digitalisation des processus administratifs.

## 📞 Contact

Pour toute question ou suggestion concernant ce projet, n'hésitez pas à me contacter.

---

© 2026 - Système de Gestion d'État Civil - Commune Marocaine

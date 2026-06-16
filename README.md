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
2. Configuration Backend (Laravel)
bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
3. Configuration Base de données
Modifier le fichier .env:

env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=etat_civil
DB_USERNAME=
DB_PASSWORD=

<template>
  <div class="user-service-view">
    <!-- Vue pour les clients : affiche simplement la liste des services -->
    <div v-if="userType === 'client'">
      <h1>Liste des Services</h1>
      <div v-if="services.length === 0" class="no-items">
        <p>Aucun service disponible pour le moment.</p>
      </div>
      <div v-else class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.id_service">
          <h2>{{ service.nom_service }}</h2>
          <p><strong>Type :</strong> {{ service.type_service }}</p>
          <p><strong>Description :</strong> {{ service.description_service }}</p>
          <p v-if="service.date_service">
            <strong>Date :</strong> {{ service.date_service | formatDate }}
          </p>
          <p v-if="service.heure_service">
            <strong>Heure :</strong> {{ service.heure_service }}
          </p>
        </div>
      </div>
    </div>

    <!-- Vue pour les prestataires : menu et contenu dynamique -->
    <div v-else-if="userType === 'prestataire'">
      <div class="prestataire-view">
        <h1>Gestion Prestataire</h1>
        <!-- Menu de navigation -->
        <div class="menu">
          <button :class="{active: activeTab === 'profile'}" @click="activeTab = 'profile'">
            Modifier Profil
          </button>
          <button :class="{active: activeTab === 'presentation'}" @click="activeTab = 'presentation'">
            Présentation
          </button>
          <button :class="{active: activeTab === 'services'}" @click="activeTab = 'services'">
            Gestion des Services
          </button>
        </div>

        <!-- Contenu en fonction de l'onglet actif -->
        <div class="tab-content">
          <!-- Onglet Modifier Profil -->
          <div v-if="activeTab === 'profile'">
            <h2>Modifier Profil</h2>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="nom">Nom</label>
                <input id="nom" v-model="user.nom" type="text" required />
              </div>
              <div class="form-group">
                <label for="prenom">Prénom</label>
                <input id="prenom" v-model="user.prenom" type="text" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="user.mail" type="email" required />
              </div>
              <div class="form-group">
                <label for="image">Image Prestataire</label>
                <input id="image" v-model="user.image" type="text" />
              </div>

              <div v-if="user.image" class="presentation-image-container">
                <h3>Image du Prestataire</h3>
                <img :src="user.image" alt="Image du Prestataire" class="presentation-image" />
              </div>

              <button type="submit">Mettre à jour</button>
            </form>
          </div>

          <!-- Onglet Présentation -->
          <div v-if="activeTab === 'presentation'">
            <h2>Modifier Présentation</h2>
            <!-- Utilisation de TinyMCE -->
            <editor v-model="presentationContent" :init="editorInit"></editor>
            <button @click="savePresentation">Sauvegarder la présentation</button>
            <!-- Affichage de l'image sous le texte -->
            <div v-if="user.image" class="presentation-image-container">
              <h3>Image du Prestataire</h3>
              <img :src="user.image" alt="Image du Prestataire" class="presentation-image" />
            </div>
          </div>

          <!-- Onglet Gestion des Services -->
          <div v-if="activeTab === 'services'">
            <h2>Gestion des Services</h2>
            <div v-if="services.length === 0" class="no-items">
              <p>Aucun service enregistré.</p>
            </div>
            <div v-else class="services-grid">
              <div class="service-card" v-for="service in services" :key="service.id_service">
                <h3>{{ service.nom_service }}</h3>
                <p><strong>Type :</strong> {{ service.type_service }}</p>
                <p><strong>Description :</strong> {{ service.description_service }}</p>
                <p v-if="service.date_service">
                  <strong>Date :</strong> {{ service.date_service | formatDate }}
                </p>
                <p v-if="service.heure_service">
                  <strong>Heure :</strong> {{ service.heure_service }}
                </p>
                <p>
                  <strong>Accessible au public :</strong>
                  <span>{{ service.isPublic ? 'Oui' : 'Non' }}</span>
                </p>
                <div class="service-actions">
                  <button @click="toggleServiceVisibility(service)">
                    {{ service.isPublic ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button @click="configureService(service)">Configurer</button>
                  <button @click="deleteService(service.id_service)">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message par défaut si le type n'est pas reconnu -->
    <div v-else>
      <p>Vous n'avez pas accès à ce service.</p>
    </div>
  </div>
</template>

<script>
import { Editor } from '@tinymce/tinymce-vue';
import prestataireService from '@/services/prestataires';

export default {
  name: 'ServiceView',
  components: {
    editor: Editor
  },
  data() {
    return {
      activeTab: 'profile', // onglet par défaut pour les prestataires
      user: {},
      userType: '',
      services: [],
      presentationContent: '',
      editorInit: {
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
      }
    };
  },
  created() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.user = storedUser;
      // On vérifie la propriété de type, ici "type_utilisateur" ou "type"
      this.userType = storedUser.type_utilisateur || storedUser.type;
      if (this.userType === 'client') {
        this.fetchClientServices();
      } else if (this.userType === 'prestataire') {
        // Normalisation de l'ID pour les prestataires
        if (!this.user.id_utilisateur && this.user.id) {
          this.user.id_utilisateur = this.user.id;
        }
        this.fetchPrestataireServices();
        // Charger la présentation existante si elle existe
        this.presentationContent = this.user.presentation || '';
      }
    } else {
      this.$router.push({ name: 'Login' });
    }
  },
  methods: {
    async fetchClientServices() {
      try {
        const data = await prestataireService.fetchServicesForClient();
        this.services = data;
      } catch (error) {
        console.error('Erreur lors du chargement des services client :', error);
      }
    },
    async fetchPrestataireServices() {
      try {
        const data = await prestataireService.fetchServicesForPrestataire(this.user.id_utilisateur);
        this.services = data.map(service => ({
          ...service,
          isPublic: service.isPublic !== undefined ? service.isPublic : true
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des services prestataire :', error);
      }
    },
    async updateProfile() {
      try {
        const updatedUser = await prestataireService.updateProfile(this.user);
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profil mis à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        alert('Erreur lors de la mise à jour du profil');
      }
    },
    async savePresentation() {
      try {
        this.user.presentation = this.presentationContent;
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Présentation mise à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la présentation :', error);
        alert('Erreur lors de la sauvegarde de la présentation');
      }
    },
    async toggleServiceVisibility(service) {
      try {
        service.isPublic = !service.isPublic;
        alert(`Le service "${service.nom_service}" est désormais ${service.isPublic ? 'accessible au public' : 'privé'}.`);
      } catch (error) {
        console.error('Erreur lors de la modification de la visibilité du service :', error);
        alert('Erreur lors de la modification de la visibilité du service');
      }
    },
    async deleteService(serviceId) {
      try {
        this.services = this.services.filter(service => service.id_service !== serviceId);
        alert('Service supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression du service :', error);
        alert('Erreur lors de la suppression du service');
      }
    },
    configureService(service) {
      alert(`Configurer le service "${service.nom_service}" (fonctionnalité à implémenter).`);
    }
  },
  filters: {
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.user-service-view {
  padding: 20px;
}
.menu {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.menu button {
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.menu button.active {
  background-color: #2980b9;
}
.tab-content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
.profile-form,
.services-grid {
  margin-top: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.service-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.service-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.service-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3498db;
  color: #fff;
}
.service-actions button:hover {
  background-color: #2980b9;
}
.no-items {
  text-align: center;
  color: #e74c3c;
  margin-top: 20px;
}

/* Style pour l'image de présentation */
.presentation-image-container {
  margin-top: 20px;
  text-align: center;
}
.presentation-image {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

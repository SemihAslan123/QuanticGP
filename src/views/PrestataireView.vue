<template>
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
            <input id="nom" v-model="user.nom_utilisateur" type="text" required />
          </div>
          <div class="form-group">
            <label for="prenom">Prénom</label>
            <input id="prenom" v-model="user.prenom_utilisateur" type="text" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="user.mail_utilisateur" type="email" required />
          </div>
          <div class="form-group">
            <label for="image">Image Prestataire</label>
            <input id="image" v-model="user.image_prestataire" type="text" />
          </div>
          <button type="submit">Mettre à jour</button>
        </form>
      </div>

      <!-- Onglet Présentation -->
      <div v-if="activeTab === 'presentation'">
        <h2>Modifier Présentation</h2>
        <!-- Éditeur WYSIWYG TinyMCE -->
        <editor
          v-model="presentationContent"
          :init="editorInit"
        ></editor>
        <button @click="savePresentation">Sauvegarder la présentation</button>
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
</template>

<script>
// Import de TinyMCE Vue (assurez-vous d'avoir installé @tinymce/tinymce-vue)
import { Editor } from '@tinymce/tinymce-vue';
import prestataireService from '@/services/prestataires';

export default {
  name: 'PrestataireView',
  components: {
    editor: Editor
  },
  data() {
    return {
      activeTab: 'profile', // onglet par défaut
      user: {},
      services: [],
      presentationContent: '', // contenu de la présentation
      editorInit: {
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help'
      }
    };
  },
  created() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.user = storedUser;
      // Pour homogénéiser, on peut vérifier id_utilisateur ou id
      if (!this.user.id_utilisateur && this.user.id) {
        this.user.id_utilisateur = this.user.id;
      }
      // On suppose que le type est stocké dans storedUser.type_utilisateur
      this.userType = storedUser.type_utilisateur || storedUser.type;
      if (this.userType === 'prestataire') {
        this.fetchPrestataireServices();
        // Charger la présentation existante si elle existe
        this.presentationContent = this.user.presentation || '';
      }
    } else {
      this.$router.push({ name: 'Login' });
    }
  },
  methods: {
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
    async fetchPrestataireServices() {
      try {
        // Utilise l'ID du prestataire
        const data = await prestataireService.fetchServicesForPrestataire(this.user.id_utilisateur);
        // Pour la gestion, on ajoute une propriété isPublic (par défaut à true)
        this.services = data.map(service => ({
          ...service,
          isPublic: service.isPublic !== undefined ? service.isPublic : true
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des services prestataire :', error);
      }
    },
    async savePresentation() {
      try {
        // Vous pouvez appeler ici une API pour sauvegarder la présentation,
        // par exemple prestataireService.updatePresentation(this.user.id_utilisateur, this.presentationContent)
        // Pour l'instant, on simule avec une mise à jour de l'objet user
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
        // Inverse la visibilité
        service.isPublic = !service.isPublic;
        // Appeler ici une API pour mettre à jour la visibilité du service
        // Exemple : await prestataireService.updateServiceVisibility(service.id_service, service.isPublic)
        alert(`Le service "${service.nom_service}" est désormais ${service.isPublic ? 'accessible au public' : 'privé'}.`);
      } catch (error) {
        console.error('Erreur lors de la modification de la visibilité du service :', error);
        alert('Erreur lors de la modification de la visibilité du service');
      }
    },
    async deleteService(serviceId) {
      try {
        // Appeler ici une API pour supprimer le service
        // Exemple : await prestataireService.deleteService(serviceId)
        // Puis retirer le service de la liste
        this.services = this.services.filter(service => service.id_service !== serviceId);
        alert('Service supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression du service :', error);
        alert('Erreur lors de la suppression du service');
      }
    },
    configureService(service) {
      // Cette méthode pourrait rediriger vers une page de configuration détaillée pour le service
      // Par exemple : this.$router.push({ name: 'ServiceConfig', params: { serviceId: service.id_service } });
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
.prestataire-view {
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
</style>

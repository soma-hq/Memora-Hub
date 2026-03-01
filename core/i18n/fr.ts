const fr = {
	// Common
	common: {
		save: "Enregistrer",
		cancel: "Annuler",
		delete: "Supprimer",
		edit: "Modifier",
		create: "Créer",
		search: "Rechercher",
		filter: "Filtrer",
		export: "Exporter",
		import: "Importer",
		close: "Fermer",
		confirm: "Confirmer",
		back: "Retour",
		next: "Suivant",
		previous: "Précédent",
		loading: "Chargement...",
		noResults: "Aucun résultat",
		yes: "Oui",
		no: "Non",
		all: "Tous",
		actions: "Actions",
		status: "Statut",
		active: "Actif",
		inactive: "Inactif",
		required: "Requis",
		optional: "Optionnel",
	},

	// Auth
	auth: {
		login: "Se connecter",
		logout: "Se déconnecter",
		email: "Email",
		password: "Mot de passe",
		forgotPassword: "Mot de passe oublié ?",
		rememberMe: "Se souvenir de moi",
		loginTitle: "Connexion à Memora Hub",
		loginDescription: "Entrez vos identifiants pour accéder à votre espace.",
		a2fTitle: "Vérification en deux étapes",
		a2fDescription: "Entrez le code envoyé à votre appareil.",
		demoCredentials: "Identifiants démo",
	},

	nav: {
		dashboard: "Tableau de bord",
		projects: "Projets",
		tasks: "Tâches",
		meetings: "Réunions",
		management: "Legacy",
		// Personnel
		personnel: "Personnel",
		personnelAbsences: "Absences",
		personnelPlanning: "Planning",
		personnelProjects: "Mes projets",
		personnelTasks: "Mes tâches",
		// Momentum
		momentumLaunch: "Lancement",
		momentumSessions: "Sessions PIM",
		momentumSpace: "Espace Momentum",
		momentumManagement: "Management",
		// Talent
		talent: "Talent",
		talentSessions: "Sessions",
		talentEspace: "Mon espace",
		talentConsignes: "Consignes",
		talentCandidates: "Candidats",
		talentResults: "Résultats",
		talentCalendar: "Calendrier",
		talentAdmin: "Admin",
		// Admin
		users: "Squad",
		groups: "Permissions",
		stats: "Statistiques",
		settings: "Paramètres",
		profile: "Mon profil",
		administration: "Administration",
	},

	// Users
	users: {
		title: "Utilisateurs",
		description: "Gérez les membres de votre organisation",
		newUser: "Nouvel utilisateur",
		editUser: "Modifier l'utilisateur",
		deleteUser: "Supprimer l'utilisateur",
		deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.",
		firstName: "Prénom",
		lastName: "Nom",
		role: "Rôle",
		group: "Entité",
		status: "Statut",
		memberSince: "Membre depuis",
		groupAccess: "Accès par entité",
		addGroupAccess: "Ajouter un accès entité",
		groupAccessInfo:
			"Chaque entité a ses propres accès. Un utilisateur peut avoir un rôle différent dans chaque entité auquel il appartient.",
	},

	// Groups
	groups: {
		title: "Entités",
		description: "Gérez les entités de votre organisation",
		newGroup: "Nouvelle entité",
		members: "Membres",
		projects: "Projets",
		permissions: "Permissions",
	},

	// Projects
	projects: {
		title: "Projets",
		description: "Gérez les projets de votre équipe",
		newProject: "Nouveau projet",
		progress: "Progression",
		startDate: "Date de début",
		endDate: "Date de fin",
		overview: "Vue d'ensemble",
		activity: "Activité",
	},

	// Tasks
	tasks: {
		title: "Tâches",
		description: "Gérez et suivez les tâches de votre équipe",
		newTask: "Nouvelle tâche",
		todo: "À faire",
		inProgress: "En cours",
		done: "Terminé",
		priority: "Priorité",
		high: "Haute",
		medium: "Moyenne",
		low: "Basse",
		assignee: "Assigné à",
		dueDate: "Date limite",
		subtasks: "Sous-tâches",
	},

	// Meetings
	meetings: {
		title: "Réunions",
		description: "Planifiez et gérez les réunions de votre équipe",
		newMeeting: "Nouvelle réunion",
		upcoming: "À venir",
		past: "Passées",
		today: "Aujourd'hui",
		participants: "Participants",
		location: "Lieu",
		notes: "Notes",
		date: "Date",
		time: "Heure",
	},

	// Personnel
	personnel: {
		title: "Personnel",
		absences: {
			title: "Absences",
			description: "Gérez vos absences longue durée",
			newRequest: "Déclarer une absence",
			minDays: "Minimum 5 jours",
			maxActive: "Maximum 2 absences simultanées",
			status: "Statut",
			pending: "En attente",
			received: "Réceptionnée",
			acknowledged: "Prise en compte",
			archives: "Archives",
		},
		planning: {
			title: "Planning",
			description: "Votre planning personnel",
			newEvent: "Nouvel événement",
			editEvent: "Modifier l'événement",
			deleteEvent: "Supprimer l'événement",
		},
		projects: {
			title: "Mes projets",
			description: "Vos projets assignés",
		},
		tasks: {
			title: "Mes tâches",
			description: "Vos tâches assignées",
		},
	},

	// Recruitment / Talent
	recruitment: {
		title: "Talent",
		description: "Gestion du recrutement par sessions",
		sessions: {
			title: "Sessions",
			description: "Sessions de recrutement actives",
			newSession: "Nouvelle session",
			noSessions: "Aucune session de recrutement",
		},
		questionnaire: {
			title: "Questionnaire",
			step1: "Exploration du Profil",
			step2: "Axes de Découverte",
			step3: "Mise en Situation",
			step4: "Clap de Fin",
			objective: "Objectif",
			nextPage: "Page suivante",
			prevPage: "Page précédente",
			backToHub: "Retour au Hub",
		},
		espace: {
			title: "Mon espace",
			description: "Votre tableau de bord recruteur",
			myCandidates: "Mes candidats",
			todayTasks: "À faire aujourd'hui",
			myStats: "Mes statistiques",
		},
		consignes: {
			title: "Consignes",
			description: "Directives et profils recherchés par les Responsables",
		},
		candidates: {
			title: "Candidats",
			description: "Listing complet des candidats",
			bilan: "Bilan",
			formId: "ID Formulaire",
			spectators: "Spectateurs",
			favorable: "Favorable",
			unfavorable: "Défavorable",
			accepted: "Accepté",
			refused: "Refusé",
			pending: "En attente",
			candidature: "Candidature",
		},
		results: {
			title: "Résultats",
			description: "Tableau Kanban des décisions",
		},
		calendar: {
			title: "Calendrier",
			description: "Planning des entretiens",
			publicView: "Vue publique",
		},
		admin: {
			title: "Admin",
			description: "Vue d'ensemble du recrutement",
		},
		timeline: {
			preInterview: "Pré-Entretiens",
			inInterview: "In-Entretiens",
			postInterview: "Post-Entretiens",
		},
	},

	// Momentum — Tutorat & PIM
	momentum: {
		title: "Momentum",
		launch: {
			title: "Lancement",
			description: "Lancez une nouvelle session PIM pour intégrer les Juniors",
			newSession: "Nouvelle session PIM",
			selectEntity: "Sélectionner l'entité",
			startDate: "Date de début",
			confirm: "Lancer la session",
		},
		sessions: {
			title: "Sessions PIM",
			description: "Suivi des Périodes d'Intégration de Modération",
			noSessions: "Aucune session PIM active",
			createFirst: "Lancez votre première session depuis la page Lancement.",
		},
		space: {
			title: "Espace Momentum",
			description: "Référentiel interne — politiques, processus et timelines",
		},
		management: {
			title: "Management",
			description: "Espace réservé à Marsha Teams et Legacy",
		},
		pim: {
			juniors: "Juniors",
			notes: "Notes",
			formations: "Formations",
			remarks: "Remarques",
			competencies: "Compétences",
			objectives: "Objectifs",
			bilans: "Bilans RRJ",
			fsi: "Fiche de Suivi",
		},
		dispositif: {
			atria: "ATRIA — Parcours intensif",
			pulse: "PULSE — Parcours autonome",
		},
		status: {
			notStarted: "Non débutée",
			inProgress: "En cours",
			standby: "En Stand-by",
			completed: "Réalisée",
			cancelled: "Annulée",
		},
		competencyLevel: {
			notAcquired: "Non acquise",
			partiallyAcquired: "Partiellement acquise",
			acquired: "Acquise",
		},
	},

	// Settings
	settings: {
		title: "Paramètres",
		account: "Compte",
		security: "Sécurité",
		preferences: "Préférences",
		notifications: "Notifications",
		data: "Données",
		theme: "Thème",
		language: "Langue",
		timezone: "Fuseau horaire",
		darkMode: "Mode sombre",
		lightMode: "Mode clair",
		systemMode: "Système",
		exportData: "Exporter mes données",
		deleteAccount: "Supprimer mon compte",
	},

	// Profile
	profile: {
		title: "Mon profil",
		description: "Consultez vos informations, accès et activité",
		editProfile: "Modifier le profil",
		recentActivity: "Activité récente",
		groupAccess: "Accès par entité",
		groupAccessDescription: "Vos rôles et permissions dans chaque entité",
		memberSince: "Membre depuis",
		a2fEnabled: "A2F activée",
	},

	// Roles
	roles: {
		owner: "Propriétaire",
		admin: "Administrateur",
		manager: "Responsable",
		collaborator: "Collaborateur",
		guest: "Invité",
	},

	// Notifications
	notifications: {
		title: "Notifications",
		markAllRead: "Tout marquer comme lu",
		noNotifications: "Aucune notification",
		email: "Email",
		push: "Push",
		taskAssigned: "Tâche assignée",
		meetingReminder: "Rappel de réunion",
		absenceResponse: "Réponse d'absence",
		projectUpdate: "Mise à jour de projet",
	},

	// Errors
	errors: {
		notFound: "Page non trouvée",
		notFoundDescription: "Oups, cette page n'existe pas ou a été déplacée.",
		serverError: "Erreur serveur",
		serverErrorDescription: "Une erreur inattendue s'est produite.",
		goHome: "Retour à l'accueil",
		retry: "Réessayer",
		generic: "Une erreur est survenue",
	},

	// Empty states
	empty: {
		noProjects: "Aucun projet pour le moment",
		noTasks: "Aucune tâche pour le moment",
		noMeetings: "Aucune réunion planifiée",
		noSessions: "Aucune session PIM active",
		noUsers: "Aucun utilisateur trouvé",
		noGroups: "Aucune entité",
		createFirst: "Commencez par en créer un.",
	},
} as const;

type DeepStringify<T> = {
	[K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationKeys = DeepStringify<typeof fr>;
export default fr;

"use client";

// React
import { useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, SectionHeaderBanner, Icon } from "@/components/ui";
import { showSuccess, showWarning, showInfo, showError } from "@/lib/utils/toast";
import { definePageConfig } from "@/core/structures";

const PAGE_CONFIG = definePageConfig({
	name: "settings/account",
	section: "protected",
	description: "Paramètres du compte utilisateur.",
});

/**
 * Account settings page
 * @returns Account settings form
 */
export default function AccountPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState("/avatar/Alpha.jpeg");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		await new Promise((r) => setTimeout(r, 1000));
		showSuccess("Profil mis à jour");
		setIsLoading(false);
	};

	const handleAvatarChange = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			showError("Le fichier dépasse la taille maximale de 2 Mo.");
			return;
		}

		if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
			showError("Format non supporté. Utilisez JPG, PNG ou GIF.");
			return;
		}

		const url = URL.createObjectURL(file);
		setAvatarPreview(url);
		showSuccess("Photo de profil mise à jour.");
	};

	const handleAvatarDelete = () => {
		setAvatarPreview("/avatar/Alpha.jpeg");
		showWarning("Photo de profil supprimée.");
	};

	return (
		<div className="max-w-2xl space-y-6">
			{/* Avatar */}
			<SectionCard title="Photo de profil" icon="profile" color="primary" padding="lg">
				<div className="flex items-center gap-6">
					<Image
						src={avatarPreview}
						alt="Avatar"
						width={80}
						height={80}
						className="rounded-full object-cover"
					/>
					<div className="space-y-2">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/gif"
							className="hidden"
							onChange={handleFileSelect}
						/>
						<div className="flex gap-2">
							<Button variant="outline-primary" size="sm" onClick={handleAvatarChange}>
								<Icon name="upload" size="xs" />
								Changer
							</Button>
							<Button variant="outline-danger" size="sm" onClick={handleAvatarDelete}>
								<Icon name="delete" size="xs" />
								Supprimer
							</Button>
						</div>
						<p className="text-xs text-gray-400">JPG, PNG ou GIF. Max 2 Mo.</p>
					</div>
				</div>
			</SectionCard>

			{/* Personal info */}
			<SectionCard title="Informations personnelles" icon="edit" color="primary" padding="lg">
				<form onSubmit={handleSave} className="space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Input label="Prénom" defaultValue="Jeremy" />
						<Input label="Nom" defaultValue="Alpha" />
					</div>
					<Input
						label="Email"
						type="email"
						defaultValue="jeremy@memora.hub"
						hint="Votre adresse email professionnelle"
					/>
					<Input label="Téléphone" type="tel" placeholder="+33 6 00 00 00 00" />
					<Input
						label="Poste"
						placeholder="Votre fonction dans l'organisation"
						defaultValue="Directeur technique"
					/>
					<div className="flex justify-end pt-2">
						<Button type="submit" isLoading={isLoading}>
							Enregistrer
						</Button>
					</div>
				</form>
			</SectionCard>
		</div>
	);
}
